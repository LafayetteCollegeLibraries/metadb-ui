import { expect } from 'chai'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import fetchMock from 'fetch-mock'

import * as S from '../actions'

const mockStore = configureMockStore([thunk])
const SEARCH_BASE = process.env.SEARCH_BASE_URL

const state = {
	query: 'cats AND dogs',
	facets: {
		collection: [
			'fake collection'
		],
		format: [
			'book', 'dvd',
		]
	},
	options: {},
}

const store = mockStore({search: state})

describe('Search actionCreator', function () {
	beforeEach(function () {
		if (!SEARCH_BASE) {
			this.skip()
			return
		}

		const escaped = SEARCH_BASE.replace(/\./g, '\\.')
		const reg = new RegExp(escaped + '\?.*')

		fetchMock.get(reg, {status: 200, body: {response: {}}})
	})

	afterEach(function () {
		fetchMock.restore()
		store.clearActions()
	})

	describe('#searchCatalog', function () {
		it('dispatches `fetchingSearch` and `receivedSearchResults`', function () {
			const QUERY = 'some query'

			const expected = [
				S.fetchingSearch({
					query: QUERY,
					facets: {},
					options: {},
					queryString: `q=${QUERY.replace(/ /g, '+')}`,
				}),

				S.receivedSearchResults({results: {}})
			]

			return store.dispatch(S.searchCatalog('some query'))
			.then(() => {
				const actions = store.getActions()
				expect(actions).to.have.length(2)
				expect(actions).to.deep.equal(expected)
			})
		})

		it('dispatches `fetchingSearch` w/ query details', function () {
			const query = 'cats AND dogs'
			const facets = { one: [{ value: 'a'}, {value: 'b'}]}
			const options = { per_page: 5 }

			const expected = S.fetchingSearch({
				query,
				facets,
				options,
				queryString: 'q=cats+AND+dogs&f%5Bone%5D%5B%5D=a&f%5Bone%5D%5B%5D=b&per_page=5',
			})

			return store.dispatch(S.searchCatalog(query, facets, options))
			.then(() => {
				const actions = store.getActions()
				expect(actions).to.have.length(2)
				expect(actions[0]).to.deep.equal(expected)
			})
		})
	})

	describe('#setSearchOption', function () {
		it('adds key/val to `search.options`', function () {
			const key = 'key'
			const val = 'val'

			return store.dispatch(S.setSearchOption(key, val)).then(() => {
				const actions = store.getActions()
				expect(actions[0].type).to.equal(S.fetchingSearch.toString())
				expect(actions[0].payload.options).to.have.property(key)
				expect(actions[0].payload.options[key]).to.equal(val)
			})
		})

		it('will make an api call even if the key/val already exists', function () {
			const key = 'key'
			const val = 'val'

			const options = {
				[key]: val
			}

			const store = mockStore({search: {options}})

			return store.dispatch(S.setSearchOption(key, val))
			.then(() => {
				const actions = store.getActions()
				expect(actions).to.not.be.empty
			})
		})
	})

	describe('#toggleSearchFacet', function () {
		it('sets a facet + makes an API call', function () {
			const field = 'facet_field'
			const value = 'value'

			return store.dispatch(S.toggleSearchFacet(field, value, true))
			.then(() => {
				const actions = store.getActions()

				// it calls 2 actions (`fetchingSearch` + `receiveSearchResults`)
				expect(actions).to.have.length(2)

				// it sends the updated props w/ SEARCHING
				const { payload } = actions[0]

				// the facet prop now has the new property
				expect(payload.facets).to.have.property(field)
				expect(payload.facets[field]).to.have.length(1)
				expect(payload.facets[field].indexOf(value)).to.be.greaterThan(-1)

				// finally, make sure the API was actually called
				const calls = fetchMock.calls()
				expect(calls.matched).to.not.be.empty
				expect(calls.matched).to.have.length(1)
			})
		})

		it('does not send duplicate search requests (for string values)', function () {
			const field = 'facet_field'
			const value = 'value'
			const facets = {}
			facets[field] = [value]

			const store = mockStore({search: {facets}})

			return store.dispatch(S.toggleSearchFacet(field, value, true))
			.then(() => {
				expect(fetchMock.calls().matched).to.have.length(0)
			})
		})

		it('does not send duplicate search requests (for non-string values)', function () {
			const field = 'facet_field'
			const value = {name: 'aye', value: 'a'}
			const facets = {}
			facets[field] = [value]

			const store = mockStore({search: {facets}})

			return store.dispatch(S.toggleSearchFacet(field, value, true))
			.then(() => {
				expect(fetchMock.calls().matched).to.have.length(0)
			})
		})

		it('removes a facet, removes a page number, and makes an API call', function () {
			const FIELD = 'field'
			const search = {
				query: 'search query',
				facets: {
					[FIELD]: [
						{value: 'one', name: 'one', hits: 12},
						{value: 'two', name: 'two', hits: 123},
						{value: 'three', name: 'three', hits: 1234},
					]
				},
				options: {
					page: 2
				},
			}

			const store = mockStore({search})
			const value = search.facets[FIELD][1]

			return store.dispatch(S.toggleSearchFacet(FIELD, value, false))
			.then(() => {
				const actions = store.getActions()

				expect(actions).to.have.length(2)

				const first = actions[0]
				expect(first.payload.facets[FIELD])
					.to.have.length(search.facets[FIELD].length - 1)

				expect(first.payload.options).to.not.have.property('page')

				const calls = fetchMock.calls()
				expect(calls.matched).to.not.be.empty
				expect(calls.matched).to.have.length(1)
			})
		})
	})
})

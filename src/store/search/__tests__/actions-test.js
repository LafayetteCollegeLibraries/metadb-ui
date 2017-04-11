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
				S.preppingSearch({
					query: QUERY,
					facets: {},
					range: {},
					options: {
						format: 'json',
						page: 1,
						per_page: S.RESULTS_PER_PAGE,
					}
				}),
				S.fetchingSearch(),
				S.receivedSearchResults({results: {}})
			]

			return store.dispatch(S.searchCatalog('some query'))
			.then(() => {
				const actions = store.getActions()
				expect(actions).to.have.length(expected.length)
				expect(actions).to.deep.equal(expected)
			})
		})

		it('dispatches `preppingSearch` w/ query details', function () {
			const query = 'cats AND dogs'
			const facets = { one: [{value: 'a'}, {value: 'b'}] }
			const options = {
				format: 'json',
				per_page: S.RESULTS_PER_PAGE,
				page: 1,
			}
			const range = {}

			const expected = S.preppingSearch({
				query,
				facets,
				options,
				range,
			})

			return store.dispatch(S.searchCatalog(query, facets, range, options))
			.then(() => {
				const actions = store.getActions()
				expect(actions).to.have.length(3)
				expect(actions[0]).to.deep.equal(expected)
			})
		})
	})

	describe('#toggleSearchFacet', function () {
		it('sets a facet + makes an API call', function () {
			const field = 'facet_field'
			const value = 'value'

			const expectedActions = [
				S.setFacet,
				S.preppingSearch,
				S.fetchingSearch,
				S.receivedSearchResults,
			]

			return store.dispatch(S.toggleSearchFacet(field, value, true))
			.then(() => {
				const actions = store.getActions()

				expect(actions).to.have.length(expectedActions.length)
				actions.forEach((a,i) => { expect(a.type).to.equal(expectedActions[i].toString()) })

				// it sends the updated props w/ `preppingSearch`
				const { payload } = actions[1]

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
				range: {},
				meta: {
					currentPage: 2,
				}
			}

			const expectedActions = [
				S.clearFacet,
				S.preppingSearch,
				S.fetchingSearch,
				S.receivedSearchResults,
			]

			const store = mockStore({search})
			const value = search.facets[FIELD][1]

			return store.dispatch(S.toggleSearchFacet(FIELD, value, false))
			.then(() => {
				const actions = store.getActions()

				expect(actions).to.have.length(expectedActions.length)
				actions.forEach((a, i) => { expect(a.type).to.equal(expectedActions[i].toString()) })

				const prepped = actions[1]

				expect(prepped.payload.facets[FIELD])
					.to.have.length(search.facets[FIELD].length - 1)

				expect(prepped.payload).to.have.property('options')
				expect(prepped.payload.options.page).to.equal(1)

				const calls = fetchMock.calls()
				expect(calls.matched).to.not.be.empty
				expect(calls.matched).to.have.length(1)
			})
		})
	})
})

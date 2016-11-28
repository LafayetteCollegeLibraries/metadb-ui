import { expect } from 'chai'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import fetchMock from 'fetch-mock'

import {
	searchCatalog,
	setSearchOption,
	toggleSearchFacet,
} from '../search'

import {
	RECEIVE_SEARCH_RESULTS,
	SEARCHING,
} from '../../constants'

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
		it('dispatches `SEARCHING` and `RECEIVE_SEARCH_RESULTS`', function () {
			return store.dispatch(searchCatalog('some query'))
			.then(() => {
				const actions = store.getActions()
				expect(actions).to.have.length(2)
				expect(actions[0].type).to.equal(SEARCHING)
				expect(actions[1].type).to.equal(RECEIVE_SEARCH_RESULTS)
			})
		})

		it('dispatches `SEARCHING` w/ query details', function () {
			const query = 'cats AND dogs'
			const facets = { one: ['a', 'b']}
			const options = { per_page: 5 }

			return store.dispatch(searchCatalog(query, facets, options))
			.then(() => {
				const actions = store.getActions()
				expect(actions).to.have.length(2)
				expect(actions[0].type).to.equal(SEARCHING)
				expect(actions[0].query).to.equal(query)
				expect(actions[0].facets).to.deep.equal(facets)
				expect(actions[0].options.per_page).to.equal(options.per_page)
			})
		})

		it('appends `search_field=search` to url', function () {
			return store.dispatch(searchCatalog('some query'))
			.then(() => {
				const url = fetchMock.lastUrl()
				expect(url.indexOf('search_field=search')).to.be.greaterThan(-1)
			})
		})
	})

	describe('#setSearchOption', function () {
		it('adds key/val to `search.options`', function () {
			const key = 'key'
			const val = 'val'

			return store.dispatch(setSearchOption(key, val)).then(() => {
				const actions = store.getActions()
				expect(actions[0].type).to.equal(SEARCHING)
				expect(actions[0].options).to.have.property(key)
				expect(actions[0].options[key]).to.equal(val)
			})
		})

		it('will make an api call even if the key/val already exists', function () {
			const key = 'key'
			const val = 'val'

			const options = {
				[key]: val
			}

			const store = mockStore({search: {options}})

			return store.dispatch(setSearchOption(key, val))
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

			return store.dispatch(toggleSearchFacet(field, value, true))
			.then(() => {
				const actions = store.getActions()

				// it calls 2 actions (SEARCHING + RECEIVE_SEARCH_{RESULTS,ERROR})
				expect(actions).to.have.length(2)

				// it sends the updated props w/ SEARCHING
				const action = actions[0]

				// the facet prop now has the new property
				expect(action.facets).to.have.property(field)
				expect(action.facets[field]).to.have.length(1)
				expect(action.facets[field].indexOf(value)).to.be.greaterThan(-1)

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

			return store.dispatch(toggleSearchFacet(field, value, true))
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

			return store.dispatch(toggleSearchFacet(field, value, true))
			.then(() => {
				expect(fetchMock.calls().matched).to.have.length(0)
			})
		})

		it('removes a facet + makes an API call', function () {
			const search = {
				query: 'search query',
				facets: {
					'facet_field': [
						{value: 'one', name: 'one', hits: 12},
						{value: 'two', name: 'two', hits: 123},
						{value: 'three', name: 'three', hits: 1234},
					]
				}
			}

			const store = mockStore({search})
			const field = 'facet_field'
			const value = search.facets[field][1]

			return store.dispatch(toggleSearchFacet(field, value, false))
			.then(() => {
				const actions = store.getActions()

				expect(actions).to.have.length(2)

				const action = actions[0]
				expect(action.facets[field]).to.have.length(search.facets[field].length - 1)

				const calls = fetchMock.calls()
				expect(calls.matched).to.not.be.empty
				expect(calls.matched).to.have.length(1)
			})
		})
	})
})

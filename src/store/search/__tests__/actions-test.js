import { expect } from 'chai'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import fetchMock from 'fetch-mock'
import arrayFind from 'array-find'

import * as S from '../actions'
import * as utils from '../utils'

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
	meta: {},
}

const store = mockStore({search: state})

const findPreppingPayload = actions => {
	const str = S.preppingSearch.toString()
	const action = arrayFind(actions, a => a.type === str)

	if (!action) {
		throw new Error(`could not find action, "${str}"`)
	}

	return action.payload
}

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

	describe('#getResultsAtPage', function () {
		const initialState = {
			search: {
				meta: {
					page: 1
				}
			}
		}

		const store = mockStore(initialState)
		const reqPage = 2

		return store.dispatch(S.getResultsAtPage(reqPage))
			.then(() => {
				const state = store.getState()
				expect(state.search.meta.page).to.equal(reqPage)
			})
	})

	describe('#searchCatalog', function () {
		it('dispatches `preppingSearch` and `receivedSearchResults`', function () {
			const QUERY = 'some query'

			const expected = [
				S.preppingSearch({
					query: QUERY,
					facets: {},
					range: {},
					meta: {
						isSearching: true,
						format: 'json',
						page: 1,
						per_page: S.RESULTS_PER_PAGE,
					}
				}),
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
			const meta = {
				isSearching: true,
				format: 'json',
				per_page: S.RESULTS_PER_PAGE,
				page: 1,
			}
			const range = {}

			const expected = S.preppingSearch({
				query,
				facets,
				meta,
				range,
			})

			return store.dispatch(S.searchCatalog(query, facets, range, meta))
			.then(() => {
				const actions = store.getActions()
				expect(actions).to.have.length(2)
				expect(actions[0]).to.deep.equal(expected)
			})
		})
	})

	describe('#searchCatalogFromQueryString', function () {
		it('parses out the search object from a query string', function () {
			const input = {
				q: 'cool cat',
				f: {
					subject: [
						'cats',
						'cool things',
					]
				}
			}

			const qs = utils.stringifyQs(input)

			return store.dispatch(S.searchCatalogByQueryString(qs))
				.then(() => {
					const payload = findPreppingPayload(store.getActions())
					expect(payload.query).to.equal(input.q)
					expect(payload.facets).to.deep.equal(input.f)
					expect(payload.range).to.be.empty
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

		it('will send an api call if the facet already exists but the item does not', function () {
			const initialState = {
				search: {
					facets: {
						subject: [
							{value: 'cats'}
						]
					}
				}
			}

			const store = mockStore(initialState)
			const item = { value: 'dogs' }
			return store.dispatch(S.toggleSearchFacet('subject', item, true))
				.then(() => {
					const payload = findPreppingPayload(store.getActions())
					expect(payload).to.have.property('facets')
					expect(payload.facets).to.have.property('subject')
					expect(payload.facets.subject).to.have.length(2)
					expect(payload.facets.subject).to.contain(item)

					expect(fetchMock.calls().matched).to.have.length(1)
				})
		})

		it('will send an api for non-duplicate facet (using strings)', function () {
			const initialState = {
				search: {
					facets: {
						subject: ['cats']
					}
				}
			}

			const item = 'dogs'
			const store = mockStore(initialState)
			return store.dispatch(S.toggleSearchFacet('subject', item, true))
				.then(() => {
					const payload = findPreppingPayload(store.getActions())
					expect(payload).to.have.property('facets')
					expect(payload.facets).to.have.property('subject')
					expect(payload.facets.subject).to.have.length(2)
					expect(payload.facets.subject).to.contain(item)

					expect(fetchMock.calls().matched).to.have.length(1)
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
			const value = {label: 'aye', value: 'a'}
			const facets = {}
			facets[field] = [value]

			const store = mockStore({search: {facets}})

			return store.dispatch(S.toggleSearchFacet(field, value, true))
			.then(() => {
				expect(fetchMock.calls().matched).to.have.length(0)
			})
		})

		it('accepts facets using objects for field', function () {
			const facet = { name: 'subject', label: 'Subject' }
			const item = { label: 'Cats', value: 'cats' }

			const expected = {
				[facet.name]: [item],
			}

			const store = mockStore({search: {}})

			return store.dispatch(S.toggleSearchFacet(facet, item, true))
				.then(() => {
					const payload = findPreppingPayload(store.getActions())

					expect(payload.facets).to.deep.equal(expected)
					expect(fetchMock.calls().matched).to.have.length(1)
				})
		})

		it('toggles a range facet true', function () {
			const facet = {name: 'date_created'}
			const item = {type: 'range', value: { begin: '1990', end: '1999' }}

			const expectedRange = {
				[facet.name]: item.value
			}

			const store = mockStore({search: {}})

			return store.dispatch(S.toggleSearchFacet(facet, item, true))
				.then(() => {
					const payload = findPreppingPayload(store.getActions())

					expect(payload.range).to.deep.equal(expectedRange)
					expect(fetchMock.calls().matched).to.have.length(1)
				})
		})

		describe('removing a facet', function () {
			it('works for ranges', function () {
				const facet = {name: 'date_created'}
				const item = {type: 'range', value: {begin: '1990', end: '1999'}}

				const initialState = {
					search: {
						query: '',
						facets: {},
						range: {
							[facet.name]: item.value,
							another_field: {begin: '1234', end: '5678'}
						}
					}
				}

				const expectedRange = {
					another_field: {begin: '1234', end: '5678'}
				}

				const store = mockStore(initialState)

				return store.dispatch(S.toggleSearchFacet(facet, item, false))
					.then(() => {
						const payload = findPreppingPayload(store.getActions())
						expect(payload.range).to.deep.equal(expectedRange)
					})
			})

			it('removes a page number, and makes an API call', function () {
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

					expect(prepped.payload).to.have.property('meta')
					expect(prepped.payload.meta.page).to.equal(1)

					const calls = fetchMock.calls()
					expect(calls.matched).to.not.be.empty
					expect(calls.matched).to.have.length(1)
				})
			})

			it('does nothing when facet key does not exist (object)', function () {
				const initialState = {
					search: {
						facets: {},
					}
				}

				const store = mockStore(initialState)
				return store.dispatch(S.toggleSearchFacet('nothing', {value: 'nope'}, false))
					.then(() => {
						expect(fetchMock.calls().matched).to.have.length(0)
						expect(fetchMock.calls().unmatched).to.have.length(0)
					})
			})

			it('will toggle if values are strings', function () {
				const initialState = {
					search: {
						facets: {
							subject: ['dogs', 'cats']
						}
					}
				}
				const item = 'dogs'
				const store = mockStore(initialState)

				return store.dispatch(S.toggleSearchFacet('subject', item, false))
					.then(() => {
						const payload = findPreppingPayload(store.getActions())
						const original = initialState.search.facets.subject
						const updated = payload.facets.subject

						expect(updated.length).to.be.lessThan(original.length)
						expect(updated).to.not.contain(item)
					})
			})
		})
	})
})

import { expect } from 'chai'

import * as actions from '../actions'
import reducer, {
	initialState as INITIAL_STATE
} from '../reducer'

const defaultState = {
	query: '',
	facets: {},
	range: {},
	meta: {
		isSearching: false,
	},
	breadcrumbs: [],
}

const defaultStatePure = { ...defaultState }

describe('Search reducer', function () {
	afterEach(function () {
		expect(defaultState).to.deep.equal(defaultStatePure)
	})

	it('returns a default object when state is undefined', function () {
		const res = reducer(undefined, {type: 'nothing'})

		expect(res).to.be.an('object')
		expect(res).to.not.be.empty
	})

	describe('`clearFacet`', function () {
		it('removes the appropriate breadcrumb from the collection', function () {
			const breadcrumbs = [
				{
					facet: {name: 'subject', label: 'Subject'},
					item: {value: 'COOL CATS'},
				},
				{
					facet: {name: 'subject', label: 'Subject'},
					item: {value: 'NICE DOGS'},
				},
				{ facet: {name: 'author', label: 'Author'},
					item: {value: 'Brent'},
				}
			]

			const state = {
				...defaultState,
				breadcrumbs,
			}

			const index = 1

			const expected = [].concat(
				breadcrumbs.slice(0, index),
				breadcrumbs.slice(index + 1)
			)

			const action = actions.clearFacet(breadcrumbs[index])
			const result = reducer(state, action)

			expect(result.breadcrumbs).to.deep.equal(expected)
		})
	})

	describe('`clearSearch`', function () {
		it('restores the state to the initial values', function () {
			const dirty = {
				query: 'some cool query',
				facets: {
					subject: [
						{value: 'neat'}
					]
				},
				range: {},
				meta: {
					isSearching: false,
					per_page: 40,
				},
				breadcrumbs: [
					{
						facet: {name: 'subject', label: 'Subject'},
						item: {value: 'neat'}
					}
				]
			}

			const action = actions.clearSearch()
			const result = reducer(dirty, action)

			expect(result).to.deep.equal(INITIAL_STATE)
		})
	})

	describe('`fetchingSearchErr`', function () {
		it('sets `isSearching` to false', function () {
			const action = actions.fetchingSearchErr()
			const res = reducer({isSearching: true}, action)

			expect(res.meta.isSearching).to.be.false
		})
	})

	describe('`preppingSearch`', function () {
		it('updates the `query`, `facets`, and `meta` to those passed', function () {
			const query = 'a whole new query'
			const facets = {
				one: [
					{value: 'a'},
					{value: 'b'}
				]
			}
			const range = {
				date_created: [
					{
						label: '2000 - 2010',
						value: {
							begin: '2000',
							end: '2010',
						}
					}
				]
			}

			const meta = {
				format: 'json',
				per_page: 25,
				page: 1,
			}

			const action = actions.preppingSearch({query, facets, range, meta})
			const res = reducer(defaultState, action)

			expect(res).to.not.deep.equal(defaultState)
			expect(res).to.contain.all.keys(['query', 'facets', 'range', 'meta'])

			expect(res.query).to.not.equal(defaultState.query)
			expect(res.query).to.equal(query)

			expect(res.facets).to.not.deep.equal(defaultState.facets)
			expect(res.facets).to.deep.equal(facets)

			expect(res.range).to.not.deep.equal(defaultState.range)
			expect(res.range).to.deep.equal(range)

			expect(res.meta.format).to.equal(meta.format)
			expect(res.meta.per_page).to.equal(meta.per_page)
			expect(res.meta.page).to.equal(meta.page)
		})
	})

	describe('`receivedSearchResults`', function () {
		it('sets `isSearching` to false', function () {
			const action = actions.receivedSearchResults({
				results: {
					response: {},
				}
			})

			const res = reducer({meta: {isSearching: true}}, action)

			expect(res.meta.isSearching).to.be.false
		})

		describe('when handling facets', function () {
			const state = {
				breadcrumbs: null,
				facets: {
					subject: [
						'COOL CATS',
						'NICE DOGS'
					],
					author: [
						{ value: 'Beverly Cleary' }
					]
				},
				query: '',
				range: {},
				meta: {},
			}

			const action = actions.receivedSearchResults({
				results: {
					facets: [
						{
							name: 'subject',
							label: 'Subject',
							items: [
								{ value: 'COOL CATS' },
								{ value: 'NICE DOGS' },
								{ value: 'SKATEBOARDS' },
								{ value: 'SICK MOVES' },
							]
						},
						{
							name: 'author',
							label: 'Author',
							items: [
								{ value: 'Beverly Cleary' },
								{ value: 'Stephen King' },
								{ value: 'KA Applegate' },
								{ value: 'Laura Ingalls Wilder' },
							]
						},
						{
							name: 'medium',
							label: 'Medium',
							items: [
								{ value: 'Book' },
								{ value: 'Compact Disc' },
							]
						}
					]
				}
			})

			const expectedFacets = {
				subject: [
					{ value: 'COOL CATS' },
					{ value: 'NICE DOGS' },
				],
				author: [
					{ value: 'Beverly Cleary' },
				]
			}

			const expectedBreadcrumbs = [
				{
					facet: {name: 'subject', label: 'Subject'},
					item: {value: 'COOL CATS', label: 'COOL CATS'}
				},
				{
					facet: {name: 'subject', label: 'Subject'},
					item: {value: 'NICE DOGS', label: 'NICE DOGS'}
				},
				{
					facet: {name: 'author', label: 'Author'},
					item: {value: 'Beverly Cleary'}
				},
			]

			const res = reducer(state, action)

			it('fills in string facets with those from the results', function () {
				expect(res.facets.subject).to.deep.equal(expectedFacets.subject)
			})

			it('passes through already-expanded facets', function () {
				expect(res.facets.author).to.deep.equal(expectedFacets.author)
			})

			it('creates breadcrumbs if they do not exist already', function () {
				expect(res.breadcrumbs).to.deep.equal(expectedBreadcrumbs)
			})
		})

		describe('when no breadcrumbs are defined', function () {
			it('creates them from a combination of search + result data', function () {
				// this is the state from a queryString, before an initial search
				const initialState = {
					...INITIAL_STATE,
					breadcrumbs: null,
					query: 'cool cats and dogs',
					facets: {
						subject: [
							'cats',
							'dogs'
						]
					},
					range: {
						date_created: {
							begin: '1986',
							end: '2017',
						}
					}
				}

				const results = {
					docs: [{id: 'abc123', title: ['Look at this great book!']}],
					facets: [
						{
							name: 'subject',
							label: 'Subject',
							items: [
								{ value: 'cats', label: 'Cats', hits: 1234 },
								{ value: 'dogs', label: 'Dogs', hits: 567 },
							]
						},
						{
							name: 'date_created',
							label: 'Date Created',
							items: [
								{ value: '1986', label: '1986', hits: 901 },
								{ value: '2017', label: '2017', hits: 900 },
							]
						}
					],
					pages: {
						'first_page?': true,
						'last_page?': true,
						total_count: 1,
					}
				}

				const expectedBreadcrumbs = [
					{
						facet: {
							name: 'subject',
							label: 'Subject',
						},
						item: {
							label: 'Cats',
							value: 'cats',
						}
					},
					{
						facet: {
							name: 'subject',
							label: 'Subject',
						},
						item: {
							label: 'Dogs',
							value: 'dogs',
						}
					},
					{
						facet: {
							label: 'Date Created',
							name: 'date_created',
						},
						item: {
							label: '1986 - 2017',
							name: 'date_created',
							value: {
								begin: '1986',
								end: '2017',
							},
							type: 'range',
						}
					}
				]

				const action = actions.receivedSearchResults({results})
				const res = reducer(initialState, action)

				expect(res.breadcrumbs).to.deep.equal(expectedBreadcrumbs)
			})
		})
	})

	describe('`setFacet`', function () {
		it('appends a facet breadcrumb to the array', function () {
			const payload1 = {
				facet: { name: 'cool-facet' },
				item: { value: 'Cool Facet Item 1' }
			}

			const payload2 = {
				facet: { name: 'another-cool-facet' },
				item: { name: 'Another Cool Facet Item 1' },
			}

			const initialState = { breadcrumbs: [] }

			const result1 = reducer(initialState, actions.setFacet(payload1))
			expect(result1).to.have.property('breadcrumbs')
			expect(result1.breadcrumbs).to.have.length(1)
			expect(result1.breadcrumbs[0]).to.deep.equal(payload1)

			const result2 = reducer(result1, actions.setFacet(payload2))
			expect(result2).to.have.property('breadcrumbs')
			expect(result2.breadcrumbs).to.have.length(2)
			expect(result2.breadcrumbs[1]).to.deep.equal(payload2)
		})

		it('will append multiple ranges for different facets', function () {
			const range1 = {
				facet: { name: 'cool-range-facet-1', },
				item: {
					type: 'range',
					value: { begin: '2000', end: '2010' },
				}
			}

			const range2 = {
				facet: { name: 'cool-range-facet-2', },
				item: {
					type: 'range',
					value: { begin: '1991', end: '1999' },
				}
			}

			const initialState = { breadcrumbs: [] }

			const result1 = reducer(initialState, actions.setFacet(range1))
			expect(result1.breadcrumbs).to.have.length(1)

			const result2 = reducer(result1, actions.setFacet(range2))
			expect(result2.breadcrumbs).to.have.length(2)
		})

		it('will only allow one range per facet', function () {
			const range1 = {
				facet: { name: 'cool-range-facet-1' },
				item: {
					type: 'range',
					value: { begin: '1986', end: '2017' },
				}
			}

			const range2 = {
				facet: range1.facet,
				item: {
					type: 'range',
					value: { begin: '1961', end: '1975' }
				}
			}

			const initialState = { breadcrumbs: [] }

			const result1 = reducer(initialState, actions.setFacet(range1))
			expect(result1.breadcrumbs).to.have.length(1)

			const result2 = reducer(result1, actions.setFacet(range2))
			expect(result2.breadcrumbs).to.have.length(1)
			expect(result2.breadcrumbs[0]).to.deep.equal(range2)
		})
	})
})

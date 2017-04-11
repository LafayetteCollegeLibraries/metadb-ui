import { expect } from 'chai'

import * as actions from '../actions'
import searchReducer from '../reducer'

const defaultState = {
	query: '',
	facets: {},
	range: {},
	meta: {
		isSearching: false,
	}
}

const defaultStatePure = { ...defaultState }

describe('Search reducer', function () {
	afterEach(function () {
		expect(defaultState).to.deep.equal(defaultStatePure)
	})

	it('returns a default object when state is undefined', function () {
		const res = searchReducer(undefined, {type: 'nothing'})

		expect(res).to.be.an('object')
		expect(res).to.not.be.empty
	})

	describe('`fetchingSearch`', function () {
		it('sets `isSearching` to true', function () {
			const action = actions.fetchingSearch()
			const res = searchReducer(defaultState, action)

			expect(res.meta.isSearching).to.be.true
		})
	})

	describe('`fetchingSearchErr`', function () {
		it('sets `isSearching` to false', function () {
			const action = actions.fetchingSearchErr()
			const res = searchReducer({isSearching: true}, action)

			expect(res.meta.isSearching).to.be.false
		})
	})

	describe('`preppingSearch`', function () {
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

		it('updates the `query`, `facets`, and `meta` to those passed', function () {
			const action = actions.preppingSearch({query, facets, range, meta})
			const res = searchReducer(defaultState, action)

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

			const res = searchReducer({meta: {isSearching: true}}, action)

			expect(res.meta.isSearching).to.be.false
		})

		describe('when handling facets', function () {
			const state = {
				facets: {
					subject_ocm: [
						'200 COOL CATS',
						'300 NICE DOGS'
					],
					author: [
						{ value: 'Beverly Cleary' }
					]
				}
			}

			const action = actions.receivedSearchResults({
				results: {
					facets: [
						{
							name: 'subject_ocm',
							items: [
								{ value: '200 COOL CATS' },
								{ value: '300 NICE DOGS' },
								{ value: '400 SKATEBOARDS' },
								{ value: '450 SICK MOVES' },
							]
						},
						{
							name: 'author',
							items: [
								{ value: 'Beverly Cleary' },
								{ value: 'Stephen King' },
								{ value: 'KA Applegate' },
								{ value: 'Laura Ingalls Wilder' },
							]
						},
						{
							name: 'medium',
							items: [
								{ value: 'Book' },
								{ value: 'Compact Disc' },
							]
						}
					]
				}
			})

			const expectedFacets = {
				subject_ocm: [
					{ value: '200 COOL CATS' },
					{ value: '300 NICE DOGS' },
				],
				author: [
					{ value: 'Beverly Cleary' },
				]
			}

			const res = searchReducer(state, action)

			it('fills in string facets with those from the results', function () {
				expect(res.facets.subject_ocm).to.deep.equal(expectedFacets.subject_ocm)
			})

			it('passes through already-expanded facets', function () {
				expect(res.facets.author).to.deep.equal(expectedFacets.author)
			})
		})

	})
})

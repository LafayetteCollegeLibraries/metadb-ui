import { expect } from 'chai'
import reducer from '../reducer'
import * as search from '../../search/actions'

const results = {
	docs: [
		{ id: 'abc123', title: ['Title of Work'] },
		{ id: 'def456', title: ['Another Work'] },
	],
	facets: [
		{
			name: 'subject',
			label: 'Subject',
			items: [
				{
					name: 'Cats',
					value: 'Cats',
					hits: 120,
				},
				{
					name: 'Dogs',
					value: 'Dogs',
					hits: 10,
				}
			]
		}
	],
	pages: {
		'first_page?': true,
		'last_page?': false,
		current_page: 1,
		total_pages: 2,
		total_count: 4,
		per_page: 2
	}
}

const resultsPure = { ...results }

describe('src/store/search-results/reducers', function () {
	afterEach(function () {
		expect(results).to.deep.equal(resultsPure)
	})

	describe('`search.clearSearch`', function () {
		it('returns an empty object', function () {
			const action = search.clearSearch()
			const result = reducer({}, action)

			expect(result).to.be.empty
			expect(result).to.deep.equal({})
		})

		it('clears out any previous state', function () {
			const action = search.clearSearch()
			const initialState = {
				docs: [].concat(results.docs),
				facets: [].concat(results.facets),
				meta: {
					total_pages: 1,
					total_count: 2,
				}
			}

			const result = reducer(initialState, action)
			expect(result).to.deep.equal({})
		})
	})

	describe('`search.receivedSearchResults`', function () {
		it('contains the `docs`, `facets` props and a `meta` prop', function () {
			const action = search.receivedSearchResults({results})
			const result = reducer({}, action)

			expect(result).to.have.all.keys(['docs', 'facets', 'meta'])
		})

		it('concats results with previous state if beyond first page', function () {
			const firstState = reducer({}, search.receivedSearchResults({results}))
			const nextResults = {
				...results,
				pages: {
					...results.pages,
					current_page: 2,
					'first_page?': false,
					'last_page?': true,
				}
			}
			const secondState = reducer(firstState, search.receivedSearchResults({
				results: nextResults,
			}))

			const { docs, facets } = secondState

			expect(docs).to.have.length(nextResults.docs.length + firstState.docs.length)
			expect(facets).to.have.length(results.facets.length)
		})
	})
})

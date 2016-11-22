import { expect } from 'chai'
import {
	addSearch,
	getSearches,
	getPreviousQueries,
	STORED_SEARCH_KEY,
} from '../search-history'

describe('lib/search-history', function () {
	// need to run this _before_ each test so as to clear out previous searches
	// saved from `search` action tests
	beforeEach(function () {
		localStorage.clear()
	})

	describe('#addSearch/#getSearches', function () {
		it('writes a search object to localStorage', function () {
			const search = {
				query: 'cats',
				facets: {},
				options: {},
			}

			addSearch(search)
			expect(getSearches()).to.deep.equal([search])
		})

		it('puts most recent search at beginning of array', function () {
			const first = {
				query: 'cats 1',
				facets: {},
				options: {},
			}

			const second = {
				query: 'cats 2',
				facets: {},
				options: {},
			}

			addSearch(first)
			addSearch(second)

			expect(getSearches()).to.deep.equal([second, first])
		})
	})

	describe('#getSearches', function () {
		it('returns an empty array if search key is not found in local storage', function () {
			expect(localStorage.getItem(STORED_SEARCH_KEY)).to.be.null
			expect(getSearches()).to.deep.equal([])
		})
	})

	describe('#getPreviousQueries', function () {
		it('returns an empty array if search key is not found in local storage', function () {
			expect(localStorage.getItem(STORED_SEARCH_KEY)).to.be.null
			expect(getPreviousQueries()).to.deep.equal([])
		})

		it('returns only unique previous queries', function () {
			const history = [
				{ query: 'animals', facets: {}, options: {page: 2} },
				{ query: 'animals', facets: {}, options: {page: 1} },
				{ query: 'cats', facets: {author: ['Cleary, Beverly']}, options: {} },
				{ query: 'cool things', facets: {}, options: {} },
				{ query: 'dumb things', facets: {}, options: {} },
				{ query: 'cats', facets: {}, options: {} },
				{ query: 'dogs', facets: {}, options: {} },
			]

			const expected = [
				'animals',
				'cats',
				'cool things',
				'dumb things',
				'dogs',
			]

			localStorage.setItem(STORED_SEARCH_KEY, JSON.stringify(history))

			expect(getPreviousQueries()).to.deep.equal(expected)
		})
	})
})

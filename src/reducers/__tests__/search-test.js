import { expect } from 'chai'
import assign from 'object-assign'
import {
	RECEIVE_SEARCH_ERR,
	RECEIVE_SEARCH_RESULTS,
	SEARCHING,
} from '../../constants'

import searchReducer from '../search'

const defaultState = {
	query: '',
	facets: {},
	options: {},
	isSearching: false,
	queryString: '',
}

const defaultStatePure = assign({}, defaultState)

describe('Search reducer', function () {
	afterEach(function () {
		expect(defaultState).to.deep.equal(defaultStatePure)
	})

	it('returns an empty object when state is undefined', function () {
		const res = searchReducer()

		expect(res).to.be.an('object')
		expect(res).to.be.empty
	})

	describe('@SEARCHING', function () {
		it('sets `isSearching` to true', function () {
			const action = {
				type: SEARCHING,
				query: 'some query',
				facets: {},
				options: {},
				queryString: 'q=some%20query'
			}

			const res = searchReducer(defaultState, action)

			expect(res.isSearching).to.be.true
		})

		it('updates the `query`, `facets`, and `options` to those passed', function () {
			const query = 'a whole new query'
			const facets = { 'one': ['a','b'] }
			const options = { 'per_page': 25 }
			const queryString = '?q=a%20whole%20new%20query&f[one][]=a&f[one][]=b&per_page=25'

			const action = {
				type: SEARCHING,
				query,
				facets,
				options,
				queryString,
			}

			const res = searchReducer(defaultState, action)

			expect(res.query).to.not.equal(defaultState.query)
			expect(res.query).to.equal(query)

			expect(res.facets).to.not.deep.equal(defaultState.facets)
			expect(res.facets).to.deep.equal(facets)

			expect(res.options).to.not.deep.equal(defaultState.options)
			expect(res.options).to.deep.equal(options)

			expect(res.queryString).to.not.deep.equal(defaultState.queryString)
			expect(res.queryString).to.equal(queryString)
		})
	})

	describe('@RECEIVE_SEARCH_ERR', function () {
		it('sets `isSearching` to false', function () {
			const action = { type: RECEIVE_SEARCH_ERR }
			const res = searchReducer({isSearching: true}, action)

			expect(res.isSearching).to.be.false
		})
	})

	describe('@RECEIVE_SEARCH_RESULTS', function () {
		it('sets `isSearching` to false', function () {
			const action = { type: RECEIVE_SEARCH_RESULTS }
			const res = searchReducer({isSearching: true}, action)

			expect(res.isSearching).to.be.false
		})
	})
})

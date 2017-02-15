/**
 *  the search-state stores data related to the query itself -- results (which
 *  include: facets, docs, page info) are handled within the results component
 *  itself, as: a) that data doesn't need to be stored in the global state, and
 *  b) it can easily be re-fetched using search info here.
 *
 *  note: all of the heavy lifting is being done within the action/search creator
 *
 *  {
 *    // facets grouped by field
 *    // { 'subject': [{value: 'art' ...}, {value: 'anthropology' ...} ]}
 *    facets: object
 *
 *    // flagged when SEARCHING action is received
 *    isSearching: bool

 *    // search options
 *    // { 'per_page': 25 }
 *    options: object
 *
 *    // contains the search query
 *    query: string
 *
 *		// the actual formatted querystring (used for pushState)
 *    queryString: string
 *
 *    // raw Blacklight results (specificially, the `response` object)
 *    results: object
 *
 *    // Date.now() used to determine whether or not to update state on the
 *    // SearchResults page
 *    timestamp: number
 *  }
 */

import assign from 'object-assign'
import arrayFind from 'array-find'

import {
	RECEIVE_SEARCH_ERR,
	RECEIVE_SEARCH_RESULTS,
	SEARCHING,
} from '../constants'

export default function searchReducer (state, action) {
	if (typeof state === 'undefined')
		return {}

	switch (action.type) {
		case SEARCHING:
			return searching(state, action)

		case RECEIVE_SEARCH_ERR:
			return receiveError(state, action)

		case RECEIVE_SEARCH_RESULTS:
			return receiveResults(state, action)

		default:
			return state
	}
}


function searching (state, action) {
	return {
		isSearching: true,
		query: action.query,
		facets: action.facets,
		options: action.options,
		queryString: action.queryString,
	}
}

function receiveError () {
	return {
		isSearching: false,
	}
}

// this would be very straight-forward _if_ we weren't allowing
// users to return by way of copy/pasting a url w/ a search
// querystring. we're storing facets in state as objects,
// as opposed to the querystring where they are just the
// values. so in order to get these _back_ to objects, as the
// components are expecting them, we need to find their
// respective objects in the pool of facets returned from
// the server.

function receiveResults (state, action) {
	const results = action.results.response || {}
	const fullSet = results.facets
	const selectedFacets = state.facets || {}
	const facets = {}

	const keys = Object.keys(selectedFacets)

	if (keys.length) {
		keys.forEach(key => {
			const facet = selectedFacets[key]

			facets[key] = facet.map(facetValue => {
				// in most cases (read: not arriving from a link) the facets
				// will be objects, so we'll just return them and deal with
				// the minimal extra work
				if (typeof facetValue === 'object' && facetValue !== null)
					return facetValue

				// otherwise, loop through all of the facet-groups to find
				// the appropriate one, and then loop through its items
				// to locate the facet object
				const group = arrayFind(fullSet, g => g.name === key)
				return arrayFind(group.items, facetItem => facetItem.value === facetValue)

				// filter out any empty values that may have been returned
				// as `null`
			}).filter(Boolean)
		})
	}

	return assign({}, state, {
		isSearching: false,
		facets,
		results,
		timestamp: Date.now(),
	})
}

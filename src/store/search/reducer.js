import { handleActions } from 'redux-actions'
import arrayFind from 'array-find'
import * as actions from './actions'

/**
 *  the search-state stores data related to the query itself -- results (which
 *  include: facets, docs, page info) are handled within the results component
 *  itself, as: a) that data doesn't need to be stored in the global state, and
 *  b) it can easily be re-fetched using search info here.
 *
 *	{
 *	  // facets grouped by field
 *	  // { 'subject': [{value: 'art' ...}, {value: 'anthropology' ...} ]}
 *		facets: object
 *
 *	  // contains the search query
 *	  query: string
 *
 *		// just like the facets, but w/ ranges
 *		range: object
 *
 *		// stores the meta-information about the search (details that
 *		// aren't exposed in the queryString)
 *		meta: {
 *			// flagged when `fetchingSearch` is called
 *			isSearching: bool
 *
 *			// which page are we at
 *			// (`search/actions` defaults this to 1)
 *			page: number
 *
 *			// how many results per-page are we expecting
 *			// (`search/actions` sets the app default)
 *			perPage: number
 *		}
 *	}
 */

const initialState = {
	query: '',
	facets: {},
	range: {},
	meta: {
		isSearching: false,
	}
}

export default handleActions({
	[actions.fetchingSearch]: (state, action) => {
		return {
			...state,
			meta: {
				...state.meta,
				isSearching: true,
			}
		}
	},

	// any errors are handled within notifications
	[actions.fetchingSearchErr]: state => {
		return {
			...state,
			meta: {
				...state.meta,
				isSearching: false,
			}
		}
	},

	[actions.preppingSearch]: (state, action) => {
		const { query, facets, range, options } = action.payload

		return {
			query,
			facets,
			range,
			meta: {
				...state.meta,
				...options,
				perPage: options.per_page,
			}
		}
	},

	// this would be very straight-forward _if_ we weren't allowing
	// users to return by way of copy/pasting a url w/ a search
	// querystring. we're storing facets in state as objects,
	// as opposed to the querystring where they are just the
	// values. so in order to get these _back_ to objects, as the
	// components are expecting them, we need to find their
	// respective objects in the pool of facets returned from
	// the server.
	[actions.receivedSearchResults]: (state, action) => {
		const { results } = action.payload || {}
		const allFacets = results.facets
		const selectedFacets = state.facets || {}
		let facets = {}

		const selectedKeys = Object.keys(selectedFacets)

		if (selectedKeys.length) {
			facets = selectedKeys.reduce((out, key) => {
				out[key] = selectedFacets[key].map(item => {

					// in most cases (read: not arriving from a link) the facets
					// will be objects, so we'll just return them and deal with
					// the minimal extra work
					if (typeof item === 'object' && item !== null)
						return item

					// otherwise, loop through all of the facet-groups to find
					// the appropriate one, and then loop through its items
					// to locate the facet object
					const group = arrayFind(allFacets, g => g.name === key)
					return arrayFind(group.items, i => i.value === item)

				// filter out any empty values
				}).filter(Boolean)

				return out
			}, {})
		}

		return {
			...state,
			isSearching: false,
			facets,
			results,
			timestamp: Date.now(),
		}
	},
}, initialState)

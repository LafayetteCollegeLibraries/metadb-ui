import { handleActions } from 'redux-actions'
import arrayFind from 'array-find'
import * as actions from './actions'
import { createRangeFacet } from './utils'

/**
 *  the search-state stores data related to the query itself -- results (which
 *  include: facets, docs, page info) are handled within the results component
 *  itself, as: a) that data doesn't need to be stored in the global state, and
 *  b) it can easily be re-fetched using search info here.
 *
 *	{
 *		// breadcrumb objects accumulated during the search
 *		breadcrumbs: array
 *
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
 *      // are we at the end?
 *			atEnd: bool
 *
 *			// flagged when `fetchingSearch` is called
 *			isSearching: bool
 *
 *			// which page are we at
 *			// (`search/actions` defaults this to 1)
 *			page: number
 *
 *			// how many results per-page are we expecting
 *			// (`search/actions` sets the app default)
 *			per_page: number
 *		}
 *	}
 */

export const initialState = {
	breadcrumbs: [],
	facets: {},
	query: '',
	range: {},

	meta: {
		atEnd: false,
		isSearching: false,
		page: 0,
		per_page: 0,
	}
}

export default handleActions({
	[actions.clearFacet]: (state, action) => {
		const breadcrumbs = state.breadcrumbs.filter(bc => {
			return bc.item.value !== action.payload.item.value
		})

		return {
			...state,
			breadcrumbs,
		}
	},

	[actions.clearSearch]: () => ({ ...initialState }),

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
		const { query, facets, range, meta } = action.payload

		return {
			...state,
			query,
			facets,
			range,
			meta: {
				...state.meta,
				...meta,
			}
		}
	},

	[actions.receivedSearchResults]: (state, action) => {
		const { results } = action.payload || {}
		const allFacets = results.facets || []
		const selectedFacets = { ...state.facets }

		// save ourselves the hassle of iterating through the returned
		// array of facets + create a map:
		//
		//     { [facet.name]: index }
		//
		const facetDictionary = allFacets.reduce((out, f, index) => {
			out[f.name] = index
			return out
		}, {})

		let facets, breadcrumbs

		// rehydrating our selected facets, in the event that we are
		// handling the first page-load and currently don't have
		// access to helpful things such as labels
		const selectedFacetsKeys = Object.keys(selectedFacets)
		if (selectedFacetsKeys.length > 0) {
			facets = selectedFacetsKeys.reduce((out, key) => {
				const facet = selectedFacets[key]

				const mapped = facet.map(item => {
					// if we haven't lost state, or just arrived here,
					// the facet items will already exist as objects
					// and all we have to do is return them
					if (typeof item === 'object' && item !== null) {
						return item
					}

					// otherwise, loop through the items of the facet
					// until you find one where the value matches our
					// current one in the upper loop
					const groupIdx = facetDictionary[key]
					const group = allFacets[groupIdx]
					return arrayFind(group.items, i => i.value === item)
				}).filter(Boolean)

				out[key] = mapped
				return out
			}, {})
		} else {
			facets = {}
		}

		// if we're arriving here with a fresh initialState, then we'll
		// have to populate the search breadcrumbs using the query,
		// facets, and ranges

		// if we're coming from a queryString, we'll have to populate
		// the search breadcrumbs as well
		if (state.breadcrumbs === null) {
			const facetBc = selectedFacetsKeys.reduce((out, key) => {
				const facet = selectedFacets[key]
				const allIdx = facetDictionary[key]
				const orig = allFacets[allIdx]

				return out.concat(facet.map(value => {
					const facet = {
						name: orig.name,
						label: orig.label,
					}

					const item = typeof value === 'string'
						? {value}
						: value

					return {facet, item}
				}))
			}, [])

			// TODO: revisit to make sure this works
			const rangeBc = Object.keys(state.range).reduce((out, key) => {
				const r = state.range[key]
				const idx = facetDictionary[key]
				const orig = allFacets[idx]

				const facet = {
					label: orig.label,
					name: orig.name,
				}
				const item = createRangeFacet(facet.name, r.begin, r.end)

				return out.concat({facet, item})
			}, [])

			breadcrumbs = [].concat(facetBc, rangeBc).filter(Boolean)
		} else {
			breadcrumbs = [].concat(state.breadcrumbs || [])
		}

		return {
			...state,
			breadcrumbs,
			facets,
			meta: {
				...state.meta,
				atEnd: results.pages['last_page?'],
				isSearching: false,
			},
		}
	},

	[actions.setFacet]: (state, action) => {
		const breadcrumbs = [].concat(state.breadcrumbs, {
			facet: action.payload.facet,
			item: action.payload.item,
		})

		return {
			...state,
			breadcrumbs,
		}
	}
}, initialState)

import { createAction } from 'redux-actions'
import browserHistory from 'react-router/lib/browserHistory'
import isEqual from 'lodash.isequal'

import * as api from './endpoints'
import * as utils from './utils'

export const RESULTS_PER_PAGE = 50

const hasProperty = (obj, prop) => (
	Object.prototype.hasOwnProperty.call(obj, prop)
)

export const clearFacet = createAction('clearing search.facet')
export const clearSearch = createAction('clearing search')
export const fetchingSearch = createAction('fetching search')
export const fetchingSearchErr = createAction('error fetching search')
export const preppingSearch = createAction('prepping search')
export const setFacet = createAction('setting search.facet')
export const receivedSearchResults = createAction('received search results')

export const searchCatalog = (query, facets, range, meta) => {
	return dispatch => {
		if (query === undefined) {
			query = ''
		}

		if (facets === undefined) {
			facets = {}
		}

		if (range === undefined) {
			range = {}
		}

		if (meta === undefined) {
			meta = {}
		}

		const options = {
			format: meta.format || 'json',
			page: meta.page || 1,
			per_page: meta.per_page ||  RESULTS_PER_PAGE,
		}

		dispatch(preppingSearch({query, facets, range, options}))

		const mappedFacets = Object.keys(facets).reduce((out, key) => {
			out[key] = facets[key].map(i => i.value ? i.value : i)
			return out
		}, {})

		const queryObj = {
			q: query,
			f: mappedFacets,
			range,
		}

		const display = utils.stringifyQs(queryObj)

		const fullObj = {
			...queryObj,
			...options,
		}

		const queryString = utils.stringifyQs(fullObj)

		browserHistory.push({
			pathname: '/search',
			search: `?${display}`,
			state: fullObj,
		})

		dispatch(fetchingSearch())

		return api.search(queryString)
			.then(results => results.response)
			.then(results => {
				dispatch(receivedSearchResults({results}))
			})
			.catch(error => {
				dispatch(fetchingSearchErr(error))
			})
	}
}

export const searchCatalogByQueryString = queryString => {
	const { q, f, range, ...opts } = utils.parseQs(queryString)
	return searchCatalog(q, f, range, opts)
}

export const toggleSearchFacet = (facet, item, isChecked) => {
	let facetName, facetLabel

	if (typeof facet === 'object') {
		facetName = facet.name
		facetLabel = facet.label
	} else {
		facetName = facetLabel = facet
		facet = {
			name: facetName,
			label: facetLabel,
		}
	}

	return (dispatch, getState) => {
		const original = getState().search || {}
		const search = { ...original }
		const isRange = item.type && item.type === 'range'
		const key = isRange ? 'range' : 'facets'

		let dirty = false
		let target

		if (isChecked) {
			let shouldUpdate = true

			if (hasProperty(search[key], facetName)) {
				// check for duplicate values and don't update if it's already there
				for (let i = 0; i < search[key][facetName].length; i++) {
					const current = search[key][facetName][i]
					if (hasProperty(current, 'value') && hasProperty(item, 'value')) {
						if (isEqual(current.value, item.value)) {
							shouldUpdate = false
							break
						}
					}

					else {
						if (isEqual(current, item)) {
							shouldUpdate = false
							break
						}
					}
				}
			}

			if (shouldUpdate) {
				target = [].concat(search[key][facetName], item).filter(Boolean)
				dirty = true
			}
		}

		else if (search[key][facetName] && !isChecked) {
			target = search[key][facetName].filter(i => {
				if (hasProperty(i, 'value') && hasProperty(item, 'value')) {
					return !isEqual(i.value, item.value)
				}

				else {
					return !isEqual(i, item)
				}
			})

			if (search[key][facetName].length > target.length) {
				dirty = true
			}
		}

		if (!dirty) {
			return Promise.resolve()
		}

		if (isChecked) {
			dispatch(setFacet({facet, item}))
		} else {
			dispatch(clearFacet({facet, item}))
		}

		search[key] = {
			...search[key],
			[facetName]: target,
		}

		const { query, facets, range } = search

		// reset the page count
		const meta = {
			...search.meta,
			page: 1,
		}

		return searchCatalog(query, facets, range, meta)(dispatch)
	}
}

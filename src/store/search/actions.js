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
export const fetchingSearchErr = createAction('error fetching search')
export const preppingSearch = createAction('prepping search')
export const setFacet = createAction('setting search.facet')
export const receivedSearchResults = createAction('received search results')

export const getResultsAtPage = page => {
	return (dispatch, getState) => {
		const search = getState().search
		const { query, facets, range, meta } = search

		return searchCatalog(query, facets, range, {...meta, page})(dispatch)
	}
}

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
			per_page: meta.per_page || RESULTS_PER_PAGE
		}

		dispatch(preppingSearch({
			query,
			facets,
			range,
			meta: {
				...options,
				isSearching: true,
			}
		}))

		const mappedFacets = utils.mapFacets(facets)
		const flattenedRange = utils.flattenRange(range)

		const queryObj = {
			q: query,
			f: mappedFacets,
			range: flattenedRange,
		}

		const display = utils.stringifyQs(queryObj)

		const fullObj = {
			...queryObj,
			...options,
		}

		const queryString = utils.stringifyQs(fullObj)

		// only update the browserHistory if we're at the
		// beginning of a page, otherwise the state will
		// update + cause the Router to update + trigger
		// an unnecssary render
		if (options.page === 1) {
			browserHistory.push({
				pathname: '/search',
				search: `?${display}`,
				state: fullObj,
			})
		}

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
	const { q, f, range, ...meta } = utils.parseQs(queryString)
	return searchCatalog(q, f, range, meta)
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

	const isRange = item.type && item.type === 'range'
	const dispatchFn = isChecked ? setFacet : clearFacet

	return (dispatch, getState) => {
		const original = getState().search
		const search = {
			// defaults
			query: '',
			facets: {},
			range: {},
			meta: {},

			...original,
		}

		// ranges are super easy, as they're key/object-values
		if (isRange) {
			if (isChecked) {
				search.range[facetName] = item.value
			}

			else {
				delete search.range[facetName]
			}
		}

		else {
			let dirty = false
			let target

			// selecting facet
			if (isChecked) {
				const facets = search.facets
				let shouldUpdate = true
				// is the facet already being used?
				// check for duplicate values and don't update if it's already there
				if (hasProperty(facets, facetName)) {
					for (let i = 0; i < facets[facetName].length; i++) {
						const current = facets[facetName][i]
						if (hasProperty(current, 'value') && hasProperty(item, 'value')) {
							if (isEqual(current.value, item.value)) {
								shouldUpdate = false
								break
							}
						} else {
							if (isEqual(current, item)) {
								shouldUpdate = false
								break
							}
						}
					}
				}

				if (shouldUpdate === true) {
					target = [].concat(facets[facetName], item).filter(Boolean)
					dirty = true
				}
			}

			// removing facet
			// we'll skip a catch-all `else` case and let `dirty = false`
			// result in a no-op
			else if (search.facets[facetName] && !isChecked) {
				target = search.facets[facetName].filter(i => {
					if (hasProperty(i, 'value') && hasProperty(item, 'value')) {
						return !isEqual(i.value, item.value)
					}

					else {
						return !isEqual(i, item)
					}
				})

				if (search.facets[facetName].length > target.length) {
					dirty = true
				}
			}

			if (!dirty) {
				return Promise.resolve()
			}

			search.facets = {
				...search.facets,
				[facetName]: target,
			}
		}

		dispatch(dispatchFn({facet, item}))

		const { query, facets, range } = search

		// reset the page count
		const meta = {
			...search.meta,
			page: 1,
		}

		return searchCatalog(query, facets, range, meta)(dispatch)
	}
}

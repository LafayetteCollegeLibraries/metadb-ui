import assign from 'object-assign'
import findIndex from 'array-find-index'
import isEqual from 'lodash.isequal'

import { search } from '../../lib/api'
import { addSearch as addSearchToHistory } from '../../lib/search-history'
import browserHistory from 'react-router/lib/browserHistory'
import formatSearchQuerystring from '../../lib/format-search-querystring'
import { parse as parseQuerystring } from 'blacklight-querystring'
import createRangeFacet from '../../lib/create-range-facet'

import {
	RECEIVE_SEARCH_ERR,
	RECEIVE_SEARCH_RESULTS,
	SEARCHING,
} from '../constants'

const hasOwnProperty = Object.prototype.hasOwnProperty

function conductSearch (dispatch, query, facets, options, queryString) {
	dispatch({
		type: SEARCHING,
		query,
		facets,
		options,
		queryString,
	})

	addSearchToHistory({query, facets, options})

	return search(queryString + '&format=json')
	.then(results => {
		dispatch({
			type: RECEIVE_SEARCH_RESULTS,
			results,
		})

		return results
	})
	.catch(error => {
		dispatch({
			type: RECEIVE_SEARCH_ERR,
			error,
		})

		throw error
	})
}

export const searchCatalog = (query, facets, opts) => dispatch => {
	// save ourselves the hassle of keeping track of these defaults
	const options = assign({}, opts)

	if (!facets)
		facets = {}

	const queryString = formatSearchQuerystring(query, facets, options)
	browserHistory.push('/search?' + queryString)

	return conductSearch(dispatch, query, facets, options, queryString)
}

// this function is used when arriving on a Search page w/ a pre-populated
// search querystring (ex. arriving from a link, refreshing the results)
// `parseSearchQuerystring` is used to extract the query, facets, and
// options + passed to `conductSearch`
export const searchCatalogByQueryString = queryString => dispatch => {
	const {query, facets, options} = parseQuerystring(queryString)

	if (hasOwnProperty.call(options, 'range')) {
		const range = options.range
		delete options.range

		for (let r in range) {
			if (!facets[r])
				facets[r] = []

			facets[r].push(createRangeFacet(r, range[r].begin, range[r].end))
		}
	}

	return conductSearch(dispatch, query, facets, options, queryString)
}

// used to toggle options such as `per_page` and `page`
export const setSearchOption = (field, value) => (dispatch, getState) => {
	const search = getState().search || {}

	const query = search.query || ''
	const facets = assign({}, search.facets)
	const options = assign({}, search.options)

	// we'll pass null to remove the option
	if (value === null) {
		delete options[field]
	} else {
		options[field] = value
	}

	// since searchCatalog's a thunk, we'll use the passed `dispatch` + call it again
	return searchCatalog(query, facets, options)(dispatch)
}

export const toggleSearchFacet = (field, facet, checked) => (dispatch, getState) => {
	const search = getState().search || {}

	// recycling the previous search info
	const query = search.query || ''
	const options = assign({}, search.options)
	const facets = assign({}, search.facets)

	let dirty = false
	let idx = -1

	if (facets[field]) {
		idx = findIndex(facets[field], f => {
			if (hasOwnProperty.call(f, 'value') && hasOwnProperty.call(facet, 'value'))
				return isEqual(f.value, facet.value)
			else
				return isEqual(f, facet)
		})
	}

	// add to selected-facets
	if (checked) {
		if (idx === -1) {
			facets[field] = [].concat(facets[field], facet).filter(Boolean)
			dirty = true
		}
	}

	// remove from selected-facets
	else {
		if (idx !== -1) {
			facets[field] = [].concat(
				facets[field].slice(0, idx),
				facets[field].slice(idx + 1)
			)

			if (!facets[field].length)
				delete facets[field]

			dirty = true
		}
	}

	if (!dirty)
		return Promise.resolve()

	// reset the page count (if it's already set)
	if (options.page)
		delete options.page

	return searchCatalog(query, facets, options)(dispatch)
}

import {
	BATCH_UPDATE_WORKS,
	BATCH_UPDATE_WORKS_OK,
	BATCH_UPDATE_WORKS_ERR,
} from '../constants'

import { batchUpdates } from '../../lib/api'

export const batchUpdateWorks = updates => (dispatch, getState) => {
	const state = getState()
	const { facets, query, results } = state.search

	const count = results && results.pages ? results.pages.total_count : undefined

	const search = {
		facets: {},
		range: {},
		query,
	}

	const facetKeys = Object.keys(facets)

	for (let i = 0; i < facetKeys.length; i++) {
		const key = facetKeys[i]

		// we need to extract range facets from w/in `facets` and put them
		// into their own section of search to comply w/ how Blacklight handles them
		let type = facets[key][0].type === 'range' ? 'range' : 'facets'

		search[type][key] = [].concat(facets[key].map(f => f.value))
	}

	dispatch({
		type: BATCH_UPDATE_WORKS,
		updates,
		count,
	})

	return batchUpdates({search, updates})
		.then(() => {
			dispatch({
				type: BATCH_UPDATE_WORKS_OK,
				count,
			})
		})
		.catch(error => {
			dispatch({
				type: BATCH_UPDATE_WORKS_ERR,
				error,
			})
		})
}

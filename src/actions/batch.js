import {
	BATCH_UPDATE_WORKS,
	BATCH_UPDATE_WORKS_OK,
	BATCH_UPDATE_WORKS_ERR,
} from '../constants'

import { batchUpdates } from '../../lib/api'
import assign from 'object-assign'

export const batchUpdateWorks = updates => (dispatch, getState) => {
	const state = getState()
	const { facets, query } = state.search

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
	})

	return batchUpdates({search, updates})
		.then(() => {
			dispatch({
				type: BATCH_UPDATE_WORKS_OK,
			})
		})
		.catch(error => {
			dispatch({
				type: BATCH_UPDATE_WORKS_ERR,
				error,
			})
		})
}

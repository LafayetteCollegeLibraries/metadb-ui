import { handleActions } from 'redux-actions'
import * as search from '../search/actions'

// state shape:
// {
// 	docs: [],
// 	facets: [],
// 	meta: {},
// }

export default handleActions({
	[search.clearSearch]: () => ({}),

	[search.preppingSearch]: (state, action) => {
		const { meta: { page } } = action.payload

		if (page === 1) {
			return {
				...state,
				docs: [],
			}
		}

		return state
	},

	[search.receivedSearchResults]: (state, action) => {
		const { results } = action.payload
		const { pages } = results

		const atFirstPage = pages['first_page?']
		const meta = {
			count: pages.total_count,
			pages: pages.total_pages,
		}

		const facets = atFirstPage
			? results.facets.filter(f => f.items.length > 0)
			: state.facets

		const docs = atFirstPage
			? results.docs
			: [].concat(state.docs, results.docs)

		return { docs, facets, meta }
	}
}, {})

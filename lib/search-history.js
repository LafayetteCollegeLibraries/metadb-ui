/* globals localStorage */

// TODO: move this to a user setting
const STORED_SEARCH_LIMIT = 20
export const STORED_SEARCH_KEY = 'search-history'

export function addSearch (search, limit) {
	limit = limit || STORED_SEARCH_LIMIT

	const history = getSearches()
	const update = [].concat(search, history.slice(0, limit - 1))

	localStorage.setItem(STORED_SEARCH_KEY, JSON.stringify(update))
}

export function clearSearches () {
	localStorage.setItem(STORED_SEARCH_KEY, '[]')
}

export function getSearches () {
	const history = localStorage.getItem(STORED_SEARCH_KEY) || '[]'

	try {
		return JSON.parse(history)
	} catch(e) {
		return []
	}
}

export function getPreviousQueries () {
	const history = localStorage.getItem(STORED_SEARCH_KEY) || '[]'

	try {
		const parsed = JSON.parse(history)
		return parsed
			.map(search => search.query)
			.filter((query, idx, arr) => query && (arr.indexOf(query) === idx))
	} catch (e) {
		return []
	}
}

/* globals localStorage */
import qs from 'qs'

export const stringifyQs = input => qs.stringify(input, { arrayFormat: 'brackets' })
export const parseQs = input => qs.parse(input)

export const createBreadcrumb = (facet, item) => {
	if (typeof item === 'object' && item.hasOwnProperty('value')) {
		item = item.value
	}

	return {
		group: facet || null,
		value: item,
	}
}

export const createRangeFacet = (name, min, max) => {
	const label = min === max ? `${min}` : `${min} - ${max}`

	return {
		label,
		name,
		value: {
			begin: min,
			end: max,
		},
		type: 'range'
	}
}

// TODO: move STORED_KEY + STORED_LIMIT to a user setting
export const searchHistory = {
	STORED_KEY: 'search-history',
	STORED_LIMIT: 20,

	add: function addEntryToSearchHistory (search, limit) {
		limit = limit || this.STORED_LIMIT

		const history = this.getAll()
		let update = [].concat(search, history)

		if (update.length > limit) {
			update = update.slice(0, limit)
		}

		localStorage.setItem(this.STORED_KEY, JSON.stringify(update))
	},

	clear: function clearSearchHistory () {
		localStorage.setItem(this.STORED_KEY, '[]')
	},

	getAll: function getAllSearchHistory () {
		const history = localStorage.getItem(this.STORED_KEY) || '[]'

		try {
			return JSON.parse(history)
		} catch (e) {
			return []
		}
	},

	getPreviousQueries: function getPreviousSearchQueries () {
		return this.getAll()
			.map(search => search.query)
			.filter((query, idx, arr) => query && (arr.indexOf(query) === idx))
	},
}

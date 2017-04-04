/* globals localStorage */
import blqs from 'blacklight-querystring'

export const stringify = input => blqs.stringify(input, { arrayFormat: 'brackets' })
export const parse = input => blqs.parse(input)

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

export const formatSearchQueryString = (query, facets, options) => {
	if (!facets)
		facets = {}

	// instead of passing the query, facets, and options directly
	// to `blacklight-querystring`, we'll need to do a little cleanup:
	//
	// 1) blqs#stringify expects a flat array of facet values per group,
	//    whereas we're storing the full objects in state (which contain
	//    the value, name, and label). so we'll extract the value.
	// 2) the `range` facet is handled completely differently from
	//    other facets, so we'll look for values w/ a `type` attribute,
	//    assume a shallow value + assign it to an object (whose key
	//    matches the `type` attribute) within the `options` object.

	const opts = { ...options }
	const mappedFacets = Object.keys(facets).reduce((out, key) => {
		const facet = facets[key]

		for (let i = 0; i < facet.length; i++) {
			const current = facet[i]
			const type = current.type

			if (typeof type !== 'undefined') {
				if (!opts[type]) {
					opts[type] = {}
				}

				if (opts[type][key]) {
					opts[type][key] = [].concat(opts[type][key], current.value)
				} else {
					opts[type][key] = current.value
				}

			} else {
				if (!out[key]) {
					out[key] = []
				}

				out[key].push(current.value)
			}
		}

		return out
	}, {})


	const toStringify = {
		options: opts,
		facets: mappedFacets,
		query,
	}

	const strung = stringify(toStringify)
	return strung
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

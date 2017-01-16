const FIELD_STORAGE_KEY = 'search-result-fields'

function getStoredFields () {
	try {
		const stored = localStorage.getItem(FIELD_STORAGE_KEY)

		if (!stored)
			return []

		return JSON.parse(stored)
	} catch (e) {
		return []
	}
}

function setStoredFields (value) {
	localStorage.setItem(FIELD_STORAGE_KEY, JSON.stringify(value))
}

export default {
	get: getStoredFields,
	set: setStoredFields,
}

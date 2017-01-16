function getFactory (key, def) {
	return function () {
		const stored = localStorage.getItem(key)

		if (!stored) {
			return def
		}

		try {
			return JSON.parse(stored)
		} catch (e) {
			return def
		}
	}
}

function setFactory (key) {
	return function (value) {
		localStorage.setItem(key, JSON.stringify(value))
	}
}

const FIELD_KEY = 'search-result--fields'
const DISPLAY_KEY = 'search-result--display'

const fields = {
	get: getFactory(FIELD_KEY, []),
	set: setFactory(FIELD_KEY),
}

const display = {
	get: getFactory(DISPLAY_KEY),
	set: setFactory(DISPLAY_KEY),
}

export default { fields, display }
export { fields }
export { display }

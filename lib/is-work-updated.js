export default function isWorkUpdated (prev, next) {
	if (!next)
		return false

	const keys = Object.keys(next)

	if (!keys.length)
		return false

	for (let i = 0; i < keys.length; i++) {
		const key = keys[i]

		if (typeof prev[key] === 'string' && typeof next[key] === 'string') {
			return prev[key] === next[key]
		}

		const nextFiltered = next[key].filter(Boolean)

		if (nextFiltered.length !== prev[key].length) {
			return true
		}

		for (let j = 0; j < nextFiltered.length; j++) {
			if (next[key][j] !== prev[key][j]) {
				return true
			}
		}
	}

	return false
}

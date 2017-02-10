export default function getWorkTitle (work) {
	if (!work || !work.title)
		return null

	const title = work.title

	if (Array.isArray(title))
		return title[0]

	if (typeof title === 'string')
		return title

	// edge cases we haven't encountered
	return null
}

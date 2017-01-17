export function createFacetNameMap (arr, field) {
	if (!field)
		field = 'value'

	const out = {}

	for (let i = 0; i < arr.length; i++)
		if (!out[arr[i][field]])
			out[arr[i][field]] = arr[i].label


	return out
}


export function getBreadcrumbList (pool, selected) {
	const hasOwnProperty = Object.prototype.hasOwnProperty
	let out = []

	if (!selected)
		return out

	const selKeys = Object.keys(selected)

	if (!selKeys.length)
		return out

	// loop through the pool of potential facets
	// (these are the responses returned w/ a search query)
	for (let p = 0; p < pool.length; p++) {
		const group = pool[p]

		// loop through the keys of the selected facets
		// and find our matching group (which should exist
		// because it's part of our search)
		for (let s = 0; s < selKeys.length; s++) {
			const name = selKeys[s]

			if (group.name === name) {

				// we're going to append our collection (`out`) with data
				// for each of the selected facets. this will allow us to
				// display a breadcrumb like 'Facet Group > Facet Value'
				// using label values (for cleaner values) + retain the
				// values used by the back-end
				out = out.concat(selected[name].map(sk => {
					const selVal = hasOwnProperty.call(sk, 'value') ? sk.value : sk
					const selLabel = hasOwnProperty.call(sk, 'label') ? sk.label : sk
					return {
						group: {
							name: group.name,
							label: group.label
						},
						facet: {
							value: selVal,
							label: selLabel,
						}
					}
				}))

				// selKeys.splice(s, 1)
				// break
			}
		}
	}

	return [].concat.apply([], out)
}

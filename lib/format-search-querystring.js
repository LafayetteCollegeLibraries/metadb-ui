import { stringify } from 'blacklight-querystring'
import assign from 'object-assign'

export default function formatSearchQuerystring (query, facets, options) {
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

	const facetKeys = Object.keys(facets)
	const mappedFacets = {}
	const opts = options ? assign({}, options) : {}

	facetKeys.forEach(function (k) {
		let i = 0
		let current, key

		for (; i < facets[k].length; i++) {
			current = facets[k][i]
			key = current.type

			if (typeof key !== 'undefined') {
				if (!opts[key])
					opts[key] = {}

				opts[key][k] = current.value
			} else {
				if (!mappedFacets[k])
					mappedFacets[k] = []

				mappedFacets[k].push(current.value)
			}
		}
	})

	return stringify({
		options: opts,
		facets: mappedFacets,
		query,
	})
}


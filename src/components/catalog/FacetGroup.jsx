import React from 'react'
import assign from 'object-assign'

const T = React.PropTypes

const FacetGroup = React.createClass({
	propTypes: {
		// `facets` is an array of facet-objects from blacklight.
		// ----------
		// "facets": [
		//		{
		//			"label": "Database Topic",
		//			"name": "db_az_subject",
		//			"items": [
		//				{
		//					"value": "American History",
		//					"label": "American History",
		//					"hits": 100,
		//				}
		//			]
		//		}
		//	]
		data: T.arrayOf(T.shape({
			name: T.string,
			label: T.string,
			items: T.arrayOf(T.shape({
				hits: T.number,
				label: T.string,
				value: T.any,
			}))
		})).isRequired,

		onRemoveSelectedFacet: T.func.isRequired,
		onSelectFacet: T.func.isRequired,

		defaultBodyComponent: T.func,

		// `selectedFacets` is a map of facet objects
		// -----------
		// {
		//   `example_name`: [
		//		  { value: 'Facet 1', name: 'Facet 1', hits: 200 },
		//	 ]
		// }
		selectedFacets: T.object,
	},

	getDefaultProps: function () {
		return {
			selectedFacets: {},
		}
	},

	buildFacetDictionary: function () {
		var dict = {}

		this.props.data.forEach((facet, index) => {
			dict[facet.name] = index
		})

		return dict
	},

	getSelectedFacets: function (name) {
		return this.props.selectedFacets[name] || []
	},

	renderChildren: function () {
		var dict = this.buildFacetDictionary()

		return React.Children.map(this.props.children, (child, index) => {
			const name = child.props.name
			const idx = dict[name]

			// skip facets w/o a name property
			if (typeof idx === 'undefined')
				return

			const data = this.props.data[idx]
			const items = child.props.data || data.items

			// skip empty facets
			if (!items.length)
				return

			const bodyComponent = child.props.bodyComponent
			? child.props.bodyComponent
			: this.props.defaultBodyComponent

			const props = {
				bodyComponent,
				items,
				key: name + index,
				label: child.props.label || data.label,
				onRemoveSelectedFacet: this.props.onRemoveSelectedFacet.bind(null, name),
				onSelectFacet: this.props.onSelectFacet.bind(null, name),
				selectedFacets: this.getSelectedFacets(name)
			}

			return React.cloneElement(child, props)
		})
	},

	render: function () {
		const wrapperStyles = {
			display: 'inline-block',
			width: '100%',
		}

		return (
			<div style={wrapperStyles}>
				{this.renderChildren()}
			</div>
		)
	}
})

export default FacetGroup

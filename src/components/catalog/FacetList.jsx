import React from 'react'
import assign from 'object-assign'
import FacetListSelectedItem from './FacetListSelectedItem.jsx'
import FacetListItem from './FacetListItem.jsx'

const T = React.PropTypes

const FacetList = React.createClass({
	propTypes: {
		// data related to the facet (as returned from the Blacklight JSON api)
		label: T.string.isRequired,
		name: T.string.isRequired,
		items: T.array.isRequired,

		onRemoveSelectedFacet: T.func.isRequired,
		onSelectFacet: T.func.isRequired,
		selectedFacets: T.array.isRequired,
	},

	componentWillUpdate: function () {
		// need to clear out internal list when props change, otherwise
		// previously selected values will linger around in the array
		// and not appear as unselected values when the render arrives
		this._selectedFacetValues = null
	},

	renderFacetList: function () {
		const { items, name, onSelectFacet } = this.props

		return items.map((item, index) => {
			if (this._selectedFacetValues && this._selectedFacetValues.indexOf(item.value) > -1)
				return null

			const props = {
				data: item,
				onClick: this.props.onSelectFacet,
			}

			return React.createElement(
				'li',
				{ key: 'unsel' + name + index },
				React.createElement(FacetListItem, props)
			)
		})
	},

	renderSelectedFacetList: function () {
		const selected = this.props.selectedFacets
		if (!selected.length)
			return

		return selected.map((item, index) => {
			const props = {
				data: item,
				// onRemove: this.removeFacetFromInternalValueList,
				onRemove: this.props.onRemoveSelectedFacet,
			}

			if (this._selectedFacetValues && this._selectedFacetValues.push)
				this._selectedFacetValues.push(item.value)
			else
				this._selectedFacetValues = [item.value]

			return React.createElement(
				'li',
				{ key: 'sel-' + index + '-' + item.value },
				React.createElement(FacetListSelectedItem, props)
			)
		})
	},

	render: function () {
		const styles = {
			list: {
				listStyleType: 'none',
				margin: '0',
				padding: '0',
			}
		}

		return (
			<ul style={styles.list}>
				{this.renderSelectedFacetList()}
				{this.renderFacetList()}
			</ul>
		)
	}
})

export default FacetList

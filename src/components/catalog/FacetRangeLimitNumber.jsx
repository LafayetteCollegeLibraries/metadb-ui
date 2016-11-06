// this acts as a bridge between the Facet interface 
// and the RangeSliderNumber component by calculating
// the range data

import React from 'react'
import RangeSliderNumber from './RangeSliderNumber.jsx'
import FacetListSelectedItem from './FacetListSelectedItem.jsx'

const T = React.PropTypes

const FacetRangeLimitNumber = React.createClass({
	propTypes: {
		name: T.string,
		label: T.string,
		items: T.array,

		onSelectFacet: T.func.isRequired,
		onRemoveSelectedFacet: T.func.isRequired,
		selectedFacets: T.array.isRequired,
	},

	getInitialState: function () {
		return {
			hits: 0,
			items: this.props.items,
			max: 0,
			min: 0,
		}
	},

	componentWillMount: function () {
		this.setState(this.calculateRange())
	},

	calculateRange: function () {
		const items = this.props.items
		let max = -Infinity
		let min = Infinity
		let totalHits = 0

		// double duty:
		// a) clean up date values by parsing their numeric value
		// b) determine min/max/total hits
		const cleaned = items.map(function (item, index) {
			let value = item.value = +item.value

			if (value < min)
				min = value

			if (value > max)
				max = value

			totalHits += item.hits

			return item
		})

		return {
			items: cleaned,
			hits: totalHits,
			max,
			min,
		}
	},

	handleApplyRange: function (range) {
		const [min, max] = range

		const facet = {
			name: this.props.name,
			label: min + ' - ' + max,
			value: {
				begin: min,
				end: max,
			},
			type: 'range',
		}

		this.props.onSelectFacet(facet)
	},

	maybeRenderSelectedFacets: function () {
		if (!this.props.selectedFacets.length)
			return

		return this.props.selectedFacets.map((facet, index) => {
			const key = `sel-${facet.name}-${facet.value.begin}-${facet.value.end}`
			return (
				<FacetListSelectedItem
					data={facet}
					key={key}
					onRemove={this.props.onRemoveSelectedFacet}
				/>
			)
		})
	},

	render: function () {
		const containerProps = {
			style: {
				padding: '10px'
			}
		}

		return (
			<div {...containerProps}>
				{this.maybeRenderSelectedFacets()}
				<RangeSliderNumber
					max={this.state.max}
					min={this.state.min}
					onApplyRange={this.handleApplyRange}
				/>
			</div>
		)
	}
})

export default FacetRangeLimitNumber

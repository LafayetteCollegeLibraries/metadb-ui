// this acts as a bridge between the Facet interface 
// and the RangeSliderNumber component by calculating
// the range data

import React from 'react'
import RangeSliderNumber from './RangeSliderNumber.jsx'
import FacetListSelectedItem from './FacetListSelectedItem.jsx'
import calculateRange from './common/calculate-range'

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
		this.setState(calculateRange(this.props.items, v => {
			return Number(v)
		}))
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

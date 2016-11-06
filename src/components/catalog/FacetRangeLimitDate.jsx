// this is the bridge between the Facet interface
// and the RangeSliderDate component, by parsing the
// date values and calculating the range

import React from 'react'
import RangeSliderDate from './RangeSliderDate.jsx'
import FacetListSelectedItem from './FacetListSelectedItem.jsx'

import {
	INTERVALS,
	VALUES as INTERVAL_VALUES,
} from './common/date-intervals'

import calculateRange from './common/calculate-range'
import formatDateValue from './common/format-date-value'

const T = React.PropTypes
const FacetRangeLimitDate = React.createClass({
	propTypes: {
		name: T.string,
		label: T.string,
		items: T.array,

		onSelectFacet: T.func.isRequired,
		onRemoveSelectedFacet: T.func.isRequired,
		selectedFacets: T.array.isRequired,

		interval: T.oneOf(INTERVAL_VALUES)
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
		// TODO: don't assume correctly formatted ISO timestamps
		const range = calculateRange(this.props.items, v => {
			const parsed = Date.parse(v)
			return parsed
		})

		this.setState(range)
	},

	getFormattedDateValue: function (raw) {
		return formatDateValue(this.props.interval, raw)
	}

	handleApplyRange: function (range) {
		const [rawMin, rawMax] = range

		const min = this.getFormattedDateValue(rawMin)
		const max = this.getFormattedDateValue(rawMax)

		const facet = {
			name: this.props.name,
			label: `${min} - ${max}`,
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
			const props = {
				data: facet,
				onRemove: this.props.onRemoveSelectedFacet,
				key,
			}

			return React.createElement(FacetListSelectedItem, props)
		})
	},

	render: function () {
		const containerProps = {
			style: {
				padding: '10px',
			}
		}

		return (
			<div {...containerProps}>
				{this.maybeRenderSelectedFacets()}
				<RangeSliderDate
					interval={this.props.interval}
					max={this.state.max}
					min={this.state.min}
					onApplyRange={this.handleApplyRange}
				/>
			</div>
		)
	}
})

export default FacetRangeLimitDate

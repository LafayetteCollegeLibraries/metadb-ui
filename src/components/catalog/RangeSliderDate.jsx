import React from 'react'
import Slider from 'rc-slider'
import Button from '../Button.jsx'

import {
	INTERVALS,
	VALUES as INTERVAL_VALUES,
} from './common/date-intervals'

import roundDate from './common/round-date-to-interval'
import formatDateValue from './common/format-date-value'

import 'rc-slider/assets/index.css'

const T = React.PropTypes

const RangeSliderDate = React.createClass({
	propTypes: {
		interval: T.oneOf(INTERVAL_VALUES),

		// expect min/max/value to be Date.UTC values
		// (handled at the level of the wrapper)
		max: T.number.isRequired,
		min: T.number.isRequired,

		onApplyRange: T.func.isRequired,
	},

	getDefaultProps: function () {
		return {
			interval: INTERVALS.DAY,
		}
	},

	getInitialState: function () {
		return {
			value: [
				this.props.min,
				this.props.max,
			]
		}
	},

	// determine which `type=` value to use for the input
	getDateInputType: function () {
		switch (this.props.interval) {
			case INTERVALS.MONTH:
				return 'month'

			case INTERVALS.DAY:
				return 'date'

			case INTERVALS.YEAR:
			default:
				return 'number'
		}
	},

	// sets a timestamp to YYYY(-MM(-DD))
	// dependent on `props.interval`
	getFormattedDateValue: function (raw) {
		return formatDateValue(this.props.interval, raw)
	},

	getStepValue: function () {
		const { min, max } = this.props

		if (min === max)
			return null

		let divisor

		switch (this.props.interval) {
			case INTERVALS.DAY:
				divisor = 864e+5 // 1000ms * 60s * 60m * 24h

			case INTERVALS.MONTH:
				divisor = 26298e+5 // (DAY * 365.25) / 12

			case INTERVALS.YEAR:
			default:
				divisor = 315576e+5 // DAY * 365.25
		}

		return (max - min) / divisor
	},

	handleApplyRange: function () {
		if (!this.props.onApplyRange)
			return

		// TODO: we're rounding the values at the level above (FacetRangeLimitDate)
		// and _shouldn't_ have to do the work of rounding again (especially if
		// the interval is cleanly divisible as per rc-slider's requirements)
		const roundDateValue = roundDate.bind(null, this.props.interval)
		const cleaned = this.state.value.map(roundDateValue)

		this.props.onApplyRange.call(null, cleaned)
	},

	handleMaxValueChange: function (ev) {
		const val = ev.target.value
		const args = val.split('-').map(Number)

		// months are 0-indexed
		if (args.length > 1)
			args[1] = args[1] - 1

		const max = Date.UTC.apply(Date, args)

		this.setState({
			value: [
				this.state.value[0],
				max,
			]
		})
	},

	handleMinValueChange: function (ev) {
		const val = ev.target.value
		const args = val.split('-').map(Number)

		// months are 0-indexed
		if (args.length > 1)
			args[1] = args[1] - 1

		const min = Date.UTC.apply(Date, args)

		this.setState({
			value: [
				min,
				this.state.value[1],
			]
		})
	},

	handleSliderChange: function (value) {
		this.setState({value})
	},

	renderInputPair: function (which, onChange, value) {
		const id = 'range-slider-date--input-' + which

		const containerProps = {
			style: {
				display: 'inline-block',
			},
		}

		const labelProps = {
			children: which,
			htmlFor: id,
			key: which + '-label',
		}

		const inputProps = {
			id,
			key: which + '-input',
			onChange,
			type: this.getDateInputType(),
			max: this.getFormattedDateValue(this.props.max),
			min: this.getFormattedDateValue(this.props.min),
			value: this.getFormattedDateValue(value),
			style: {
				display: 'block',
				fontFamily: 'sans-serif',
				fontSize: '.9em',
				marginBottom: '10px',
				marginRight: '10px',
				minWidth: '5em',
			}
		}

		return (
			<div {...containerProps}>
				<label {...labelProps} />
				<input {...inputProps} />
			</div>
		)
	},

	renderInputs: function () {
		const [min, max] = this.state.value

		const wrapperProps = {
			style: {
				marginBottom: '10px',
			}
		}

		return (
			<div {...wrapperProps}>
				{this.renderInputPair('min', this.handleMinValueChange, min)}
				{this.renderInputPair('max', this.handleMaxValueChange, max)}
				<Button onClick={this.handleApplyRange}>Apply range</Button>
			</div>
		)
	},

	renderSlider: function () {
		const props = {
			allowCross: true,
			min: this.props.min,
			max: this.props.max,
			onChange: this.handleSliderChange,
			pushable: false,
			range: true,
			step: this.getStepValue(),
			tipFormatter: this.getFormattedDateValue,
			value: this.state.value,
		}

		return <Slider {...props} />
	},

	render: function () {
		return (
			<div>
				{this.renderInputs()}
				{this.renderSlider()}
			</div>
		)
	}
})

export default RangeSliderDate

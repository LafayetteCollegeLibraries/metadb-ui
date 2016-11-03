import React from 'react'
import Slider from 'rc-slider'
import Button from '../Button.jsx'

import 'rc-slider/assets/index.css'

const T = React.PropTypes

const INTERVALS = {
	DAY: 'day',
	MONTH: 'month',
	YEAR: 'year',
}

const FacetDateRangeLimit = React.createClass({
	propTypes: {
		interval: T.oneOf([INTERVALS.DAY, INTERVALS.MONTH, INTERVALS.YEAR]),

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
		const d8 = new Date(raw)
		const formatDay = (d) => {
			const yr = d.getUTCFullYear()
			const day = d.getUTCDate()
			let mo = d.getUTCMonth() + 1

			if (mo < 10)
				mo = '0' + mo

			return `${yr}-{$mo}-${day}`
		}

		const formatMonth = (d) => {
			const yr = d.getUTCFullYear()
			let mo = d.getUTCMonth() + 1

			if (mo < 10)
				mo = '0' + mo

			return `${yr}-${mo}`
		}

		const formatYear = (d) => {
			return `${d.getUTCFullYear()}`
		}

		switch (this.props.interval) {
			case INTERVALS.MONTH:
				return formatMonth(d8)

			case INTERVALS.DAY:
				return formatDay(d8)

			case INTERVALS.YEAR:
			default:
				return formatYear(d8)
		}
	},

	// rc-slider will complain if max-min isn't evenly divisible by
	// the step value (not something I expected would happen, but 
	// it _is_). so we'll do this math to get a clean step + do the
	// rounding when we send the value with `onApplyRange`
	getStepValue: function () {
		const { min, max } = this.props
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

		return Math.round((max - min) / divisor)
	},

	// round range values to their nearest `interval` 
	// (months are set to their first day; days are set to midnight)
	handleApplyRange: function () {
		if (!this.props.onApplyRange)
			return

		const cleaned = this.state.value.map(this.roundDateValue)

		this.props.onApplyRange.call(null, cleaned)
	},

	handleMaxValueChange: function (ev) {
		const val = ev.target.value
		const args = val.split('-').filter(Boolean).map(Number)
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
		const args = val.split('-').filter(Boolean).map(Number)
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
		const id = 'input-' + which

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

		return React.createElement(Slider, props)
	},

	roundDateValue: function (val) {
		const d = new Date(val)
		const year = d.getUTCFullYear()

		switch (this.props.interval) {
			case INTERVALS.DAY:
				return Date.UTC(year, d.getUTCMonth(), d.getUTCDate())
				
			case INTERVALS.MONTH:
				return Date.UTC(year, d.getUTCMonth(), 1)

			case INTERVALS.YEAR:
			default:
				return Date.UTC(year, 0, 1)
		}
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

export default FacetDateRangeLimit

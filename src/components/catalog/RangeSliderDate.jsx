import React from 'react'
import Button from '../Button.jsx'
import Slider from 'rc-slider'

import formatDateValue from './common/format-date-value'
import roundDateValue from './common/round-date-to-interval'
import parseInputValue from './common/parse-input-date-value'

import {
	INTERVALS,
	VALUES as INTERVAL_VALUES,
} from './common/date-intervals'

// TODO: move this styling to SCSS area
import 'rc-slider/assets/index.css'

const { YEAR, MONTH, DAY } = INTERVALS

const propTypes = {
	// min/max are UTC timestamp values (similar to Date.now())
	min: React.PropTypes.number.isRequired,
	max: React.PropTypes.number.isRequired,

	onApplyRange: React.PropTypes.func.isRequired,

	interval: React.PropTypes.oneOf(INTERVAL_VALUES),
}

const defaultProps = {
	interval: DAY,
}

// helper fns
function getInputType (interval) {
	switch (interval) {
		case MONTH: return 'month'
		case YEAR:  return 'number'
		case DAY:
		default:    return 'date'
	}
}

function getStepValue (min, max, interval) {
	const day = 1000 * 60 * 60 * 24

	let divisor

	switch (interval) {
		case YEAR:  divisor = day * 365.25
		case MONTH: divisor = (day * 365.25) / 12
		case DAY:
		default:    divisor = day
	}

	return Math.round((max - min) / divisor)
}

class RangeSliderDate extends React.Component {
	constructor (props) {
		super(props)

		this.state = {
			min: props.min,
			max: props.max,
		}

		this._formatted = {
			min: formatDateValue(props.interval, props.min),
			max: formatDateValue(props.interval, props.max)
		}

		this._rounded = {
			min: roundDateValue(props.interval, props.min),
			max: roundDateValue(props.interval, props.max),
		}

		this.getStepValue = this.getStepValue.bind(this)
		this.handleApplyRange = this.handleApplyRange.bind(this)
		// this.handleInputChange is bound within this.renderInput
		this.renderInput = this.renderInput.bind(this)
		this.renderSlider = this.renderSlider.bind(this)
	}

	componentWillUpdate (nextProps) {
		if (nextProps.interval !== this.props.interval)
			this.step = null
	}

	getStepValue () {
		if (!this._step && this._step !== 0) {
			const { min, max } = this._rounded ? this._rounded : this.props
			const { interval } = this.props
			this._step = getStepValue(min, max, interval)
		}

		return this._step
	}

	handleApplyRange () {
		const value = [
			this.state.min,
			this.state.max,
		].map(v => formatDateValue(this.props.interval, v))

		this.props.onApplyRange(value)
	}

	handleInputChange (which, event) {
		const target = (event || {}).target || {}
		const value = target.value
		const parsed = parseInputValue(value)

		const update = {}
		// (parsed !== parsed) === Number.isNaN(parsed)
		update[which] = parsed !== parsed ? null : parsed

		this.setState(update)
	}

	renderInput (which) {
		const tsValue = this.state[which]
		const value = tsValue ? formatDateValue(this.props.interval, tsValue) : ''
		const type = getInputType(this.props.interval)

		const props = {
			className: 'range-slider-date--input',
			key: `input-${which}`,
			min: this._formatted.min,
			max: this._formatted.max,
			onChange: this.handleInputChange.bind(this, which),
			type,
			value,
		}

		return (
			<label className="range-slider-date--label">
				{which}
				<input {...props} />
			</label>
		)
	}

	renderSlider () {
		const hasSingleValue = this.props.min === this.props.max

		const value = hasSingleValue ? (this.state.min || 0) : [
			this.state.min || this.props.min,
			this.state.max || this.props.max,
		]

		const onChange = value => {
			this.setState({
				min: value[0],
				max: value[1],
			})
		}

		const props = {
			allowCross: true,
			min: this._rounded.min,
			max: this._rounded.max,
			onChange,
			pushable: false,
			range: !hasSingleValue,
			tipFormatter: formatDateValue.bind(null, this.props.interval),
			value,
		}

		if (!hasSingleValue) {
			props.step = this.getStepValue()
		}

		return <Slider {...props} />
	}

	render () {
		const hasOneValue = this.props.min === this.props.max
		const applyRangeProps = {
			onClick: this.handleApplyRange
		}

		// disable the ability to set a range when either
		// the min or max are empty
		if (!this.state.min || !this.state.max) {
			applyRangeProps.disabled = true
		}

		return (
			<div className="range-slider-date">
				<div className="range-slider-date--inputs-container">
					{this.renderInput('min')}
					{this.renderInput('max')}
					<Button {...applyRangeProps}>
						Apply range
					</Button>
				</div>

				{this.renderSlider()}
			</div>
		)
	}
}

RangeSliderDate.propTypes = propTypes
RangeSliderDate.defaultProps = defaultProps

export default RangeSliderDate

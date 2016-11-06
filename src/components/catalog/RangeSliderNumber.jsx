import React from 'react'
import Button from '../Button.jsx'
import Slider from 'rc-slider'

import 'rc-slider/assets/index.css'

const T = React.PropTypes

const RangeSliderNumber = React.createClass({
	propTypes: {
		max: T.oneOfType([T.string, T.number]).isRequired,
		min: T.oneOfType([T.string, T.number]).isRequired,

		onApplyRange: T.func.isRequired,
	},


	getInitialState: function () {
		return {
			value: [+this.props.min, +this.props.max],
		}
	},

	handleApplyRange: function (ev) {
		ev.preventDefault && ev.preventDefault()

		this.props.onApplyRange(this.state.value)
	},

	handleMaxValueChange: function (ev) {
		this.setState({
			value: [
				this.state.value[0],
				+ev.target.value || this.props.max,
			]
		})
	},

	handleMinValueChange: function (ev) {
		this.setState({
			value: [
				+ev.target.value || this.props.min,
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
			}
		}

		const labelProps = {
			children: which,
			htmlFor: id,
			key: which + '-label',
		}

		const inputProps = {
			id,
			key: which + '-input',
			max: this.props.max,
			min: this.props.min,
			onChange,
			type: 'number',
			value,
			style: {
				display: 'block',
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
		const val = this.state.value
		const min = val[0]
		const max = val[1]

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

export default RangeSliderNumber

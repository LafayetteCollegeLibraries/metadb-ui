import React from 'react'
import assign from 'object-assign'

const T = React.PropTypes

const Select = React.createClass({
	propTypes: {
		options: T.arrayOf(T.oneOfType([T.string, T.shape({
			label: T.string,
			value: T.string,
		})])),

		style: T.object,
	},

	defaultStyle: function () {
		return {
			appearance: 'none',
			backgroundColor: 'transparent',
			backgroundRepeat: 'no-repeat',
			backgroundPositionX: '125%',
			backgroundPositionY: 'bottom',
			backgroundSize: 'contain',
			borderRadius: '2px',
			display: 'inline-block',
			fontSize: '1em',
			padding: '15px',
			paddingRight: '20px',
			verticalAlign: 'middle',
		}
	},

	handleChange: function (ev) {
		this.props.onChange && this.props.onChange.call(null, ev.target.value)
	},

	mapOptions: function () {
		if (!this.props.options || !this.props.options.length)
			return

		return this.props.options.map((option, index) => {
			const optProps = {}
			let label

			if (typeof option === 'object') {
				optProps.value = option.value
				label = option.label
			}

			else {
				label = optProps.value = option
			}

			optProps.key = 'sel' + index + (optProps.value || 'empty')

			return <option {...optProps}>{label}</option>
		})
	},

	render: function () {
		const style = assign(this.defaultStyle(), this.props.style)
		const selProps = assign(
			{},
			this.props,
			{className: 'Select', style, onChange: this.handleChange}
		)

		if (selProps.options)
			delete selProps.options

		return (
			<select {...selProps}>
				{this.props.children}
				{this.mapOptions()}
			</select>
		)
	}
})

export default Select

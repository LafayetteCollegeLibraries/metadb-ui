import React from 'react'
import assign from 'object-assign'

const T = React.PropTypes
const BORDER_RADIUS = '2px'

const Toggle = React.createClass({
	propTypes: {
		values: T.array.isRequired,

		styles: T.shape({
			container: T.object,
			toggle: T.object,
			selected: T.object,
		}),

		value: T.oneOfType([T.string, T.number])
	},

	getDefaultProps: function () {
		return {
			styles: {},
		}
	},

	handleToggleChange: function (val) {
		if (val === this.props.value)
			return

		this.props.onChange(val)
	},

	renderToggleOption: function (_value, index) {
		let label, value

		if (typeof _value === 'object') {
			label = _value.label
			value = _value.value
		} else {
			label = _value
			value = _value
		}

		const selected = value === this.props.value

		const labelStyle = assign({}, {
			backgroundColor: (selected ? '#b0b0b0' : '#efefef'),
			cursor: (selected ? 'auto' : 'pointer'),
			display: 'inline-block',
			fontWeight: 'normal',
			minWidth: '5em',
			padding: '5px',
			textAlign: 'center',
		}, this.props.styles.toggle,
		(selected ? this.props.styles.selected : undefined))

		if (index === 0) {
			labelStyle.borderBottomLeftRadius = '1px'
			labelStyle.borderTopLeftRadius = '1px'
		}

		if (index === (this.props.values.length - 1)) {
			labelStyle.borderBottomRightRadius = '1px'
			labelStyle.borderTopRightRadius = '1px'
		}

		return (
			<label key={'toggle' + index + value} style={labelStyle}>
				{label}
				<input
					checked={value === this.props.view}
					onChange={this.handleToggleChange.bind(this, value)}
					style={{display: 'none'}}
					value={value}
					type="radio"
				/>
			</label>
		)
	},

	render: function () {
		const containerStyles = assign({}, {
			borderColor: '#b0b0b0',
			borderRadius: BORDER_RADIUS,
			borderStyle: 'solid',
			borderWidth: '1px',
			fontSize: '.9em',
		}, this.props.styles.container)

		return (
			<div style={containerStyles}>
				{this.props.values.map(this.renderToggleOption)}
			</div>
		)
	}
})

export default Toggle

import React from 'react'
import assign from 'object-assign'

const T = React.PropTypes

const Button = React.createClass({
	propTypes: {
		onClick: T.func,
		size: T.string,
		style: T.object,
		type: T.string,
	},

	getSizeClassName: function () {
		switch (this.props.size) {
			case 'small':
				return 'btn-size-small'
			case 'large':
				return 'btn-size-large'
		}
	},

	getTypeClassName: function () {
		switch (this.props.type) {
			case 'danger':
				return 'btn-type-danger'
			case 'info':
				return 'btn-type-info'
			case 'success':
				return 'btn-type-success'
			case 'text':
				return 'btn-type-text'
			case 'warning':
				return 'btn-type-warning'
		}
	},

	render: function () {
		const className = [
			this.getSizeClassName(),
			this.getTypeClassName(),
			this.props.className,
		].join(' ')

		const uProps = assign({}, this.props)
		delete uProps.size
		delete uProps.type
		delete uProps.className

		const props = assign({}, uProps, {className})

		return React.createElement('button', props)
	}
})

export default Button

// used for single-line metadata. for larger blobs, use `TextInput`
import React from 'react'
import assign from 'object-assign'

const StringInput = React.createClass({
	handleBlur: function (ev) {
		const val = ev.target.value
		const check = this._initialValue ? this._initialValue : this.props.value

		if (this.props.onBlur)
			this.props.onBlur.apply(null, arguments)

		if (this.props.disabled || this.props.readOnly || check === val)
			return

		this.props.onChange && this.props.onChange.call(null, val)
	},

	handleFocus: function (ev) {
		this._initialValue = ev.target.value

		if (this.props.onFocus)
			this.props.onFocus.apply(null, arguments)
	},

	render: function () {
		const props = assign(
			// default
			{
				type: 'text'
			},

			// passed props
			this.props,

			// internal overrides
			{
				autoComplete: 'off',
				defaultValue: this.props.value || '',
				onBlur: this.handleBlur,
				onFocus: this.handleFocus,

				// we're overriding `onChange` to only trigger on blur,
				// so we need to noop the original function
				onChange: () => {},
			}
		)

		// stick w/ defaultValue (which uses this.props.value)
		delete props.value

		return React.createElement('input', props)
	}
})

export default StringInput

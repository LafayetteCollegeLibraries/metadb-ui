// used for larger blobs of text, for single-line metadata, us `StringInput`
import React from 'react'
import assign from 'object-assign'

const TextInput = React.createClass({
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
		const props = assign({},
			// passed props
			this.props,

			// internal overrides
			{
				defaultValue: this.props.value || '',
				onBlur: this.handleBlur,
				onFocus: this.handleFocus,

				// we're overriding `onChange` to only trigger on blur,
				// so we need to noop the original function
				onChange: () => {},

				rows: 4,
			}
		)

		// we're using `defaultValue`, since our value changes
		// are being handled via blur/focus
		delete props.value

		return React.createElement('textarea', props)
	}
})

export default TextInput

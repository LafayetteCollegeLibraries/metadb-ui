// used for single-line metadata. for larger blobs, use `TextInput`
import React from 'react'

const defaultProps = {
	type: 'text'
}

export default class StringInput extends React.PureComponent {
	constructor (props) {
		super(props)

		this.handleBlur = this.handleBlur.bind(this)
		this.handleFocus = this.handleFocus.bind(this)
	}

	handleBlur (ev) {
		const val = ev.target.value
		const check = this._initialValue ? this._initialValue : this.props.value

		if (this.props.onBlur)
			this.props.onBlur.apply(null, arguments)

		if (this.props.disabled || this.props.readOnly || check === val)
			return

		this.props.onChange && this.props.onChange.call(null, val)
	}

	handleFocus (ev) {
		this._initialValue = ev.target.value

		if (this.props.onFocus)
			this.props.onFocus.apply(null, arguments)
	}

	render () {
		const props = {
			// passed props
			...this.props,

			// internal overrides
			autoComplete: 'off',
			defaultValue: this.props.value || '',
			onBlur: this.handleBlur,
			onFocus: this.handleFocus,

			// we're overriding `onChange` to only trigger on blur,
			// so we need to noop the original function
			onChange: () => {},

			ref: el => { this.inputElement = el },
		}

		if (props.className) {
			props.className = `StringInput ${props.className}`
		} else {
			props.className = 'StringInput'
		}

		// stick w/ defaultValue (which uses this.props.value)
		delete props.value

		return React.createElement('input', props)
	}
}

StringInput.defaultProps = defaultProps

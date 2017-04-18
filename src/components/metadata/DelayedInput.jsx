import React from 'react'

export default class DelayedInput extends React.PureComponent {
	constructor (props) {
		super(props)

		this.handleBlur = this.handleBlur.bind(this)
		this.handleChange = this.handleChange.bind(this)

		this.state = {
			value: props.value || ''
		}
	}

	componentWillReceiveProps (nextProps) {
		if (nextProps.value !== this.state.value) {
			this.setState({value: nextProps.value})
		}
	}

	handleBlur (ev) {
		this.props.onBlur && this.props.onBlur(ev)
		this.props.onChange && this.props.onChange(this.state.value)
	}

	handleChange (ev) {
		this.setState({value: ev.target.value})
	}

	render () {
		return (
			<input
				{ ...this.props }

				onBlur={this.handleBlur}
				onChange={this.handleChange}
				ref={el => { this.inputElement = el }}
				value={this.state.value}
			/>
		)
	}
}

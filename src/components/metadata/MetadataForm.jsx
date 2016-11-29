// container for work-metadata-form fields
import React from 'react'
import assign from 'object-assign'

const T = React.PropTypes
const DEFAULT_FIELD_NAME = 'undefined-field'

const MetadataForm = React.createClass({
	propTypes: {
		data: T.object,

		onAddValueField: T.func,
		onChange: T.func,
		onRemoveValueField: T.func,
		onSubmit: T.func,

		submitButton: T.oneOfType([T.func, T.element]),

		defaultProps: T.object,
	},

	handleOnAddValueField: function (/* name */) {
		this.props.onAddValueField && this.props.onAddValueField.apply(null, arguments)
	},

	handleOnChange: function (/* name, index, value */) {
		this.props.onChange && this.props.onChange.apply(null, arguments)
	},

	handleOnRemoveValueField: function (/* name, index */) {
		this.props.onRemoveValueField && this.props.onRemoveValueField.apply(null, arguments)
	},

	handleSubmit: function (ev) {
		ev.preventDefault && ev.preventDefault()
		this.props.onSubmit && this.props.onSubmit()
	},

	renderFormFields: function () {
		const data = this.props.data || {}
		return React.Children.map(this.props.children, (formElement, index) => {
			const name = formElement.props.name

			// we'll use the `name` prop to determine whether or not
			// we clone the extended props to the element. this will
			// allow us to add components to the form (eg. <Button/>)
			// without invalid props being passed along. the assumption
			// being made is that the `name` prop is what links us
			// to the Work data.
			if (typeof name === 'undefined')
				return formElement

			const wrapperDefaults = {
				onChange: this.handleOnChange.bind(null, name),
				onAddValueField: this.handleOnAddValueField.bind(null, name),
				onRemoveValueField: this.handleOnRemoveValueField.bind(null, name),
				value: (data[name] || []),
			}

			const mergedProps = assign({},
				wrapperDefaults,
				this.props.defaultProps,
				formElement.props
			)

			mergedProps.key = `md-form!${mergedProps.name}@${index}`

			return React.cloneElement(formElement, mergedProps)
		})
	},

	render: function () {
		return (
			<form onSubmit={this.handleSubmit}>
				{this.renderFormFields()}
			</form>
		)
	}
})

export default MetadataForm

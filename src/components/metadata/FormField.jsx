// a wrapper for form components that adds a label + multiple value ui
// and allows for better form composability

// TODO: add option to display multiple values but not append/remove inputs

import React from 'react'
import assign from 'object-assign'
import Button from '../Button.jsx'

const T = React.PropTypes

const FormField = React.createClass({
	propTypes: {

		/**
		 *  implied-required fields
		 *  ---------
		 *  these are fields needed to actually accomplish anything, but will
		 *  be provided by a form container (*cough* WorkMetadataForm *cough*).
		 *  however, if we mark them as `.isRequired`, propTypes will throw
		 *  bc they're not declared explicitly (but passed via the container's
		 *  React.Children.map call)
		 */

		onChange: T.func,
		renderer: T.func,
		value: T.any,

		/**
		 *  optional fields
		 */

		// whether or not a <label> containing the `label` or `name`
		// field is rendered
		hideLabel: T.bool,

		// text used for a form label. if empty, the `name` field is used
		label: T.string,

		// whether or not multiple form elements can be rendered.
		// if true, button controls are added to allow for adding/removing fields
		multiple: T.bool,

		// data key for the field
		name: T.string,

		// these are required to inform the form state handler that
		//   a) an empty value has been added to the array
		//   b) a value from the array has been removed
		// however, these are not needed for fields that do not allow multiple
		// values. in practice, these will be popuated from the form container
		onAddValueField: T.func,
		onRemoveValueField: T.func,
	},

	allowsMultipleValues: function () {
		return !!this.props.multiple
	},

	// TODO: make sure this actually does what it's supposed to
	focusFirstChild: function () {
		if (!this.refs || !this.refs.length)
			return

		this.refs[0].focus && this.refs[0].focus()
	},

	handleAddValueRow: function (ev) {
		ev.preventDefault && ev.preventDefault()
		this.props.onAddValueField && this.props.onAddValueField()
	},

	handleOnChange: function (/* index, value */) {
		this.props.onChange && this.props.onChange.apply(null, arguments)
	},

	handleRemoveValueRow: function (index, ev) {
		ev.preventDefault && ev.preventDefault()
		this.props.onRemoveValueField && this.props.onRemoveValueField(index)
	},

	hasNoLabelField: function () {
		return (
			typeof this.props.label === 'undefined'
			&& typeof this.props.name === 'undefined'
		)
	},

	maybeRenderAddButton: function () {
		if (!this.allowsMultipleValues())
			return

		return (
			<div className="form-element">
				<div className="form-field--add-row-padding"/>
				{ this.renderAddButton() }
			</div>
		)
	},

	maybeRenderLabel: function () {
		if (this.props.hideLabel || this.hasNoLabelField())
			return false

		return (
			<label onClick={this.focusFirstChild}>
				{this.props.label || this.props.name}
			</label>
		)
	},

	renderAddButton: function () {
		const props = {
			children: '+',
			className: 'form-field--add-row-btn',
			key: 'add-row-btn',
			onClick: this.handleAddValueRow,
		}

		return <Button {...props} />
	},

	renderRemoveButton: function (idx) {
		const props = {
			children: '-',
			className: 'form-field--remove-row-btn',
			key: 'remove-row-btn',
			onClick: this.handleRemoveValueRow.bind(null, idx),
		}

		return <Button {...props} />
	},

	renderFieldComponents: function () {
		const Component = this.props.renderer
		let values = this.props.value || []

		// if we're only allowing one value to be passed as a business rule,
		// we'll only worry about the first item in the array (of which there
		// should _probably_ only be one)
		if (!this.allowsMultipleValues() && values.length > 1)
			values = values.slice(0, 1)

		// I'm having trouble replicating this problem in a test, but in practice
		// a field without a value (an empty array) will not render a component.
		// In the future it might be good to have a toggle for this to explictly
		// hide an element if the value is empty
		if (!values.length)
			values[0] = ''

		// there's probably a cleaner way to do this, but what I'm trying to
		// do here is allow renderer-specific props to be passed through the
		// FormField component. however, some of the props that we pass to
		// the renderer (specifically, `value` and `onChange`) are modified
		// for each value (ie. `onChange` is bound with the index + often
		// passed from the Form container, meaning `this.props.onChange`
		// doesn't initially exist + will cause an error to be thrown).
		const componentProps = assign({}, this.props)

		delete componentProps.multiple
		delete componentProps.name
		delete componentProps.onAddValueField
		delete componentProps.onChange
		delete componentProps.onRemoveValueField
		delete componentProps.renderer
		delete componentProps.value

		const name = this.props.name
		const keyBase = `ff-${name || 'unnamed'}`
		const nameBase = `${name}-${Component.displayName || 'renderer'}`

		return values.map((value, index) => {
			const props = assign({
				key: `${keyBase}-v-${value}-${index}`,
				name: `${nameBase}-${index}`,
				onChange: this.handleOnChange.bind(null, index),
				value,
			}, componentProps)

			return (
				<div className="form-element" key={keyBase + '-c-' + index}>
					{React.createElement(Component, props)}
					{this.allowsMultipleValues() ? this.renderRemoveButton(index) : null}
				</div>
			)
		})
	},

	render: function () {
		if (!this.props.renderer || (typeof this.props.renderer !== 'function'))
			return

		return (
			<div className="form-element-wrapper">
				{this.maybeRenderLabel()}
				{this.renderFieldComponents()}
				{this.maybeRenderAddButton()}
			</div>
		)
	}
})

export default FormField

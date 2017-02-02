import React from 'react'
import Modal, { Header, Footer } from '../Modal.jsx'
import assign from 'object-assign'
import Button from '../Button.jsx'

import {
	FormField,
	MetadataForm,
	StringInput,
	TextInput,
} from '../metadata'

const T = React.PropTypes

const AddMetadataForm = React.createClass({
	propTypes: {
		data: T.object.isRequired,
		onClose: T.func.isRequired,
	},

	getInitialState: function () {
		return {
			changes: {},
			dirty: false,
		}
	},

	cancel: function () {
		if (!this.isDirty())
			return this.props.onClose()

		const message = 'Are you sure you want to cancel? Any changes you made will be lost'

		if (confirm(message)) {
			this.props.onClose()
		}
	},

	handleOnClose: function () {
		this.props.onClose()
	},

	handleAddValueField: function (name) {
		const changes = assign({}, this.state.changes)

		if (!changes[name])
			changes[name] = ['']

		changes[name].push('')

		const dirty = this.isDirty()

		this.setState({changes, dirty})
	},

	handleChange: function (name, index, value) {
		const changes = assign({}, this.state.changes)
		let dirty = this.state.dirty || !!value

		if (!changes[name])
			changes[name] = ['']

		changes[name][index] = value

		if (!value) {
			dirty = this.isDirty()
		}

		this.setState({changes, dirty})
	},

	handleRemoveValueField: function (name, index) {
		const changes = assign({}, this.state.changes)

		if (!changes[name])
			return

		changes[name] = [].concat(
			changes[name].slice(0, index),
			changes[name].slice(index + 1)
		)

		if (!changes[name].length)
			delete changes[name]

		const dirty = this.isDirty()

		this.setState({changes, dirty})
	},

	isDirty: function () {
		const changes = this.state.changes
		const keys = Object.keys(changes)

		if (!keys.length)
			return false

		for (let i = 0; i < keys.length; i++) {
			if (changes[keys[i]].filter(Boolean).length) {
				return true
			}
		}

		return false
	},

	renderMetadataForm: function () {
		const mdformProps = {
			data: this.state.changes,
			onAddValueField: this.handleAddValueField,
			onChange: this.handleChange,
			onRemoveValueField: this.handleRemoveValueField,
		}

		return (
			<MetadataForm {...mdformProps}>
				<FormField name="title" label="Title" renderer={StringInput} multiple />
				<FormField name="description" label="Description" renderer={TextInput} multiple />
			</MetadataForm>
		)
	},

	submitChanges: function () {
		if (!this.state.dirty)
			return this.props.onClose()

		const affected = this.props.data.pages.total_count
		const message = `Submit changes? This will update ${affected} records!`

		if (confirm(message)) {
			this.props.onClose(assign({}, this.state.changes))
		}
	},

	render: function () {
		const { data } = this.props
		const count = data.pages.total_count
		const label = `Apply metadata to ${count} result${count === 1 ? '' : 's'}`

		const modalProps = {
			className: 'full',
			onRequestClose: this.handleOnClose,
			isOpen: true,
			contentLabel: label,
		}

		return (
			<Modal {...modalProps}>
				<Header>{label}</Header>

				{this.renderMetadataForm()}

				<Footer>
					<div className="button-group">
						<Button onClick={this.cancel}>
							Cancel
						</Button>
						<Button
							disabled={!this.state.dirty}
							onClick={this.submitChanges}
							type="success"
							>
							Apply changes
						</Button>
					</div>
				</Footer>
			</Modal>
		)
	}
})

export default AddMetadataForm
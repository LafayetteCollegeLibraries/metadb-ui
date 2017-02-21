import React from 'react'
import GenericWork from '../schema/GenericWork.jsx'

import assign from 'object-assign'

const T = React.PropTypes

const WorkEdit = React.createClass({
	propTypes: {
		autosave: T.bool,

		data: T.object.isRequired,

		// function updateWork (updates)
		// (expects a promise)
		updateWork: T.func.isRequired,
	},

	getDefaultProps: function () {
		return {
			autosave: false,
		}
	},

	getInitialState: function () {
		return {
			updates: {},
		}
	},

	maybeSubmitUpdate: function (updates) {
		if (!this.props.autosave)
			return

		return this.props.updateWork(updates)
			.then(() => this.setState({updates: {}}))
			.catch(err => console.warn('Error in WorkEdit:', err))
	},

	onAddField: function (name) {
		const updates = assign({}, this.state.updates)

		if (!updates[name]) {
			updates[name] = [].concat(this.props.data[name])
		}

		updates[name].push('')

		this.setState({updates})
	},

	onChange: function (name, index, value) {
		const updates = assign({}, this.state.updates)

		if (!updates[name]) {
			updates[name] = [].concat(this.props.data[name])
		}

		updates[name] = [].concat(
			updates[name].slice(0, index),
			value,
			updates[name].slice(index + 1)
		)

		this.setState({updates})
		this.maybeSubmitUpdate(updates)
	},

	onRemoveValueField: function (name, index) {
		const updates = assign({}, this.state.updates)

		if (!updates[name]) {
			updates[name] = [].concat(this.props.data[name])
		}

		updates[name] = [].concat(
			updates[name].slice(0, index),
			updates[name].slice(index + 1)
		)

		this.setState({updates})
		this.maybeSubmitUpdate(updates)
	},

	render: function () {
		const data = assign({}, this.props.data, this.state.updates)

		const props = {
			data,
			onAddValueField: this.onAddField,
			onChange: this.onChange,
			onRemoveValueField: this.onRemoveValueField,
		}

		return <GenericWork {...props} />
	}
})

export default WorkEdit

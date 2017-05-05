import React from 'react'
import cn from 'classnames'

const SELECT_CLASSNAME = 'results-table--field-select ResultsTableFieldSelect'

const propTypes = {
	fields: React.PropTypes.object,
	onClose: React.PropTypes.func,
	onSelectField: React.PropTypes.func,
	selected: React.PropTypes.array,
}

const defaultProps = {
	fields: {},
	onClose: () => {},
	onSelectField: () => {},
	selected: [],
}

const ResultsTableFieldSelect = React.createClass({
	propTypes: propTypes,

	getDefaultProps: function () {
		return defaultProps
	},

	componentWillMount: function () {
		document.addEventListener('click', this.maybeCloseSelect)
	},

	componentWillUnmount: function () {
		document.removeEventListener('click', this.maybeCloseSelect)
	},

	handleFieldClick: function (key) {
		const idx = this.props.selected.indexOf(key)
		const isSelected = idx > -1
		this.props.onSelectField.call(null, key, !isSelected, idx)
	},

	handleReset: function () {
		this.props.onReset && this.props.onReset()
	},

	handleSelectAll: function () {
		this.props.onSelectAll && this.props.onSelectAll()
	},

	maybeCloseSelect: function (event) {
		let target = event.target

		do {
			if (target.className.indexOf(SELECT_CLASSNAME) > -1) {
				return
			}

			target = target.parentElement
		} while (target)

		this.props.onClose()
	},

	renderWorkField: function (key, index) {
		const selected = this.props.selected.indexOf(key) > -1
		const props = {
			children: this.props.fields[key],
			className: cn('field ResultsTableFieldSelect-field', {selected}),
			onClick: this.handleFieldClick.bind(null, key),
			key: key + index,
		}

		return <div {...props} />
	},

	renderWorkFields () {
		const fieldClassName = 'ResultsTableFieldSelect-field'
		const header = [
			(
			<div
				className={`field field-header ${fieldClassName}`}
				key="all"
				onClick={this.handleSelectAll}
			>
				Select all fields
			</div>
			),
			(
			<div
				className={`field field-header ${fieldClassName}`}
				key="header"
				onClick={this.handleReset}
			>
				Restore defaults
			</div>
			),
			(
			<div
				className="field-divider {fieldClassName} ResultsTableFieldSelect-divider"
				key="divider"
			/>
			),
		]

		const keys = Object.keys(this.props.fields)
		return header.concat(keys.map(this.renderWorkField))
	},

	render: function () {
		const props = {
			className: SELECT_CLASSNAME,
			ref: el => { this._containerEl = el },
		}

		return (
			<div {...props}>
				{this.renderWorkFields()}
			</div>
		)
	}
})

export default ResultsTableFieldSelect

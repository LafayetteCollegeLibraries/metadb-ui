import React from 'react'
import workFields from '../../../lib/work-fields'
import cn from 'classnames'

const SELECT_CLASSNAME = 'results-table--field-select'

const propTypes = {
	onClose: React.PropTypes.func,
	onSelectField: React.PropTypes.func,
	selected: React.PropTypes.array,
}

const defaultProps = {
	onClose: () => {},
	selected: [],
}

class ResultsTableFieldSelect extends React.Component {
	constructor (props) {
		super(props)

		this.handleFieldClick = this.handleFieldClick.bind(this)
		this.maybeCloseSelect = this.maybeCloseSelect.bind(this)
		this.renderWorkField = this.renderWorkField.bind(this)
		this.renderWorkFields = this.renderWorkFields.bind(this)
	}

	componentWillMount () {
		document.addEventListener('click', this.maybeCloseSelect)
	}

	componentWillUnmount () {
		document.removeEventListener('click', this.maybeCloseSelect)
	}

	handleFieldClick (key) {
		const idx = this.props.selected.indexOf(key)
		const isSelected = idx > -1
		this.props.onSelectField.call(null, key, !isSelected, idx)
	}

	maybeCloseSelect (event) {
		let target = event.target

		do {
			if (target.className.indexOf(SELECT_CLASSNAME) > -1) {
				return
			}
		} while (target = target.parentElement)

		this.props.onClose()
	}

	renderWorkField (key, index) {
		const selected = this.props.selected.indexOf(key) > -1
		const props = {
			children: workFields[key],
			className: cn('field', {selected}),
			onClick: this.handleFieldClick.bind(null, key),
			key: key + index,
		}

		return <div {...props} />
	}

	renderWorkFields () {
		const keys = Object.keys(workFields)
		return keys.map(this.renderWorkField)
	}

	render () {
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
}

ResultsTableFieldSelect.propTypes = propTypes
ResultsTableFieldSelect.defaultProps = defaultProps

export default ResultsTableFieldSelect

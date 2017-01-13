import React from 'react'
import workFields from '../../../lib/work-fields'

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
		this.handleOnClose = this.handleOnClose.bind(this)
		this.renderWorkField = this.renderWorkField.bind(this)
		this.renderWorkFields = this.renderWorkFields.bind(this)
	}

	componentWillMount () {
		document.addEventListener('click', this.handleOnClose)
	}

	componentWillUnmount () {
		document.removeEventListener('click', this.handleOnClose)
	}

	handleFieldClick (key) {
		const idx = this.props.selected.indexOf(key)
		const isSelected = idx > -1
		this.props.onSelectField.call(null, key, !isSelected, idx)
	}

	handleOnClose (ev) {
		if (!this._containerEl)
			return

		console.log(ev.target === this._containerEl)
	}

	renderWorkField (key, index) {
		const selected = this.props.selected.indexOf(key) > -1
		const props = {
			children: workFields[key],
			onClick: this.handleFieldClick.bind(null, key),
			key: key + index,
			style: {
				backgroundColor: (selected ? '#1d5f83' : '#fff'),
				color: (selected ? '#fff' : '#1e1e1e'),
				cursor: 'pointer',
				margin: '1px 2px',
				padding: '2px',
			}
		}

		return <div {...props} />
	}

	renderWorkFields () {
		const keys = Object.keys(workFields)
		return keys.map(this.renderWorkField)
	}

	render () {
		const props = {
			ref: el => { this._containerEl = el },
			style: {
				backgroundColor: '#fff',
				boxShadow: '0 0 2px 0 #999',
				fontSize: '.9em',
				fontWeight: 'normal',
				padding: '2px',
				position: 'absolute',
				textAlign: 'left',
			}
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

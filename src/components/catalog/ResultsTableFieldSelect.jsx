import React from 'react'
import workFields from '../../../lib/work-fields'

const propTypes = {
	onSelectField: React.PropTypes.func,
	selected: React.PropTypes.array,
}

const defaultProps = {
	selected: [],
}

class ResultsTableFieldSelect extends React.PureComponent {
	constructor (props) {
		super(props)

		this.renderWorkField = this.renderWorkField.bind(this)
		this.renderWorkFields = this.renderWorkFields.bind(this)
	}

	renderWorkField (key, index) {
		const selected = this.props.selected.indexOf(key) > -1

		const props = {
			children: workFields[key],
			onClick: this.props.onSelectField.bind(null, key, !selected),
			key: index,
			style: {
				backgroundColor: selected ? '#1d5f83' : '#fff',
				cursor: 'pointer',
				padding: '2px 4px',
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
			style: {
				position: 'absolute',
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

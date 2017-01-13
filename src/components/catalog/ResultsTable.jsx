import React from 'react'
import { TacoTable, DataType } from 'react-taco-table'
import workFields from '../../../lib/work-fields'
import ResultsTableFieldSelect from './ResultsTableFieldSelect.jsx'

const propTypes = {
	data: React.PropTypes.array,
	fields: React.PropTypes.array,
}

const defaultProps = {
	data: {},
	fields: [],
}

// create a dictionary to use for sorting the fields based on position.
// this way, the fields remain in the order displayed in the
// `ResultsTableFieldSelect` component
const workFieldKeys = Object.keys(workFields).reduce((dict, key, index) => {
	dict[key] = index + 1
	return dict
}, {})

const sortByField = (a, b) => (workFieldKeys[a] - workFieldKeys[b])

class ResultsTable extends React.Component {
	constructor (props) {
		super(props)

		this.state = {
			fields: ['title', 'creator'],
			fieldSelectOpen: false,
		}

		this.getColumns = this.getColumns.bind(this)
		this.getFieldToggleHeader = this.getFieldToggleHeader.bind(this)
		this.handleOnSelectField = this.handleOnSelectField.bind(this)
		this.renderFieldSelect = this.renderFieldSelect.bind(this)
	}

	getColumns () {
		// set default column first (thumbnail)
		const columns = [
			{
				header: this.getFieldToggleHeader(),
				id: 'thumbnail_path',

				// TODO: a11y updates
				renderer: path => <img src={this.getThumbnailPath(path)} />,

				// disable sorting by setting type to None
				type: DataType.None,
			}
		]

		const fields = this.state.fields.map(id => ({
			id,
			header: workFields[id],
			type: DataType.None,
		}))

		return columns.concat(fields)
	}

	getFieldToggleHeader () {
		const open = this.state.fieldSelectOpen
		const buttonProps = {
			children: 'X',
			key: 'toggle-btn',
			onClick: ev => {
				ev.preventDefault && ev.preventDefault()
				this.setState({
					fieldSelectOpen: !this.state.fieldSelectOpen,
				})
			},
			style: {
				backgroundColor: (open ? '#888' : '#ccc'),
				cursor: 'pointer',
				height: '25px',
				width: '25px',
				WebkitAppearance: 'none',
				appearance: 'none',
			}
		}

		return [
			<button {...buttonProps} />,
			(open ? this.renderFieldSelect() : null),
		]
	}

	getThumbnailPath (path) {
		return `${process.env.API_BASE_URL}${path}`
	}

	handleOnSelectField (key, toggle, index) {
		const { fields } = this.state

		if (toggle) {

			// no duplicates!
			if (index > -1)
				return

			fields.push(key)
			this.setState({fields: fields.sort(sortByField)})

			return
		}

		if (index === -1)
			return

		const update = [].concat(
			fields.slice(0, index),
			fields.slice(index + 1)
		)

		this.setState({fields: update})
	}

	renderFieldSelect () {
		const props = {
			onSelectField: this.handleOnSelectField,
			selected: this.state.fields,
		}

		return <ResultsTableFieldSelect {...props} />
	}

	render () {
		return (
			<TacoTable columns={this.getColumns()} data={this.props.data} />
		)
	}
}

ResultsTable.propTypes = propTypes
ResultsTable.defaultProps = defaultProps

export default ResultsTable

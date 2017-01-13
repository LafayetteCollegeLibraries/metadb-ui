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

class ResultsTable extends React.Component {
	constructor (props) {
		super(props)

		this.state = {
			fields: ['title', 'creator'],
			fieldSelectOpen: true,
		}
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
			dataType: DataType.String,
			header: workFields[id],
		}))

		return columns.concat(fields)
	}

	getFieldToggleHeader () {
		const open = this.state.fieldSelectOpen
		const props = {
			children: [
				'X',
				(open ? this.renderFieldSelect() : null),
			],
			style: {
				backgroundColor: (open ? '#888' : '#ccc'),
				cursor: 'pointer',
				height: '25px',
				width: '25px',
			}
		}

		return <div {...props} />
	}

	getThumbnailPath (path) {
		return `${process.env.API_BASE_URL}${path}`
	}

	renderFieldSelect () {
		const props = {
			onSelectField: (key, toggle) => {
				const { fields } = this.state

				if (toggle) {
					fields.push(key)
					this.setState({fields})
					return
				}

				const idx = fields.indexOf(key)

				if (idx === -1)
					return

				const update = [].concat(
					fields.slice(0, idx),
					fields.slice(idx + 1)
				)

				this.setState({fields: update})
			},

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

import React from 'react'

// this is a hack, but importing the whole of `react-taco-table`
// throws an error during testing (`Object.assign` not existing)
// because the module imports a plugin which uses this, but we
// aren't using that plugin.
// ~~~~~~~~~~
// PhantomJS 2.1.1 (Mac OS X 0.0.0) ERROR
//  TypeError: undefined is not a constructor (evaluating 'Object.assign({}, d3Scale, d3ScaleChromatic)')
//  at webpack:///~/react-taco-table/lib/plugins/HeatmapPlugin.js:32:0 <- test.webpack.js:97422
// ~~~~~~~~~~
// import { TacoTable, DataType } from 'react-taco-table'
import TacoTable from 'react-taco-table/lib/TacoTable'
import DataType from 'react-taco-table/lib/DataType'

import cn from 'classnames'
import workFields from '../../../lib/work-fields'
import ResultsTableFieldSelect from './ResultsTableFieldSelect.jsx'
import { fields as searchResultFields } from '../../../lib/search-result-settings'

const propTypes = {
	data: React.PropTypes.array,
	getSelectedFields: React.PropTypes.func,
	setSelectedFields: React.PropTypes.func,
}

const defaultProps = {
	data: [],
	defaultFields: ['title', 'creator'],
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

		let fields = searchResultFields.get()

		if (fields.length === 0) {
			fields = this.props.defaultFields
		}

		this.state = {
			fields,
			fieldSelectOpen: false,
		}

		this.getColumns = this.getColumns.bind(this)
		this.getFieldToggleHeader = this.getFieldToggleHeader.bind(this)
		this.handleOnSelectField = this.handleOnSelectField.bind(this)
		this.renderFieldSelect = this.renderFieldSelect.bind(this)
		this.setFields = this.setFields.bind(this)
	}

	getColumns () {
		// set default column first (thumbnail)
		const columns = [
			{
				className: 'thumbnail-preview',
				header: this.getFieldToggleHeader(),
				id: 'thumbnail_path',

				// TODO: a11y updates
				renderer: (path, _, rowData) => (
					<a href={`/works/${rowData.id}`}>
						<img src={this.getThumbnailPath(path)} />
					</a>
				),

				thClassName: 'field-select',

				// disable sorting by setting type to None
				type: DataType.None,
			}
		]

		const fields = this.state.fields.map(id => ({
			id,
			header: workFields[id],

			// TODO: should fields w/ multiple values be more than
			// semi-colon delimited?
			renderer: data => (data.join('; ')),
			type: DataType.None,
		}))

		return columns.concat(fields)
	}

	getFieldToggleHeader () {
		const open = this.state.fieldSelectOpen

		// simple wrapper for svg lines
		const rect = (x, y) => {
			const props = {
				width: '250',
				height: '40',
				fill: '#1e1e1e',
				x,
				y,
			}

			return <rect {...props} />
		}

		// our button will just have an svg of three stacked lines (the ol'
		// hamburger button), + we'll do this w/ jsx
		const contents = (
			<svg
				version="1.1"
				viewBox="0 0 300 300"
				xmlns="http://www.w3.org/2000/svg"
				>
        { rect('25', '80') }
        { rect('25', '170') }
        { rect('25', '260') }
			</svg>
		)

		const buttonProps = {
			children: contents,
			className: cn('btn-size-small', 'toggle', {open}),
			key: 'toggle-btn',
			onClick: ev => {
				ev.preventDefault && ev.preventDefault()
				this.setState({
					fieldSelectOpen: !this.state.fieldSelectOpen,
				})
			},
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
		const fields = [].concat(this.state.fields)
		let update

		// add a field to the pool
		if (toggle) {

			// no duplicates!
			if (index > -1)
				return

			fields.push(key)
			update = fields.sort(sortByField)
		}

		// remove a field from the pool
		else {

			// not sure why or even if this'll happen, but if the selected item
			// isn't in our pool, just bail
			if (index === -1)
				return

			update = [].concat(
				fields.slice(0, index),
				fields.slice(index + 1)
			)
		}

		this.setFields(update)
	}

	renderFieldSelect () {
		const onClose = () => {
			if (this.state.fieldSelectOpen) {
				this.setState({fieldSelectOpen: false})
			}
		}

		const onReset = () => {
			this.setFields(this.props.defaultFields)
		}

		const props = {
			onClose,
			onReset,
			fields: workFields,
			key: 'field-select',
			onSelectField: this.handleOnSelectField,
			selected: this.state.fields,
		}

		return <ResultsTableFieldSelect {...props} />
	}

	setFields (fields) {
		searchResultFields.set(fields)
		this.setState({fields})
	}

	render () {
		return (
			<TacoTable
				className="results-table"
				columns={this.getColumns()}
				data={this.props.data}
				sortable={false}
				/>
		)
	}
}

ResultsTable.propTypes = propTypes
ResultsTable.defaultProps = defaultProps

export default ResultsTable

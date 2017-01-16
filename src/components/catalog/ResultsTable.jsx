import React from 'react'
import { TacoTable, DataType } from 'react-taco-table'
import cn from 'classnames'
import workFields from '../../../lib/work-fields'
import ResultsTableFieldSelect from './ResultsTableFieldSelect.jsx'
import { fields as searchResultFields } from '../../../lib/search-result-settings'

const DEFAULT_FIELDS = ['title', 'creator']

const propTypes = {
	data: React.PropTypes.array,
}

const defaultProps = {
	data: [],
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
			fields = DEFAULT_FIELDS
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
			type: DataType.None,
		}))

		return columns.concat(fields)
	}

	getFieldToggleHeader () {
		const open = this.state.fieldSelectOpen
		const contents = (
			<svg viewBox="0 0 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <rect fill="#1E1E1E" x="25" y="80" width="250" height="40"></rect>
        <rect fill="#1E1E1E" x="25" y="170" width="250" height="40"></rect>
        <rect fill="#1E1E1E" x="25" y="260" width="250" height="40"></rect>
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
			this.setFields(DEFAULT_FIELDS)
		}

		const props = {
			onClose,
			onReset,
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
				/>
		)
	}
}

ResultsTable.propTypes = propTypes
ResultsTable.defaultProps = defaultProps

export default ResultsTable

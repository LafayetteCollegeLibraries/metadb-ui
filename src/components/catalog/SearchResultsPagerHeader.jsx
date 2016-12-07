import React from 'react'
import ResultsPager from './ResultsPager.jsx'
import Select from '../metadata/Select.jsx'
import { RESULTS_PAGER as RESULTS_PAGER_MESSAGE} from '../../messages/results'

const T = React.PropTypes

const SearchResultsPagerHeader = React.createClass({
	propTypes: {
		data: T.object.isRequired,
		onNextPage: T.func.isRequired,
		onPreviousPage: T.func.isRequired,
		onPerPageChange: T.func.isRequired,

		perPage: T.oneOfType([T.number, T.string]),
		perPageOptions: T.array,
	},

	getDefaultProps: function () {
		return {
			perPage: 10,
			perPageOptions: [10, 25, 50, 100, 250],
		}
	},

	handlePerPageChange: function (val) {
		this.props.onPerPageChange(val)
	},

	perPageOption: function (amount, index) {
		return React.createElement('option', {
			children: amount,
			key: 'per-page-' + index + amount,
			value: amount,
		})
	},

	renderPerPage: function () {
		const containerProps = {
			style: {
				float: 'right',
				textAlign: 'right',
			}
		}

		const selectProps = {
			children: this.props.perPageOptions.map(this.perPageOption),
			key: 'per-page-select',
			onChange: this.handlePerPageChange,
			value: this.props.perPage,
			style: {
				borderColor: '#ccc',
				outlineColor: '#1d5f83',
				marginLeft: '10px',
			}
		}

		return (
			<div {...containerProps}>
				per page
				<Select {...selectProps} />
			</div>
		)
	},

	render: function () {
		const pagerProps = {
			...this.props.data,
			message: RESULTS_PAGER_MESSAGE,
			onNextClick: this.props.onNextPage,
			onPreviousClick: this.props.onPreviousPage,
		}

		return (
			<div>
				<ResultsPager {...pagerProps}/>

				{this.renderPerPage()}
				<div style={{clear: 'both'}}/>
			</div>
		)
	}
})

export default SearchResultsPagerHeader

import React from 'react'
import Button from '../Button.jsx'
import Toggle from '../Toggle.jsx'
import SearchResultsPagerHeader from './SearchResultsPagerHeader.jsx'

import BulkToolMenu from '../bulk-tools/Menu.jsx'

const T = React.PropTypes
const BORDER_RADIUS = '2px'

const SearchResultsHeader = React.createClass({
	propTypes: {
		onNextPage: T.func.isRequired,
		onPreviousPage: T.func.isRequired,
		onPerPageChange: T.func.isRequired,
		onViewChange: T.func.isRequired,

		bulkTools: T.array,
		onOpenBulkTool: T.func.isRequired,

		pageData: T.object.isRequired,
		view: T.string,
		viewOptions: T.array,

		perPage: T.oneOfType([T.number, T.string]),
		perPageOptions: T.array,

		bulkTools: T.array,
	},

	getInitialState: function () {
		return {
			toolDropdownOpen: false,
		}
	},

	maybeRenderToolDropdown: function () {
		if (!this.state.toolDropdownOpen)
			return

		return (
			<BulkToolMenu
				onClose={this.toggleToolDropdown}
				onSelect={(tool) => {
					this.toggleToolDropdown()
					this.props.onOpenBulkTool(tool)
				}}
				tools={this.props.bulkTools}
			/>
		)
	},

	toggleToolDropdown: function () {
		this.setState({
			toolDropdownOpen: !this.state.toolDropdownOpen,
		})
	},

	viewToggle: function () {
		return (
			<Toggle
				onChange={this.props.onViewChange}
				value={this.props.view}
				values={this.props.viewOptions}
			/>
		)
	},

	render: function () {
		const styles = {
			buttonContainer: {
				display: 'inline-block',
				position: 'relative',
			},

			divider: {
				border: 'none',
				borderBottom: '1px solid #ccc',
				margin: 'auto',
				marginBottom: '10px',
				marginTop: '10px',
				width: '98%',
			},

			toggleContainer: {
				float: 'right',
				display: 'inline-block',
			},
		}

		return (
			<div>
				<div key="search-results-header-top">
					<div style={styles.buttonContainer}>
						<Button onClick={this.toggleToolDropdown}>
							Choose metadata tool
						</Button>

						{this.maybeRenderToolDropdown()}
					</div>

					<div style={styles.toggleContainer}>
						{this.viewToggle()}
					</div>
				</div>

				<hr style={styles.divider} />

				<SearchResultsPagerHeader
					data={this.props.pageData}
					key="search-results-header-bottom"
					onNextPage={this.props.onNextPage}
					onPerPageChange={this.props.onPerPageChange}
					onPreviousPage={this.props.onPreviousPage}
					perPage={this.props.perPage}
					perPageOptions={this.props.perPageOptions}
				/>
			</div>
		)
	}
})

export default SearchResultsHeader

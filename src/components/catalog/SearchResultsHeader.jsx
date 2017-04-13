import React from 'react'
import Button from '../Button.jsx'
import Toggle from '../Toggle.jsx'
// import SearchResultsPagerHeader from './SearchResultsPagerHeader.jsx'

import BatchToolMenu from '../batch-tools/Menu.jsx'

const T = React.PropTypes
const BORDER_RADIUS = '2px'

const SearchResultsHeader = React.createClass({
	propTypes: {
		onViewChange: T.func.isRequired,

		batchTools: T.array,
		onOpenBatchTool: T.func.isRequired,

		view: T.string,
		viewOptions: T.array,

		batchTools: T.array,
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
			<BatchToolMenu
				onClose={this.toggleToolDropdown}
				onSelect={(tool) => {
					this.toggleToolDropdown()
					this.props.onOpenBatchTool(tool)
				}}
				tools={this.props.batchTools}
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
			<div className="SearchResultsHeader">
				<div
					className="SearchResultsHeader-top"
					key="search-results-header-top"
					>
					<div
						className="SearchResultsHeader-button-container"
						style={styles.buttonContainer}
						>
						<Button
							className="SearchResultsHeader-tool-toggle"
							onClick={this.toggleToolDropdown}
							>
							Choose metadata tool
						</Button>

						{this.maybeRenderToolDropdown()}
					</div>

					<div
						className="SearchResultsHeader-view-toggle"
						style={styles.toggleContainer}>
						{this.viewToggle()}
					</div>
				</div>

				{/*
				<hr className="SearchResultsHeader-divider" style={styles.divider} />

				<SearchResultsPagerHeader
					data={this.props.pageData}
					key="search-results-header-bottom"
					onNextPage={this.props.onNextPage}
					onPerPageChange={this.props.onPerPageChange}
					onPreviousPage={this.props.onPreviousPage}
					perPage={this.props.perPage}
					perPageOptions={this.props.perPageOptions}
				/>
				*/}
			</div>
		)
	}
})

export default SearchResultsHeader

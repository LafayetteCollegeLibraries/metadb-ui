import React from 'react'
import Button from '../Button.jsx'
import Toggle from '../Toggle.jsx'
import SearchResultsPagerHeader from './SearchResultsPagerHeader.jsx'

const T = React.PropTypes
const BORDER_RADIUS = '2px'

const SearchResultsHeader = React.createClass({
	propTypes: {
		onNextPage: T.func.isRequired,
		onOpenToolModal: T.func.isRequired,
		onPreviousPage: T.func.isRequired,
		onPerPageChange: T.func.isRequired,
		onViewChange: T.func.isRequired,

		pageData: T.object.isRequired,
		view: T.string,
		viewOptions: T.array,

		perPage: T.oneOfType([T.number, T.string]),
		perPageOptions: T.array,
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

	renderMetadataToolButton: function () {
		// pass some empty space for now
		return <div style={{padding: '.75em'}} />

		// return (
		// 	<Button onClick={this.props.onOpenToolModal}>
		// 		Choose metadata tool
		// 	</Button>
		// )
	},

	render: function () {
		const styles = {
			buttonContainer: {
				display: 'inline-block',
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
						{this.renderMetadataToolButton()}
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

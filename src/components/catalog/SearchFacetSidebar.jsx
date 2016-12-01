import React from 'react'
import FacetGroup from './FacetGroup.jsx'
import Button from '../Button.jsx'

const T = React.PropTypes

const SearchFacetSidebar = React.createClass({
	propTypes: {
		data: T.array.isRequired,

		onClearSelectedFacets: T.func.isRequired,

		onRemoveSelectedFacet: T.func.isRequired,
		onSelectFacet: T.func.isRequired,
		onSubmitSearchQuery: T.func.isRequired,

		selectedFacets: T.object.isRequired,

		query: T.string,
	},

	componentWillReceiveProps: function (nextProps) {
		this.setState({query: nextProps.query})
	},

	getInitialState: function () {
		return {
			query: this.props.query,
		}
	},

	handleClearFacets: function (ev) {
		ev.preventDefault && ev.preventDefault()
		this.props.onClearSelectedFacets()
	},

	handleSearchSubmit: function (ev) {
		ev.preventDefault && ev.preventDefault()

		const query = this.state.query
		this.props.onSubmitSearchQuery(query)
	},

	renderSearchHeader: function () {
		const styles = {
			container: {
				marginBottom: '10px',
			},
			input: {
				width: '100%',
			}
		}

		// TODO: this button isn't rendering correctly
		const button = !Object.keys(this.props.selectedFacets).length ? null : (
			<Button
				onClick={this.handleClearFacets}
				size="small"
			>
				Clear facets
			</Button>
		)

		return (
			<div style={styles.container}>
				<form onSubmit={this.handleSearchSubmit}>
					<input
						value={this.state.query}
						onChange={e => this.setState({query: e.target.value})}
						name="query"
						style={styles.input}
						type="search"
					/>
				</form>
				{button}
			</div>
		)
	},

	render: function () {
		const containerProps = {
			style: {
				// TODO: maybe get rid of this border
				borderRight: '1px solid #ccc',
				paddingRight: '10px',
			}
		}

		return (
			<div {...containerProps}>
				{this.renderSearchHeader()}

				<FacetGroup {...this.props}>
					{this.props.children}
				</FacetGroup>
			</div>
		)
	}
})

export default SearchFacetSidebar

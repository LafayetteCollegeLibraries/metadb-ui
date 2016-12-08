import React from 'react'
import browserHistory from 'react-router/lib/browserHistory'
import StringInput from '../components/metadata/StringInput.jsx'
import Button from '../components/Button.jsx'
import { clearSearches, getPreviousQueries } from '../../lib/search-history'

const SearchLanding = React.createClass({
	getInitialState: function () {
		const previousQueries = getPreviousQueries()
		return {previousQueries}
	},

	handleSearchSubmit: function (ev) {
		ev.preventDefault()
		const query = ev.target.elements.query.value

		browserHistory.push(`/search?q=${query}`)
	},

	renderPreviousSearches: function () {
		const containerStyle = {
			border: '1px solid #1d5f83',
			borderRadius: '2px',
			marginTop: '2em',
			padding: '5px',
		}

		if (!this.state.previousQueries.length)
			return

		return (
			<div style={containerStyle}>
				<p>previously searched queries</p>
				<ul>
					{this.state.previousQueries.map((query, idx) => (
						<li key={`pq-${idx}`}>
							<a href={`/search?q=${query}`}>{query}</a>
						</li>
					))}
				</ul>

				<Button
					type="warning"
					size="small"
					onClick={e => {
						e.preventDefault()
						clearSearches()
						this.setState({previousQueries: []})
					}}
					>
					Clear search history
				</Button>
			</div>
		)
	},

	render: function () {
		const searchboxWrapperStyle = {
			margin: 'auto',
			width: '75%',
		}

		const stringInputStyle = {
			width: '85%',
		}

		const btnStyle = {
			height: '100%',
			marginLeft: '10px',
		}

		return (
			<div>
				<form onSubmit={this.handleSearchSubmit} style={searchboxWrapperStyle}>
					<StringInput name="query" placeholder="Enter your query!" style={stringInputStyle} />
					<Button
						children="Search"
						style={btnStyle}
						type="success"
						/>

						{this.renderPreviousSearches()}
				</form>
			</div>
		)
	}
})

export default SearchLanding

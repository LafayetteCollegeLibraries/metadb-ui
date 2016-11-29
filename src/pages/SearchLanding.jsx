import React from 'react'
import browserHistory from 'react-router/lib/browserHistory'
import StringInput from '../components/metadata/StringInput.jsx'
import Button from '../components/Button.jsx'
import { getPreviousQueries } from '../../lib/search-history'

const SearchLanding = React.createClass({
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

		const searches = getPreviousQueries()

		if (!searches.length)
			return

		return (
			<div style={containerStyle}>
				<p>previously searched queries</p>
				<ul>
					{searches.map((query, idx) => (
						<li key={`pq-${idx}`}>
							<a href={`/search?q=${query.replace(' ', '-')}`}>{query}</a>
						</li>
					))}
				</ul>
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
					<StringInput name="query" placeholder="enter yr search terms" style={stringInputStyle} />
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

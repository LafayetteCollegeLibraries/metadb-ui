import React from 'react'
import Link from 'react-router/lib/Link'

export default function NoResultsFound (props) {
	const queryStyle = {
		fontSize: '1.25em',
		fontWeight: 'bold',
		margin: '0 5px',
	}

	return (
		<div className="error-page-container">
			<div className="error-page-message">
				<h1>No results found!</h1>

				<p>Your search for <code style={queryStyle}>{props.query}</code>
				returned no results! <Link to="/search">Try another search?</Link></p>
			</div>
		</div>
	)
}

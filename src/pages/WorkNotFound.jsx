import React from 'react'
import Link from 'react-router/lib/Link'

export default function WorkNotFound (props) {
	return (
		<div className="error-page-container">
			<div className="error-page-message">
				<h1>Not found!</h1>

				<p>
					The work you are looking for &ndash;
					<strong> { props.work.error.id }</strong>
					&nbsp;&ndash; does not appear to exist! Sorry about that.
				</p>

				<p>
					<Link to="/search">
						Use search to browse for it.
					</Link>
				</p>
			</div>
		</div>
	)
}

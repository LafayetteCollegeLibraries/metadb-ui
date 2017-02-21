import React from 'react'
import Button from './Button.jsx'
import browserHistory from 'react-router/lib/browserHistory'

export default function NavToSearchResults (props) {
	return (
		<nav>
			<Button
				onClick={() => browserHistory.goBack()}
				size="large"
				type="text"
			>
				&lt; Return to results
			</Button>
		</nav>
	)
}

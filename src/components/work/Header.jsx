import React from 'react'

export default function WorkHeader (props) {
	return (
		<header className="WorkHeader-container">
			<h1 className="WorkHeader-title">
				{props.title}
			</h1>

			<span className="WorkHeader-status">
				{props.status}
			</span>
		</header>
	)
}

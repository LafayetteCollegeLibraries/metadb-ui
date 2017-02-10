import React from 'react'

const T = React.PropTypes

const WorkHeader = React.createClass({
	render: function () {
		return (
			<header className="WorkHeader-container">
				<h1 className="WorkHeader-title">
					{this.props.title}
				</h1>

				<span className="WorkHeader-status">
					{this.props.status}
				</span>
			</header>
		)
	}
})

export default WorkHeader

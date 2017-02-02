import React from 'react'

const T = React.PropTypes

const BatchToolsMenuItem = React.createClass({
	propTypes: {
		name: T.string.isRequired,
		description: T.string,
	},

	render: function () {
		return (
			<div className="BatchToolsMenu-item" onClick={this.props.onSelect}>
				<p><strong className="title">{this.props.name}</strong></p>
				<p className="description">{this.props.description}</p>
			</div>
		)
	}
})

export default BatchToolsMenuItem

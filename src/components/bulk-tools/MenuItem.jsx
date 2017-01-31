import React from 'react'

const BulkToolsMenuItem = React.createClass({
	propTypes: {

	},

	render: function () {
		return (
			<div className="BulkToolsMenu-item" onClick={this.props.onSelect}>
				<p><strong className="title">{this.props.name}</strong></p>
				<p className="description">{this.props.description}</p>
			</div>
		)
	}
})

export default BulkToolsMenuItem

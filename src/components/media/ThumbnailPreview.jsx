import React from 'react'
import Button from '../Button.jsx'

const T = React.PropTypes

const ThumbnailPreview = React.createClass({
	propTypes: {
		src: T.string.isRequired,

		caption: T.string,
		onClick: T.func,
	},

	handleOnClick: function () {
		if (!this.props.onClick)
			return

		return this.props.onClick()
	},

	maybeRenderCaption: function () {
		if (!this.props.caption)
			return

		return (
			<figcaption className="ThumbnailPreview-caption">
				{this.props.caption}
			</figcaption>
		)
	},

	render: function () {
		return(
			<div className="ThumbnailPreview-container">
				<figure className="ThumbnailPreview-figure" >
					<img src={this.props.src} />

					{this.maybeRenderCaption()}
				</figure>
				<Button onClick={this.handleOnClick}>Open Viewer</Button>
			</div>
		)
	}
})

export default ThumbnailPreview

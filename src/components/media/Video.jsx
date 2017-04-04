import React from 'react'

/**
 * Component for HTML5 streaming Video resources
 *
 */
class Video extends React.Component {

	// Constructor for the class
	// @params props
	constructor (props) {
		super(props)
	}

	// Generate the elements for the captions in the video
	// @see (W3C link here)
	captions() {
		if (this.props.captions) {
			const props = this.props.captions
			return (<track {...props} />)
		} else {
			return false
		}
	}

	// Render the <video> element
	// @see (W3C link here)
	render() {
		const props = this.props

		return (
			<video {...props}>
				{
					props.sources.map(source => {
						return <source {...source} />
					})
				}
				{ this.captions() }
			</video>
		)
	}
}

Video.propTypes = {
	options: React.PropTypes.object,
	poster: React.PropTypes.string,
	src: React.PropTypes.string,
	type: React.PropTypes.string.isRequired,
	sources: React.PropTypes.array,
	captions: React.PropTypes.object,
}

Video.defaultProps = {
	sources: []
}

export default Video

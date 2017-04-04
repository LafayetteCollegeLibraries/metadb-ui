import React from 'react'
import plyr from 'plyr'
import Video from './Video.jsx'
import Audio from './Audio.jsx'
import assign from 'object-assign'
/**
 * Component for playing streaming media resources
 *
 */
class MediaPlayer extends React.Component {

	// Constructor for the class
	// @params
	constructor (props) {
		super(props)
		this.state = {
			mediaComponent: null
		}
	}

	// Initialize the global `plyr` Object after the component has been mounted
	componentDidMount () {
		plyr.setup(this.props.options)
	}

	// Render the media element component (if it exists)
	renderMediaElement() {
		const typeSegments = this.props.type.split('/')
		if ( typeSegments.length == 0 )
			throw 'No content type specified for the media player: ' + this.props.type
		const format = typeSegments[0]
		const props = assign({}, {
			type: this.props.type,
			sources: this.props.sources,
			captions: this.props.captions,
			src: this.props.src,
			poster: this.props.poster,
		}, this.props.mediaComponentProps)

		switch(format) {
			case 'video':
				return (<Video {...props} />)
				break
			case 'audio':
				return (<Audio {...props} />)
				break
			default:
				throw 'Unsupported content type specified for the media player: ' + this.props.type
		}
	}

	// Render the container for the elements
	render() {
		return (
			<div>
				{ this.renderMediaElement() }
			</div>
		)
	}
}

MediaPlayer.propTypes = {
	options: React.PropTypes.object,
	poster: React.PropTypes.string,
	src: React.PropTypes.string,
	type: React.PropTypes.string.isRequired,
	mediaComponentProps: React.PropTypes.object
}

export default MediaPlayer

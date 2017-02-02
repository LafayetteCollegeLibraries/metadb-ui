import React, { Component } from 'react'
import plyr from 'plyr'

/**
 * VideoPlayer component is used to load and play videos
 */
class MediaPlayer extends Component {

	constructor (props) {
		super(props)

		this.renderVideo = this.renderVideo.bind(this)
		this.renderAudio = this.renderAudio.bind(this)
	}

	componentDidMount () {
		plyr.setup()
	}

	renderAudio(){
		return (
				<audio {...this.props.config}>
				  <source src={this.props.mediaSrc} />
				</audio>
		)
	}

	renderVideo(){
		return (
				<video poster={this.props.poster} {...this.props.config} >
			    <source src={this.props.mediaSrc} />
			    <track src={this.props.trackSrc} {...this.props.trackConfig} />
			  </video>
		)
	}

	render () {
		return (
			<div style={this.props.styleConfig || {width: '50%'}}>
				{	this.props.video ? this.renderVideo() : ( this.props.audio ? this.renderAudio() : console.log('Specify media component type')) }
			</div>
		)
	}
}


/**
 * video - true if provided media is video
 * audio - true if provided media is audio
 * styleConfig - styles for whole div element
 * poster - image used to display before playing the media
 * config - configuration of media player( check Plyr official documentation)
 * mediaSrc - source of media
 * trackSrc - provide captions
 * trackConfig - configuration for track( check Plyr official documentation)
 */
MediaPlayer.propTypes = {
	video: React.PropTypes.bool,
	audio: React.PropTypes.bool,
	styleConfig: React.PropTypes.any,
	poster: React.PropTypes.string,
	config: React.PropTypes.any,
	mediaSrc: React.PropTypes.string,
	trackSrc: React.PropTypes.string,
	trackConfig: React.PropTypes.any
}

export default MediaPlayer

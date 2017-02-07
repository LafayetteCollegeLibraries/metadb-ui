import React, { Component } from 'react'

/**
 * MediaPlayer component is used to load and play videos
 */
class MediaPlayer extends Component {

	constructor (props) {
		super(props)

		this.renderVideo = this.renderVideo.bind(this)
		this.renderAudio = this.renderAudio.bind(this)
	}

	renderAudio(){
		return (
				<audio {...this.props.config}>
				  <source src={this.props.mediaSrc} />
				</audio>
		)
	}

	renderYoutube(){
		return (
			<div data-type="youtube" data-video-id={this.props.youtubeId}></div>
		)
	}

	renderVimeo(){
		console.log("Foo")
		return (
			<div data-type="vimeo" data-video-id={this.props.vimeoId}></div>
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
		  	{
					this.props.type === "audio"
					? this.renderAudio()
					: this.props.type === "video"
						? this.renderVideo()
						: this.props.type === "youtube"
							? this.renderYoutube()
							: this.props.type === "vimeo"
								? this.renderVimeo()
								:	console.log('Specify media component type')
				}
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
	type: React.PropTypes.string,
	styleConfig: React.PropTypes.any,
	poster: React.PropTypes.string,
	config: React.PropTypes.any,
	mediaSrc: React.PropTypes.string,
	trackSrc: React.PropTypes.string,
	trackConfig: React.PropTypes.any,
	youtubeId: React.PropTypes.string,
	vimeoId: React.PropTypes.string
}

export default MediaPlayer

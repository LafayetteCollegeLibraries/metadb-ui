import React from 'react'

class Audio extends React.Component {

	constructor (props) {
		super(props)
	}

	render() {
		const props = this.props
		return (
			<audio {...props}>
				{
					props.sources.map(source => {
						return <source {...source} />
					})
				}
			</audio>
		)
	}
}

Audio.propTypes = {
	options: React.PropTypes.object,
	poster: React.PropTypes.string,
	src: React.PropTypes.string,
	type: React.PropTypes.string.isRequired,
	sources: React.PropTypes.array,
}

Audio.defaultProps = {
	sources: []
}

export default Audio

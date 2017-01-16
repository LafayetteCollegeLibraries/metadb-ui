import React from 'react'
import ResultsGalleryItem from './ResultsGalleryItem.jsx'

const propTypes = {
	data: React.PropTypes.array,
}

const defaultProps = {
	data: [],
}

class ResultsGallery extends React.Component {
	constructor (props) {
		super(props)
	}

	renderGalleryItem (item, index) {
		return <ResultsGalleryItem data={item} key={index}/>
	}

	render () {
		return (
			<div className="search-results-gallery">
				{this.props.data.map(this.renderGalleryItem)}
			</div>
		)
	}
}

ResultsGallery.propTypes = propTypes
ResultsGallery.defaultProps = defaultProps

export default ResultsGallery

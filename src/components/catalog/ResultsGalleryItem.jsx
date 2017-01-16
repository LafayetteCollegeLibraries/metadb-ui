import React from 'react'
import Link from 'react-router/lib/Link'

const propTypes = {
	data: React.PropTypes.object,
}

const defaultProps = {
	data: {}
}

class ResultsGalleryItem extends React.PureComponent {
	getTitle () {
		const { title } = this.props.data

		if (!title || !title.length)
			return null

		return title[0]
	}

	renderThumbnail () {
		const { thumbnail_path } = this.props.data

		if (!thumbnail_path)
			return null

		const src = `${process.env.API_BASE_URL}${thumbnail_path}`
		const props = {
			className: 'search-results-gallery--thumbnail',
			src,
		}
		return <img {...props} />
	}

	render () {
		const src = process.env.API_BASE_URL + this.props.data.thumbnail_path
		return (
			<figure className="search-results-gallery--item">
				<Link to={`/works/${this.props.data.id}`}>
					{this.renderThumbnail()}
					<figcaption className="search-results-gallery--caption">
						{this.getTitle()}
					</figcaption>
				</Link>
			</figure>
		)
	}
}

ResultsGalleryItem.propTypes = propTypes
ResultsGalleryItem.defaultProps = defaultProps

export default ResultsGalleryItem

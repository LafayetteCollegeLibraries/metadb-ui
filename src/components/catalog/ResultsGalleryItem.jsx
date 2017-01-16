import React from 'react'
import Link from 'react-router/lib/Link'

const T = React.PropTypes

const ResultsGalleryItem = React.createClass({
	propTypes: {
		data: T.object,
	},

	render: function () {
		const src = process.env.API_BASE_URL + this.props.data.thumbnail_path
		return (
			<figure className="search-results-gallery--item">
				<Link to={`/works/${this.props.data.id}`}>
					<img className="search-results-gallery--thumbnail" src={src} />
					<figcaption className="search-results-gallery--caption">
						{this.props.data.title[0]}
					</figcaption>
				</Link>
			</figure>
		)
	}
})

export default ResultsGalleryItem

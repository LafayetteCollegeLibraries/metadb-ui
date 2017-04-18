// renders a list-item element via a Blacklight facet-item
import React from 'react'

const T = React.PropTypes

const FacetListItem = React.createClass({
	propTypes: {
		data: T.shape({
			label: T.string.isRequired,
			value: T.string.isRequired,
			hits: T.number.isRequired,
		}).isRequired,

		onClick: T.func.isRequired,

		hideCount: T.bool,
	},

	getLabelStyle: function () {
		return {
			borderBottom: '1px dotted #aaa',
			cursor: 'pointer',
		}
	},

	maybeRenderHits: function (style) {
		const hits = this.props.data.hits

		if (this.props.hideCount || (typeof hits !== 'number'))
			return

		return (
			<span
				className="facet-count FacetListItem-count"
				style={style}
				>
				{hits}
			</span>
		)
	},

	render: function () {
		const styles = {
			item: {
				margin: '5px 0',
				position: 'relative',
			},
			label: this.getLabelStyle(),
			count: {
				right: '0',
				position: 'absolute',
			},
		}

		return (
			<div className="FacetListItem" style={styles.item}>
				<span
					className="facet-label FacetListItem-label"
					onClick={this.props.onClick.bind(null, this.props.data)}
					style={styles.label}
				>
					{this.props.data.label}
				</span>
				{this.maybeRenderHits(styles.count)}
			</div>
		)
	}
})

export default FacetListItem

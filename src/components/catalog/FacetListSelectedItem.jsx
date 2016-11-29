import React from 'react'
import Button from '../Button.jsx'

const T = React.PropTypes

const FacetListSelectedItem = React.createClass({
	propTypes: {
		data: T.object.isRequired,
		onRemove: T.func.isRequired,

		color: T.string,
	},

	getDefaultProps: function () {
		return {
			color: '#a4b9a4'
		}
	},

	maybeRenderHits: function (props) {
		const hits = this.props.data.hits

		if (this.props.hideCount || (typeof hits !== 'number'))
			return

		return React.createElement('span', props, hits)
	},

	render: function () {
		const styles = {
			item: {
				color: this.props.color,
				margin: '5px 0',
				position: 'relative',
			},

			count: {
				right: '0',
				position: 'absolute',
			}
		}

		return (
			<div style={styles.item}>
				{this.props.data.label}
				<Button
					children="x"
					onClick={this.props.onRemove.bind(null, this.props.data)}
					type="text"
					/>

				{this.maybeRenderHits({style: styles.count})}
			</div>
		)
	}
})

export default FacetListSelectedItem

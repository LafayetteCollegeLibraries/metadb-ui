import React from 'react'

const T = React.PropTypes

const SearchBreadcrumb = React.createClass({
	propTypes: {
		onRemove: T.func.isRequired,
		facet: T.object,
		item: T.oneOfType([T.object, T.string]),
	},

	getInitialState: function () {
		return {
			buttonHover: false,
		}
	},

	handleButtonClick: function (ev) {
		ev && ev.preventDefault && ev.preventDefault()
		this.props.onRemove(this.props.facet, this.props.item)
	},

	maybeRenderFacet: function (style) {
		if (this.props.facet !== undefined)
			return (
				<span className="SearchBreadcrumb-facet" style={style}>
					{this.props.facet.label + ' > '}
				</span>
			)
	},

	render: function () {
		const btnHover = this.state.buttonHover

		const borderRadiusVal = 10
		const btnHoverColor = '#cc092f'
		const borderColor = '#ccc'

		const styles = {
			container: {
				backgroundColor: '#fff',
				borderColor: (btnHover ? '#cc092f' : '#ccc'),
				borderStyle: 'solid',
				borderWidth: '1px',
				borderRadius: borderRadiusVal + 'px',
				display: 'inline-block',
				fontSize: '.9em',
				margin: '5px 10px',
				padding: '6px 8px',
				paddingRight: '35px',
				position: 'relative',
			},

			facet: {
				color: '#999',
			},

			value: {
				fontWeight: 'bold',
			},

			closeBtn: {
				appearance: 'none',
				backgroundColor: (btnHover ? btnHoverColor : '#fff'),
				border: (btnHover ? '1px solid ' + btnHoverColor : 'none'),
				borderLeft: (btnHover ? 'inherit' : '1px solid #ccc'),
				borderBottomRightRadius: (borderRadiusVal - 1) + 'px',
				borderTopRightRadius: (borderRadiusVal - 1) + 'px',
				color: (btnHover ? '#fff' : '#222'),
				cursor: 'pointer',
				fontWeight: 'bold',
				height: '100%',
				margin: '0',
				outline: 'none',
				position: 'absolute',
				right: '0',
				top: '0',
				WebkitAppearance: 'none',
				width: '25px',
			},
		}

		return (
			<div
				className="SearchBreadcrumb"
				style={styles.container}
				>
				{this.maybeRenderFacet(styles.facet)}

				<span className="SearchBreadcrumb-value" style={styles.value}>
					{this.props.item.label || this.props.item.value || this.props.item}
				</span>

				<button
					children="X"
					className="SearchBreadcrumb-remove"
					onClick={this.handleButtonClick}
					onMouseOut={() => this.setState({buttonHover: false})}
					onMouseOver={() => this.setState({buttonHover: true})}
					style={styles.closeBtn}
				/>
			</div>
		)
	}
})

export default SearchBreadcrumb

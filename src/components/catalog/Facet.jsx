/**
 *  <Facet /> is used within a <FacetGroup /> component to organize groups of
 *  facet options. Each of these components maps to a key within the `facets`
 *  object returned via the Blacklight JSON api. 
 */

import React from 'react'
import assign from 'object-assign'

const T = React.PropTypes

const Facet = React.createClass({
	propTypes: {
		// an array of facet items provided from Blacklight. 
		items: T.arrayOf(T.shape({
			name: T.string,
			hits: T.number,
			value: T.any,
		})), //.isRequired,

		// the name of the facet that relates to the key within the `facets` object
		// provided by Blacklight. 
		name: T.string, //.isRequired,

		// triggered when a `selectedFacet`s `X` button is clicked.
		// (passed to panel-body `SelectedFacetsList` component)
		// @param object  the facet being removed
		onRemoveSelectedFacet: T.func, //.isRequired,

		// triggered when a facet is selected (passed to panel-body)
		// @param object  the facet being selected
		onSelectFacet: T.func, //.isRequired,

		// React Component used to render the facet body when opened. Not _technically_
		// required, but <Facet/> will bail early if no component is provided.
		// Props passed to <Facet/> are passed downstream to `bodyComponent`.
		bodyComponent: T.func,

		// The display label to use on the facet header
		// (defaults to the `name` property which is required)
		label: T.string,

		// whether or not the panel-body is visible. this is handled in state
		// but this allows us to have a panel open initially
		// (default: `false`)
		open: T.bool,

		// array of facet options selected for the group
		// (default: `[]`)
		selectedFacets: T.array,

		// whether or not to display an angled line ('arrow' w/o a stem) as visual
		// feedback on the facet-header
		// (default: `true`)
		showHeaderArrow: T.bool,

		// styles used for the facet wrapper
		styles: T.shape({
			default: T.shape({
				panel: T.object,
				header: T.object,
			}),
			hasSelectedFacets: T.shape({
				panel: T.object,
				header: T.object,
			}),
		}),
	},

	getDefaultProps: function () {
		const panelColor = '#dddddd'
		const selectedColor = '#d8ecd8'
		const textColor = '#1e1e1e'

		return {
			bodyComponent: null,
			open: false,
			selectedFacets: [],
			showHeaderArrow: true,
			sort: 'desc',

			styles: {
				default: {
					panel: {
						borderColor: panelColor,
						borderRadius: '2px',
						borderStyle: 'solid',
						borderWidth: '1px',
						color: textColor,
						margin: '5px 0',
					},

					header: {
						backgroundColor: panelColor,
						cursor: 'pointer',
						padding: '5px',
					},
				},
				hasSelectedFacets: {
					panel: {
						borderColor: selectedColor,
						color: textColor,
					},

					header: {
						backgroundColor: selectedColor,
						color: textColor,
					}
				},
			}
		}
	},

	getInitialState: function () {
		return {
			open: this.props.open,
		}
	},

	maybeRenderHeaderArrow: function () {
		if (!this.props.showHeaderArrow)
			return

		const hasSel = this.props.selectedFacets.length > 0

		let stroke = hasSel 
		? this.props.styles.hasSelectedFacets.color 
		: this.props.styles.default.color

		if (!stroke)
			stroke = '#1e1e1e'

		// remember to convert the hash for hex colors! (%23)
		stroke = stroke.replace(/^#/, '%23')

		const transformDeg = this.state.open ? 90 : 0
		const arrowSvg = [
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">',
			'<path d="M2,1L8,5L2,9" stroke="'+stroke+'" stroke-width="2" fill="transparent" />',
		'</svg>'].join('')

		const props = {
			key: 'dss-fp-header-arrow',
			style: {
				backgroundImage: "url('data:image/svg+xml;utf8," + arrowSvg + "')",
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'center center',
				display: 'inline-block',
				float: 'right',
				height: '15px',
				marginLeft: '15px',
				marginTop: '2px',
				transform: 'rotate(' + transformDeg + 'deg)',
				verticalAlign: 'middle',
				width: '20px',
			}
		}

		return React.createElement('span', props)
	},

	renderFacetBody: function () {
		if (!this.state.open || !this.props.bodyComponent)
			return

		return React.createElement(
			'div',
			{
				className: 'facet-panel--body',
				style: {padding: '5px'}
			},
			React.createElement(this.props.bodyComponent, this.props)
		)
	},

	render: function () {
		// skip if there's nothing to display
		if (!this.props.items.length)
			return null

		const defaultPanel = this.props.styles.default.panel
		const defaultHeader = this.props.styles.default.header
		const selPanel = this.props.styles.hasSelectedFacets.panel
		const selHeader = this.props.styles.hasSelectedFacets.panel
		const hasSel = this.props.selectedFacets.length > 0

		const panelStyles = assign({}, defaultPanel, (hasSel ? selPanel : null))
		const headerStyles = assign({}, defaultHeader, (hasSel ? selHeader : null))

		const headerLabel = {
			margin: '0',
			padding: '0',
			verticalAlign: 'middle',
		}

		return (
			<div className="facet-panel" style={panelStyles}>
				<header onClick={ev => this.setState({open: !this.state.open})} style={headerStyles}>
					<h3 className="panel-title" style={headerLabel}>
						{this.props.label}
						{this.maybeRenderHeaderArrow()}
					</h3>
				</header>

				{this.renderFacetBody()}
			</div>
		)
	}
})

export default Facet

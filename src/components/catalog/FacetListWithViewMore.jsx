import React from 'react'
import assign from 'object-assign'
import ModalWithHeader from '../ModalWithHeader.jsx'
import FacetList from './FacetList.jsx'

const T = React.PropTypes

const FacetListWithViewMore = React.createClass({
	propTypes: {
		label: T.string.isRequired,
		name: T.string.isRequired,
		items: T.array.isRequired,

		onRemoveSelectedFacet: T.func.isRequired,
		onSelectFacet: T.func.isRequired,
		selectedFacets: T.array.isRequired,

		limit: T.number,

		// determines whether or not the View More modal is open on mount.
		// this is mostly as a means to test the modal w/o having to trigger
		// it on each test.
		// (default: `false`)
		modalOpen: T.bool,

		// text used for `View more...` link/span that will trigger modal open.
		viewMoreText: T.string,
	},

	getDefaultProps: function () {
		return {
			limit: 5,
			modalOpen: false,
			viewMoreText: 'View more...',
		}
	},

	getInitialState: function () {
		return {
			modalOpen: this.props.modalOpen,
		}
	},

	getFacetListProps: function (xtend) {
		return assign({}, {
			className: 'facet-list',
			items: this.props.items,
			label: this.props.label,
			name: this.props.name,
			onRemoveSelectedFacet: this.handleRemoveSelectedFacet,
			onSelectFacet: this.handleSelectFacet,
			selectedFacets: this.props.selectedFacets,
		}, xtend)
	},

	handleRemoveSelectedFacet: function () {
		if (this.state.modalOpen)
			this.setState({modalOpen: false})

		this.props.onRemoveSelectedFacet.apply(null, arguments)
	},

	handleSelectFacet: function () {
		if (this.state.modalOpen)
			this.setState({modalOpen: false})

		this.props.onSelectFacet.apply(null, arguments)
	},

	maybeRenderModal: function () {
		if (!this.state.modalOpen)
			return

		const label = this.props.label
		const props = {
			contentLabel: `Viewing all facets for ${label}`,
			isOpen: this.state.modalOpen,
			header: function (modal) {
				return (
					<header {...modal.getHeaderProps()}>
						Viewing all for <strong>{label}</strong>
					</header>
				)
			},
			key: 'dss-flwvm-modal',
			onRequestClose: this.toggleModal,
			style: {
				content: {
					bottom: '33%',
					left: '33%',
					right: '33%',
					top: '10%',
				}
			}
		}

		return (
			<ModalWithHeader {...props}>
				<FacetList {...this.getFacetListProps()} />
			</ModalWithHeader>
		)
	},

	renderLimitedFacetList: function () {
		const els = []

		const limit = this.props.limit
		const flProps = this.getFacetListProps({
			items: this.props.items.slice(0, limit),
			key: 'dss-fpwvm-limited-list',
		})

		const LimitedList = React.createElement(FacetList, flProps)

		// no need to add a `view more` link if there aren't more to view
		if (this.props.items.length <= limit)
			return LimitedList

		const ViewMoreLink = React.createElement('span', {
			className: 'view-more',
			key: 'dss-fpwvm-view-more',
			onClick: this.toggleModal,
			style: {
				borderBottom: '1px dotted #aaa',
				cursor: 'pointer',
				display: 'inline-block',
				fontWeight: 'bold',
				marginTop: '10px',
			}
		}, this.props.viewMoreText)

		return [LimitedList, ViewMoreLink]
	},

	toggleModal: function () {
		this.setState({modalOpen: !this.state.modalOpen})
	},

	render: function () {
		const styles = {
			list: {
				listStyleType: 'none',
				margin: '0',
				padding: '0',
			}
		}

		return (
			<div>
				{this.renderLimitedFacetList()}
				{this.maybeRenderModal()}
			</div>
		)
	}
})

export default FacetListWithViewMore

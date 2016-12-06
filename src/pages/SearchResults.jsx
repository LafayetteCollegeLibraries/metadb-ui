import React from 'react'
import Modal from 'react-modal'
import assign from 'object-assign'
import Button from '../components/Button.jsx'
import SearchFacetSidebar from '../components/catalog/SearchFacetSidebar.jsx'
import Facet from '../components/catalog/Facet.jsx'
import FacetList from '../components/catalog/FacetList.jsx'
import FacetListWithViewMore from '../components/catalog/FacetListWithViewMore.jsx'
import FacetRangeLimitDate from '../components/catalog/FacetRangeLimitDate.jsx'

import SearchBreadcrumb from '../components/catalog/SearchBreadcrumb.jsx'
import SearchBreadcrumbTrail from '../components/catalog/SearchBreadcrumbTrail.jsx'
import SearchResultsHeader from '../components/catalog/SearchResultsHeader.jsx'

import ResultsContainer from '../components/catalog/ResultsContainer.jsx'
import ResultsListItem from '../components/catalog/ResultsListItem.jsx'
import ResultsGalleryItem from '../components/catalog/ResultsGalleryItem.jsx'

import { getBreadcrumbList } from '../../lib/facet-helpers'

const SearchResults = React.createClass({
	componentWillMount: function () {
		const qs = this.props.location.search

		if (qs)
			this.props.searchCatalogByQueryString(qs).then(this.handleSearchResponse)
	},

	getInitialState: function () {
		return {
			resultsView: 'list',
		}
	},

	clearSelectedFacets: function (ev) {
		const query = this.props.search.query
		const options = this.props.search.options

		this.props.searchCatalog(query, {}, this.props.search.options)
		.then(this.handleSearchResponse)
	},

	determineResultsComponent: function (which) {
		switch (which) {
			case 'gallery':
				return ResultsGalleryItem

			case 'list':
			default:
				return ResultsListItem
		}
	},

	getResultsComponentStyle: function (which) {
		switch (which) {
			case 'gallery':
				return {
					alignItems: 'center',
					display: 'flex',
					flexWrap: 'wrap',
				}

			case 'list':
			default:
				return {}
		}
	},

	getFacetGroupInfo: function (pool, name) {
		for (let i = 0; i < pool.length; i++)
			if (pool[i].name === name)
				return {
					name: pool[i].name,
					label: pool[i].label
				}

		return null
	},

	handleNextPage: function () {
		const pages = this.state.pages

		if (!pages.next_page)
			return

		this.props.setSearchOption('page', pages.next_page).then(this.handleSearchResponse)
	},

	handlePerPageChange: function (val) {
		this.props.setSearchOption('per_page', val).then(this.handleSearchResponse)
	},

	handlePreviousPage: function () {
		const pages = this.state.pages

		if (!pages.prev_page)
			return

		const prev = pages.prev_page === 1 ? null : pages.prev_page

		this.props.setSearchOption('page', prev).then(this.handleSearchResponse)
	},

	handleSearchResponse: function (res) {
		if (!res) {
			console.log('no res!')
			return
		}

		const facets = res.response.facets
		const breadcrumbs = getBreadcrumbList(facets, this.props.search.facets)

		this.setState({
			results: res.response.docs,
			options: this.props.search.options,
			pages: res.response.pages,
			facets,
			breadcrumbs,
		})
	},

	handleSubmitSearchQuery: function (query) {
		const { facets, options } = this.props.search

		this.props.searchCatalog(query, facets, options)
		.then(this.handleSearchResponse)
	},

	maybeRenderLoadingModal: function () {
		const open = this.props.search.isSearching ? true : false

		const styles = {
			overlay: {
				backgroundColor: 'rgba(0, 0, 0, .5)',
			},
			content: {
				bottom: '75%',
				left: '25%',
				right: '25%',
				top: '15%',
			},
			header: {
				margin: '0',
			}
		}

		return (
			<Modal isOpen={open} style={styles}>
				<h1 style={styles.header}>Searching... </h1>
			</Modal>
		)
	},

	onRemoveFacet: function (key, facet) {
		return this._onToggleFacet(false, key, facet)
	},

	onSelectFacet: function (key, facet) {
		return this._onToggleFacet(true, key, facet)
	},

	_onToggleFacet: function (which, key, facet) {
		return this.props.toggleSearchFacet(key, facet, which)
		.then(this.handleSearchResponse)
		.catch(console.warn)
	},

	renderBreadcrumbs: function () {
		const bc = this.state.breadcrumbs

		if (!bc)
			return

		const query = this.props.search.query

		const querybc = !query ? null : (
			<SearchBreadcrumb
				key="bc-query"
				onRemove={this.handleSubmitSearchQuery}
				value={'"' + query + '"'}
			/>
		)

		const crumbs = bc.map((crumb, index) => {
			const {label, name} = crumb.group
			const facet = crumb.facet

			const props = {
				key: 'bc' + index + facet.value,
				group: label,
				value: facet.label,
				onRemove: this.onRemoveFacet.bind(null, name, facet)
			}

			return React.createElement(SearchBreadcrumb, props)
		})

		const style = {
			marginBottom: '10px',
			marginTop: '-5px',
		}

		return (
			<div key="bc-trail" style={style}>
				{[].concat(querybc, crumbs)}
			</div>
		)
	},

	renderFacetSidebar: function () {
		if (!this.state.facets || !this.state.facets.length)
			return

		const sidebarProps = {
			data: this.state.facets,

			// play it safe and default to <FacetListWithViewMore/>...
			defaultBodyComponent: FacetListWithViewMore,

			// ... + since we're just passing props down from <FacetGroup/>
			// we can pass a `limit` that will be used via the default components
			limit: 6,

			query: this.props.search.query,
			selectedFacets: this.props.search.facets,

			// event handlers
			onClearSelectedFacets:this.clearSelectedFacets,
			onRemoveSelectedFacet: this.onRemoveFacet,
			onSelectFacet: this.onSelectFacet,
			onSubmitSearchQuery: this.handleSubmitSearchQuery,
		}

		const rangeLimitProps = {
			bodyComponent: FacetRangeLimitDate,
			interval: 'year',
		}

		return (
			<SearchFacetSidebar {...sidebarProps}>
				<Facet name="human_readable_type_sim" />
				<Facet name="creator_sim" />
				<Facet name="keyword_sim" />
				<Facet name="subject_sim" />
				<Facet name="language_sim" />
				<Facet name="creator_photographer_sim"
					label="Photographer"
					bodyComponent={FacetList}
					/>
				<Facet name="date_original_dtsi"
					label="Date (Original)"
					{...rangeLimitProps}
					/>
				<Facet name="date_artifact_upper_dtsi"
					label="Date (Artifact, Upper)"
					{...rangeLimitProps}
					/>
				<Facet name="date_artifact_lower_dtsi"
					label="Date (Artifact, Lower)"
					{...rangeLimitProps}
					/>
			</SearchFacetSidebar>
		)
	},

	renderResultsHeader: function () {
		if (!this.state.pages)
			return

		const props = {
			pageData: this.state.pages,
			onNextPage: this.handleNextPage,
			onPreviousPage: this.handlePreviousPage,
			onOpenToolModal: console.log,
			onPerPageChange: this.handlePerPageChange,
			onViewChange: this.toggleResultsView,
			perPage: this.props.search.options.per_page,
			view: this.state.resultsView,
			viewOptions: ['list', 'gallery'],
		}

		return React.createElement(SearchResultsHeader, props)
	},

	renderResults: function () {
		if (!this.state.results)
			return

		const which = this.state.resultsView

		const props = {
			data: this.state.results,
			displayComponent: this.determineResultsComponent(which),
			offset: this.state.pages.offset_value,
			containerProps: {
				style: this.getResultsComponentStyle(which),
			}
		}

		return <ResultsContainer {...props} />
	},

	toggleResultsView: function (val) {
		this.setState({resultsView: val})
	},

	render: function () {
		if (this.props.search.isSearching) {
			return this.maybeRenderLoadingModal()
		}

		const styles = {
			container: {
				// backgroundColor: '#fafafa',
			},

			sidebar: {
				container: {
					display: 'inline-block',
					verticalAlign: 'top',
					width: '22.5%',
				}
			},
			results: {
				container: {
					display: 'inline-block',
					padding: '5px',
					verticalAlign: 'top',
					width: '77.5%',
				}
			}
		}

		return (
			<div style={styles.container}>
				{this.maybeRenderLoadingModal()}

				<section key="sidebar" style={styles.sidebar.container}>
					{this.renderFacetSidebar()}
				</section>

				<section key="results" style={styles.results.container}>
					{this.renderBreadcrumbs()}
					{this.renderResultsHeader()}

					{this.renderResults()}
				</section>
			</div>
		)
	}
})

export default SearchResults

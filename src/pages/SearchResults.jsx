import React from 'react'
import Modal from 'react-modal'
import InfiniteScroll from 'react-infinite-scroller'

import SearchFacetSidebar from '../components/catalog/SearchFacetSidebar.jsx'
import Facet from '../components/catalog/Facet.jsx'
import FacetListWithViewMore from '../components/catalog/FacetListWithViewMore.jsx'
import FacetRangeLimitDate from '../components/catalog/FacetRangeLimitDate.jsx'

import SearchBreadcrumbTrail from '../components/catalog/SearchBreadcrumbTrail.jsx'
import SearchResultsHeader from '../components/catalog/SearchResultsHeader.jsx'

import ResultsGallery from '../components/catalog/ResultsGallery.jsx'
import ResultsTable from '../components/catalog/ResultsTable.jsx'

import { display as searchResultsDisplay } from '../../lib/search-result-settings'

import AddMetadataModal from '../components/batch-tools/AddMetadataModal.jsx'
import NoResultsFound from './NoResultsFound.jsx'

export default class SearchResults extends React.PureComponent {
	constructor (props) {
		super(props)

		this.maybeCloseModalOnPopState = this.maybeCloseModalOnPopState.bind(this)
		this.clearSelectedFacets = this.clearSelectedFacets.bind(this)
		this.handleCloseBatchTool = this.handleCloseBatchTool.bind(this)
		this.handleOpenBatchTool = this.handleOpenBatchTool.bind(this)
		this.handleSubmitSearchQuery = this.handleSubmitSearchQuery.bind(this)
		this.maybeRenderBatchTool = this.maybeRenderBatchTool.bind(this)
		this.maybeRenderLoadingModal = this.maybeRenderLoadingModal.bind(this)
		this.onRemoveFacet = this.onRemoveFacet.bind(this)
		this.onSelectFacet = this.onSelectFacet.bind(this)
		this.renderBreadcrumbs = this.renderBreadcrumbs.bind(this)
		this.renderFacetSidebar = this.renderFacetSidebar.bind(this)
		this.renderResultsHeader = this.renderResultsHeader.bind(this)
		this.renderResults = this.renderResults.bind(this)
		this.toggleView = this.toggleView.bind(this)

		this.state = {
			batchTool: null,
			resultsView: searchResultsDisplay.get() || 'table'
		}
	}

	componentWillMount () {
		const qs = this.props.location.search

		if (qs && this.props.searchResults.docs === undefined) {
			this.props.searchCatalogByQueryString(qs.substr(1))
		}

		window.addEventListener('popstate', this.maybeCloseModalOnPopState)
	}

	componentWillUnmount () {
		window.removeEventListener('popstate', this.maybeCloseModalOnPopState)
	}

	maybeCloseModalOnPopState () {
		if (this.state.batchTool !== null) {
			this.setState({batchTool: null})
		}
	}

	componentWillReceiveProps (/* nextProps */) {
		// compare the queryString in the browser to the previously-searched
		// one. if it differs, submit the new search. this allows the search
		// to be updated when the user uses the back/forward buttons in the
		// browser in addition to selecting facets/options
		const queryString = window.location.search
		const previousQueryString = this.props.search.queryString

		// checking that `previousQueryString` is defined prevents this
		// from being run on mount (when `queryString` will always not
		// equal `undefined`).
		if (previousQueryString && queryString !== previousQueryString)
			return this.props.searchCatalogByQueryString(queryString)
	}

	clearSelectedFacets (/* ev */) {
		const query = this.props.search.query
		const options = this.props.search.options

		this.props.searchCatalog(query, {}, options)
	}

	determineResultsComponent (which) {
		switch (which) {
			case 'gallery':
				return ResultsGallery

			case 'table':
			default:
				return ResultsTable
		}
	}

	handleCloseBatchTool (changes) {
		if (changes)
			this.props.batchUpdateWorks(changes)

		this.setState({batchTool: null})
	}

	handleOpenBatchTool (batchTool) {
		this.setState({batchTool})
	}

	handleSubmitSearchQuery (query) {
		// restart search w/ query (reset facets)
		this.props.searchCatalog(query)
	}

	maybeRenderBatchTool () {
		if (!this.state.batchTool)
			return null

		const Component = this.state.batchTool.component
		const data = this.props.searchResults || {}

		return (
			<Component
				data={data}
				onClose={this.handleCloseBatchTool}
			/>
		)
	}

	maybeRenderLoadingModal () {
		const { meta } = this.props.search

		if (typeof meta === undefined || typeof meta.isSearching === undefined) {
			return null
		}

		const props = {
			isOpen: meta.isSearching,
			contentLabel: 'Loading',
			style: {
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
				},
			},
		}

		const h1props = {
			style: {
				margin: '0',
			}
		}

		return (
			<Modal {...props}>
				<h1 {...h1props}>Searching... </h1>
			</Modal>
		)
	}

	onRemoveFacet (key, facet) {
		return this.props.toggleSearchFacet(key, facet, false)
	}

	onSelectFacet (key, facet) {
		return this.props.toggleSearchFacet(key, facet, true)
	}

	renderBreadcrumbs () {
		if (!this.props.search.breadcrumbs)
			return null

		const onRemoveBreadcrumb = (key, value) => {
			if (key === 'q')
				return this.handleSubmitSearchQuery('')

			return this.onRemoveFacet(key, value)
		}

		const props = {
			breadcrumbs: this.props.search.breadcrumbs,
			onRemoveBreadcrumb,
			query: this.props.search.query,
		}

		return <SearchBreadcrumbTrail {...props} />
	}

	renderFacetSidebar () {
		const facets = this.props.searchResults.facets || []

		if (!facets || !facets.length)
			return

		const sidebarProps = {
			data: facets,

			// play it safe and default to <FacetListWithViewMore/>...
			defaultBodyComponent: FacetListWithViewMore,

			// ... + since we're just passing props down from <FacetGroup/>
			// we can pass a `limit` that will be used via the default components
			limit: 6,

			query: this.props.search.query,
			selectedFacets: this.props.search.facets || {},

			// event handlers
			onClearSelectedFacets:this.clearSelectedFacets,
			onRemoveSelectedFacet: this.onRemoveFacet,
			onSelectFacet: this.onSelectFacet,
			onSubmitSearchQuery: this.handleSubmitSearchQuery,
		}

		const rangeLimitProps = {
			bodyComponent: FacetRangeLimitDate,
			interval: 'day',
		}

		return (
			<SearchFacetSidebar {...sidebarProps}>
				<Facet name="human_readable_type_sim" />
				<Facet name="creator_sim" />
				<Facet name="keyword_sim" />
				<Facet name="subject_sim" />
				<Facet name="subject_ocm_sim" />
				<Facet name="language_sim" />
				<Facet name="creator_photographer_sim"
					label="Photographer"
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
	}

	renderResultsHeader () {
		const props = {
			batchTools: [
				{
					name: 'Batch apply metadata',
					description: 'Apply metadata to all items in current search',
					component: AddMetadataModal,
				}
			],
			onOpenBatchTool: this.handleOpenBatchTool,
			onViewChange: this.toggleView,
			view: this.state.resultsView,
			viewOptions: ['table', 'gallery'],
		}

		return React.createElement(SearchResultsHeader, props)
	}

	renderResults () {
		const { searchResults, search } = this.props
		const { docs } = searchResults

		if (docs === undefined || searchResults.meta === undefined)
			return

		const { atEnd, isSearching } = search.meta
		const hasMore = !(atEnd || isSearching)

		const props = {
			hasMore,
			loadMore: this.props.getResultsAtPage,
			pageStart: 1,
			threshold: 50
		}

		const which = this.state.resultsView
		const Component = this.determineResultsComponent(which)

		return (
			<InfiniteScroll {...props}>
				<Component data={docs} />
			</InfiniteScroll>
		)
	}

	toggleView (view) {
		searchResultsDisplay.set(view)
		this.setState({resultsView: view})
	}

	render () {
		const { isSearching } = this.props.search.meta
		const { docs } = this.props.searchResults

		if (!isSearching && docs && docs.length === 0) {
			return <NoResultsFound query={this.props.search.query} />
		}

		const styles = {
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
			<div>
				{this.maybeRenderLoadingModal()}
				{this.maybeRenderBatchTool()}

				<section key="sidebar" style={styles.sidebar.container}>
					{this.renderFacetSidebar()}
				</section>

				<section key="results" style={styles.results.container}>
					{this.renderBreadcrumbs()}
					{this.renderResultsHeader()}

					{this.maybeRenderLoadingModal()}
					{this.renderResults()}
				</section>
			</div>
		)
	}
}

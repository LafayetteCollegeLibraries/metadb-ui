import React from 'react'
import withRouter from 'react-router/lib/withRouter'

import { StickyContainer, Sticky } from 'react-sticky'
import cn from 'classnames'

import ThumbnailPreview from '../components/media/ThumbnailPreview.jsx'
import OpenSeadragonViewer from '../components/media/OpenSeadragonViewer.jsx'
import NavToSearchResults from '../components/NavToSearchResults.jsx'
import WorkHeader from '../components/work/Header.jsx'
import WorkEdit from '../components/work/Edit.jsx'

import getWorkTitle from '../../lib/get-work-title'

const Work = React.createClass({
	componentDidMount: function () {
		const id = this.props.params.workId

		if (!id) {
			// handle no id
		}

		this.props.fetchWork(id)
		this.props.router.setRouteLeaveHook(this.props.route, this.onExit)
	},

	onExit: function (/* nextLocation */) {
		if (this.state.hasChanges) {
			return 'Any unsaved changes will be lost. Are you sure?'
		}
	},

	getInitialState: function () {
		return {
			hasFirstSave: false,
			mediaIsStuck: false,
			mediaOpen: false,
		}
	},

	adjustSections: function () {
		this.setState({mediaOpen: !this.state.mediaOpen})
		this.forceUpdate()
	},

	getHeaderStatus: function () {
		const { isFetching, isSaving, data } = this.props.work
		const { hasFirstSave } = this.state

		if (isFetching)
			return

		if (isSaving)
			return 'Saving...'

		if (hasFirstSave) {
			const dateString = data.last_modified
			const date = new Date(Date.parse(dateString))

			// TODO: better date formatting
			return `Last updated: ${date.toDateString()}`
		}

		return 'All changes saved'
	},

	handleUpdateWork: function (changes) {
		const id = this.props.params.workId

		// TODO: better handling for this case
		if (!id)
			throw Error ('No work ID provided')

		return this.props.saveWork(id, changes)
	},

	maybeRenderNavToSearchResults: function () {
		if (!Object.keys(this.props.search).length)
			return null

		return <NavToSearchResults />
	},

	renderHeader: function () {
		const { isFetching, data } = this.props.work
		const title = isFetching ? 'fetching...' : getWorkTitle(data)

		const props = {
			status: this.getHeaderStatus(),
			title,
		}

		return <WorkHeader {...props} />
	},

	renderMediaPreview: function () {
		const { work } = this.props
		const data = work.data

		if (!work || !data)
			return

		if (work.isFetching || !Object.keys(data).length)
			return

		if (!data.thumbnail_path)
			return

		if (this.state.mediaOpen) {
			return (
				<OpenSeadragonViewer
					prefixUrl='http://openseadragon.github.io/openseadragon/images/'
					tileSources={data.iiif_images}
					sequenceMode={data.iiif_images.length > 1}
					showReferenceStrip={data.iiif_images.length > 1}
					referenceStripScroll='vertical'
					showNavigator={true}
					onClose={this.adjustSections}
			  />
			 )
		}

		const props = {
			onClick: this.adjustSections,
			src: data.thumbnail_path,
		}

		return <ThumbnailPreview {...props} />
	},

	render: function () {
		const { work } = this.props

		if (work.error && work.error.code === 404) {
			return <WorkNotFound {...this.props} />
		}

		if (work.isFetching) {
			return (
				<div>{this.renderHeader()}</div>
			)
		}

		const { mediaOpen } = this.state

		const workViewContainerProps = {
			className: cn('Work-sub-container', {
				'Work-view-container': true,
				'is-open': mediaOpen,
				'StickyContainer': true,
			}),

			style: {
				width: mediaOpen ? '66%' : '33%',
			}
		}

		const workEditContainerProps = {
			className: cn('Work-sub-container', {
				'Work-edit-container': true,
			}),

			style: {
				width: mediaOpen ? '33%' : '66%',
			}
		}

		const workEditProps = {
			autosave: true,
			data: work.data || {},
			updateWork: this.handleUpdateWork,
		}

		const stickyWorkViewProps = {
		}

		return (
			<StickyContainer className="Work-container StickyContainer">
				{this.maybeRenderNavToSearchResults()}

				<Sticky stickyStyle={{width: '100%'}} className="Work-sticky-header">
					{this.renderHeader()}
				</Sticky>

				<div className="Work-content">
					<StickyContainer {...workViewContainerProps}>
						<Sticky {...stickyWorkViewProps}>
							{this.renderMediaPreview()}
						</Sticky>
					</StickyContainer>

					<div {...workEditContainerProps}>
						<WorkEdit {...workEditProps} />
					</div>
				</div>
			</StickyContainer>
		)
	}
})

// wrap Work component with `withRouter` to allow access to `setRouteLeaveHook`
export default withRouter(Work)

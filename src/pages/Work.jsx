import React from 'react'
import withRouter from 'react-router/lib/withRouter'
import assign from 'object-assign'
import scrollToTop from '../../lib/scroll-to-top'
import browserHistory from 'react-router/lib/browserHistory'
import Button from '../components/Button.jsx'

// import WorkMetadataForm from '../components/WorkMetadataForm.jsx'
import GenericWork from '../components/schema/GenericWork.jsx'
import ThumbnailPreview from '../components/media/ThumbnailPreview.jsx'
import OpenSeadragonViewer from '../components/media/OpenSeadragonViewer.jsx'
import PDFViewer from '../components/media/PDFViewer.jsx'

import isWorkUpdated from '../../lib/is-work-updated'

import WorkNotFound from './WorkNotFound.jsx'

const Work = React.createClass({
	componentDidMount: function () {
		const id = this.props.params.workId

		if (!id) {
			// handle no id
		}

		this.props.fetchWork(id)
		this.props.router.setRouteLeaveHook(this.props.route, this.onExit)
	},

	onExit: function (nextLocation) {
		if (this.state.hasChanges)
			return 'Any unsaved changes will be lost. Are you sure?'
	},

	componentWillReceiveProps: function (nextProps) {
		if (!this.state.data && nextProps.work.data) {
			return this.setState({data: nextProps.work.data})
		}

		if (!nextProps.work.isSaving) {
			const prev = this.props.work.data
			const next = nextProps.work.data

			const isUpdated = isWorkUpdated(prev, next)

			if (isUpdated) {
				this.setState({
					hasChanges: false,
					updates: {},
				})
			}
		}
	},

	getInitialState: function () {
		return {
			hasChanges: false,
			mediaOpen: false,
			updates: {},
		}
	},

	adjustSections: function (ev) {
		this.setState({mediaOpen: !this.state.mediaOpen})
	},

	handleFormSubmit: function () {
		this.props.saveWork(this.props.params.workId, this.state.updates)

		scrollToTop()
	},

	hasChanges: function (updates) {
		const updateKeys = Object.keys(updates)
		const original = this.props.work.data

		if (!updateKeys.length || !original)
			return false

		return isWorkUpdated(original, updates)
	},

	maybeRenderNavToSearchResults: function () {
		if (!Object.keys(this.props.search).length)
			return

		return (
			<nav>
				<Button
					onClick={() => browserHistory.goBack()}
					size="large"
					type="text"
					>
					&lt; Return to results
				</Button>
			</nav>
		)
	},

	mediaPreview: function () {
		const work = this.props.work
		const data = work.data

		if (!work || !data)
			return

		if (work.isFetching || !Object.keys(data).length)
			return

		if (!data.thumbnail_path)
			return

		return (
			<ThumbnailPreview
				onClick={this.adjustSections}
				src={data.thumbnail_path}
			/>
		)
	},

	mediaPreviewSide: function () {
		// open pdf js viewer only when the work is pdf type
		const fileIsPDF = true; // Find if file is pdf, ....

		if (this.state.mediaOpen) {
			return fileIsPDF ? this.pdfjsViewer() : this.openSeadragonViewer()
		}

		return this.mediaPreview()
	},

	onAddField: function (name) {
		const updates = assign({}, this.state.updates)
		const original = this.props.work.data

		if (!updates[name])
			updates[name] = [].concat(original[name])

		updates[name].push('')

		this.setState({updates})
	},

	onChange: function (name, index, value) {
		const updates = assign({}, this.state.updates)
		const original = this.props.work.data

		if (!updates[name])
			updates[name] = [].concat(original[name])

		updates[name][index] = value

		this.setState({
			hasChanges: this.hasChanges(updates),
			updates,
		})
	},

	onRemoveValue: function (name, index) {
		const updates = assign({}, this.state.updates)
		const original = this.props.work.data

		if (!updates[name]) {
			updates[name] = [].concat(original[name])
		}

		updates[name] = [].concat(
			updates[name].slice(0, index),
			updates[name].slice(index + 1)
		)

		if (!original[name].length && !updates[name].length) {
			delete updates[name]
		}

		this.setState({
			hasChanges: this.hasChanges(updates),
			updates,
		})
	},

	openSeadragonViewer: function () {
		const work = this.props.work
		if (!work || !work.data)
			return

		if (work.isFetching || !Object.keys(work.data).length)
			return

		const workData = work.data

		return (
			<div>
			  <OpenSeadragonViewer
					prefixUrl='http://openseadragon.github.io/openseadragon/images/'
					tileSources={workData.iiif_images}
					sequenceMode={workData.iiif_images.length > 1}
					showReferenceStrip={workData.iiif_images.length > 1}
					referenceStripScroll='vertical'
					showNavigator={true}
					onClose={this.adjustSections}
			  />
			</div>
		)
	},

	pdfjsViewer: function(){
		const work = this.props.work
		return(
			<div>
				<PDFViewer src={work.data.download_path} />
			</div>
		)
	},

	workEditSide: function () {
		const work = this.props.work
		const data = work.data

		if (!work || !data)
			return

		if (work.isFetching || !Object.keys(data).length)
			return

		const updates = this.state.updates
		const schema = data.form

		return (
			<GenericWork
				{...this.props}

				data={assign({}, data, updates)}
				getAutocompleteTerms={this.props.fetchAutocompleteTerms}
				onAddValueField={this.onAddField}
				onChange={this.onChange}
				onRemoveValueField={this.onRemoveValue}
				onSubmit={this.handleFormSubmit}
				schema={schema}
			/>
		)
	},

	renderHeader: function () {
		const work = this.props.work
		const data = this.state.data

		let title

		if (work.isFetching || !data)
			title = 'fetching...'
		else
			title = data.title || data.id

		// default to just the first title for now
		if (Array.isArray(title) && title.length > 1)
			title = title[0]

		const base = `${process.env.API_BASE_URL}/concern/generic_works`
		const debugUrl = `${base}/${this.props.params.workId}.json`

		return (
			<header>
				{this.maybeRenderNavToSearchResults()}

				<h1 style={{display: 'inline-block'}}>{title}</h1>

				<a
					href={debugUrl}
					style={{
						fontFamily: 'monospace',
						margin: '0 1em',
					}}
					target="_blank"
					children={'(debug)'}
				/>

				{this.state.hasChanges ? this.showChangedBadge() : ''}
			</header>
		)
	},

	showChangedBadge: function () {
		return (
			<span className="badge badge-changed">updated</span>
		)
	},

	render: function () {
		if (this.props.work.error && this.props.work.error.code === 404) {
			return <WorkNotFound {...this.props} />
		}

		const workSpaceStyle = {
			display: 'table',
			tableLayout: 'fixed',
			width: '100%',
		}

		const workEditStyle = {
			display: 'table-cell',
			verticalAlign: 'top',
			width: (this.state.mediaOpen ? '33%' : '66%'),
		}

		const mediaPreviewStyle = {
			borderLeft: '1px solid #aaa',
			display: 'table-cell',
			transition: 'width 250ms ease-in',
			verticalAlign: 'top',
			padding: '1em',
			width: (this.state.mediaOpen ? '66%' : '33%'),
		}

		return (
			<div>
				{this.renderHeader()}

				<div style={workSpaceStyle} className="work-space">

					<div style={workEditStyle} ref={e => this._workEditEl = e}>
						{this.workEditSide()}
					</div>

					<div style={mediaPreviewStyle} ref={e =>this._mediaPreviewEl = e}>
						{this.mediaPreviewSide()}
					</div>

				</div>
			</div>
		)
	}
})

export default withRouter(Work)

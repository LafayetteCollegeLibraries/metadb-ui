import React from 'react'
import withRouter from 'react-router/lib/withRouter'
import assign from 'object-assign'
import scrollToTop from '../../lib/scroll-to-top'

import WorkMetadataForm from '../components/WorkMetadataForm.jsx'
import ThumbnailPreview from '../components/media/ThumbnailPreview.jsx'
import OpenSeadragonViewer from '../components/media/OpenSeadragonViewer.jsx'


const Work = React.createClass({
	componentDidMount: function () {
		const id = this.props.params.workId

		if (!id) {
			// handle no id
		}

		this.props.fetchWork(id)
		this.props.router.setRouteLeaveHook(this.props.route, this.onExit)
	},

	componentWillUnmount: function () {
		// this.props.removeError()
		// this.props.removeWork()

	},

	onExit: function (nextLocation) {
		if (this.props.work.isChanged)
			return 'Any unsaved changes will be lost. Are you sure?'
	},


	getInitialState: function () {
		return {
			mediaOpen: false
		}
	},

	adjustSections: function (ev) {
		this.setState({mediaOpen: !this.state.mediaOpen})
	},

	handleAddValueField: function (which) {
		console.log('adding value field to', which)
		this.props.addEmptyValueToWork.apply(null, arguments)
	},

	handleRemoveValueField: function (which, index) {
		console.log(`removing value field [idx:${index}] from ${which}`)
		this.props.removeValueFromWork.apply(null, arguments)
	},

	handleChange: function (key, index, value) {
		console.log('making change [${value}] to key [${key}] @ idx ${index}')
		this.props.editWorkField.apply(null, arguments)
	},

	handleFormSubmit: function () {
		this.props.saveWork(this.props.params.workId)

		scrollToTop()
	},

	mediaPreview: function () {
		const work = this.props.work

		if (!work || !work.data)
			return

		if (work.isFetching || !Object.keys(work.data).length)
			return

		if (!work.data.thumbnail_path)
			return

		return (
			<ThumbnailPreview
				onClick={this.adjustSections}
				src={work.data.thumbnail_path}
			/>
		)
	},

	mediaPreviewSide: function () {
		return (
			<div>
				{
					this.state.mediaOpen
					? this.openSeadragonViewer()
					: this.mediaPreview()
				}
			</div>
		)
	},

	openSeadragonViewer: function () {
		return (
			<div>
				<button
					children="X"
					onClick={this.adjustSections}
					style={{
						float: 'right',
					}}
				/>
				<OpenSeadragonViewer />
			</div>
		)
	},

	workEditSide: function () {
		const work = this.props.work
		if (!work || !work.data)
			return

		if (work.isFetching || !Object.keys(work.data).length)
			return

		const workData = work.data
		const updates = work.updates
		const schema = workData.form

		return (
			<WorkMetadataForm
				{...this.props}

				data={assign({}, workData, updates)}
				onAddValueField={this.handleAddValueField}
				onChange={this.handleChange}
				onRemoveValueField={this.handleRemoveValueField}
				onSubmit={this.handleFormSubmit}
				schema={schema}
			/>
		)
	},

	renderHeader: function () {
		const work = this.props.work
		let title

		if (work.isFetching || typeof work.data === 'undefined')
			title = 'fetching...'
		else
			title = work.data.title || work.data.id

		// default to just the first title for now
		if (Array.isArray(title) && title.length > 1)
			title = title[0]

		const base = `${process.env.API_BASE_URL}/concern/generic_works`
		const debugUrl = `${base}/${this.props.params.workId}.json`

		return (
			<header>
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

				{this.props.work.isChanged ? this.showChangedBadge() : ''}
			</header>
		)
	},

	showChangedBadge: function () {
		return (
			<span className="badge badge-changed">updated</span>
		)
	},

	render: function () {
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
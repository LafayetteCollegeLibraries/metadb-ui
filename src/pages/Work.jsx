import React from 'react'
import withRouter from 'react-router/lib/withRouter'

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
			mediaOpen: false,
		}
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
		const title = getWorkTitle(data)

		const props = {
			status: this.getHeaderStatus(),
			title,
		}

		return <WorkHeader {...props} />
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

		const workEditProps = {
			autosave: true,
			data: work.data || {},
			updateWork: this.handleUpdateWork,
		}

		return (
			<div>
				{this.maybeRenderNavToSearchResults()}

				{this.renderHeader()}

				<div className="work-space">
					<WorkEdit {...workEditProps} />
				</div>
			</div>
		)
	}
})

// wrap Work component with `withRouter` to allow access to `setRouteLeaveHook`
export default withRouter(Work)

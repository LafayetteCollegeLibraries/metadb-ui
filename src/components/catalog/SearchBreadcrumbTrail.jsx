import React from 'react'
import SearchBreadcrumb from './SearchBreadcrumb.jsx'

const T = React.PropTypes

const SearchBreadcrumbTrail = React.createClass({
	propTypes: {
		onRemoveBreadcrumb: T.func.isRequired,

		breadcrumbs: T.array,
		query: T.string,
	},

	renderGroupBreadcrumbs: function (breadcrumb, index) {
		const props = {
			key: `bc${index}`,
			group: breadcrumb.group.label,
			value: breadcrumb.facet.label,
			onRemove: this.props.onRemoveBreadcrumb.bind(null,
				breadcrumb.group.name,
				breadcrumb.facet,
			),
		}

		return <SearchBreadcrumb {...props} />
	},

	renderQuery: function () {
		if (!this.props.query || this.props.query === '')
			return

		return (
			<SearchBreadcrumb
				key={'query'}
				onRemove={this.props.onRemoveBreadcrumb.bind(null, 'q', this.props.query)}
				value={'"' + this.props.query + '"'}
			/>
		)
	},

	render: function () {
		const bc = this.props.breadcrumbs

		return (
			<div>
				{this.renderQuery()}

				{!!bc.length && bc.map(this.renderGroupBreadcrumbs)}
			</div>
		)
	}
})

export default SearchBreadcrumbTrail

import React from 'react'
import SearchBreadcrumb from './SearchBreadcrumb.jsx'

const T = React.PropTypes

const SearchBreadcrumbTrail = React.createClass({
	propTypes: {
		onRemoveBreadcrumb: T.func.isRequired,

		breadcrumbs: T.arrayOf(T.shape({
			facet: T.object,
			item: T.object,
		})),

		query: T.string,
	},

	getDefaultProps: function () {
		return {
			breadcrumbs: [],
			query: '',
		}
	},

	renderGroupBreadcrumbs: function (breadcrumb, index) {
		return (
			<SearchBreadcrumb
				key={`bc${index}`}
				facet={breadcrumb.facet}
				item={breadcrumb.item}
				onRemove={this.props.onRemoveBreadcrumb}
			/>
		)
	},

	renderQuery: function () {
		if (this.props.query === '' || !this.props.query)
			return

		const item = {value: '"' + this.props.query + '"'}

		return (
			<SearchBreadcrumb
				item={item}
				key={'query'}
				onRemove={() => this.props.onRemoveBreadcrumb('q', this.props.query)}
			/>
		)
	},

	render: function () {
		const bc = this.props.breadcrumbs

		return (
			<div className="SearchBreadcrumbTail">
				{this.renderQuery()}

				{!!bc.length && bc.map(this.renderGroupBreadcrumbs)}
			</div>
		)
	}
})

export default SearchBreadcrumbTrail

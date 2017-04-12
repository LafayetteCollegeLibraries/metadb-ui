import React from 'react'
import { expect } from 'chai'
import { shallow, mount } from 'enzyme'
import SearchBreadcrumbTrail from '../SearchBreadcrumbTrail.jsx'

const wrapEl = renderer => xtend => renderer(
	<SearchBreadcrumbTrail onRemoveBreadcrumb={() => {}} {...xtend} />
)

const shallowEl = wrapEl(shallow)
const mountEl = wrapEl(mount)

const breadcrumbs = [
	{
		facet: {name: 'cool-facet', label: 'Cool Facet'},
		item: {label: 'cool-value-1', label: 'Cool Value, 1'},
	},
	{
		facet: {name: 'cool-facet', label: 'Cool Facet'},
		item: {label: 'cool-value-2', label: 'Cool Value, 2'}
	}
]

describe('<SearchBreadcrumbTrail />', function () {
	it('renders a SearchBreadcrumb component for each item in the breadcrumbs array', function () {
		const $el = shallowEl({breadcrumbs})
		expect($el.find('SearchBreadcrumb')).to.have.length(breadcrumbs.length)
	})

	it('calls `onRemoveBreadcrumb` when one is set to remove', function (done) {
		const index = 1

		const onRemoveBreadcrumb = (f, i) => {
			expect(f).to.deep.equal(breadcrumbs[index].facet)
			expect(i).to.deep.equal(breadcrumbs[index].item)

			done()
		}

		const $el = mountEl({breadcrumbs, onRemoveBreadcrumb})
		const $bc = $el.find('SearchBreadcrumb').at(index)

		$bc.find('button').simulate('click')
	})

	describe('the query SearchBreadcrumb', function () {
		it('is created when `props.query` is supplied', function () {
			const query = 'some query'
			const $el = shallowEl({query})

			expect($el.find('SearchBreadcrumb')).to.have.length(1)
		})

		it('calls `onRemoveBreadcrumb` with the facet value being "q"', function (done) {
			const query = 'a query'
			const onRemoveBreadcrumb = (facet, item) => {
				expect(facet).to.equal('q')
				expect(item).to.deep.equal(query)
				done()
			}

			const $el = mountEl({query, onRemoveBreadcrumb})
			$el.find('SearchBreadcrumb').first().find('button').simulate('click')
		})
	})
})

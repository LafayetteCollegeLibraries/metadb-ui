import React from 'react'
import ReactDOM from 'react-dom'
import { expect } from 'chai'
import { mount, shallow, render } from 'enzyme'
import assign from 'object-assign'
import FacetListWithViewMore from '../FacetListWithViewMore.jsx'
import data from './data/facet.json'

const noop = () => {}

const defaultProps = {
	...data,
	onRemoveSelectedFacet: noop,
	onSelectFacet: noop,
	selectedFacets: [],

	limit: 5,
	viewMoreText: 'View more...',
}

const wrap = (xtend, renderer) => {
	const props = assign({}, defaultProps, xtend)
	return renderer(React.createElement(FacetListWithViewMore, props))
}

const mountEl = xtend => wrap(xtend, mount)
const shallowEl = xtend => wrap(xtend, shallow)
const renderEl = xtend => wrap(xtend, render)

describe('<FacetListWithMoreView />', function () {
	it('renders the number of items established with `limit`', function () {
		const limit = Math.floor(Math.random() * defaultProps.items.length)
		const $el = mountEl({limit})
		expect($el.find('FacetListItem')).to.have.length(limit)
	})

	describe('the `View More` span', function () {
		const SEL = 'span.view-more'
		it('renders if # items exceeds limit', function () {
			const $el = shallowEl()
			expect($el.find(SEL)).to.have.length(1)
		})

		it('does not render if # items is below or equal to limit', function () {
			const $first = shallowEl({limit: defaultProps.items.length})
			expect($first.find(SEL)).to.have.length(0)

			const $second = shallowEl({limit: Infinity})
			expect($second.find(SEL)).to.have.length(0)
		})

		it('uses text provided with `viewMoreText` prop', function () {
			const viewMoreText = 'I am not View More =^_^='
			const $el = mountEl({viewMoreText})
			expect($el.find(SEL).text()).to.equal(viewMoreText)
		})

		it('opens the View More modal (w/ header) when clicked', function () {
			const $el = shallowEl()

			expect($el.state('modalOpen')).to.be.false
			expect($el.find('Modal')).to.have.length(0)

			$el.find(SEL).simulate('click')

			expect($el.state('modalOpen')).to.be.true
			expect($el.find('Modal')).to.have.length(1)
		})
	})

	// TODO: lots of headaches in trying to put the Modal component
	// into an `enzyme` wrapper.
	//
	// see: https://github.com/reactjs/react-modal#testing
	describe('the `View More` modal', function () {
		xit('displays all of the facet options', function () {})
	})
})

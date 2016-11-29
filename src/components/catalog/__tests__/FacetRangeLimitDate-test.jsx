import React from 'react'
import { expect } from 'chai'
import { shallow, mount } from 'enzyme'
import assign from 'object-assign'
import FacetRangeLimitDate from '../FacetRangeLimitDate.jsx'

import calculateRange from '../common/calculate-range'
import isoDateRange from '../common/__tests__/data/iso-date-range.json'

const noop = () => {}

const defaultProps = {
	...isoDateRange,
	onSelectFacet: noop,
	onRemoveSelectedFacet: noop,
	selectedFacets: [],
}

const wrapper = (xtend, renderer) => {
	const props = assign({}, defaultProps, xtend)
	return renderer(React.createElement(FacetRangeLimitDate, props))
}

const shallowEl = xtend => wrapper(xtend, shallow)
const mountEl = xtend => wrapper(xtend, mount)

describe('<FacetRangeLimitDate />', function () {
	it('calculates and stores min/max and hits in state', function () {
		const props = {...isoDateRange}
		const $el = shallowEl(props)
		const {min, max, hits, items} = calculateRange(props.items, val => Date.parse(val))

		expect($el.state('hits')).to.equal(hits)
		expect($el.state('items')).to.deep.equal(items)

		expect($el.state('min')).to.not.be.undefined
		expect($el.state('max')).to.not.be.undefined
	})

	it('does not render FacetListSelectedItems if not selected items', function () {
		const $el = shallowEl({selectedFacets: []})
		expect($el.find('FacetListSelectedItem')).to.have.length(0)
	})

	it('will render FacetListSelectedItems if selected items are passed', function () {
		const selectedFacets = [
			{
				name: 'Facet name',
				value: {
					begin: Date.parse('1986-02-11T00:00:00Z'),
					end: Date.now(),
				},
			}
		]

		const $el = shallowEl({selectedFacets})
		expect($el.find('FacetListSelectedItem')).to.have.length(selectedFacets.length)
	})

	describe('the `onSelectFacet` callback', function () {
		it('is called when triggered via `RangeSliderDate`', function (done) {
			const onSelectFacet = () => { done() }
			const $el = mountEl({onSelectFacet})
			const $btn = $el.find('Button')
			$btn.simulate('click')
		})

		it('is sent a facet object when called', function (done) {
			const onSelectFacet = facet => {
				expect(facet).to.have.property('name')
				expect(facet.name).to.be.a.string
				expect(facet.name).to.equal(defaultProps.name)

				expect(facet).to.have.property('label')
				expect(facet.label).to.be.a.string

				expect(facet).to.have.property('value')
				expect(facet.value).to.be.an.object
				expect(facet.value).to.have.property('begin')
				expect(facet.value.begin).to.be.a.number
				expect(facet.value).to.have.property('end')
				expect(facet.value.end).to.be.a.number

				expect(facet).to.have.property('type')
				expect(facet.type).to.equal('range')

				done()
			}

			const $el = mountEl({onSelectFacet})
			const $btn = $el.find('Button')
			$btn.simulate('click')
		})
	})
})

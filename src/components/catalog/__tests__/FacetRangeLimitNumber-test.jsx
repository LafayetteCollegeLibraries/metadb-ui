import React from 'react'
import { expect } from 'chai'
import { shallow, mount, render } from 'enzyme'
import assign from 'object-assign'
import FacetRangeLimitNumber from '../FacetRangeLimitNumber.jsx'

import calculateRange from '../common/calculate-range'
import yearRange from '../common/__tests__/data/year-range.json'

const noop = () => {}

const defaultProps = {
	...yearRange,
	onSelectFacet: noop,
	onRemoveSelectedFacet: noop,
	selectedFacets: [],
}

const wrapper = (xtend, renderer) => {
	const props = assign({}, defaultProps, xtend)
	return renderer(React.createElement(FacetRangeLimitNumber, props))
}

const shallowEl = xtend => wrapper(xtend, shallow)
const mountEl = xtend => wrapper(xtend, mount)

describe('<FacetRangeLimitNumber />', function () {
	it('calculates and stores min/max and hits in state', function () {
		const props = {...yearRange}

		const $el = shallowEl(props)
		const {min, max, hits, items} = calculateRange(props.items, val => +val)

		expect($el.state('hits')).to.equal(hits)
		expect($el.state('min')).to.equal(min)
		expect($el.state('max')).to.equal(max)
		expect($el.state('items')).to.deep.equal(items)
	})

	it('will not render FacetListSelectedItem if no selected items', function () {
		const $el = shallowEl({selectedFacets: []})
		expect($el.find('FacetListSelectedItem')).to.have.length(0)
	})

	it('will render FacetListSelectedItem if selected items passed', function () {
		const selectedFacets = [
			{
				name: 'Facet name',
				value: {
					begin: 1,
					end: 10
				}
			}
		]

		const $el = shallowEl({selectedFacets})
		expect($el.find('FacetListSelectedItem')).to.have.length(selectedFacets.length)
	})

	describe('the `onSelectFacet` callback', function () {
		it('is called when triggered via `RangeSliderNumber`', function (done) {
			const onSelectFacet = () => {
				done()
			}

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
				expect(facet.value).to.have.property('begin')
				expect(facet.value).to.have.property('end')

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

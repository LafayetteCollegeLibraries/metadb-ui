import React from 'react'
import { expect } from 'chai'
import { shallow, mount } from 'enzyme'
import assign from 'object-assign'
import randomIndex from 'random-array-index'
import FacetList from '../FacetList.jsx'

import data from './data/facet.json'

const defaultProps = {
	...data,
	onRemoveSelectedFacet: () => {},
	onSelectFacet: () => {},
	selectedFacets: [],
}

const renderEl = (xtend, renderer) => {
	const props = assign({}, defaultProps, xtend)
	return renderer(React.createElement(FacetList, props))
}

const mountEl = xtend => renderEl(xtend, mount)
const shallowEl = xtend => renderEl(xtend, shallow)

describe('<FacetList />', function () {
	it('renders `FacetListItem`s for each item passed', function () {
		const $el = shallowEl()
		expect($el.find('FacetListItem')).to.have.length(defaultProps.items.length)
	})

	it('retains the order of items passed', function () {
		const $el = shallowEl()
		const $listItems = $el.find('FacetListItem')

		$listItems.forEach(($li, index) => {
			const item = defaultProps.items[index]
			expect($li.prop('data').hits).to.equal(item.hits)
		})
	})

	it('calls `onSelectFacet` when an Item is clicked, passing the facet object', function (done) {
		const idx = randomIndex(defaultProps.items)
		const item = defaultProps.items[idx]

		const onSelectFacet = facet => {
			expect(facet).to.deep.equal(item)
			done()
		}

		const $el = mountEl({onSelectFacet})
		const $item = $el.find('FacetListItem').at(idx)
		$item.find('.facet-label').simulate('click')
	})

	// skipping for now because of using FacetListSelectedItem instead
	describe('when provided `selectedFacets`', function () {
		const items = [].concat(defaultProps.items)
		const idx = randomIndex(items)
		const selectedFacets = items.splice(idx, 1)

		it('renders a <FacetListSelectedItem/> component for each item', function () {
			const $el = mountEl({items, selectedFacets})
			expect($el.find('FacetListSelectedItem')).to.have.length(1)
		})

		it('triggers `onRemoveSelectedFacet` when selectedFacet X button is clicked', function (done) {
			const onRemoveSelectedFacet = facet => {
				expect(facet).to.deep.equal(selectedFacets[0])
				done()
			}

			const $el = mountEl({items, selectedFacets, onRemoveSelectedFacet})
			const $button = $el.find('FacetListSelectedItem').find('Button')
			$button.simulate('click')
		})
	})
})

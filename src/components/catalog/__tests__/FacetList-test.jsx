import React from 'react'
import { expect } from 'chai'
import { shallow, mount } from 'enzyme'
import assign from 'object-assign'
import randomIndex from 'random-array-index'
import FacetList from '../FacetList.jsx'

const defaultProps = {
	data: {
		label: 'Facet List Label',
		name: 'facet_list_name',
		items: [
			{
				label: 'label 1',
				hits: 4,
				value: 'value_1',
			},
			{
				label: 'label_2',
				hits: 10,
				value: 'value_2',
			},
			{
				label: 'label_3',
				hits: 7,
				value: 'value_3',
			}
		],
	},
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
		expect($el.find('FacetListItem')).to.have.length(defaultProps.data.items.length)
	})

	it('retains the order of items passed', function () {
		const $el = shallowEl()
		const $listItems = $el.find('FacetListItem')

		$listItems.forEach(($li, index) => {
			const item = defaultProps.data.items[index]
			expect($li.prop('data').hits).to.equal(item.hits)
		})
	})

	it('calls `onSelectFacet` when an Item is clicked, passing the facet object', function (done) {
		const idx = randomIndex(defaultProps.data.items)
		const item = defaultProps.data.items[idx]

		const onSelectFacet = facet => {
			expect(facet).to.deep.equal(item)
			done()
		}

		const $el = mountEl({onSelectFacet})
		const $item = $el.find('FacetListItem').at(idx)
		$item.find('.facet-label').simulate('click')
	})

	describe('when provided `selectedFacets`', function () {
		const items = [].concat(defaultProps.data.items)
		const idx = randomIndex(items)
		const selectedFacets = items.splice(idx, 1)

		it('renders <SelectedFacetsList/> component', function () {
			const $el = mountEl({items, selectedFacets})
			expect($el.find('SelectedFacetsList')).to.have.length(1)
		})

		it('triggers `onRemoveSelectedFacet` when selectedFacet X button is clicked', function (done) {
			const onRemoveSelectedFacet = facet => {
				expect(facet).to.deep.equal(selectedFacets[0])
				done()
			}

			const $el = mountEl({items, selectedFacets, onRemoveSelectedFacet})
			const $button = $el.find('SelectedFacetsList').find('button')

			$button.simulate('click')
		})
	})
})

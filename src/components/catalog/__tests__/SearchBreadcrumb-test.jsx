import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import SearchBreadcrumb from '../SearchBreadcrumb.jsx'

const shallowEl = xtend => shallow(
	<SearchBreadcrumb
		item={{label: 'Cool Breadcrumb'}}
		onRemove={() => {}}
		{...xtend}
	/>
)

const FACET_LABEL_SELECTOR = '.SearchBreadcrumb-facet'
const ITEM_LABEL_SELECTOR = '.SearchBreadcrumb-value'
const BUTTON_SELECTOR = '.SearchBreadcrumb-remove'
const HOVER_STATE_KEY = 'buttonHover'

describe('<SearchBreadcrumb />', function () {
	it('does not render the facet name if not included', function () {
		const $el = shallowEl()
		expect($el.find(FACET_LABEL_SELECTOR)).to.have.length(0)
	})

	it('renders a facet label when included', function () {
		const facet = {
			name: 'cool-facet',
			label: 'Cool Facet',
		}

		const $el = shallowEl({facet})
		expect($el.find(FACET_LABEL_SELECTOR)).to.have.length(1)
	})

	describe('the remove-button', function () {
		it(`sets the \`${HOVER_STATE_KEY}\` state to true when mouse-over'd`, function () {
			const $el = shallowEl()
			expect($el.state(HOVER_STATE_KEY)).to.be.false

			const $button = $el.find(BUTTON_SELECTOR)
			$button.simulate('mouseOver')

			expect($el.state(HOVER_STATE_KEY)).to.be.true
		})

		it(`sets the \`${HOVER_STATE_KEY}\` state to false when mouse-out'd`, function () {
			const $el = shallowEl()
			const $button = $el.find(BUTTON_SELECTOR)

			$button.simulate('mouseOver')
			expect($el.state(HOVER_STATE_KEY)).to.be.true

			$button.simulate('mouseOut')
			expect($el.state(HOVER_STATE_KEY)).to.be.false
		})

		it('triggers the `onRemove` callback when clicked', function (done) {
			const facet = {
				name: 'cool-facet',
				label: 'COOL FACET',
			}

			const item = {
				value: 'thumbs-up',
				label: 'Thumbs Up!',
			}

			const onRemove = (f, i) => {
				expect(f).to.deep.equal(facet)
				expect(i).to.deep.equal(item)

				done()
			}

			const $el = shallowEl({facet, item, onRemove})
			const $button = $el.find(BUTTON_SELECTOR)

			$button.simulate('click', {preventDefault: () => {}})
		})
	})

	describe('the item label', function () {
		it('uses the `label` prop first', function () {
			const item = {label: 'this is the label', value: 'this is the value'}
			const $el = shallowEl({item})

			const $item = $el.find(ITEM_LABEL_SELECTOR)
			expect($item.text()).to.equal(item.label)
		})

		it('falls back to the `value` prop', function () {
			const item ={value: 'hey I am a value'}
			const $el = shallowEl({item})

			const $item = $el.find(ITEM_LABEL_SELECTOR)
			expect($item.text()).to.equal(item.value)
		})

		it('ultimately falls back to just using the `item` prop', function () {
			const item = 'just a text value'
			const $el = shallowEl({item})

			const $item = $el.find(ITEM_LABEL_SELECTOR)
			expect($item.text()).to.equal(item)
		})
	})
})

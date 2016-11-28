import React from 'react'
import assign from 'object-assign'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import FormField from '../FormField.jsx'

const RENDERER_DISPLAY_NAME = 'LolComponent'

const wrapper = (xtend, renderer) => {
	const props = assign({
		name: 'test-form-field',
		renderer: p => <input type="text" defaultValue={p.value} />,
		value: ['value'],
	}, xtend)

	// give our renderer a hook for us to easily grab onto
	props.renderer.displayName = RENDERER_DISPLAY_NAME

	return renderer(React.createElement(FormField, props))
}

const shallowEl = xtend => wrapper(xtend, shallow)

const fillArray = val => {
	const value = []
	const num = Math.floor(Math.random() * 10)

	for (let i = 0; i < num; i++)
		value[i] = val

	return value
}

describe('<FormField />', function () {
	it('renders a component when value is an empty array', function () {
		const $el = shallowEl({data: []})
		expect($el.find(RENDERER_DISPLAY_NAME)).to.have.length(1)
	})

	describe('the `label` prop', function () {
		it('renders a <label/> with provided value', function () {
			const label = 'form field label'
			const $el = shallowEl({label})
			const $label = $el.find('label')

			expect($label).to.have.length(1)
			expect($label.text()).to.equal(label)
		})

		it('renders a <label/> with `props.name` by default', function () {
			const name = 'form-field-name'
			const $el = shallowEl({name})
			const $label = $el.find('label')

			expect($label).to.have.length(1)
			expect($label.text()).to.equal(name)
		})

		it('does not render a component when `props.hideLabel` is passed', function () {
			const $el = shallowEl({hideLabel: true})
			expect($el.find('label')).to.have.length(0)
		})
	})

	describe('the `renderer` prop', function () {
		it('is called for each item contained in `props.value`', function () {
			const value = fillArray()
			const $el = shallowEl({multiple: true, value})
			expect($el.find(RENDERER_DISPLAY_NAME)).to.have.length(value.length)
		})

		it('is only called once if `props.multiple === false`', function () {
			let value = fillArray()
			while (value.length < 2)
				value = fillArray()

			const $el = shallowEl({multiple: false, value})
			expect($el.find(RENDERER_DISPLAY_NAME)).to.have.length(1)
		})
	})

	describe('the rendered value', function () {
		describe('when `onChange` is triggered', function () {
			it('sends the signature (index, value)', function (done) {
				const onChange = function (/* index, value */) {
					expect(arguments).to.have.length(2)
					expect(arguments[0]).to.be.a.number
					done()
				}

				const value = ['first', 'second']
				const $el = shallowEl({onChange, value, multiple: true})

				const $target = $el.find(RENDERER_DISPLAY_NAME).last()
				$target.simulate('change', {target: {value: 'new value'}})
			})
		})
	})

	describe('the add row <button/>', function () {
		it('renders after remove-row buttons (when `multiple === true)`', function () {
			const $el = shallowEl({multiple: true})
			const $buttons = $el.find('Button')

			expect($buttons.length).to.be.greaterThan(1)

			const $add = $buttons.last()
			expect($add.key()).to.equal('add-row-btn')
		})

		it('does not render at all (when `multiple === false`) [default]', function () {
			const $el = shallowEl({multiple: false})
			expect($el.find('button')).to.have.length(0)
		})
	})
})

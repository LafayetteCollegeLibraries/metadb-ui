import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import assign from 'object-assign'
import RangeSliderNumber from '../RangeSliderNumber.jsx'

const noop = () => {}
const evt = {preventDefault: noop}

const defaultProps = {
	min: 0,
	max: 100,
	onApplyRange: noop,
}

const wrapper = (xtend, renderer) => {
	const props = assign({}, defaultProps, xtend)
	return renderer(React.createElement(RangeSliderNumber, props))
}

const shallowEl = xtend => wrapper(xtend, shallow)
const INPUT_SEL = 'input[type="number"]'

describe('<RangeSliderNumber />', function () {
	it('renders a pair of inputs with `type="number"`', function () {
		const $el = shallowEl()
		const $inputs = $el.find(INPUT_SEL)
		expect($inputs).to.have.length(2)
	})

	it('stores the min/max values in state as a tuple', function () {
		const $el = shallowEl()
		expect($el.state('value')).to.be.an.array
		expect($el.state('value')).to.have.length(2)
	})

	it('updates the first value of the tuple when `min` input changed', function () {
		const $el = shallowEl()
		const $min = $el.find(INPUT_SEL).filterWhere($e => $e.key() === 'min-input')
		const value = 75

		expect($min).to.have.length(1)

		$min.simulate('change', {target: {value}})

		expect($el.state('value')[0]).to.equal(value)
		expect($el.state('value')[1]).to.equal(defaultProps.max)
	})

	it('updates the second value of the tuple when `max` input changed', function () {
		const $el = shallowEl()
		const $max = $el.find(INPUT_SEL).filterWhere($e => $e.key() === 'max-input')
		const value = 75

		expect($max).to.have.length(1)

		$max.simulate('change', {target: {value}})

		expect($el.state('value')[0]).to.equal(defaultProps.min)
		expect($el.state('value')[1]).to.equal(value)
	})

	it('converts string min/max props to numbers in state', function () {
		const min = '1'
		const max = '010'
		const numMin = 1
		const numMax = 10
		const $el = shallowEl({min, max})

		const value = $el.state('value')
		value.map(v => expect(v).to.be.a.number)

		expect(value[0]).to.deep.equal(numMin)
		expect(value[1]).to.deep.equal(numMax)
	})

	describe('the `onApplyRange` handler', function () {
		it('is called when button is clicked', function (done) {
			const $el = shallowEl({onApplyRange: () => {
				done()
			}})

			$el.find('Button').simulate('click', evt)
		})
		
		it('is passed `state.value`', function (done) {
			const onApplyRange = val => {
				expect(val).to.deep.equal($el.state('value'))
				done()
			}

			const $el = shallowEl({onApplyRange})
			$el.find('Button').simulate('click', evt)
		})
	})
})

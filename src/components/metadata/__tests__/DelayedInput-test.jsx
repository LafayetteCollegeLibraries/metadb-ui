import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'

import DelayedInput from '../DelayedInput.jsx'

const wrapEl = (xtend, renderer) => {
	const props = {
		type: 'text',
		...xtend,
	}

	return renderer(<DelayedInput {...props} />)
}

const shallowEl = xtend => wrapEl(xtend, shallow)

describe('<DelayedInput />', function () {
	it('triggers `onChange` handler on blur', function (done) {
		const onChange = () => { done() }
		const $el = shallowEl({onChange})

		$el.simulate('blur')
	})

	it('also triggers `onBlur` when blurred', function (done) {
		const onBlur = () => { done() }
		const $el = shallowEl({onBlur})

		$el.simulate('blur')
	})

	it('does not trigger `onChange` when input element changes', function () {
		const onChange = () => {
			throw new Error('onChange handler should not have been called')
		}

		const $el = shallowEl({onChange})
		const $input = $el.find('input')
		$input.simulate('change', { target: { value: 'new value' }})
	})

	it('stores value in state when contained input changes', function () {
		const value = 'some original text'
		const updatedValue = 'new value ^_^'

		const $el = shallowEl({	value })
		const $input = $el.find('input')

		expect($el.state('value')).to.equal(value)

		$input.simulate('change', { target: { value: updatedValue }})

		expect($el.state('value')).to.not.equal(value)
		expect($el.state('value')).to.equal(updatedValue)
	})

	it('updates the state value when `props.value` changes', function () {
		const value = 'some txt'
		const updatedValue = 'a new value'

		const $el = shallowEl({value})

		expect($el.state('value')).to.equal(value)

		$el.setProps({value: updatedValue})

		expect($el.state('value')).to.equal(updatedValue)
	})

	it('leaves the original value when other props fields are changed', function () {
		const value = 'some txt'
		const disabled = true

		const $el = shallowEl({disabled, value})

		expect($el.state('value')).to.equal(value)

		$el.setProps({disabled: false})

		expect($el.state('value')).to.equal(value)
	})
})

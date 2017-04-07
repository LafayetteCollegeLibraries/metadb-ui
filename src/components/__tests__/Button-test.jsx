import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'

import Button from '../Button.jsx'

const wrapEl = (xtend, renderer) => {
	const props = {
		...xtend,
		onClick: () => {},
	}

	return renderer(<Button {...props} />)
}

const shallowEl = xtend => wrapEl(xtend, shallow)

describe('<Button />', function () {
	describe('the `size` attribute', function () {
		const sizes = [
			'small',
			'large',
		]

		sizes.forEach(function (size) {
			it(`adds a "*-${size}" classname when set to "${size}"`, function () {
				const $el = shallowEl({size})
				expect($el.prop('className')).to.contain(size)
			})
		})
	})

	describe('the `type` attribute', function () {
		const types = [
			'danger', 'info', 'success', 'text', 'warning'
		]

		types.forEach(function (type) {
			it(`adds a "*-${type}" classname when set to "${type}"`, function () {
				const $el = shallowEl({type})
				expect($el.prop('className')).to.contain(type)
			})
		})
	})
})

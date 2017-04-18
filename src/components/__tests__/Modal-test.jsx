import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'

import {
	Header,
	Footer,
	NAMESPACE
} from '../Modal.jsx'


describe('<Modal />', function () {
	describe('Modal.Header', function () {
		const shallowEl = xtend => (
			shallow(<Header {...xtend} />)
		)

		it('uses the Modal namespace in its className', function () {
			const $el = shallowEl()
			expect($el.prop('className')).to.contain(NAMESPACE)
		})

		it('combines passed classNames with namespaced one', function () {
			const className = 'some-other-classname'
			const $el = shallowEl({className})
			const cns = $el.prop('className').split(' ')

			expect(cns).to.contain(className)
			expect(cns).to.contain(NAMESPACE + '-header')
		})
	})

	describe('Modal.Footer', function () {
		const shallowEl = xtend => (
			shallow(<Footer {...xtend} />)
		)

		it('uses the Modal namespace in its className', function () {
			const $el = shallowEl()
			expect($el.prop('className')).to.contain(NAMESPACE)
		})

		it('combines passed classNames with namespaced one', function () {
			const className = 'some-other-classname'
			const $el = shallowEl({className})
			const cns = $el.prop('className').split(' ')

			expect(cns).to.contain(className)
			expect(cns).to.contain(NAMESPACE + '-footer')
		})
	})
})

import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import assign from 'object-assign'
import ResultsPager from '../ResultsPager.jsx'
import commafy from 'number-with-commas'

import data from './data/pages.json'

const noop = () => {}

const defaultProps = {
	...data,
	onNextClick: noop,
	onPreviousClick: noop,
}

const wrap = (xtend, renderer) => {
	const props = assign({}, defaultProps, xtend)
	return renderer(React.createElement(ResultsPager, props))
}

const shallowEl = xtend => wrap(xtend, shallow)

describe('<ResultsPager />', function () {
	it('renders next button as disabled when `next_page` is null', function () {
		const $el = shallowEl({
			next_page: null,
			prev_page: 1,
		})

		expect($el.find('button').last().prop('disabled')).to.be.true
	})

	it('renders previous button as disabled when `prev_page` is null', function () {
		const $el = shallowEl({
			next_page: 2,
			prev_page: null,
		})

		expect($el.find('button').first().prop('disabled')).to.be.true
	})

	it('triggers `onNextClick` when next button is clicked', function (done) {
		const onNextClick = done
		const $el = shallowEl({
			onNextClick,
			next_page: 3,
			prev_page: 1,
		})

		const $next = $el.find('button').last()
		$next.simulate('click', {preventDefault: noop})
	})

	it('triggers `onPreviousClick` when the previous button is clicked', function (done) {
		const onPreviousClick = done
		const $el = shallowEl({
			onPreviousClick,
			next_page: 3,
			prev_page: 1,
		})

		const $prev = $el.find('button').first()
		$prev.simulate('click', {preventDefault: noop})
	})

	it('uses text passed to `nextText` in next button', function () {
		const nextText = 'HAI NEXT PLZ ^_^'

		const $el = shallowEl({nextText})

		expect($el.find('button').last().text()).to.equal(nextText)
	})

	it('uses text passed to `previousText` in previous button', function () {
		const previousText = 'Previously... on Search Results'
		const $el = shallowEl({previousText})

		expect($el.find('button').first().text()).to.equal(previousText)
	})

	describe('props.message', function () {
		it('allows a string template to be passed', function () {
			const { limit_value, offset_value, total_count } = defaultProps
			const start = commafy(offset_value + 1)
			const end = commafy(offset_value + limit_value)
			const total = commafy(total_count)

			const message = 'start: %(start)s, end: %(end)s, total: %(total)s'
			const res = `start: ${start}, end: ${end}, total: ${total}`

			const $el = shallowEl({message})

			expect($el.find('span').html()).to.contain(res)
		})

		it('allows a function to generate a message', function () {
			const { limit_value, offset_value, total_count } = defaultProps
			const messageGenerator = ({start, end, total}) => {
				return `start: ${start}, end: ${end}, total: ${total}`
			}

			const res = messageGenerator({
				start: offset_value + 1,
				end: offset_value + limit_value,
				total: total_count
			})

			const $el = shallowEl({message: messageGenerator})

			expect($el.find('span').html()).to.contain(res)
		})
	})
})

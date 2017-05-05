import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import assign from 'object-assign'
import RangeSliderDate from '../RangeSliderDate.jsx'
import { INTERVALS } from '../common/date-intervals'

const wrapper = (xtend, renderer) => {
	const props = assign({}, {
		min: Date.parse('1986-02-11T00:00:00Z'),
		max: Date.parse('2016-11-06T00:00:00Z'),
		onApplyRange: () => {},
	}, xtend)

	return renderer(React.createElement(RangeSliderDate, props))
}

const shallowEl = xtend => wrapper(xtend, shallow)

describe('<RangeSliderDate />', function () {
	describe('when interval="month"', function () {
		let $els

		beforeEach(function () {
			const $el = shallowEl({interval: INTERVALS.MONTH })
			$els = $el.find('DelayedInput')
		})

		it('renders inputs with `type="month"', function () {
			const $filtered = $els.findWhere($e => $e.prop('type') === 'month')
			expect($filtered).to.have.length(2)
		})

		it('parses value to YYYY-MM', function () {
			$els.forEach($$el => {
				expect($$el.prop('value')).to.match(/^\d{4}-\d{2}$/)
			})
		})
	})

	describe('when interval="day"', function () {
		let $els

		beforeEach(function () {
			const $el = shallowEl({interval: INTERVALS.DAY})
			$els = $el.find('DelayedInput')
		})

		it('renders inputs with `type="date"`', function () {
			const $filtered = $els.findWhere($e => $e.prop('type') === 'date')
			expect($filtered).to.have.length(2)
		})

		it('parses value to YYYY-MM-DD', function () {
			$els.forEach($$el => {
				expect($$el.prop('value')).to.match(/^\d{4}-\d{2}-\d{2}$/)
			})
		})
	})

	describe('when interval="year"', function () {
		let $els

		beforeEach(function () {
			const $el = shallowEl({interval: INTERVALS.YEAR})
			$els = $el.find('DelayedInput')
		})

		it('renders inputs with `type="number"`', function () {
			const $filtered = $els.findWhere($e => $e.prop('type') === 'number')
			expect($filtered).to.have.length(2)
		})

		it('parses value to YYYY', function () {
			$els.forEach($$el => {
				expect($$el.prop('value')).to.match(/^\d{4}$/)
			})
		})
	})

	describe('the `onApplyRange` handler', function () {
		it('is called with an array of 2 numbers', function (done) {
			const onApplyRange = vals => {
				expect(Array.isArray(vals)).to.be.true
				expect(vals).to.have.length(2)

				vals.map(v => expect(v).to.be.a.number)

				done()
			}

			const $el = shallowEl({onApplyRange})
			const $button = $el.find('Button')

			$button.simulate('click')
		})

		it('is called with rounded date values', function (done) {
			const min = Date.parse('1986-02-11T11:11:00Z')
			const max = Date.parse('2016-11-06T15:49:00Z')

			const dates = [
				new Date(min),
				new Date(max),
			]

			const onApplyRange = vals => {
				const fns = [
					'getUTCFullYear', 'getUTCMonth', 'getUTCDate'
				]

				let i = 0
				let current, comp

				// throw if there's a problem
				expect(vals).to.have.length(dates.length)

				for (; i < vals.length; i++) {
					current = new Date(vals[i])
					comp = dates[i]

					expect(current.toISOString()).to.not.equal(comp.toISOString())

					fns.forEach(fn => {
						expect(current[fn]()).to.equal(comp[fn]())
					})
				}

				done()
			}

			const $el = shallowEl({min, max, onApplyRange})
			const $button = $el.find('Button')
			$button.simulate('click')
		})
	})

	describe('the `min` input', function () {
		it('changes the value of `state.min`', function () {
			const minValue = '1999-12-31'
			const split = minValue.split('-').map(Number)
			split[1] = split[1] - 1

			const minTs = Date.UTC.apply(Date, split)
			const $el = shallowEl({interval: INTERVALS.DAY})

			const $min = $el.find('DelayedInput').filterWhere(el => (
				el.key() === 'input-min'
			))

			expect($min).to.have.length(1)

			$min.simulate('change', minValue)

			const minState = $el.state('min')
			expect(minState).to.equal(minTs)
		})
	})

	describe('the `max` input', function () {
		it('changes the value of `state.max`', function () {
			const maxValue = '2017-01-01'
			const split = maxValue.split('-').map(Number)
			split[1] = split[1] - 1

			const maxTs = Date.UTC.apply(Date, split)
			const $el = shallowEl({interval: INTERVALS.DAY})

			const $max = $el.find('DelayedInput').filterWhere(el => (
				el.key() === 'input-max'
			))

			expect($max).to.have.length(1)

			$max.simulate('change', maxValue)

			const maxState = $el.state('max')
			expect(maxState).to.equal(maxTs)
		})
	})
})

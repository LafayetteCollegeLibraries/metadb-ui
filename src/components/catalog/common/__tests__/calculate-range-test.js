import calculateRange from '../calculate-range'
import { expect } from 'chai'
import yearRange from './data/year-range.json'
import isoDateRange from './data/iso-date-range.json'

const yearModifier = value => Number(value)
const dateModifier = value => Date.parse(value)

describe('catalog/common/calculate-range', function () {
	it('uses a pass-thru function if no valueModifier provided', function () {
		var items = [
			{
				value: 'a',
				hits: 0,
			},
			{
				value: 'z',
				hits: 0,
			},
			{
				value: 'm',
				hits: 0,
			}
		]

		const range = calculateRange(items)
		expect(range.min).to.equal(Infinity)
		expect(range.max).to.equal(-Infinity)
		expect(range.hits).to.equal(0)
	})

	it('calculates the total number of hits', function () {
		const items = yearRange.items
		const totalHits = items.reduce(function (total, item) {
			return total + item.hits
		}, 0)

		const range = calculateRange(yearRange.items, yearModifier)

		expect(range.hits).to.equal(totalHits)
	})

	describe('with string numeric + Number modifier', function () {
		const range = calculateRange(yearRange.items, yearModifier)
		
		it('calculates the min value', function () {
			const min = yearRange.items.reduce(function (min, item) {
				const val = yearModifier(item.value)
				return val < min ? val : min
			}, Infinity)

			expect(range.min).to.equal(min)
		})

		it('calculates the max value', function () {
			const max = yearRange.items.reduce(function (max, item) {
				const val = yearModifier(item.value)
				return val > max ? val : max
			}, -Infinity)

			expect(range.max).to.equal(max)
		})
	})

	describe('with ISO timestamp + Date modifier', function () {
		const range = calculateRange(isoDateRange.items, dateModifier)
		
		it('calculates the min date value', function () {
			const min = isoDateRange.items.reduce(function (current, item) {
				const val = dateModifier(item.value)
				return val < current ? val : current
			}, Infinity)

			expect(range.min).to.equal(min)
		})

		it('calculates the max date value', function () {
			const max = isoDateRange.items.reduce(function (current, item) {
				const val = dateModifier(item.value)
				return val > current ? val : current
			}, -Infinity)

			expect(range.max).to.equal(max)
		})
	})
})

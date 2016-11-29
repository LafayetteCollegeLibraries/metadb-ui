import roundDate from '../round-date-to-interval'
import { INTERVALS } from '../date-intervals'
import { expect } from 'chai'

describe('catalog/common/round-date-to-interval', function () {
	// 2016-11-29T11:18:00Z
	const TIMESTAMP = Date.UTC(2016, 10, 29, 11, 18, 0)

	it('rounds `day` to the day', function () {
		const rounded = roundDate(INTERVALS.DAY, TIMESTAMP)
		const d = new Date(TIMESTAMP)
		const r = new Date(rounded)

		expect(r.getUTCFullYear()).to.equal(d.getUTCFullYear())
		expect(r.getUTCMonth()).to.equal(d.getUTCMonth())
		expect(r.getUTCDate()).to.equal(d.getUTCDate())

		expect(r.getUTCHours()).to.not.equal(d.getUTCHours())
		expect(r.getUTCHours()).to.equal(0)

		expect(r.getUTCMinutes()).to.not.equal(d.getUTCMinutes())
		expect(r.getUTCMinutes()).to.equal(0)
	})

	it('rounds `month` to the month', function () {
		const rounded = roundDate(INTERVALS.MONTH, TIMESTAMP)
		const d = new Date(TIMESTAMP)
		const r = new Date(rounded)

		expect(r.getUTCFullYear()).to.equal(d.getUTCFullYear())
		expect(r.getUTCMonth()).to.equal(d.getUTCMonth())

		expect(r.getUTCDate()).to.not.equal(d.getUTCDate())
		expect(r.getUTCDate()).to.equal(1)

		expect(r.getUTCHours()).to.not.equal(d.getUTCHours())
		expect(r.getUTCHours()).to.equal(0)

		expect(r.getUTCMinutes()).to.not.equal(d.getUTCMinutes())
		expect(r.getUTCMinutes()).to.equal(0)
	})

	it('rounds `year` to the year', function () {
		const rounded = roundDate(INTERVALS.YEAR, TIMESTAMP)
		const d = new Date(TIMESTAMP)
		const r = new Date(rounded)

		expect(r.getUTCFullYear()).to.equal(d.getUTCFullYear())

		expect(r.getUTCMonth()).to.not.equal(d.getUTCMonth())
		expect(r.getUTCMonth()).to.equal(0)

		expect(r.getUTCDate()).to.not.equal(d.getUTCDate())
		expect(r.getUTCDate()).to.equal(1)

		expect(r.getUTCHours()).to.not.equal(d.getUTCHours())
		expect(r.getUTCHours()).to.equal(0)

		expect(r.getUTCMinutes()).to.not.equal(d.getUTCMinutes())
		expect(r.getUTCMinutes()).to.equal(0)
	})
})

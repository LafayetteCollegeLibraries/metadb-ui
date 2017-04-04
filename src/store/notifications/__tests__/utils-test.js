import { expect } from 'chai'
import * as utils from '../utils'

describe('store/notifications/utils', function () {
	describe('#createNotification', function () {
		const start = Date.now()
		const type = utils.OK
		const template = '%(thing)s is for the children'
		const data = { thing: 'Wu-Tang' }

		const notification = utils.createNotification(type, template, data)

		expect(notification).to.have.all.keys(['type', 'message', 'time'])
		expect(notification.type).to.equal(type)
		expect(notification.message).to.equal('Wu-Tang is for the children')
		expect(notification.time).to.be.a.number
		expect(notification.time).to.be.closeTo(start, 1000)
		expect(notification.time).to.be.closeTo(Date.now(), 1000)
	})
})

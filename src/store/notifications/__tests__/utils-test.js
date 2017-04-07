import { expect } from 'chai'
import * as utils from '../utils'

describe('store/notifications/utils', function () {
	describe('#createNotification', function () {
		const start = Date.now()
		const type = utils.OK
		const template = '%(thing)s is for the children'
		const data = { thing: 'Wu-Tang' }
		const notification = utils.createNotification(type, template, data)

		it('creates an object with `type`, `message` and `time` properties', function () {
			expect(notification).to.have.all.keys(['type', 'message', 'time'])
		})

		it('compiles the message with data', function () {
			expect(notification.message).to.not.equal(template)
			expect(notification.message).to.equal('Wu-Tang is for the children')
		})

		it('includes a timestamp', function () {
			expect(notification.time).to.be.a.number
		})
	})

	describe('#errorMessage', function () {
		it('sets the `type` property to ERROR', function () {
			const notification = utils.errorMessage()
			expect(notification.type).to.equal(utils.ERROR)
		})
	})

	describe('#message', function () {
		it('uses the OK `type`', function () {
			const notification = utils.message()
			expect(notification.type).to.equal(utils.OK)
		})
	})

	describe('#successMessage', function () {
		it('uses the OK `type`', function () {
			const notification = utils.successMessage()
			expect(notification.type).to.equal(utils.OK)
		})
	})

	describe('#bulkMessageReducer', function () {
		const WITHOUT_COUNT = '!!no count included!!'
		const WITH_COUNT_DELIMITER = '||'
		const WITH_COUNT = `%(count)d${WITH_COUNT_DELIMITER}%(workDisplay)s`
		const reducer = utils.bulkMessageReducer(WITHOUT_COUNT, WITH_COUNT)

		it('returns the `WITHOUT_COUNT` message when `count` prop missing', function () {
			const results = reducer([], {})
			expect(results).to.have.length(1)

			const result = results[0]
			expect(result).to.have.property('message')
			expect(result.message).to.equal(WITHOUT_COUNT)
		})

		it('returns the `WITH_COUNT` message when the `count` prop is included', function () {
			const count = 10
			const results = reducer([], {payload: {count}})
			expect(results).to.have.length(1)

			const result = results[0]
			expect(result).to.have.property('message')

			const [count_s, ] = result.message.split(WITH_COUNT_DELIMITER)
			expect(Number(count_s)).to.equal(count)
		})

		it('pluralizes "works" for counts > 1 and "work" for counts === 1', function () {
			const SINGLE = 'work'
			const PLURAL = 'works'

			const results0 = reducer([], {payload: { count: 0 }})
			const result0 = results0[0]
			const [ , message0 ] = result0.message.split(WITH_COUNT_DELIMITER)

			expect(message0).to.equal(PLURAL)

			const results1 = reducer([], {payload: { count: 1 }})
			const result1 = results1[0]
			const [ , message1 ] = result1.message.split(WITH_COUNT_DELIMITER)

			expect(message1).to.equal(SINGLE)

			const results2 = reducer([], {payload: { count: 2 }})
			const result2 = results2[0]
			const [ , message2 ] = result2.message.split(WITH_COUNT_DELIMITER)

			expect(message2).to.equal(PLURAL)
		})

		it('uses the `templateWithCount` when `templateWithoutCount` is not included', function () {
			const msg = 'EITHER OR'
			const r = utils.bulkMessageReducer(msg)

			const results1 = r([], {})
			expect(results1).to.have.length(1)

			const result1 = results1[0]
			expect(result1.message).to.equal(msg)

			const results2 = r([], {payload: {count: 10}})
			expect(results2).to.have.length(1)

			const result2 = results2[0]
			expect(result2.message).to.equal(msg)
		})
	})

	describe('#vocabularyMessageReducer', function () {
		const labelReducer = utils.vocabularyMessageReducer('%(label)s')

		it('uses the vocabulary `pref_label` for the label', function () {
			const label = 'cool vocab'
			const results = labelReducer([], {payload: {pref_label: [label]}})
			const result = results[0]

			expect(result.message).to.equal(label)
		})

		it('falls back first to the uri property if no `pref_label`', function () {
			const uri = 'http://example.org'
			const results = labelReducer([], {payload: {uri}})
			const result = results[0]

			expect(result.message).to.equal(uri)
		})

		it('ultimately falls back to "Unknown Vocabulary"', function () {
			const results = labelReducer([], {})
			const result = results[0]
			expect(result.message).to.equal('Unknown Vocabulary')
		})

		it('uses an ERROR message if an `action.error` is true', function () {
			const results = labelReducer([], {error: true, payload: new Error('something went wrong!')})
			const result = results[0]

			expect(result.type).to.equal(utils.ERROR)
		})
	})
})

import { expect } from 'chai'
import reducer, { UNKNOWN_NO_MESSAGE } from '../reducer'
import * as actions from '../actions'
import * as batch from '../../batch/actions'
import * as search from '../../search/actions'
import * as terms from '../../active-vocabulary-terms/actions'
import * as utils from '../utils'

const originalState = [
	{ type: 'SUCCESS', message: 'Hey that one worked!', time: Date.now() },
	{ type: 'ERROR', message: 'But this one did not!', time: Date.now() },
]

const originalStatePure = [].concat(originalState)

describe('Notifications reducer', function () {
	beforeEach(function () {
		expect(originalState).to.deep.equal(originalStatePure)
	})

	it('returns an empty array when state is undefined', function () {
		const result = reducer(undefined, {type: 'nothing'})
		expect(result).to.be.an('array')
		expect(result).to.be.empty
	})

	describe('`clearNotification`', function () {
		it('removes a notification by its index', function () {
			const index = 0
			const action = actions.clearNotification(index)
			const result = reducer(originalState, action)

			expect(result.length).to.be.lessThan(originalState.length)
			expect(originalState.length - result.length).to.equal(1)
			expect(result).to.not.contain(originalState[index])
		})

		it('returns the previous state if no payload is provided', function () {
			const action = actions.clearNotification()
			const result = reducer(originalState, action)

			expect(result).to.deep.equal(originalState)
		})

		it('can handle a stringified index', function () {
			const index = '0'
			const action = actions.clearNotification(index)
			const result = reducer(originalState, action)

			expect(result.length).to.be.lessThan(originalState.length)
			expect(originalState.length - result.length).to.equal(1)
			expect(result).to.not.contain(originalState[Number(index)])
		})

		it('returns the previous state if index > length', function () {
			const index = originalState.length
			const action = actions.clearNotification(index)
			const result = reducer(originalState, action)

			expect(result).to.deep.equal(originalState)
		})
	})

	describe('`batch.batchUpdatingWorksErr`', function () {
		it('returns an ERROR type', function () {
			const action = batch.batchUpdatingWorksErr(new Error('batch updating error'))
			const results = reducer([], action)
			const result = results[0]

			expect(result.type).to.equal(utils.ERROR)
		})
	})

	describe('`search.fetchingSearchErr', function () {
		const err = new Error('!!search err!!')
		const action = search.fetchingSearchErr(err)
		const results = reducer([], action)
		const result = results[0]

		it('returns an ERROR type', function () {
			expect(result.type).to.equal(utils.ERROR)
		})

		it('includes the error message in the notification', function () {
			expect(result.message).to.contain(err.message)
		})

		it('says there was no message if there was not one', function () {
			const action = search.fetchingSearchErr()
			const results = reducer([], action)
			const result = results[0]

			expect(result.message).to.contain(UNKNOWN_NO_MESSAGE)
		})
	})

	describe('`terms.addingTermToVocabularyErr`', function () {
		const term = 'some term'
		const err = new Error('!!terms err!!')
		err.term = term

		const action = terms.addingTermToVocabularyErr(err)
		const results = reducer([], action)
		const result = results[0]

		it('returns an ERROR type', function () {
			expect(result.type).to.equal(utils.ERROR)
		})

		it('contains the term in the message', function () {
			expect(result.message).to.contain(term)
		})

		it('says there was no message if there was not one', function () {
			const action = terms.addingTermToVocabularyErr()
			const results = reducer([], action)
			const result = results[0]

			expect(result.message).to.contain(UNKNOWN_NO_MESSAGE)
		})
	})

	describe('`terms.fetchingVocabularyTermsErr`', function () {
		const err = new Error('!!vocab err!!')
		const action = terms.fetchingVocabularyTermsErr(err)
		const results = reducer([], action)
		const result = results[0]

		it('returns an ERROR type', function () {
			expect(result.type).to.equal(utils.ERROR)
		})

		it('includes the error message in the response message', function () {
			expect(result.message).to.contain(err.message)
		})

		it('says there was no message if there was not one', function () {
			const action = terms.fetchingVocabularyTermsErr()
			const results = reducer([], action)
			const result = results[0]

			expect(result.message).to.contain(UNKNOWN_NO_MESSAGE)
		})
	})

	describe('`terms.updatingTermInVocabularyErr`', function () {
		const err = new Error('!!updating terms err!!')
		err.termLabel = 'term'
		err.vocabulary = {
			pref_label: ['Vocabulary']
		}

		const action = terms.updatingTermInVocabularyErr(err)
		const results = reducer([], action)
		const result = results[0]

		it('returns an ERROR type', function () {
			expect(result.type).to.equal(utils.ERROR)
		})

		it('includes the error message in the response.message', function () {
			expect(result.message).to.contain(err.message)
		})

		it('says there was no message if there was not one', function () {
			const action = terms.updatingTermInVocabularyErr()
			const results = reducer([], action)
			const result = results[0]

			expect(result.message).to.contain(UNKNOWN_NO_MESSAGE)
		})

		it('uses the vocabulary uri if no pref_label', function () {
			const uri = 'http://example.org'
			err.vocabulary = {uri}

			const action = terms.updatingTermInVocabularyErr(err)
			const results = reducer([], action)
			const result = results[0]

			expect(result.message).to.contain(uri)
		})

		it('falls back to "Unknown Vocabulary" if no vocabulary present', function () {
			delete err.vocabulary

			const action = terms.updatingTermInVocabularyErr(err)
			const results = reducer([], action)
			const result = results[0]

			expect(result.message).to.contain('Unknown Vocabulary')
		})
	})
})

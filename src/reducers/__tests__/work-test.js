import { expect } from 'chai'
import workReducer from '../work'
import assign from 'object-assign'

import {
	ADD_EMPTY_VALUE_TO_WORK,
	FETCHING_WORK,
	RECEIVE_WORK,
	REMOVE_VALUE_FROM_WORK,
	SAVED_WORK,
	SAVING_WORK,
	UPDATE_WORK,
} from '../../constants'

const originalState = {
	data: {
		title: ['One Title', 'Two Titles'],
		author: ['Author Name', 'Another author'],
		single_value: ['just one here'],
	},
	updates: {},
	fetchedAt: Date.now(),
	isChanged: false,
	isFetching: false,
	isSaving: false,
}

const originalStatePure = assign({}, originalState)

describe('workReducer', function () {
	afterEach(function () {
		expect(originalState).to.deep.equal(originalStatePure)
	})

	it('returns an empty object when state is undefined', function () {
		const result = workReducer()
		expect(result).to.deep.equal({})
	})

	describe('@FETCHING_WORK', function () {
		it('toggles `isFetching`', function () {
			const action = {type: FETCHING_WORK}
			const result = workReducer(originalState, action)

			expect(result).to.deep.equal({
				isFetching: true,
			})
		})
	})

	describe('@RECEIVE_WORK', function () {
		const action = {
			type: RECEIVE_WORK,
			data: {
				title: ['New Work'],
				author: ['New Author'],
			}
		}

		const result = workReducer(originalState, action)

		it('data differs from the originalState', function () {
			expect(result.data).to.not.deep.equal(originalState.data)
		})

		it('updates the `fetchedAt` property', function () {
			expect(result.fetchedAt).to.be.at.least(originalState.fetchedAt)
		})
	})

	describe('@SAVED_WORK', function () {
		const action = {type: SAVED_WORK}

		let data, updates, state

		beforeEach(function () {
			data = {
				title: ['First Title'],
				author: []
			}

			updates = {
				title: ['First Title', 'Another Author'],
				author: ['The Author']
			}

			state = {
				data,
				updates,
				isChanged: true,
			}
		})

		it('merges data with updates', function () {
			const result = workReducer(state, action)

			expect(result.data.title).to.deep.equal(updates.title)
			expect(result.data.author).to.deep.equal(updates.author)
		})

		it('empties the changes object', function () {
			const result = workReducer(state, action)
			expect(result.updates).to.be.empty
		})

		it('toggles `isChanged` to false', function () {
			const result = workReducer(state, action)
			expect(result.isChanged).to.be.false
		})

		it('toggles `isSaving` to false', function () {
			const result = workReducer(state, action)
			expect(result.isSaving).to.be.false
		})
	})

	describe('@SAVE_WORK', function () {
		const action = {type: SAVING_WORK}

		let state, result

		beforeEach(function () {
			state = assign({}, originalState, {
				updates: {
					title: [].concat(originalState.data.title, 'New Title')
				},
				isChanged: true,
			})

			result = workReducer(state, action)
		})

		it('retains current state (except `isSaving` flag)', function () {
			for (let key in result) {
				if (key === 'isSaving')
					continue

				expect(result[key]).to.deep.equal(state[key])
			}
		})

		it('toggles `isSaving` flag to true', function () {
			expect(result.isSaving).to.be.true
		})
	})
})

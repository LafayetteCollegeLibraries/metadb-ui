import { expect } from 'chai'
import * as actions from '../work'

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import fetchMock from 'fetch-mock'
import {
	ADD_EMPTY_VALUE_TO_WORK,
	FETCHING_WORK,
	FETCHING_WORK_ERR,
	RECEIVE_WORK,
	REMOVE_VALUE_FROM_WORK,
	SAVING_WORK,
	SAVED_WORK,
	UPDATE_WORK,
	WORK_NOT_FOUND_ERR,
} from '../../constants'

const mockStore = configureMockStore([thunk])

const apiWorkUrl = id => (
	`${process.env.API_BASE_URL}/concern/generic_works/${id}.json`
)

describe('Work actionCreator', function () {
	describe('#addEmptyValueToWork', function () {
		it('returns the ADD_EMPTY_VALUE_TO_WORK action + key passed', function () {
			const testKey = 'testKey'
			const store = mockStore({work: {}})
			const expectedAction = [
				{
					type: ADD_EMPTY_VALUE_TO_WORK,
					key: testKey,
				}
			]

			store.dispatch(actions.addEmptyValueToWork(testKey))
			expect(store.getActions()).to.deep.equal(expectedAction)
		})
	})

	describe('#editWorkField', function () {
		it('returns the UPDATE_WORK action + key/index/value passed', function () {
			const key = 'key'
			const index = 0
			const value = 'value'

			const store = mockStore({work: {}})
			const expectedAction = [
				{
					type: UPDATE_WORK,
					key,
					index,
					value,
				}
			]

			store.dispatch(actions.editWorkField(key, index, value))
			expect(store.getActions()).to.deep.equal(expectedAction)
		})
	})

	describe('#fetchWork', function () {
		const id = 'example-id'

		before(function () {
			if (!process.env.API_BASE_URL) {
				this.skip()
				return
			}

			fetchMock
				.get(apiWorkUrl(id), { title: ['HULLO!'] })
				.get(apiWorkUrl('fake-id'), 404)
				.get('*', 500)
		})

		after(fetchMock.restore)


		it('sends FETCHING_WORK and RECEIVE_WORK actions', function () {
			const expectedActions = [
				{type: FETCHING_WORK, id},
				{type: RECEIVE_WORK, data: {title: ['HULLO!']}}
			]

			const store = mockStore({work: {}})

			return store.dispatch(actions.fetchWork(id))
				.then(() => {
					expect(store.getActions()).to.deep.equal(expectedActions)
				})
		})

		it('sends FETCHING_WORK and WORK_NOT_FOUND if not found', function () {
			const id = 'fake-id'
			const store = mockStore({work: {}})

			return store.dispatch(actions.fetchWork(id))
				.then(() => {
					const actions = store.getActions()
					expect(actions[0].type).to.equal(FETCHING_WORK)
					expect(actions[0].id).to.equal(id)
					expect(actions[1].type).to.equal(WORK_NOT_FOUND_ERR)
					expect(actions[1].error.status).to.equal(404)
				})
		})

		it('sends FETCHING_WORK and FETCHING_WORK_ERR if encountering an error', function () {
			const id = 'whatever'
			const store = mockStore({work: {}})

			return store.dispatch(actions.fetchWork(id))
				.then(() => {
					const actions = store.getActions()
					expect(actions[0].type).to.equal(FETCHING_WORK)
					expect(actions[1].id).to.equal(id)
					expect(actions[1].type).to.equal(FETCHING_WORK_ERR)
				})
		})
	})

	describe('#removeValueFromWork', function () {
		it('returns the REMOVE_VALUE_FROM_WORK action + key/index passed', function () {
			const key = 'key'
			const index = 0

			const expectedAction = [
				{
					type: REMOVE_VALUE_FROM_WORK,
					key,
					index,
				}
			]

			const store = mockStore({work: {}})

			store.dispatch(actions.removeValueFromWork(key, index))
			expect(store.getActions()).to.deep.equal(expectedAction)
		})
	})

	describe('#saveWork', function () {
		const id = 'example-work'

		before(function () {
			if (!process.env.API_BASE_URL) {
				this.skip()
				return
			}

			fetchMock.mock({
				matcher: apiWorkUrl(id),
				method: 'PATCH',
				response: {
					status: 200,
					body: {
						status: 'ok'
					}
				}
			})
		})

		after(fetchMock.restore)

		it('dispatches SAVING_WORK and SAVED_WORK when successful', function () {
			const expectedActions = [
				{
					type: SAVING_WORK,
					id,
				},
				{
					type: SAVED_WORK,
				}
			]

			const state = {
				work: {
					data: {
						title: ['Old Title'],
					},
					updates: {
						title: ['New Title'],
					},
				}
			}

			const store = mockStore(state)

			return store.dispatch(actions.saveWork(id))
				.then(() => {
					expect(store.getActions()).to.deep.equal(expectedActions)
				})
		})
	})
})


// 	describe('#saveWork', function () {
// 		xit('updates the work to the API server')
// 	})
// })

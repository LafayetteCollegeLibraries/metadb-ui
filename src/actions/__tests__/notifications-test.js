import { expect } from 'chai'
import * as actionCreators from '../notifications'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { CLEAR_NOTIFICATION } from '../../constants'

const mockStore = configureMockStore([thunk])
const store = mockStore([])

describe('Notifications actionCreator', function () {
	afterEach(function () {
		store.clearActions()
	})

	describe('#clearNotification', function () {
		it('dispatches CLEAR_NOTIFICATION type + index', function () {
			const idx = 0
			store.dispatch(actionCreators.clearNotification(idx))
			const actions = store.getActions()

			expect(actions).to.have.length(1)
			expect(actions[0].type).to.equal(CLEAR_NOTIFICATION)
			expect(actions[0]).to.have.property('index')
			expect(actions[0].index).to.equal(idx)
		})

		it('does not dispatch if no index is passed', function () {
			store.dispatch(actionCreators.clearNotification())
			const actions = store.getActions()
			expect(actions).to.be.empty
		})
	})
})

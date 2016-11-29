import { expect } from 'chai'
import * as actions from '../vocabulary'
import assign from 'object-assign'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import fetchMock from 'fetch-mock'

import {
	CREATE_VOCABULARY_REQUEST,
	CREATE_VOCABULARY_RESPONSE_OK,

	DELETE_VOCABULARY_REQUEST,
	DELETE_VOCABULARY_RESPONSE_OK,

	FETCHING_ALL_VOCABULARIES,
	RECEIVE_ALL_VOCABULARIES,

	UPDATING_VOCABULARY,
	UPDATE_VOCABULARY_OK,
	UPDATE_VOCABULARY_ERR,
} from '../../constants'

import { testVocabulary as VOCAB_DATA } from './data/vocabularies-with-terms'

const mockStore = configureMockStore([thunk])
const API_BASE = process.env.API_BASE_URL

describe('Vocabulary actionCreator', function () {
	beforeEach(function () {
		if (!API_BASE)
			this.skip()
	})
	describe('#createVocabulary', function () {
		beforeEach(function () {
			fetchMock.post(
				`${API_BASE}/vocabularies.json`,
				{ status: 200, body: {status: 'ok'} }
			)
		})

		afterEach(fetchMock.restore)

		const data = {
			label: ['Test Vocabulary'],
			alt_label: ['Test Description'],
			pref_label: [],
			hidden_label: [],
		}

		const store = mockStore({vocabularies: []})

		// the data we get back is the same as the full Vocab output
		// (minus the `terms` array)
		const expectData = assign({}, VOCAB_DATA)
		delete expectData.terms

		const expectActions = [
			{
				type: CREATE_VOCABULARY_REQUEST
			},
			{
				type: CREATE_VOCABULARY_RESPONSE_OK,
				data: expectData,
			}
		]

		it('dispatches CREATE_VOCABULARY_REQUEST{,_OK}', function () {
			return store.dispatch(actions.createVocabulary(data))
				.then(() => {
					expect(store.getActions()).to.deep.equal(expectActions)
				})
		})
	})

	describe('#deleteVocabulary', function () {
		before(function () {
			fetchMock.delete(
				VOCAB_DATA.absolute_path,
				{status: 200, body: {status: 'ok'}}
			)
		})

		after(fetchMock.restore)

		const store = mockStore({vocabularies: [VOCAB_DATA]})
		const expectActions = [
			{
				type: DELETE_VOCABULARY_REQUEST,
			},
			{
				type: DELETE_VOCABULARY_RESPONSE_OK,
				data: VOCAB_DATA,
			}
		]

		it('dispatches DELETE_VOCABULARY_{REQUEST,RESPONSE_OK}', function () {
			return store.dispatch(actions.deleteVocabulary(VOCAB_DATA))
				.then(() => {
					expect(store.getActions()).to.deep.equal(expectActions)
				})
		})

		it('does not send data as part of the DELETE request', function () {
			const opts = fetchMock.lastOptions(VOCAB_DATA.absolute_path)
			expect(opts.body).to.be.empty
		})
	})

	describe('#fetchAllVocabularies', function () {
		beforeEach(function () {
			fetchMock.get(
				`${API_BASE}/vocabularies.json`,
				{
					vocabularies: [assign({}, VOCAB_DATA)]
				}
			)
		})

		afterEach(fetchMock.restore)

		const store = mockStore({vocabularies: []})
		const expectActions = [
			{
				type: FETCHING_ALL_VOCABULARIES
			},
			{
				type: RECEIVE_ALL_VOCABULARIES,
				data: [assign({}, VOCAB_DATA)]
			}
		]

		it('dispatches FETCHING_ALL_VOCABULARIES and RECEIVE_ALL_VOCABULARIES', function () {
			return store.dispatch(actions.fetchAllVocabularies())
				.then(() => {
					expect(store.getActions()).to.deep.equal(expectActions)
				})
		})
	})

	describe('#updateVocabularyMetadata', function () {
		const DATA = assign({}, VOCAB_DATA)
		delete DATA.terms

		const url = DATA.absolute_path

		beforeEach(function () {
			fetchMock.patch(url, {status: 200, body: {status: 'ok'}})
			fetchMock.patch('*', 404)
		})

		afterEach(fetchMock.restore)

		it('patches an update the API', function () {
			const store = mockStore({vocabularies: [DATA]})
			const data = assign({}, DATA)
			data.hidden_label = [`A new hidden label - ${Date.now()}`]

			return store.dispatch(actions.updateVocabularyMetadata(data))
				.then(() => {
					const actions = store.getActions()
					expect(actions).to.have.length(2)
					expect(actions[0].type).to.equal(UPDATING_VOCABULARY)
					expect(actions[1].type).to.equal(UPDATE_VOCABULARY_OK)
				})
		})

		it('dispatches UPDATE_VOCABULARY_ERR when there is a problem', function () {
			const store = mockStore({vocabularies: [DATA]})
			const data = assign({}, DATA)
			data.absolute_path = 'http://this.isnt.real.biz'

			return store.dispatch(actions.updateVocabularyMetadata(data))
				.then(() => {
					throw Error('this should have thrown an error')
				})
				.catch(() => {
					const actions = store.getActions()
					expect(actions).to.have.length(2)
					expect(actions[0].type).to.equal(UPDATING_VOCABULARY)
					expect(actions[1].type).to.equal(UPDATE_VOCABULARY_ERR)
				})
		})
	})
})

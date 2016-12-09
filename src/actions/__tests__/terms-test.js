import { expect } from 'chai'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import fetchMock from 'fetch-mock'
import assign from 'object-assign'
import randomIndex from 'random-array-index'

import {
	addTermToVocabulary,
	bulkEditTermsInVocabulary,
	fetchTermsFromVocabulary,
	removeTermFromVocabulary,
	updateTermInVocabulary,
} from '../terms'

import {
	testVocabulary as VOCAB_ONE,
} from './data/vocabularies-with-terms'

import {
	ADD_TERM_TO_VOCABULARY,
	BULK_EDIT_TERMS,
	FETCHING_VOCABULARY_TERMS,
	RECEIVE_VOCABULARY_TERMS,
	RECEIVE_VOCABULARY_TERMS_ERR,
	REMOVE_TERM_FROM_VOCABULARY,
	UPDATE_TERM_REQUEST,
	UPDATE_TERM_RESPONSE_OK,
	UPDATE_TERM_RESPONSE_ERR,
} from '../../constants'

const mockStore = configureMockStore([thunk])
const API_BASE = process.env.API_BASE_URL

const expectTerm = term => {
	expect(term).to.be.an('object')
	expect(term).to.have.property('uri')
	expect(term).to.have.property('label')
	expect(term).to.have.property('alt_label')
	expect(term).to.have.property('pref_label')
	expect(term).to.have.property('hidden_label')

	expect(term.uri).to.be.a('string')

	expect(term.label).to.be.an('array')
	expect(term.alt_label).to.be.an('array')
	expect(term.pref_label).to.be.an('array')
	expect(term.hidden_label).to.be.an('array')
}

describe('Terms actionCreators', function () {
	beforeEach(function () {
		if (!API_BASE)
			this.skip()
	})

	describe('#addTermToVocabulary', function () {
		const vocab = VOCAB_ONE
		const testTerm = 'test-term'
		const store = mockStore({})

		beforeEach(function () {
			fetchMock.mock(
				vocab.absolute_path,
				{status: 200, body: {status: 'ok'}},
				{method: 'PATCH'}
			)
		})

		afterEach(function () {
			fetchMock.restore()
			store.clearActions()
		})

		const boundAction = addTermToVocabulary.bind(null, vocab, testTerm)

		it('dispatches ADD_TERM_TO_VOCABULARY type', function () {
			return store.dispatch(boundAction()).then(() => {
				const actions = store.getActions()
				expect(actions).to.have.length(1)
				expect(actions[0].type).to.equal(ADD_TERM_TO_VOCABULARY)
			})
		})

		describe('the `action.data` object returned', function () {
			it('is indeed an object', function () {
				return store.dispatch(boundAction()).then(() => {
					expect(store.getActions()[0].data).to.be.an('object')
				})
			})

			it('creates `label` using the term string', function () {
				return store.dispatch(boundAction()).then(() => {
					const actions = store.getActions()
					const action = actions[0]

					expect(action.data.label).to.be.an('array')
					expect(action.data.label).to.have.length(1)
					expect(action.data.label[0]).to.equal(testTerm)
				})
			})

			it('sets `pref_label` to the same value as `label`', function () {
				return store.dispatch(boundAction()).then(() => {
					const actions = store.getActions()
					const action = actions[0]

					expect(action.data.pref_label).to.be.an('array')
					expect(action.data.pref_label).to.have.length(1)
					expect(action.data.pref_label).to.deep.equal(action.data.label)
				})
			})
		})
	})

	describe('#bulkEditTermsInVocabulary', function () {
		const vocab = VOCAB_ONE
		const activeTerms = [].concat(vocab.terms)
		const state = {activeVocabularyTerms: { data: activeTerms }}

		const prevTerms = activeTerms.map(t => t.pref_label[0])
		const newTerms = [
			'Picrodon',
			'Mononychus',
			'Bothriospondylus',
			'Velociraptor',
			'Eolosaurus',
			'Compsosuchus',
		]

		const store = mockStore(state)
		const boundAction = bulkEditTermsInVocabulary.bind(null, vocab)

		beforeEach(function () {
			fetchMock.put(vocab.absolute_path, {status: 200, body: {status: 'ok'}})
		})

		afterEach(function () {
			fetchMock.restore()
			store.clearActions()
		})

		it('dispatches BULK_EDIT_TERMS type', function () {
			return store.dispatch(boundAction(prevTerms))
			.then(() => {
				const actions = store.getActions()
				const action = actions[0]

				expect(actions).to.have.length(1)
				expect(action.type).to.equal(BULK_EDIT_TERMS)
			})
		})

		it('converts terms array of strings into term objects', function () {
			const isString = t => t && typeof t === 'string'
			expect(newTerms.every(isString)).to.be.true

			return store.dispatch(boundAction(newTerms))
			.then(() => store.getActions()[0].terms.forEach(expectTerm))
		})

		it('retains terms previously found in state', function () {
			return store.dispatch(boundAction(prevTerms))
			.then(() => {
				const terms = store.getActions()[0].terms
				expect(terms).to.deep.equal(activeTerms)
			})
		})

	})

	describe('#fetchTermsFromVocabulary', function () {
		const vocab = VOCAB_ONE
		const store = mockStore({})
		const boundAction = fetchTermsFromVocabulary.bind(null, vocab)

		beforeEach(function () {
			fetchMock.get(vocab.absolute_path, {status: 200, body: vocab})
			fetchMock.get('*', 404)
		})

		afterEach(function () {
			fetchMock.restore()
			store.clearActions()
		})

		it('dispatches {FETCHING,RECEIVE}_VOCABULARY_TERMS types', function () {
			return store.dispatch(boundAction())
			.then(() => {
				const actions = store.getActions()
				expect(actions).to.have.length(2)
				expect(actions[0].type).to.equal(FETCHING_VOCABULARY_TERMS)
				expect(actions[1].type).to.equal(RECEIVE_VOCABULARY_TERMS)
			})
		})

		it('dispatches RECEIVE_VOCABULARY_TERMS_ERR when 404\'d', function () {
			const nope = {
				absolute_path: `${API_BASE}/vocabularies/nope.json`,
			}

			return store.dispatch(fetchTermsFromVocabulary(nope))
			.then(() => {
				const actions = store.getActions()
				expect(actions).to.have.length(2)
				expect(actions[0].type).to.equal(FETCHING_VOCABULARY_TERMS)
				expect(actions[1].type).to.equal(RECEIVE_VOCABULARY_TERMS_ERR)
			})
		})

		it('dispatches the terms extracted from vocabulary response', function () {
			return store.dispatch(boundAction())
			.then(() => {
				const actions = store.getActions()
				const terms = actions[1].data

				expect(terms).to.be.an('array')
				terms.forEach(expectTerm)
			})
		})
	})

	describe('#removeTermFromVocabulary', function () {
		const vocab = VOCAB_ONE
		const terms = [].concat(vocab.terms)

		const removeRandomTerm = () => {
			const index = randomIndex(terms)
			const term = terms[index].pref_label[0]

			return removeTermFromVocabulary(vocab, term, index)
		}

		const state = {
			activeVocabularyTerms: {
				data: terms,
			}
		}

		const store = mockStore(state)

		beforeEach(function () {
			fetchMock.put(vocab.absolute_path, {status: 200, body: {status: 'ok'}})
		})

		afterEach(function () {
			fetchMock.restore()
			store.clearActions()
		})

		it('dispatches REMOVE_TERM_FROM_VOCABULARY type', function () {
			return store.dispatch(removeRandomTerm())
			.then(() => {
				const actions = store.getActions()
				expect(actions).to.have.length(1)
				expect(actions[0].type).to.equal(REMOVE_TERM_FROM_VOCABULARY)
			})
		})

		it('sends index, term, and vocabulary data with action', function () {
			return store.dispatch(removeRandomTerm())
			.then(() => {
				const action = store.getActions()[0]
				expect(action).to.have.property('index')
				expect(action).to.have.property('term')
				expect(action).to.have.property('vocabulary')
			})
		})

		it('slices the term out of the array', function () {
			return store.dispatch(removeRandomTerm())
			.then(() => {
				let body = fetchMock.lastOptions().body
				if (typeof body === 'string')
					body = JSON.parse(body)

				const stateTerms = store.getState().activeVocabularyTerms.data
				const sentTerms = body.vocabulary.terms

				expect(stateTerms.length).to.be.greaterThan(sentTerms.length)
				expect(stateTerms.length - sentTerms.length).to.equal(1)

				const term = store.getActions()[0].term

				expect(sentTerms.some(t => t.pref_label.indexOf(term) > -1)).to.be.false
			})
		})
	})

	describe('#updateTermInVocabulary', function () {
		const vocab = VOCAB_ONE
		const terms = [].concat(vocab.terms)
		const store = mockStore({})

		const getRandomTerm = () => {
			const index = randomIndex(terms)
			return assign({}, terms[index])
		}

		const updateRandomTerm = () => {
			const term = getRandomTerm()

			// see https://github.com/dariusk/corpora/blob/master/data/games/wrestling_moves.json
			const pool = [
				'Double inverted DDT', 'Elevated jawbreaker', 'Elevated splash',
				'Enzuigiri', 'European uppercut', 'Eye poke', 'Go 2 Sleep',
			]

			const update = pool[randomIndex(pool)]
			term.alt_label.push(update)

			return term
		}

		beforeEach(function () {
			fetchMock.mock(
				vocab.absolute_path,
				{status: 200, body: {status: 'ok'}},
				{method: 'PATCH'}
			)
			fetchMock.mock('*', 404, {method: 'PATCH'})
		})

		afterEach(function () {
			fetchMock.restore()
			store.clearActions()
		})

		it('dispatches UPDATE_TERM_{REQUEST,RESPONSE_OK} types', function () {
			const term = updateRandomTerm()
			const termStr = term.pref_label[0]
			return store.dispatch(updateTermInVocabulary(vocab, termStr, term))
			.then(() => {
				const actions = store.getActions()
				expect(actions).to.have.length(2)
				expect(actions[0].type).to.equal(UPDATE_TERM_REQUEST)
				expect(actions[1].type).to.equal(UPDATE_TERM_RESPONSE_OK)
			})
		})

		it('dispatches UPDATE_TERM_{REQUEST,RESPONSE_ERR} when 404\'d', function () {
			const nope = {
				absolute_path: 'http://nope.org'
			}

			const term = updateRandomTerm()
			const termStr = term.pref_label[0]

			return store.dispatch(updateTermInVocabulary(nope, termStr, term))
			.then(() => {
				const actions = store.getActions()
				expect(actions).to.have.length(2)
				expect(actions[0].type).to.equal(UPDATE_TERM_REQUEST)
				expect(actions[1].type).to.equal(UPDATE_TERM_RESPONSE_ERR)
			})
		})

		it('sends the previous pref_label with action', function () {
			const term = getRandomTerm()
			const termStr = term.pref_label[0]

			term.pref_label = ['=^_^= ~~~ new Pref Label']

			return store.dispatch(updateTermInVocabulary(vocab, termStr, term))
			.then(() => {
				const actions = store.getActions()

				expect(actions).to.have.length(2)

				const update = actions[1]
				expect(update.previousPrefLabel).to.not.equal(update.data.pref_label[0])
				expect(update.previousPrefLabel).to.equal(termStr)
			})
		})
	})
})

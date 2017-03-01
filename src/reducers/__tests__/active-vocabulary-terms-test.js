import { expect } from 'chai'
import termsReducer from '../active-vocabulary-terms'
import assign from 'object-assign'
import randomIndex from 'random-array-index'

import {
  ADD_TERM_TO_VOCABULARY,
  BULK_EDIT_TERMS,
  FETCHING_VOCABULARY_TERMS,
  RECEIVE_VOCABULARY_TERMS,
  REMOVE_TERM_FROM_VOCABULARY,
  UPDATE_TERM_RESPONSE_OK,
} from '../../constants'

import createNewTerm from '../../../lib/create-new-term'
import * as originalState from './data/active-terms.json'

const originalStatePure = assign({}, originalState)

describe('activeVocabularyTermsReducer', function () {
  afterEach(function () {
    expect(originalState).to.deep.equal(originalStatePure)
  })

  it('returns an empty object when state is undefined', function () {
    const result = termsReducer()
    const toString = Object.prototype.toString

    expect(result).to.be.empty
    expect(toString.call(result)).to.equal('[object Object]')
  })

  describe('@ADD_TERM_TO_VOCABULARY', function () {
    it('appends newly-created term to the `data` object', function () {
      const term = 'whaaaa?'
      const created = createNewTerm(term, originalState.vocabularyUri)
      const action = {
        type: ADD_TERM_TO_VOCABULARY,
        data: created,
        vocabulary: {
          uri: originalState.vocabularyUri,
        }
      }

      const result = termsReducer(originalState, action)

      expect(result.data.length).to.be.greaterThan(originalState.data.length)
      expect(result.data.length - originalState.data.length).to.equal(1)

      expect(result.data[result.data.length - 1]).to.deep.equal(created)
    })
  })

  describe('@BULK_EDIT_TERMS', function () {
    const prev = [
      {uri: 'https://example.com/vocab/test1', pref_label: ['test1']},
      {uri: 'https://example.com/vocab/test2', pref_label: ['test2']},
    ]

    const update = [
      {uri: 'https://example.com/vocab/test1', pref_label: ['new test1']},
      {uri: 'https://example.com/vocab/test2', pref_label: ['test2']},
      {uri: 'https://example.com/vocab/test3', pref_label: ['test3']},
    ]

    const action = {
      type: BULK_EDIT_TERMS,
      terms: update,
      vocabulary: {
        uri: 'https://example.com/vocab',
        label: ['Test Vocab'],
        pref_label: ['Test Vocab'],
      },
    }

    const state = assign({}, originalState)
    state.data = prev
    state.vocabularyUri = action.vocabulary.uri

    const result = termsReducer(state, action)

    it('replaces the previous state with new terms objects', function () {
      expect(result.data).to.not.deep.equal(state.data)
      expect(result.data).to.deep.equal(update)
    })


  })

  describe('@FETCHING_VOCABULARY_TERMS', function () {
    const action = {type: FETCHING_VOCABULARY_TERMS}
    const result = termsReducer(originalState, action)
    
    it('toggles `isFetching` flag to true', function () {
      expect(originalState.isFetching).to.not.be.true
      expect(result.isFetching).to.be.true
    })

    it('sets `data` to an empty array', function () {
      expect(originalState.data).to.not.be.empty
      expect(result.data).to.be.empty
    })
  })

  describe('@RECEIVE_VOCABULARY_TERMS', function () {
    const action = {
      type: RECEIVE_VOCABULARY_TERMS,
      terms: [
        {uri: 'http://whatever.org'},
        {uri: 'http://whatever.org'},
      ],
      vocabulary: {
        uri: originalState.vocabularyUri,
      },
    }

    const result = termsReducer(originalState, action)

    it('replaces state data w/ new array of terms', function () {
      expect(result.data).to.not.deep.equal(originalState.data)
    })

    it('sets `isFetching` flag to false', function () {
      expect(result.isFetching).to.be.false
    })

    it('resets the `fetchedAt` time', function () {
      expect(result.fetchedAt).to.be.at.least(originalState.fetchedAt + 1)
    })
  })

  describe('@REMOVE_TERM_FROM_VOCABULARY', function () {
    const index = randomIndex(originalState.data)
    const action = {
      type: REMOVE_TERM_FROM_VOCABULARY,
      index,
      vocabulary: {
        uri: originalState.vocabularyUri,
      },
    }

    const result = termsReducer(originalState, action)

    it('removes a term from the `data` array by index', function () {
      expect(result.data.length).to.be.lessThan(originalState.data.length)
      expect(originalState.data.length - result.data.length).to.equal(1)
    })
  })

  describe('@UPDATE_TERM_RESPONSE_OK', function () {
    it('changes a term to the update passed', function () {
      const index = randomIndex(originalState.data)
      const original = originalState.data[index]
      const copy = assign({}, original)

      copy.alt_label = [].concat(
        copy.alt_label,
        'Hey here is a new alt_label',
        'and another!'
      )

      const prefLabel = original.pref_label[0]

      const action = {
        type: UPDATE_TERM_RESPONSE_OK,
        previousPrefLabel: prefLabel,
        data: copy,
        vocabulary: {
          uri: originalState.vocabularyUri,
        },
      }

      const result = termsReducer(originalState, action)

      expect(result.data).to.have.length(originalState.data.length)
      expect(result.data[index].alt_label).to.not.deep.equal(originalState.data[index].alt_label)
    })

    it('updates the correct term when pref_label is changed', function () {
      const index = randomIndex(originalState.data)
      const original = originalState.data[index]
      const copy = assign({}, original)
      const newLabel = 'Hey I am a new label!'

      copy.label = [].concat(
        copy.label,
        newLabel
      )

      copy.pref_label = [newLabel]

      const prefLabel = original.pref_label[0]

      const action = {
        type: UPDATE_TERM_RESPONSE_OK,
        previousPrefLabel: prefLabel,
        data: copy,
        vocabulary: {
          uri: originalState.vocabularyUri,
        },
      }

      const result = termsReducer(originalState, action)

      expect(result.data).to.have.length(originalState.data.length)
      expect(result.data[index].pref_label)
        .to.not.deep.equal(originalState.data[index].pref_label)
    })
  })
})

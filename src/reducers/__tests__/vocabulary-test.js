import { expect } from 'chai'
import vocabReducer from '../vocabularies'
import * as originalState from './data/vocabularies.json'
import assign from 'object-assign'
import randomIndex from 'random-array-index'

import {
  ADD_TERM_TO_VOCABULARY,
  BULK_EDIT_TERMS,
  CREATE_VOCABULARY_RESPONSE_OK,
  DELETE_VOCABULARY_RESPONSE_OK,
  FETCHING_ALL_VOCABULARIES,
  REMOVE_TERM_FROM_VOCABULARY,
} from '../../constants'

const originalStatePure = assign({}, originalState)

describe('vocabularyReducer', function () {
  afterEach(function () {
    expect(originalState).to.deep.equal(originalStatePure)
  })

  it('returns an empty object when state is undefined', function () {
    const result = vocabReducer()

    expect(result).to.be.empty
    expect(result).to.deep.equal({})
  })

  describe('@ADD_TERM_TO_VOCABULARY', function () {
    it('increments the `term_count` property', function () {
      const originalData = originalState.data
      const idx = randomIndex(originalData)

      const originalVocab = originalData[idx]
      const uri = originalVocab.uri

      const action = {
        type: ADD_TERM_TO_VOCABULARY,
        term: 'whatever',
        uri,
      }

      const result = vocabReducer(originalState, action)
      const updatedVocab = result.data[idx]

      expect(updatedVocab.term_count).to.be.greaterThan(originalVocab.term_count)
      expect(updatedVocab.term_count - originalVocab.term_count).to.equal(1)
    })
  })

  describe('@BULK_EDIT_TERMS', function () {
    it('updates the `term_count` property to new count', function () {
      const originalData = originalState.data
      const idx = randomIndex(originalData)
      const vocab = originalData[idx]
      const originalCount = vocab.term_count

      const rando = () => Math.floor(Math.random() * 10)

      let newCount = rando()
      if (newCount === originalCount)
        newCount++

      const updates = []

      for (let i = 0; i <= newCount; i++) {
        updates.push({
          uri: 'http://lol.club/' + i,
          pref_label: ['Term ' + i],
        })
      }

      const action = {
        type: BULK_EDIT_TERMS,
        terms: updates,
        vocabulary: vocab,
      }

      const result = vocabReducer(originalState, action)
      const newData = result.data[idx]

      expect(newData.term_count).to.not.equal(originalData.term_count)
      expect(newData.term_count).to.equal(action.terms.length)
    })
  })

  describe('@CREATE_VOCABULARY_RESPONSE_OK', function () {
    const action = {
      type: CREATE_VOCABULARY_RESPONSE_OK,
      data: {
        uri: 'http://example.com/ns/newVocabEntry',
        label: ['New Vocab'],
        alt_label: [],
        hidden_label: [],
        pref_label: ['New Vocab'],
      }
    }

    const result = vocabReducer(originalState, action)

    it('appends an empty `term_count` key', function () {
      const copy = [].concat(result.data)
      const target = copy.pop()

      expect(target.uri).to.equal(action.data.uri)
      expect(target.term_count).to.not.be.undefined
      expect(target.term_count).to.equal(0)
    })

    it('adds vocabulary to state.data', function () {
      const origLen = originalState.data.length
      const resLen = result.data.length

      expect(resLen).to.be.greaterThan(origLen)
      expect(resLen - origLen).to.equal(1)
      expect(result.data[resLen - 1].uri).to.equal(action.data.uri)
    })
  })

  describe('@DELETE_VOCABULARY_RESPONSE_OK', function () {
    const originalData = originalState.data
    const idx = randomIndex(originalData)
    const target = originalData[idx]

    const action = {
      type: DELETE_VOCABULARY_RESPONSE_OK,
      data: target,
    }

    const result = vocabReducer(originalState, action)

    it('removes the target vocabulary from the vocab list', function () {
      expect(originalData.length).to.be.greaterThan(result.data.length)
      expect(originalData.length - result.data.length).to.equal(1)
    })
  })

  describe('@FETCHING_ALL_VOCABULARIES', function () {
    it('sets the `isFetching` flag to true', function () {
      const action = {type: FETCHING_ALL_VOCABULARIES}
      const result = vocabReducer(originalState, action)

      expect(result.isFetching).to.be.true
    })
  })

  describe('@REMOVE_TERM_FROM_VOCABULARY', function () {
    it('decrements the `term_count` property', function () {
      const originalData = originalState.data
      const idx = randomIndex(originalData)

      const originalVocab = originalData[idx]

      const action = {
        type: REMOVE_TERM_FROM_VOCABULARY,
        term: 'whatever',
        vocabulary: originalVocab,
      }

      const result = vocabReducer(originalState, action)
      const updatedVocab = result.data[idx]

      expect(updatedVocab.term_count).to.be.lessThan(originalVocab.term_count)
      expect(originalVocab.term_count - updatedVocab.term_count).to.equal(1)
    })
  })
})

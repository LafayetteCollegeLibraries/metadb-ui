import assign from 'object-assign'
import findIndex from 'array-find-index'

import {
  ADD_TERM_TO_VOCABULARY,
  BULK_EDIT_TERMS,
  CREATE_VOCABULARY_RESPONSE_OK,
  DELETE_VOCABULARY_RESPONSE_OK,
  FETCHING_ALL_VOCABULARIES,
  RECEIVE_ALL_VOCABULARIES,
  REMOVE_TERM_FROM_VOCABULARY,
  UPDATE_VOCABULARY_OK,
} from '../constants'

export default function vocabularyReducer (state, action) {
  if (typeof state === 'undefined') 
    return {}

  switch (action.type) {
    case ADD_TERM_TO_VOCABULARY:
      return addTermToVocab(state, action)

    case BULK_EDIT_TERMS:
      return bulkEditTerms(state, action)

    case CREATE_VOCABULARY_RESPONSE_OK:
      return createVocabulary(state, action)

    case DELETE_VOCABULARY_RESPONSE_OK:
      return deleteVocabulary(state, action)

    case FETCHING_ALL_VOCABULARIES:
      return fetchingAllVocabs(state, action)

    case RECEIVE_ALL_VOCABULARIES:
      return receiveAllVocabs(state, action)

    case REMOVE_TERM_FROM_VOCABULARY:
      return removeTermFromVocabulary(state, action)

    case UPDATE_VOCABULARY_OK:
      return updateVocab(state, action)

    default:
      return state
  }
}

// active terms are managed in a separate state key (`activeVocabularyTerms`)
// but we should increment the `term_count` + save ourselves an API call
function addTermToVocab (state, action) {
  const uri = action.uri
  const idx = findIndex(state.data, v => v.uri === uri)
  const vocab = assign({}, state.data[idx])

  if (!vocab)
    return state

  vocab.term_count++

  const data = [].concat(
    state.data.slice(0, idx),
    vocab,
    state.data.slice(idx + 1)
  )

  return assign({}, state, {data})
}

function bulkEditTerms (state, action) {
  const uri = action.vocabulary.uri
  const idx = findIndex(state.data, vocab => vocab.uri === uri)

  if (idx === -1)
    return state

  const target = assign({}, state.data[idx])
  target.term_count = action.terms.length

  const data = [].concat(
    state.data.slice(0, idx),
    target,
    state.data.slice(idx + 1)
  )

  return assign({}, state, {data})
}

function createVocabulary (state, action) {
  const vocabs = [].concat(state.data)
  const data = assign({}, action.data)
  data.term_count = 0

  vocabs.push(data)

  return assign({}, state, {data: vocabs})
}

function deleteVocabulary (state, action) {
  const target = action.data
  const idx = findIndex(state.data, vocab => vocab.uri === target.uri)

  if (idx === -1)
    return state

  const data = [].concat(
    state.data.slice(0, idx),
    state.data.slice(idx + 1)
  )

  return assign({}, state, {data})
}
 
function fetchingAllVocabs (/* state, action */) {
  return { isFetching: true }
}

function receiveAllVocabs (state, action) {
  return { 
    isFetching: false,
    fetchedAt: Date.now(),
    data: action.data,
  }
}

function removeTermFromVocabulary (state, action) {
  const uri = action.vocabulary.uri
  const idx = findIndex(state.data, v => v.uri === uri)

  // couldn't find the vocabulary, let's bail
  if (idx === -1)
    return state

  const vocab = assign({}, state.data[idx])

  if (!vocab)
    return state

  if (vocab.term_count)
    vocab.term_count--

  const data = [].concat(
    state.data.slice(0, idx),
    vocab,
    state.data.slice(idx + 1)
  )

  return assign({}, state, {data})
}

function updateVocab (state/*, action */) {

  return state  
}

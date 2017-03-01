import assign from 'object-assign'
import { RECEIVE_AUTOCOMPLETE_TERMS } from '../constants'

export default function autocompleteTermsReducer (state, action) {
  if (typeof state === 'undefined')
    return {}

  switch (action.type) {
    case RECEIVE_AUTOCOMPLETE_TERMS:
      return receiveTerms(state, action)

    default:
      return state
  }
}

function receiveTerms (state, action) {
  const terms = action.terms
  const uri = action.vocabulary.uri
  const update = assign({}, state)

  update[uri] = terms

  return update
}

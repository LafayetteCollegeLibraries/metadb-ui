import { createAction } from 'redux-actions'
import * as utils from './utils'
import * as api from './endpoints'
import { getVocabulary } from '../vocabulary/endpoints'

export const addedTermToVocabulary = createAction('added term to vocabulary')
export const addingTermToVocabulary = createAction('adding term to vocabulary')
export const addingTermToVocabularyErr = createAction('error adding term to vocabulary')
export const bulkEditedTerms = createAction('bulk edited terms')
export const bulkEditingTerms = createAction('bulk editing terms')
export const bulkEditingTermsErr = createAction('error bulk editing terms')
export const fetchedVocabularyTerms = createAction('fetched vocabulary terms')
export const fetchingVocabularyTerms = createAction('fetching vocabulary terms')
export const fetchingVocabularyTermsErr = createAction('error fetching vocabulary terms')
export const removedTermFromVocabulary = createAction('removed term from vocabulary')
export const removingTermFromVocabulary = createAction('removing term from vocabulary')
export const removingTermFromVocabularyErr = createAction('error removing term from vocabulary')
export const updatedTermInVocabulary = createAction('updated term in vocabulary')
export const updatingTermInVocabulary = createAction('updating term in vocabulary')
export const updatingTermInVocabularyErr = createAction('error updating term in vocabulary')

// 1. creates the term object
// 2. makes an API request to add new term
export const addTermToVocabulary = (vocabulary, term) => {
	return dispatch => {
		const newTerm = utils.createNewTerm(term, vocabulary)

		dispatch(addingTermToVocabulary({vocabulary, term: newTerm}))

		return api.addTerm(vocabulary, newTerm)
			.then(() => {
				dispatch(addedTermToVocabulary({vocabulary, term: newTerm}))
			})
			.catch(error => {
				error.term = term
				dispatch(addingTermToVocabularyErr(error))
			})
	}
}

export const bulkEditTermsInVocabulary = (vocabulary, terms) => {
	return (dispatch, getState) => {
		const prevTerms = getState().activeVocabularyTerms.data

		// cut down on the # of array traversals by building an index
		// using the pref_label as a key
		const indexed = prevTerms.reduce((out, term) => {
			const key = term.pref_label[0]
			out[key] = term

			return out
		}, {})

		const updates = terms.map(term => {
			if (indexed[term]) {
				return indexed[term]
			}

			return utils.createNewTerm(term, vocabulary)
		})

		dispatch(bulkEditingTerms({terms: updates, vocabulary}))

		return api.putTerms(vocabulary, updates)
			.then(() => dispatch(bulkEditedTerms({terms: updates, vocabulary})))
			.catch(error => dispatch(bulkEditingTermsErr(error)))
	}
}

export const fetchTermsFromVocabulary = vocabulary => {
	return dispatch => {
		dispatch(fetchingVocabularyTerms({vocabulary}))

		return getVocabulary(vocabulary)
			.then(res => res.terms)
			.then(terms => {
				dispatch(fetchedVocabularyTerms({terms, vocabulary}))
			})
			.catch(error => {
				error.vocabulary = vocabulary

				dispatch(fetchingVocabularyTermsErr(error))
			})
	}
}

// currently, the way we can remove a term is by omitting it
// in a PUT request of terms. In the future, a `/terms` API
// might open up so that only a DELETE request to an absolute_path
// would be needed to remove a term
export const removeTermFromVocabulary = (vocabulary, termData, index) => {
	return (dispatch, getState) => {
		const termsList = getState().activeVocabularyTerms.data
		const terms = [].concat(
			termsList.slice(0, index),
			termsList.slice(index + 1)
		)

		dispatch(removingTermFromVocabulary({term: termData, vocabulary, index}))

		return api.putTerms(vocabulary, terms)
			.then(() => {
				dispatch(removedTermFromVocabulary({term: termData, vocabulary, index}))
			})
			.catch(error => {
				dispatch(removingTermFromVocabularyErr(error))
			})
	}
}

export const updateTermInVocabulary = (vocabulary, label, data) => {
	return dispatch => {
		dispatch(updatingTermInVocabulary({vocabulary, data}))

		return api.patchTerm(vocabulary, data)
			.then(() => {
				dispatch(updatedTermInVocabulary({
					previousPrefLabel: label,
					data,
					vocabulary,
				}))
			})
			.catch(error => {
				error.termLabel = label
				error.vocabulary = vocabulary
				dispatch(updatingTermInVocabularyErr(error))
			})
	}
}

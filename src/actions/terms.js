import {
	ADD_TERM_TO_VOCABULARY,
	ADD_TERM_TO_VOCABULARY_ERR,

	BULK_EDIT_TERMS,

	FETCHING_VOCABULARY_TERMS,

	RECEIVE_VOCABULARY_TERMS,
	RECEIVE_VOCABULARY_TERMS_ERR,

	REMOVE_TERM_FROM_VOCABULARY,

	UPDATE_TERM_REQUEST,
	UPDATE_TERM_RESPONSE_ERR,
	UPDATE_TERM_RESPONSE_OK,
} from '../constants'

import {
	addTermToVocabulary as addTerm,
	getVocabulary,
	patchTerm,
	putTerms,
} from '../../lib/api'

import createNewTerm from '../../lib/create-new-term'

function mintUri (vocab, term) {
	const authBaseUrl = vocab.uri
	const cameledTerm = term
		.replace(/[^0-9a-zA-Z\s]/g, '')
		.replace(/\s+/, ' ')
		.toLowerCase()
		.split(' ')
		.map((w, i) => {
			if (i === 0) return w
			return w.substr(0,1).toUpperCase() + w.substr(1)
		}).join('')

	return `${authBaseUrl}/${cameledTerm}`
}

// 1. creates the term object
// 2. makes an API request to add new term
// 3. dispatches:
//		1. ADD_TERM_TO_VOCABULARY
//	  2. UPDATE_VOCABULARY_TERM_COUNT

export const addTermToVocabulary = function (vocabulary, term) {
	return dispatch => {
		const newTerm = createNewTerm(term, vocabulary)
		const uri = vocabulary.uri

		// Eventually I expect this will be handled on the server, but until then,
		// a URI needs to be passed for the term to be accepted, so we'll create a
		// mock one.
		newTerm.uri = mintUri(vocabulary, term)

		return addTerm(vocabulary, newTerm)
			.then(() => {
				dispatch({
					type: ADD_TERM_TO_VOCABULARY,
					data: newTerm,
					uri,
					vocabulary,
				})
			})
			.catch(error => {
				dispatch({
					type: ADD_TERM_TO_VOCABULARY_ERR,
					error,
					term,
				})
			})
	}
}

export const bulkEditTermsInVocabulary = (vocabulary, terms) => {
	return (dispatch, getState) => {

		const prevTerms = getState().activeVocabularyTerms.data

		// cut down on the # of array traversals by building an index
		// `{ termUri: indexInPrevTerms }`
		const indexed = {}
		prevTerms.forEach((term, index) => (
			indexed[term.pref_label[0]] = index
		))

		const updates = terms.map(term => {
			const idx = indexed[term]

			if (typeof idx !== 'undefined')
				return prevTerms[idx]

			return createNewTerm(term, vocabulary)
		})

		return putTerms(vocabulary, updates)
			.then(() => {
				dispatch({
					type: BULK_EDIT_TERMS,
					terms: updates,
					vocabulary,
				})
			})
			//.catch(function (err) {})
	}
}

export const fetchTermsFromVocabulary = vocabulary => {
	return dispatch => {
		dispatch({
			type: FETCHING_VOCABULARY_TERMS,
			vocabulary,
		})

		return getVocabulary(vocabulary)
			.then(results => results.terms)
			.then(terms => {
				dispatch({
					type: RECEIVE_VOCABULARY_TERMS,
					data: terms,
					vocabulary,
				})
			})
			.catch(error => {
				dispatch({
					type: RECEIVE_VOCABULARY_TERMS_ERR,
					error,
					vocabulary,
				})
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

		return putTerms(vocabulary, terms)
			.then(() => {
				dispatch({
					type: REMOVE_TERM_FROM_VOCABULARY,
					index,
					term: termData,
					vocabulary,
				})
			})
			//.catch(err => {})
	}
}

export const updateTermInVocabulary = function (vocabulary, term, data) {
	return dispatch => {
		dispatch({type: UPDATE_TERM_REQUEST})

		return patchTerm(vocabulary, data)
			.then(() => {
				dispatch({
					type: UPDATE_TERM_RESPONSE_OK,
					previousPrefLabel: term,
					data,
					vocabulary,
				})
			})
			.catch(error => {
				dispatch({
					type: UPDATE_TERM_RESPONSE_ERR,
					error,
					term,
					vocabulary,
				})
			})
	}
}

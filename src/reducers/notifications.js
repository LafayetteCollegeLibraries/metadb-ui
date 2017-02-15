import { sprintf } from 'sprintf-js'

import {
	CLEAR_NOTIFICATION,

	// term constants
	ADD_TERM_TO_VOCABULARY_ERR,
	RECEIVE_VOCABULARY_TERMS_ERR,
	UPDATE_TERM_RESPONSE_ERR,

	// vocab constants
	CREATE_VOCABULARY_RESPONSE_ERR,
	CREATE_VOCABULARY_RESPONSE_OK,
	DELETE_VOCABULARY_RESPONSE_ERR,
	DELETE_VOCABULARY_RESPONSE_OK,
	FETCHING_ALL_VOCABULARIES_ERR,
	UPDATE_VOCABULARY_ERR,

	// search constants
	RECEIVE_SEARCH_ERR,

	// types
	NOTIFICATION_ERR as ERROR,
	NOTIFICATION_SUCCESS as SUCCESS,
} from '../constants'

import * as messages from '../messages'

export default function notificationReducer (state, action) {
	if (typeof state === 'undefined')
		return []

	// CLEAR_NOTIFICATION returns a new state, so we'll check for
	// that action first, before generating a message
	if (action.type === CLEAR_NOTIFICATION)
		return clearNotification(state, action)

	const message = getMessage(action)

	// the state remains the same if we come out of `getMessage` empty-handed
	if (!message) return state

	return [].concat(state, message).filter(Boolean)
}

function getMessage (action) {
	switch (action.type) {
		case ADD_TERM_TO_VOCABULARY_ERR:
			return addTermToVocabError(action)

		case CREATE_VOCABULARY_RESPONSE_ERR:
			return createVocabularyError(action)

		case CREATE_VOCABULARY_RESPONSE_OK:
			return createVocabularySuccess(action)

		case DELETE_VOCABULARY_RESPONSE_ERR:
			return deleteVocabularyError(action)

		case DELETE_VOCABULARY_RESPONSE_OK:
			return deleteVocabularySuccess(action)

		case FETCHING_ALL_VOCABULARIES_ERR:
			return fetchingVocabulariesError(action)

		case RECEIVE_SEARCH_ERR:
			return receiveSearchError(action)

		case RECEIVE_VOCABULARY_TERMS_ERR:
			return receiveVocabularyTermsError(action)

		case UPDATE_TERM_RESPONSE_ERR:
			return updateTermError(action)

		case UPDATE_VOCABULARY_ERR:
			return updateVocabularyError(action)
	}
}

function clearNotification (state, action) {
	const idx = action.index
	return [].concat(
		state.slice(0, idx),
		state.slice(idx + 1)
	)
}

// helper fns to reduce waste
function createNotification (type, message) {
	return {
		type,
		message,
		time: Date.now(),
	}
}

function success (message) { return createNotification(SUCCESS, message) }
function error (message) { return createNotification(ERROR, message) }

function addTermToVocabError (action) {
	const tmpl = messages.CREATE_TERM_ERR
	const errMsg = action.error.message
	const term = action.term
	const message = sprintf(tmpl, term, errMsg)

	return error(message)
}


function createVocabularyError (action) {
	const tmpl = messages.CREATE_VOCABULARY_ERR
	const message = sprintf(tmpl, action.error.message)

	return error(message)
}

function createVocabularySuccess (action) {
	const tmpl = messages.CREATE_VOCABULARY_SUCCESS
	const vocabName = action.data.pref_label[0]
	const message = sprintf(tmpl, vocabName)

	return success(message)
}

function deleteVocabularyError (action) {
	const tmpl = messages.DELETE_VOCABULARY_ERR
	const name = action.data.pref_label[0]
	const errmsg = action.error.message
	const message = sprintf(tmpl, name, errmsg)

	return error(message)
}

function deleteVocabularySuccess (action) {
	const tmpl = messages.DELETE_VOCABULARY_SUCCESS
	const name = action.data.pref_label[0]
	const message = sprintf(tmpl, name)

	return success(message)
}

function fetchingVocabulariesError (action) {
	const tmpl = messages.FETCHING_VOCABULARIES_ERR
	const msg = action.error.message
	const message = sprintf(tmpl, msg)

	return error(message)
}

function receiveSearchError (action) {
	const tmpl = messages.RECEIVE_SEARCH_ERR
	const msg = action.error.message
	const message = sprintf(tmpl, msg)

	return error(message)
}

function receiveVocabularyTermsError (action) {
	const tmpl = messages.RECEIVE_VOCABULARY_TERMS_ERR
	const vocab = action.vocabulary.pref_label[0] || action.vocabulary.uri
	const msg = action.error.message
	const message = sprintf(tmpl, vocab, msg)

	return error(message)
}

function updateTermError (action) {
	const tmpl = messages.UPDATE_TERM_RESPONSE_ERR
	const vocab = action.vocabulary.pref_label[0] || action.vocabulary.uri
	const term = action.term.pref_label[0] || action.term.uri
	const msg = action.error.message
	const message = sprintf(tmpl, vocab, term, msg)

	return error(message)
}

function updateVocabularyError (action) {
	const tmpl = messages.UPDATE_VOCABULARY_ERR
	const name = action.vocabulary.pref_label[0]
	const msg = action.error.message
	const message = sprintf(tmpl, name, msg)

	return error(message)
}

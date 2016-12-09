import { sprintf } from 'sprintf-js'

import {
	CLEAR_ALL_NOTIFICATIONS,
	CLEAR_NOTIFICATION,
	CLEAR_STALE_NOTIFICATIONS,

	// term constants
	ADD_TERM_TO_VOCABULARY_ERR,

	// vocab constants
	CREATE_VOCABULARY_RESPONSE_ERR,
	CREATE_VOCABULARY_RESPONSE_OK,
	DELETE_VOCABULARY_RESPONSE_ERR,
	DELETE_VOCABULARY_RESPONSE_OK,
	FETCHING_ALL_VOCABULARIES_ERR,
	UPDATE_VOCABULARY_ERR,

	// work constants
	WORK_NOT_FOUND_ERR,

	// types
	NOTIFICATION_ERR as ERROR,
	NOTIFICATION_SUCCESS as SUCCESS,
} from '../constants'

import * as messages from '../messages'

export default function notificationReducer (state, action) {
	if (typeof state === 'undefined')
		return []

	switch (action.type) {
		case ADD_TERM_TO_VOCABULARY_ERR:
			return addTermToVocabError(state, action)

		case CLEAR_ALL_NOTIFICATIONS:
			return clearAllNotifications(state, action)

		case CLEAR_NOTIFICATION:
			return clearNotification(state, action)

		case CLEAR_STALE_NOTIFICATIONS:
			return clearStaleNotifications(state, action)

		case CREATE_VOCABULARY_RESPONSE_ERR:
			return createVocabularyError(state, action)

		case CREATE_VOCABULARY_RESPONSE_OK:
			return createVocabularySuccess(state, action)

		case DELETE_VOCABULARY_RESPONSE_ERR:
			return deleteVocabularyError(state, action)

		case DELETE_VOCABULARY_RESPONSE_OK:
			return deleteVocabularySuccess(state, action)

		case FETCHING_ALL_VOCABULARIES_ERR:
			return fetchingVocabulariesError(state, action)

		case UPDATE_VOCABULARY_ERR:
			return updateVocabularyError(state, action)

		case WORK_NOT_FOUND_ERR:
			return workNotFound(state, action)

		default:
			return state
	}
}

// helper fn to reduce waste
function createNotification (type, message) {
	return {
		type,
		message,
		time: Date.now(),
	}
}

function addTermToVocabError (state, action) {
	const tmpl = messages.CREATE_TERM_ERR
	const errMsg = action.error.message
	const term = action.term
	const message = sprintf(tmpl, term, errMsg)

	return [].concat(state, createNotification(ERROR, message))
}

function clearAllNotifications () {
	return []
}

function clearNotification (state, action) {
	const idx = action.index
	return [].concat(
		state.slice(0, idx),
		state.slice(idx + 1)
	)
}

function clearStaleNotifications (state, action) {
	return state.filter(notification => {
		const threshold = Date.now() - notification.time
		return threshold >= action.limit
	})
}

function createVocabularyError (state, action) {
	const tmpl = messages.CREATE_VOCABULARY_ERR
	const message = sprintf(tmpl, action.error.message)

	return [].concat(state, createNotification(ERROR, message))
}

function createVocabularySuccess (state, action) {
	const tmpl = messages.CREATE_VOCABULARY_SUCCESS
	const vocabName = action.data.pref_label[0]
	const message = sprintf(tmpl, vocabName)

	return [].concat(state, createNotification(SUCCESS, message))
}

function deleteVocabularyError (state, action) {
	const tmpl = messages.DELETE_VOCABULARY_ERR
	const name = action.data.pref_label[0]
	const errmsg = action.error.message
	const message = sprintf(tmpl, name, errmsg)

	return [].concat(state, createNotification(ERROR, message))
}

function deleteVocabularySuccess (state, action) {
	const tmpl = messages.DELETE_VOCABULARY_SUCCESS
	const name = action.data.pref_label[0]
	const message = sprintf(tmpl, name)

	return [].concat(state, createNotification(SUCCESS, message))
}

function fetchingVocabulariesError (state, action) {
	const tmpl = messages.FETCHING_VOCABULARIES_ERR
	const msg = action.error.message
	const message = sprintf(tmpl, msg)

	return [].concat(state, createNotification(ERROR, message))
}

function updateVocabularyError (state, action) {
	const tmpl = messages.UPDATE_VOCABULARY_ERR
	const name = action.vocabulary.pref_label[0]
	const msg = action.error.message
	const message = sprintf(tmpl, name, msg)

	return [].concat(state, createNotification(ERROR, message))
}

function workNotFound (state, action) {
	const tmpl = messages.WORK_NOT_FOUND_WITH_ID
	const id = action.id
	const message = sprintf(tmpl, id)

	return [].concat(state, createNotification(ERROR, message))
}

import {
	CREATE_VOCABULARY_REQUEST,
	CREATE_VOCABULARY_RESPONSE_ERR,
	CREATE_VOCABULARY_RESPONSE_OK,

	DELETE_VOCABULARY_REQUEST,
	DELETE_VOCABULARY_RESPONSE_ERR,
	DELETE_VOCABULARY_RESPONSE_OK,

	FETCHING_ALL_VOCABULARIES,
	FETCHING_ALL_VOCABULARIES_ERR,

	RECEIVE_ALL_VOCABULARIES,
	RECEIVE_VOCABULARY_ERROR,

	UPDATING_VOCABULARY,
	UPDATE_VOCABULARY_ERR,
	UPDATE_VOCABULARY_OK,
} from '../constants'

import { get } from '../../lib/api/request'
import {
	createVocabulary as create,
	deleteVocabulary as deleteVocab,
	getVocabularies,
	updateVocabulary,
} from '../../lib/api'
import isFresh from '../../lib/is-fresh'
import camelCase from '../../lib/camel-case'
import assign from 'object-assign'

const STALE_TIME = 60 * 1000

const mockMintAuthUri = val => (
	`${process.env.AUTH_BASE_URL}/${camelCase(val)}`
)

export const createVocabulary = data => dispatch => {
	dispatch({
		type: CREATE_VOCABULARY_REQUEST,
	})

	const payload = assign({}, data)
	const name = payload.label[0]

	payload.uri = mockMintAuthUri(name)
	payload.pref_label = payload.label

	return create(payload)
		.then(() => {

			// append `absolute_path` to the payload
			payload.absolute_path = (
				`${process.env.API_BASE_URL}/vocabularies/${camelCase(name)}.json`
			)

			dispatch({
				type: CREATE_VOCABULARY_RESPONSE_OK,
				data: payload,
			})

			return payload
		})
		.catch(error => {
			dispatch({
				type: CREATE_VOCABULARY_RESPONSE_ERR,
				error,
			})

			throw error
		})
}

export const deleteVocabulary = data => dispatch => {
	dispatch({type: DELETE_VOCABULARY_REQUEST})

	return deleteVocab(data)
		.then(() => {
			dispatch({
				type: DELETE_VOCABULARY_RESPONSE_OK,
				data,
			})
		})
		.catch(error => {
			dispatch({
				type: DELETE_VOCABULARY_RESPONSE_ERR,
				data,
				error,
			})

			throw error
		})
}

export const fetchAllVocabularies = () => dispatch => {
	dispatch({
		type: FETCHING_ALL_VOCABULARIES,
	})

	return getVocabularies()
		.then(response => {
			dispatch({
				type: RECEIVE_ALL_VOCABULARIES,
				data: response.vocabularies,
			})
		})
		.catch(error => {
			dispatch({
				type: FETCHING_ALL_VOCABULARIES_ERR,
				error,
			})

			throw error
		})
}

export const updateVocabularyMetadata = data => dispatch => {
	dispatch({
		type: UPDATING_VOCABULARY,
		vocabulary: data,
	})

	return updateVocabulary(data)
	.then(() => {
		dispatch({
			type: UPDATE_VOCABULARY_OK,
			vocabulary: data,
		})
	})
	.catch(error => {
		dispatch({
			type: UPDATE_VOCABULARY_ERR,
			error,
			vocabulary: data,
		})

		throw error
	})
}

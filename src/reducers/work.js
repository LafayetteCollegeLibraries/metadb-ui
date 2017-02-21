import {
	FETCHING_WORK,
	FETCHING_WORK_ERR,
	RECEIVE_WORK,
	SAVED_WORK,
	SAVING_WORK,
	WORK_NOT_FOUND_ERR,
} from '../constants'

import assign from 'object-assign'

export default function workReducer (state, action) {
	if (typeof state === 'undefined')
		return {}

	switch (action.type) {
		case FETCHING_WORK:
			return fetchingWork(state, action)

		// see lafayette-preserve#3, xhr requests for non-existant works
		// are returning 401: Unauthorized
		case FETCHING_WORK_ERR:
		case WORK_NOT_FOUND_ERR:
			return workNotFound(state, action)

		case RECEIVE_WORK:
			return receiveWork(state, action)

		case SAVED_WORK:
			return savedWork(state, action)

		case SAVING_WORK:
			return savingWork(state, action)

		default:
			return state
	}
}

function fetchingWork (/* state, action */) {
	return {
		isFetching: true,
	}
}

function receiveWork (state, action) {
	return {
		data: action.data,
		isFetching: false,
		isSaving: false,
	}
}

function savedWork (state, action) {
	return assign({}, state, {
		data: assign({}, state.data, action.updates),
		isSaving: false,
	})
}

function savingWork (state/* , action */) {
	return assign({}, state, {isSaving: true})
}

// we need to set something to know the work wasn't found
// + to display a not-found page
function workNotFound (state, action) {
	return {
		error: {
			code: 404,
			id: action.id,
			message: action.error.message,
		}
	}
}

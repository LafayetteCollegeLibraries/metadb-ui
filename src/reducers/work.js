import {
	ADD_EMPTY_VALUE_TO_WORK,
	FETCHING_WORK,
	FETCHING_WORK_ERR,
	RECEIVE_WORK,
	REMOVE_VALUE_FROM_WORK,
	SAVED_WORK,
	SAVING_WORK,
	UPDATE_WORK,
	WORK_NOT_FOUND_ERR,
} from '../constants'

import assign from 'object-assign'

export default function workReducer (state, action) {
	if (typeof state === 'undefined')
		return {}

	switch (action.type) {
		case ADD_EMPTY_VALUE_TO_WORK:
			return addEmptyValueToWork(state, action)

		case FETCHING_WORK:
			return fetchingWork(state, action)

		// see lafayette_concerns#3, xhr requests for non-existant works
		// are returning 401: Unauthorized
		case FETCHING_WORK_ERR:
			return workNotFound(state, action)

		case RECEIVE_WORK:
			return receiveWork(state, action)

		case REMOVE_VALUE_FROM_WORK:
			return removeValueFromWork(state, action)

		case SAVED_WORK:
			return savedWork(state, action)

		case SAVING_WORK:
			return savingWork(state, action)

		case UPDATE_WORK:
			return updateWork(state, action)

		case WORK_NOT_FOUND_ERR:
			return workNotFound(state, action)

		default:
			return state
	}
}

function addEmptyValueToWork (state, action) {
	const data = assign({}, state.data)
	const updates = assign({}, state.updates)
	const key = action.key

	if (updates[key])
		updates[key] = [].concat(updates[key], '')
	else
		updates[key] = [].concat(data[key], '')

	return assign({}, state, {updates})

}

function fetchingWork (/* state, action */) {
	return {
		isFetching: true,
	}
}

function receiveWork (state, action) {
	return {
		data: action.data,
		fetchedAt: Date.now(),
		isFetching: false,
		isSaving: false,
		updates: {},
	}
}

function removeValueFromWork (state, action) {
	const data = assign({}, state.data)
	const updates = assign({}, state.updates)

	const key = action.key
	const index = action.index

	let changed = !!state.isChanged

	// TODO: refactor this
	if (updates[key]) {
		if (updates[key][index] !== '')
			changed = true

		updates[key] = [].concat(
			updates[key].slice(0, index),
			updates[key].slice(index + 1)
		)
	} else {
		if (data[key][index] !== '')
			changed = true

		updates[key] = [].concat(
			data[key].slice(0, index),
			data[key].slice(index + 1)
		)
	}

	if (!updates[key].length)
		updates[key][0] = ''

	return assign({}, state, {
		isChanged: changed,
		updates,
	})
}

function savedWork (state/* , action*/) {
	return assign({}, state, {
		data: assign({}, state.data, state.updates),
		isChanged: false,
		isSaving: false,
		updates: {},
	})
}

function savingWork (state/* , action */) {
	return assign({}, state, {isSaving: true})
}

function updateWork (state, action) {
	const key = action.key
	const index = action.index
	const val = action.value

	const data = assign({}, state.data)
	const updates = assign({}, state.updates)

	if (!updates[key])
		updates[key] = data[key]

	updates[key][index] = val

	return assign({}, state, {
		isChanged: true,
		updates,
	})
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

import {
	FETCHING_WORK,
	FETCHING_WORK_ERR,
	RECEIVE_WORK,
	SAVED_WORK,
	SAVING_WORK,
	WORK_NOT_FOUND_ERR,
} from '../constants'

import { getWork, updateWork } from '../../lib/api'
// import isFresh from '../../lib/is-fresh'

export const fetchWork = id => (dispatch/*, getState*/) => {
	// const work = getState().work

	dispatch({
		type: FETCHING_WORK,
		id,
	})

	return getWork(id)
		.then(
			data => {
				dispatch({
					type: RECEIVE_WORK,
					data,
				})
			},
			error => {
				if (error.status === 404) {
					dispatch({
						type: WORK_NOT_FOUND_ERR,
						error,
						id,
					})

					return
				}

				dispatch({
					type: FETCHING_WORK_ERR,
					error,
					id,
				})
			}
		)
}

export const saveWork = (id, updates) => dispatch => {
	// TODO
	// 	 bail on save if already saving so to prevent duplicates

	dispatch({
		type: SAVING_WORK,
		id,
	})

	return updateWork(id, updates)
		.then(() => {
			dispatch({
				type: SAVED_WORK,
				updates,
			})
		})
		//.catch(err => {})
}

import { CLEAR_NOTIFICATION } from '../constants'

export const clearNotification = index => dispatch => {
	if (typeof index === 'undefined')
		return

	return dispatch({
		type: CLEAR_NOTIFICATION,
		index,
	})
}

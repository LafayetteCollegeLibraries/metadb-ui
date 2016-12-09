import React from 'react'
import { NotificationStack } from 'react-notification'
import assign from 'object-assign'

import {
	NOTIFICATION_ERR as ERROR,
	NOTIFICAITON_SUCCESS as SUCCESS,
} from '../constants'

const T = React.PropTypes

const NotificationCenter = React.createClass({
	propTypes: {
		notifications: T.array.isRequired,
		onClearNotification: T.func.isRequired,
	},

	getStyles: function (type) {
		const base = {

		}

		switch (type) {
			case ERROR:
				return {
					barStyle: {
						backgroundColor: '#f42069',
						color: '#fff',
					},

					actionStyle: {
						color: '#fff',
						fontWeight: 'bold',
					}
				}

			default:
				return {}
		}
	},

	render: function () {
		const notifications = this.props.notifications.map((notification, index) => {
			return {
				action: 'X',
				onClick: this.props.onClearNotification.bind(null, index),

				dismissAfter: (1000 * 10),
				isActive: true,
				key: 'notification-'+index,
				message: notification.message,

				...this.getStyles(notification.type),

				//
				__index: index,
			}
		})

		const props = {
			notifications,
			onDismiss: notification => {
				this.props.onClearNotification(notification.__index)
			},
		}

		return <NotificationStack {...props} />
	}
})

export default NotificationCenter

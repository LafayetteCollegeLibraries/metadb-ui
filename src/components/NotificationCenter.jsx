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
		const defaults = {
		}

		switch (type) {
			case ERROR:
				return assign({}, defaults, {
					barStyle: {
						backgroundColor: '#910029',
						color: '#fff',
					},

					actionStyle: {
						color: '#fff',
						fontWeight: 'bold',
					}
				})

			default:
				return defaults
		}
	},

	styleFactory: function (index, style) {
		return assign({}, style, {
			// need to null out `bottom`, as it's set by react-notification's
			// defaultStyles. this will effectively remove it from the style object.
			bottom: null,
			top: `${3 + (index * 4)}rem`,
		})
	},

	render: function () {
		const notifications = this.props.notifications.map((notification, index) => {
			const isError = notification.type === ERROR

			return {
				action: 'X',
				onClick: this.props.onClearNotification.bind(null, index),

				dismissAfter: isError ? false : (1000 * 10),
				isActive: true,
				key: 'notification-'+index,
				message: notification.message,

				...this.getStyles(notification.type),

				//
				__index: index,
			}
		})

		const props = {
			activeBarStyleFactory: this.styleFactory,
			barStyleFactory: this.styleFactory,
			notifications,
			onDismiss: notification => {
				this.props.onClearNotification(notification.__index)
			},
		}

		return <NotificationStack {...props} />
	}
})

export default NotificationCenter

import React from 'react'
import Modal, { Header } from './Modal.jsx'

import assign from 'object-assign'

const T = React.PropTypes

const NAMESPACE = 'ModalWithHeader'

const ModalWithHeader = React.createClass({
	propTypes: {
		header: T.oneOfType([T.string, T.func]),
		headerProps: T.object,
		allowHTML: T.bool,
	},

	renderHeader: function () {
		const props = assign({
			key: 'header',
			className: `${NAMESPACE}-header`,
		}, this.props.headerProps)

		// allow a user-provided function to return
		if (typeof this.props.header === 'function')
			return this.props.header.call(null, props)

		if (this.props.allowHTML)
			props.dangerouslySetInnerHTML = { __html: this.props.header }
		else
			props.children = this.props.header

		return <Header {...props}/>
	},

	render: function () {
		const props = assign({
			overlayClassName: 'ModalWithHeader-overlay',
		}, this.props)

		props.className = `${NAMESPACE}-container${props.className ? ` ${props.className}` : ''}`

		return (
			<Modal {...props}>
				{this.renderHeader()}
				{this.props.children}
			</Modal>
		)
	}
})

export default ModalWithHeader

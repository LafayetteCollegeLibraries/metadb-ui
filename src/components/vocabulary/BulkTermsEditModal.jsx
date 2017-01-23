import React from 'react'
import ModalWithHeader from '../ModalWithHeader.jsx'
import BulkTermsEditor from './BulkTermsEditor.jsx'

const T = React.PropTypes

const BulkTermsEditModal = React.createClass({
	propTypes: {
		onClose: T.func.isRequired,
		onSubmit: T.func.isRequired,

		terms: T.arrayOf(T.string).isRequired,

		label: T.string,
	},

	getInitialState: function () {
		return {
			modalOpen: true,
		}
	},

	closeModal: function (data) {
		this.setState({modalOpen: false})
		this.props.onClose()
	},

	handleClose: function (ev) {
		this.closeModal()
	},

	handleSubmit: function (data) {
		this.props.onSubmit(data)
		this.closeModal()
	},

	render: function () {
		const modalProps = {
			header: `Bulk-editing terms for ${this.props.label}`,
			isOpen: this.state.modalOpen,
			onRequestClose: this.handleClose,
			style: {
				content: {
					bottom: '12.5%',
					boxShadow: '0 1px 2px 1px #aaa',
					left: '12.5%',
					right: '12.5%',
					top: '12.5%',
				}
			}
		}

		const editorProps = {
			contentLabel: 'Bulk Terms Edit',
			onSubmit: this.handleSubmit,
			resizable: false,
			terms: this.props.terms,
		}

		return (
			<ModalWithHeader {...modalProps}>
				<BulkTermsEditor {...editorProps} />
			</ModalWithHeader>
		)
	}
})

export default BulkTermsEditModal

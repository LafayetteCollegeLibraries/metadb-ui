import React from 'react'
import ModalWithHeader from '../ModalWithHeader.jsx'
import GenericVocabulary from '../schema/GenericVocabulary.jsx'

const T = React.PropTypes

const CreateVocabularyModal = React.createClass({
	propTypes: {
		onClose: T.func.isRequired,
		onSubmit: T.func.isRequired,
	},

	getInitialState: function () {
		return {
			open: true,
		}
	},

	closeModal: function () {
		this.setState({
			open: false,
		})
		this.props.onClose.call()
	},

	handleSubmit: function (data) {
		this.props.onSubmit.call(null, data)
		this.closeModal()
	},

	render: function () {
		const label = 'Create a new vocabulary'

		const modalProps = {
			contentLabel: label,
			header: label,
			isOpen: this.state.open,
			label: label,
			onRequestClose: this.closeModal,
			style: {
				content: {
					boxShadow: '0 1px 2px 1px #aaa',
					bottom: '33%',
				}
			}
		}

		const formProps = {
			buttonLabel: 'Create new vocabulary',
			onSubmit: this.handleSubmit,
		}

		return (
			<ModalWithHeader {...modalProps}>
				<GenericVocabulary {...formProps} />
			</ModalWithHeader>
		)
	}
})

export default CreateVocabularyModal

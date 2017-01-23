import React from 'react'
import ModalWithHeader from '../ModalWithHeader.jsx'
import GenericVocabulary from '../schema/GenericVocabulary.jsx'

const T = React.PropTypes

const EditVocabularyModal = React.createClass({
	propTypes: {
		data: T.object.isRequired,
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

	getVocabularyName: function () {
		const data = this.props.data

		if (data.pref_label && data.pref_label.length)
			return data.pref_label[0]

		if (data.label && data.label.length)
			return data.label[0]
	},

	handleSubmit: function (data) {
		this.props.onSubmit.call(null, data)
		this.closeModal()
	},

	render: function () {
		const name = this.getVocabularyName()
		const label = `Edit metadata for ${name}`

		const modalProps = {
			contentLabel: label,
			header: label,
			isOpen: this.state.open,
			onRequestClose: this.closeModal,
			style: {
				content: {
					boxShadow: '0 1px 2px 1px #aaa',
					bottom: '33%',
				}
			}
		}

		const vocabProps = {
			buttonLabel: 'Submit changes',
			data: this.props.data,
			onSubmit: this.handleSubmit,
		}

		const deleteButtonProps = {
			children: `Delete ${name}`,
			onClick: this.props.onDelete,
			style: {
				backgroundColor: '#cc092f',
				border: '2px solid #aa070d',
				borderRadius: '2px',
				color: '#fff',
				cursor: 'pointer',
				marginTop: '2em',
			}
		}

		return (
			<ModalWithHeader {...modalProps}>
				<GenericVocabulary {...vocabProps} />
				<button onClick={this.handleSubmit}>
					Save changes
				</button>
				<button {...deleteButtonProps} />
			</ModalWithHeader>
		)
	}
})

export default EditVocabularyModal

import React from 'react'
import assign from 'object-assign'
import arrayFind from 'array-find'
import { sprintf } from 'sprintf-js'

// vocab side
import VocabularyList from '../components/vocabulary/VocabularyList.jsx'
import CreateVocabularyModal from '../components/vocabulary/CreateVocabularyModal.jsx'

// active vocabulary / terms side
import TermsManager from '../components/vocabulary/TermsManager.jsx'
import BulkTermsEditModal from '../components/vocabulary/BulkTermsEditModal.jsx'
import EditVocabularyModal from '../components/vocabulary/EditVocabularyModal.jsx'
import TermEditModal from '../components/vocabulary/TermEditModal.jsx'

import { DELETE_VOCABULARY_WARNING } from '../messages'

const VOCAB_LABEL_KEY = 'pref_label'

const MODAL = {
	ADD_VOCABULARY: 'addVocabulary',
	BULK_TERMS: 'bulkTerms',
	TERM_EDIT: 'termEdit',
	EDIT_VOCABULARY: 'editVocabulary',
}

const VocabularyManager = React.createClass({
	getInitialState: function () {
		return {
			activeEditingTerm: null,
			activeVocabulary: null,
			activeVocabularyIndex: -1,

			// modal window management
			modals: {
				addVocabulary: false,
				bulkTerms: false,
				termEdit: false,
				editVocabulary: false,
			},
		}
	},

	componentDidMount: function () {
		this.props.fetchAllVocabularies()
	},

	clearActiveEditingTerm: function () {
		const modals = assign({}, this.state.modals)
		modals[MODAL.TERM_EDIT] = false

		this.setState({
			activeEditingTerm: null,
			modals,
		})
	},

	closeModal: function (which) {
		this.toggleModal(which, false)
	},

	fetchingTerms: function () {
		return <h2>fetching terms...</h2>
	},

	handleCreateVocabulary: function (data) {
		this.closeModal(MODAL.ADD_VOCABULARY)

		this.props.createVocabulary(data).then(newVocab => {
			this.setState({
				activeVocabulary: newVocab,
				activeVocabularyIndex: this.props.vocabularies.length - 1,
			})
		})
	},

	handleDeleteVocabulary: function () {
		const vocab = this.state.activeVocabulary

		if (!vocab)
			return

		const name = vocab.pref_label[0]
		const msg = sprintf(DELETE_VOCABULARY_WARNING, name)

		if (!window.confirm(msg))
			return

		// close edit modal
		this.closeModal(MODAL.EDIT_VOCABULARY)

		// call `deleteVocabulary`
		this.props.deleteVocabulary(vocab).then(() => {
			// clear `activeVocab`
			this.setState({
				activeVocabulary: null,
				activeVocabularyIndex: -1,
			})
		})
	},

	handleUpdateVocabulary: function (data) {
		if (!this.state.activeVocabulary)
			return

		const vocab = assign({}, this.state.activeVocabulary)
		const {name, description} = data

		vocab.label = vocab.pref_label = [name]
		vocab.alt_label = [description]

		this.closeModal(MODAL.EDIT_VOCABULARY)

		this.props.updateVocabularyMetadata(vocab)
		.then(() => {
			this.setState({activeVocabulary: vocab})
		})
		.catch(() => {})
	},

	// sets the `activeVocabulary` prop + fetches terms
	handleVocabularySelect: function (vocabData, index) {
		this.props.fetchTermsFromVocabulary(vocabData)
		this.setState({
			activeVocabulary: vocabData,
			activeVocabularyIndex: index,
		})
	},

	openModal: function (which) {
		this.toggleModal(which, true)
	},

	renderAddVocabularyModal: function () {
		if (!this.state.modals[MODAL.ADD_VOCABULARY])
			return

		return (
			<CreateVocabularyModal
				onClose={this.closeModal.bind(null, MODAL.ADD_VOCABULARY)}
				onSubmit={this.handleCreateVocabulary}
			/>
		)
	},

	renderBulkTermsModal: function () {
		if (!this.state.modals[MODAL.BULK_TERMS])
			return

		const activeVocab = this.state.activeVocabulary
		const activeTerms = this.props.activeVocabularyTerms

		// we might want to also close the bulk modal if it's been opened
		// without an activeVocabulary selected
		if (!activeVocab)
			return

		const props = {
			label: activeVocab[VOCAB_LABEL_KEY][0],
			onClose: this.closeModal.bind(null, MODAL.BULK_TERMS),
			onSubmit: this.props.bulkEditTermsInVocabulary.bind(null, activeVocab),
			terms: activeTerms.data.map(term => term.pref_label[0]),
		}

		return React.createElement(BulkTermsEditModal, props)
	},

	renderEditVocabularyModal: function () {
		if (!this.state.modals[MODAL.EDIT_VOCABULARY])
			return

		const activeVocab = this.state.activeVocabulary

		const props = {
			data: activeVocab,
			onDelete: this.handleDeleteVocabulary,
			onSubmit: this.handleUpdateVocabulary,
			onClose: this.closeModal.bind(null, MODAL.EDIT_VOCABULARY),
		}

		return React.createElement(EditVocabularyModal, props)
	},

	renderTermEditModal: function () {
		if (!this.state.modals[MODAL.TERM_EDIT])
			return

		const activeTerm = this.state.activeEditingTerm
		const activeVocab = this.state.activeVocabulary
		const pool = this.props.activeVocabularyTerms.data

		if (!activeTerm || !activeVocab || !pool || !pool.length)
			return

		const term = arrayFind(pool, t => t.pref_label.indexOf(activeTerm) > -1)

		if (!term)
			return

		const updateTerm = this.props.updateTermInVocabulary

		const props = {
			data: term,
			onSave: updateTerm.bind(null, activeVocab, activeTerm),
			onClose: this.clearActiveEditingTerm,
		}

		return React.createElement(TermEditModal, props)
	},

	renderTermsManager: function () {
		const terms = this.props.activeVocabularyTerms
		const activeVocab = this.state.activeVocabulary

		if (!terms || !activeVocab)
			return

		if (terms.isFetching)
			return this.fetchingTerms()

		const vocabName = activeVocab[VOCAB_LABEL_KEY][0]

		return (
			<TermsManager
				label={vocabName}
				onAddTerm={this.props.addTermToVocabulary.bind(null, activeVocab)}
				onBulkTermsOpen={this.openModal.bind(null, MODAL.BULK_TERMS)}
				onEditVocabulary={this.openModal.bind(null, MODAL.EDIT_VOCABULARY)}
				onRemoveTerm={this.props.removeTermFromVocabulary.bind(null, activeVocab)}
				onTermClick={this.setActiveEditingTerm}
				terms={terms.data}
			/>
		)
	},

	renderVocabularyList: function () {
		const vocabs = this.props.vocabularies

		if (!vocabs)
			return

		// required + common props
		const props = {
			keys: {
				count: 'term_count',
				label: VOCAB_LABEL_KEY,
			},
			onAddVocabulary: this.openModal.bind(null, MODAL.ADD_VOCABULARY),
			onVocabularyClick: this.handleVocabularySelect,
			placeholder: 'Filter vocabularies',
		}

		if (!vocabs.isFetching) {
			let activeKey = null

			if (this.state.activeVocabulary)
				activeKey = this.state.activeVocabulary[VOCAB_LABEL_KEY][0]

			props.activeKey = activeKey
			props.activeIndex = this.state.activeVocabularyIndex
			props.vocabularies = vocabs.data
		}

		else props.isLoading = true

		return React.createElement(VocabularyList, props)
	},

	setActiveEditingTerm: function (term) {
		this.setState({
			activeEditingTerm: term,
		})

		this.openModal(MODAL.TERM_EDIT)
	},

	toggleModal: function (which, toggle) {
		if (typeof toggle !== 'boolean')
			toggle = !!toggle

		const modals = assign({}, this.state.modals)

		if (typeof modals[which] === 'undefined')
			return

		// reset all modals to false
		for (let m in modals)
			modals[m] = false

		if (toggle === true)
			modals[which] = true

		this.setState({modals})
	},

	render: function () {
		return (
			<div>
				<h1>Vocabulary Management</h1>

				<div className="vocabulary-list-container">
					{this.renderVocabularyList()}
				</div>

				<div className="terms-manager-container">
					{this.renderTermsManager()}
				</div>

				{/* modal hangout */}
				{this.renderAddVocabularyModal()}
				{this.renderBulkTermsModal()}
				{this.renderTermEditModal()}
				{this.renderEditVocabularyModal()}
			</div>
		)
	}
})

export default VocabularyManager

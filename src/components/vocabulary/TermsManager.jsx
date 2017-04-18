import React from 'react'
import TagList from '../tags/TagList.jsx'
import shallowCompare from 'react-addons-shallow-compare'
import Button from '../Button.jsx'

const T = React.PropTypes

const TermsManager = React.createClass({
	propTypes: {
		label: T.string.isRequired,
		terms: T.array.isRequired,

		onAddTerm: T.func.isRequired,
		onBulkTermsOpen: T.func.isRequired,
		onEditVocabulary: T.func.isRequired,
		onRemoveTerm: T.func.isRequired,
		onTermClick: T.func.isRequired,
	},

	shouldComponentUpdate: function (nextProps, nextState) {
		return shallowCompare(nextProps, nextState)
	},

	getInitialState: function () {
		return {
			// controls TermEditModal
			activeEditingTerm: null,
		}
	},

	handleInputKeyDown: function (ev) {
		if (ev.keyCode !== 13)
			return

		const val = ev.target.value

		this.props.onAddTerm.call(null, val)

		ev.target.value = ''
	},

	handleTermRemove: function (/* term, index */) {
		this.props.onRemoveTerm.apply(null, arguments)
	},

	// `term` is the original pref_label
	// `data` is the updated term object
	handleTermSave: function (term, data) {
		this.props.onUpdateTerm.call(null, term, data)
	},

	mapTermPrefLabels: function (terms) {
		return terms.map(t => t.pref_label[0])
	},

	renderTermTagList: function () {
		if (!this.props.terms.length) {
			// render a 'No terms!' div instead
			return
		}

		return (
			<TagList
				className="terms"
				onClickTag={this.props.onTermClick}
				onRemoveTag={this.handleTermRemove}
				tagClassName="vocabulary-term"
				tags={this.mapTermPrefLabels(this.props.terms)}
			/>
		)
	},

	render: function () {
		const styles = {
			editVocabButton: {
				cursor: 'pointer',
				float: 'right',
			},

			textInput: {
				width: '20em',
			},

			bulkTermsContainer: {
				float: 'right',
			},

			bulkTermsButton: {
				backgroundColor: 'transparent',
				border: '1px solid #a9a9a9',
				borderRadius: '2px',
				color: '#222',
				cursor: 'pointer',
				fontSize: '1em',
				lineHeight: '1.5em',
				outline: 'none',
			},

			termsList: {
				height: (14 * 30) + 'px',
				overflowY: 'scroll',
			}
		}

		return (
			<div className="term-editor TermsManager">
				<header className="TermsManager-header">
					Viewing terms for <strong>{this.props.label}</strong>

					<button
						style={styles.editVocabButton}
						onClick={this.props.onEditVocabulary}
						>
						Edit vocabulary metadata
					</button>
				</header>

				<section className="term-tag-list TermsManager-tag-list" style={styles.termsList}>
					{this.renderTermTagList()}
				</section>

				<footer className="TermsManager-footer">
					<span>
						<input
							className="TermsManager-add-term"
							onKeyDown={this.handleInputKeyDown}
							placeholder="Add new term"
							style={styles.textInput}
							type="text"
						/>
					</span>

					<span style={styles.bulkTermsContainer}>
						<Button
							className="TermsManager-add-submit"
							children="Bulk add/edit terms"
							onClick={this.props.onBulkTermsOpen}
							style={styles.bulkTermsButton}
						/>
					</span>
				</footer>
			</div>
		)
	}
})

export default TermsManager

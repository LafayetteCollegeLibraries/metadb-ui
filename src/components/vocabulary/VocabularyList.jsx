'use strict'

import React from 'react'
import Button from '../Button.jsx'

const T = React.PropTypes

const VocabularyList = React.createClass({
	propTypes: {
		keys: T.shape({
			count: T.string,
			label: T.string,
		}),

		activeKey: T.string,
		isLoading: T.bool,

		onAddVocabulary: T.func.isRequired,
		onVocabularyClick: T.func.isRequired,

		placeholder: T.string,
		vocabularies: T.array,
	},

	componentWillReceiveProps: function (nextProps, nextState) {
		const vocabs = nextProps.vocabularies
		const query = nextState.filterQuery || ''

		this.setState({
			vocabularies: this.filterVocabularies(query, vocabs),
		})
	},

	getDefaultProps: function () {
		return {
			keys: {
				count: 'term_count',
				label: 'label',
			},
		}
	},

	getInitialState: function () {
		return {
			filterQuery: '',
			hoverIndex: -1,
			vocabularies: this.props.vocabularies,
		}
	},

	clearHoverIndex: function () {
		this.setHoverIndex(-1)
	},

	filterVocabularies: function (val, vocabs) {
		if (!vocabs)
			vocabs = this.props.vocabularies

		if (val === '')
			return vocabs

		const lowerVal = val.toLowerCase()

		return this.props.vocabularies.filter(vocab => {
			const key = this.props.keys.label

			let label = vocab[key]

			if (Array.isArray(label))
				label = label[0]

			if (!label)
				return 0

			return label.toLowerCase().indexOf(lowerVal) > -1 ? 1 : 0
		})
	},

	handleAddVocabulary: function () {
		this.props.onAddVocabulary.call()
	},

	handleInputChange: function (ev) {
		if (!this.props.vocabularies) return

		const val = ev.target.value
		const filtered = this.filterVocabularies(val)

		this.setState({
			filterQuery: val,
			vocabularies: filtered,
		})
	},

	handleInputFocus: function () {
		this.setState({hoverIndex: -1})
	},

	handleKeyDown: function (ev) {
		switch (ev.keyCode) {

			// escape
			case 27:
				return

			// up
			case 38:
				return this.moveHoverIndex(-1)

			// down
			case 40:
				return this.moveHoverIndex(1)

		}
	},

	handleVocabularyClick: function (data, index) {
		if (data[this.props.keys.label] === this.props.activeKey) return

		this.props.onVocabularyClick.call(null, data, index)
	},

	maybeRenderCount: function (data) {
		if (!('count' in this.props.keys))
			return

		if (!data || !data.hasOwnProperty(this.props.keys.count))
			return

		const len = data[this.props.keys.count]

		return (
			<span className="term-count VocabularyList-term-count">
				Contains {len} term{len === 1 ? '' : 's'}
			</span>
		)
	},

	moveHoverIndex: function (dir) {
		const vocabs = this.state.vocabularies
		const idx = this.state.hoverIndex

		let next = idx + dir

		// wrap to the end of the list
		if (next === -1)
			next = (vocabs.length - 1)

		// wrap to the beginning of the list
		if (next === vocabs.length)
			next = 0

		this.setHoverIndex(next)
	},

	setHoverIndex: function (index) {
		this.setState({hoverIndex: index})
	},

	vocabularyList: function () {
		if (this.props.isLoading) {
			return (
				<div className="vocab-list--empty VocabularyList is-empty">
					Loading ...
				</div>
			)
		}

		const query = this.state.filterQuery

		if (!this.state.vocabularies || !this.state.vocabularies.length) {
			return (
				<div className="vocab-list--empty VocabularyList is-empty">
					No vocabularies
					{query ? ` found with "${query}"` : ''}
				</div>
			)
		}

		return (
			<ul className="vocab-list VocabularyList" onMouseOut={this.clearHoverIndex}>
				{this.state.vocabularies.map(this.vocabularyListItem)}
			</ul>
		)
	},

	vocabularyListItem: function (data, index) {
		let label = data[this.props.keys.label]

		if (Array.isArray(label))
			label = label[0]

		// WORKAROUND: skip items w/o a pref-label defined
		if (!label)
			return

		const classname = ['vocab-list--item']

		if (this.state.hoverIndex === index) {
			classname.push('hover')
		}

		if (this.props.activeKey === data[this.props.keys.label][0]) {
			classname.push('active')
		}

		return (
			<li
				className={classname.join(' ')}
				key={index}
				onClick={this.handleVocabularyClick.bind(null, data, index)}
				onMouseOver={this.setHoverIndex.bind(null, index)}
			>
				{data[this.props.keys.label][0]}
				{this.maybeRenderCount(data)}
			</li>
		)
	},

	render: function () {
		return (
			<div className="vocabulary-list VocabularyList">
				<header className="VocabularyList-header" key="filter">
					<input
						className="filter VocabularyList-filter"
						disabled={this.props.isLoading}
						onFocus={this.handleInputFocus}
						onChange={this.handleInputChange}
						onKeyDown={this.handleKeyDown}
						placeholder={this.props.placeholder}
						type="text"
					/>
				</header>

				{this.vocabularyList()}

				<footer key="footer">
					<Button onClick={this.handleAddVocabulary}>
						+ Add Vocabulary
					</Button>
				</footer>
			</div>
		)
	}
})

export default VocabularyList

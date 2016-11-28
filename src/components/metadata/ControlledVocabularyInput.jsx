import React from 'react'
import Autocomplete from 'react-autocomplete'
import assign from 'object-assign'

const T = React.PropTypes

const ControlledVocabularyInput = React.createClass({
	propTypes: {
		// function used to retrieve terms from a remote source
		// (we're using an intermediary function rather than requesting
		// from within the component to allow some WorkEdit level caching
		// of responses)
		fetchTerms: T.func,

		// whether or not to highlight the matching area of the text
		highlightMatch: T.bool,

		onChange: T.func,

		// option to pass terms directly to the component if you so wish!
		terms: T.array,
		value: T.string,
	},

	componentDidMount: function () {
		if (this.props.fetchTerms) {
			this.props.fetchTerms()
			.then(terms => this.setState({terms}))

			// TODO: do something if there's a problem
			// (maybe disable the input?)
			.catch(console.warn)
		}
	},

	getInitialState: function () {
		return {
			inputValue: this.props.value || '',
			terms: this.props.terms || [],
		}
	},

	getItemValue: function (item) {
		return item.pref_label[0]
	},

	handleChange: function (ev, value) {
		this.setState({inputValue: value})
	},

	handleSelect: function (value, item) {
		this.setState({inputValue: value})
		this.props.onChange && this.props.onChange.call(null, value)
	},

	renderItem: function (item, isHighlighted, style) {
		const itemStyle = {
			backgroundColor: isHighlighted ? '#4ea8dd' : 'inherit',
			cursor: 'pointer',
			padding: '.25em',
		}

		const label = item.pref_label[0]
		const value = this.state.inputValue.trim().toLowerCase()

		if (value === '' || !this.props.highlightMatch)
			return <div style={itemStyle}>{label}</div>

		const idx = label.toLowerCase().indexOf(value)
		const pre = label.slice(0, idx)
		const sel = label.slice(idx, idx + value.length)
		const post = label.slice(idx + value.length)

		const highlightStyle = {
			backgroundColor: '#6fcaff',
		}

		return (
			<div style={itemStyle}>
				<span>{pre}</span>
				<span style={highlightStyle}>{sel}</span>
				<span>{post}</span>
			</div>
		)
	},

	renderMenu: function (items, value, style) {
		const menuStyle = {
			borderRadius: '2px',
			boxShadow: '0 2px 12px #aaa',
			background: '#fff',
			fontSize: '90%',
			height: '10em',
			left: '0',
			overflowY: 'scroll',
			padding: '4px',
			position: 'absolute',
			top: '2.5em',
			width: '100%',
			zIndex: '10',
		}

		return (
			<div style={menuStyle} children={items} />
		)
	},

	shouldItemRender: function (item) {
		const val = this.state.inputValue.trim().toLowerCase()

		if (val === '')
			return true

		const label = item.pref_label[0]

		if (!label)
			return false

		return label.toLowerCase().indexOf(val) > -1
	},

	render: function () {
		const wrapperStyle = {
			clear: 'both',
			float: 'left',
			position: 'relative',
			verticalAlign: 'middle',
			width: '90%',
		}

		const inputProps = {
			style: {
				width: '100%',
			},

			type: 'text'
		}

		return (
			<Autocomplete
				inputProps={inputProps}
				items={this.state.terms}
				getItemValue={this.getItemValue}
				onChange={this.handleChange}
				onSelect={this.handleSelect}
				renderItem={this.renderItem}
				renderMenu={this.renderMenu}
				shouldItemRender={this.shouldItemRender}
				value={this.state.inputValue}
				wrapperStyle={wrapperStyle}
			/>
		)
	}
})

export default ControlledVocabularyInput

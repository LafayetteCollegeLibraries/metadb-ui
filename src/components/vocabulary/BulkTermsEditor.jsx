import React from 'react'
import Dropzone from 'react-dropzone'
import Button from '../Button.jsx'

const T = React.PropTypes

const BulkTermsEditor = React.createClass({
	propTypes: {
		onSubmit: T.func.isRequired,

		autofocus: T.bool,
		resizable: T.bool,
		terms: T.arrayOf(T.string),
	},

	getDefaultProps: function () {
		return {
			autofocus: true,
			terms: [],
		}
	},

	getInitialState: function () {
		const terms = this.props.terms
		const raw = terms.length ? (terms.join('\n') + '\n') : ''

		return {
			overwrite: false,
			loadingFile: false,
			raw,
		}
	},

	componentDidMount: function () {
		if (this._textarea && this.props.autofocus)
			this._textarea.focus()
	},

	handleChange: function (ev) {
		this.setState({raw: ev.target.value})
	},

	handleDrop: function (ev) {
		ev.preventDefault()

		this.setState({dragOverText: false})
	},

	handleFileDrop: function (files) {
		if (!files.length) return

		const reader = new FileReader()

		reader.onloadstart = () => {
			this.setState({
				loadingFile: true,
			})
		}

		reader.onloadend = (ev) => {
			const result = ev.target.result.trim()
			const original = this.state.raw.trim()
			const overwrite = this.state.overwrite
			const raw = overwrite ? result : `${original}\n${result}`

			this.setState({
				loadingFile: false,
				raw: `${raw}\n`,
			})

			// scroll to the bottom of our textbox
			if (this._textarea) {
				this._textarea.scrollTop = this._textarea.scrollHeight
				this._textarea.focus()
			}
		}

		reader.readAsText(files[0])
	},

	handleFileInputSelection: function (ev) {
		this.handleFileDrop(ev.target.files)
	},

	handleSubmit: function (ev) {
		ev.preventDefault()

		// filter to remove any blank lines in the terms
		this.props.onSubmit.call(null, this.state.raw.split('\n').filter(Boolean))
	},

	toggleOverwriteTermsFlag: function (ev) {
		this.setState({
			overwrite: ev.target.checked
		})
	},

	toggleDragLeave: function () {
		this.setState({dragOverText: false})
	},

	toggleDragEnter: function (/* event */) {
		this.setState({dragOverText: true})
	},

	render: function () {
		const txtbg = this.state.dragOverText ? '#deedee' : 'transparent'

		const styles = {
			container: {
			},

			header: {
				// padding: '.5em 0',
			},

			opts: {
				backgroundColor: '#efefef',
				border: '2px solid #ccc',
				borderBottom: 'none',
				display: 'block',
				padding: '.5em',
			},

			label: {
				display: 'block',
				fontWeight: 'normal',
				margin: '.25em 0',
				verticalAlign: 'middle',
			},

			fileInput: {
				border: 'none',
				fontSize: '.9em',
				marginRight: '0',
				width: '20em',
			},

			dropzone: {
				default: {
					border: 'none',
					height: '100%',
					width: '100%',
				}
			},

			textarea: {
				backgroundColor: txtbg,
				borderTopLeftRadius: '0',
				borderTopRightRadius: '0',
				display: 'inline-block',
				minHeight: '15em',
				overflow: 'auto',
				resize: this.props.resizble ? 'vertical' : 'none',
				width: '100%',
			},

			button: {
				display: 'block',
			},
		}

		return (
			<div
				className="BulkTermsEditor"
				style={styles.container}
				>
				<header
					style={styles.header}
				>
					<p>
					To add terms to this vocabulary, enter them in the box below -- adding one per line.
					To add from a text file, drag and drop it over the box below.
					</p>

					<div
						className="bulk-terms-options BulkTermsEditor-options"
						style={styles.opts}
						>

						<label
							className="BulkTermsEditor-file"
							style={styles.label}
							>
							Add terms from file (one term per line, <code>.txt</code> only)
							<input
								accept="text/plain"
								className="BulkTermsEditor-file--input"
								onChange={this.handleFileInputSelection}
								style={styles.fileInput}
								type="file"
							/>

						</label>

						<label
							className="BulkTermsEditor-overwrite"
							style={styles.label}
							>
							<input
								name="bulk-terms-overwrite-terms"
								onChange={this.toggleOverwriteTermsFlag}
								type="checkbox"
							/>
							Write over previous terms?
						</label>
					</div>
				</header>
				<Dropzone
					accept={'text/plain'}
					disableClick={true}
					multiple={false}
					onDrop={this.handleFileDrop}
					style={styles.dropzone.default}
				>
					<textarea
						className="BulkTermsEditor-text"
						onChange={this.handleChange}
						onDragEnter={this.toggleDragEnter}
						onDragLeave={this.toggleDragLeave}
						onDrop={this.handleDrop}
						ref={e => this._textarea = e}
						style={styles.textarea}
						value={this.state.raw}
					/>
				</Dropzone>

				<Button onClick={this.handleSubmit} style={styles.button}>
					Add Terms
				</Button>
			</div>
		)
	}
})

export default BulkTermsEditor

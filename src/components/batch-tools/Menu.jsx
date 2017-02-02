import React from 'react'
import Item from './MenuItem.jsx'

const MENU_CLASSNAME = 'BatchToolsMenu-container'
const T = React.PropTypes

const BatchToolsMenu = React.createClass({
	propTypes: {
		onClose: T.func.isRequired,
		onSelect: T.func.isRequired,
		tools: T.array,
	},

	getDefaultProps: function () {
		return {
			tools: [],
		}
	},

	componentWillMount: function () {
		document.addEventListener('click', this.maybeCloseMenu)
	},

	componentWillUnmount: function () {
		document.removeEventListener('click', this.maybeCloseMenu)
	},

	handleSelect: function (tool) {
		return this.props.onSelect(tool)
	},

	maybeCloseMenu: function (event) {
		let target = event.target

		do {
			if (target.className === MENU_CLASSNAME) {
				return
			}
		} while (target = target.parentElement)

		this.props.onClose()
	},

	renderItems: function () {
		return this.props.tools.map((tool, idx) => (
			<Item
				{...tool}
				key={idx}
				onSelect={this.handleSelect.bind(null, tool)}
				/>
		))
	},

	render: function () {
		return (
			<div className={MENU_CLASSNAME}>
				{this.renderItems()}
			</div>
		)
	}
})

export default BatchToolsMenu

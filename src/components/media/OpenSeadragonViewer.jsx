import React from 'react'
import 'openseadragon'
import assign from 'object-assign'
import Button from '../Button.jsx'

const T = React.PropTypes

const OpenSeadragonViewer = React.createClass({
	propTypes: {
		prefixUrl: T.string,
		tileSources: T.oneOfType([T.array, T.string]),
		sequenceMode: T.bool,
		showReferenceStrip: T.bool,
		referenceStripScroll: T.string,
		showNavigator: T.bool,
		onClose: T.func
	},

	componentDidMount: function () {
		this.initOpenSeadragon()
	},

	shouldComponentUpdate: function () {
		return false
	},

	initOpenSeadragon: function () {
		const props = assign({}, this.props)
		delete props.onClose

		this.viewer = OpenSeadragon({
			element: this._element,

			...props,
		})

		const icon = 'http://icons.iconarchive.com/icons/custom-icon-design/mono-general-1/32/close-icon.png'
		const additionalControls = [];
		const closeButton = new OpenSeadragon.Button({
			tooltip: 'Close Viewer',
			onClick: this.props.onClose,
			srcRest: icon,
			srcGroup: icon,
			srcHover: icon,
			srcDown: icon
		});
		additionalControls.push(closeButton);
		const URButtonGroup = new OpenSeadragon.ButtonGroup({buttons: additionalControls});

		this.viewer.addControl(URButtonGroup.element, {
			anchor: OpenSeadragon.ControlAnchor.TOP_RIGHT
		});
	},

	render: function () {
		return (
			<div
				className="OpenSeadragonViewer-container"
				ref={el => this._element = el}
			/>
		)
	}
})

export default OpenSeadragonViewer

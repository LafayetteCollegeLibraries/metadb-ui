import React from 'react'
import ReactModal from 'react-modal'
import assign from 'object-assign'

const NS = 'Modal'

const Modal = React.createClass({
	render: function () {
		const props = assign({
			overlayClassName: `${NS}-overlay`
		}, this.props)

		const baseClassName = `${NS}-container`
		const cn = `${baseClassName}${props.className ? ` ${props.className}`: ''}`
		props.className = cn

		return <ReactModal {...props} />
	}
})

export default Modal

// simple wrappers for header/footer els that stuff
// `Modal-{header,footer}` classnames

const elFactory = element => _props => {
	const cn = `${NS}-${element}`
	const pcn = _props.className
	const className = `${cn}${pcn ? ` ${pcn}`:''}`
	const props = assign({}, _props, {className})

	return React.createElement(element, props)
}

export const Header = elFactory('header')
Header.displayName = 'Header'

export const Footer = elFactory('footer')
Footer.displayName

export const namespace = NS

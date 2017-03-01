import React from 'react'
import Modal from 'react-modal'
import assign from 'deep-assign'

const T = React.PropTypes
const PADDING_VAL = 20

const ModalWithHeader = React.createClass({
  propTypes: {
    header: T.oneOfType([T.string, T.func]),
    headerProps: T.object,
    allowHTML: T.bool,
  },

  getHeaderProps: function () {
    const defaultProps = {
      key: '__dss-modal-w-header',
      style: {
        backgroundColor: '#1d5f83',
        color: '#fff',
        fontSize: '1.125em',
        margin: '-' + PADDING_VAL + 'px',
        marginBottom: PADDING_VAL + 'px',
        padding: Math.round(PADDING_VAL / 2) + 'px',
        textAlign: 'center',
      }
    }

    return assign(defaultProps, this.props.headerProps)
  },

  renderHeader: function () {
    // allow a user-provided function to return 
    if (typeof this.props.header === 'function')
      return this.props.header.call(null, this)

    const props = this.getHeaderProps()

    if (this.props.allowHTML)
      props.dangerouslySetInnerHTML = { __html: this.props.header }
    else
      props.children = this.props.header

    return React.createElement('header', props)
  },

  render: function () {
    const headerStyle = (this.getHeaderProps().style || {})
    const defaultContentStyle = {
      borderStyle: 'solid',
      borderWidth: '1px',
      bottom: '10%',
      left: '10%',
      padding: PADDING_VAL + 'px',
      top: '10%',
      right: '10%',
    }

    if (headerStyle.backgroundColor)
      defaultContentStyle.borderColor = headerStyle.backgroundColor

    const modalContentStyle = assign({}, defaultContentStyle, 
      (this.props.style ? this.props.style.content : undefined)
    )

    const props = assign({style: {content: modalContentStyle}}, this.props)

    return React.createElement(Modal, props, [
      this.renderHeader(),
      this.props.children
    ])
  }
})

export default ModalWithHeader

import React from 'react'

const T = React.PropTypes

const Tag = React.createClass({
  propTypes: {
    value: T.string.isRequired,

    className: T.string,
    onClick: T.func,
    onRemove: T.func,
    readOnly: T.bool,
  },

  handleOnClick: function (ev) {
    ev.preventDefault()

    return this.props.onClick && this.props.onClick.call()
  },

  handleRemoveTag: function (ev) {
    ev.preventDefault()

    if (this.props.readOnly)
      return

    return this.props.onRemove && this.props.onRemove.call()
  },

  maybeRenderRemoveButton: function () {
    if (this.props.readOnly || !this.props.onRemove)
      return

    return (
      <button
        children="x"
        className="remove-tag-btn"
        onClick={this.handleRemoveTag}
      />
    )
  },

  renderTag: function () {
    const props = {
      children: this.props.value,
      className: 'tag',
    }

    if (this.props.readOnly)
      props.className = props.className + ' read-only'
    else
      props.onClick = this.handleOnClick

    return <span {...props} />
  },

  render: function () {
    const classname = [].concat('tag-container', this.props.className).join(' ')
    return (
      <div className={classname}>
        {this.renderTag()}

        {this.maybeRenderRemoveButton()}
      </div>
    )
  }
})

export default Tag

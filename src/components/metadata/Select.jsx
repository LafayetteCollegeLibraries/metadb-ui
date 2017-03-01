import React from 'react'
import assign from 'object-assign'

const T = React.PropTypes

const Select = React.createClass({
  propTypes: {
    options: T.arrayOf(T.oneOfType([T.string, T.shape({
      label: T.string,
      value: T.string,
    })])),

    style: T.object,
  },

  defaultStyle: function () {
    const arrowSvg = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 30">',
      '<path d="M5,10L10,20L15,10" stroke="%23000" stroke-width="2"/>',
    '</svg>'].join('')

    return {
      appearance: 'none',
      backgroundColor: 'transparent',
      // backgroundImage: "url('data:image/svg+xml;utf8,'" + arrowSvg + "')",
      backgroundRepeat: 'no-repeat',
      backgroundPositionX: '125%',
      backgroundPositionY: 'bottom',
      backgroundSize: 'contain',
      borderRadius: '2px',
      display: 'inline-block',
      fontSize: '1em',
      // MozAppearance: 'none',
      padding: '15px',
      paddingRight: '20px',
      verticalAlign: 'middle',
      // WebkitAppearance: 'none',
    }
  },

  handleChange: function (ev) {
    this.props.onChange && this.props.onChange.call(null, ev.target.value)
  },

  mapOptions: function () {
    if (!this.props.options || !this.props.options.length)
      return

    return this.props.options.map((option, index) => {
      const optProps = {}
      let label

      if (typeof option === 'object') {
        optProps.value = option.value
        label = option.label
      }

      else {
        label = optProps.value = option
      }

      optProps.key = 'sel' + index + (optProps.value || 'empty')

      return <option {...optProps}>{label}</option>
    })
  },

  render: function () {
    const style = assign(this.defaultStyle(), this.props.style)
    const selProps = assign({}, this.props, {style, onChange: this.handleChange})

    if (selProps.options)
      delete selProps.options

    return (
      <select {...selProps}>
        {this.props.children}
        {this.mapOptions()}
      </select>
    )
  }
})

export default Select

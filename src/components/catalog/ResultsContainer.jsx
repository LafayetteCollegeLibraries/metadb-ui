import React from 'react'
import assign from 'object-assign'

const T = React.PropTypes
const ResultsContainer = React.createClass({
  propTypes: {
    data: T.array.isRequired,
    displayComponent: T.func.isRequired,

    containerProps: T.object,
    itemProps: T.object,
    offset: T.oneOfType([T.number, T.string]),
  },

  renderResults: function () {
    const Component = this.props.displayComponent

    if (!Component)
      return

    return this.props.data.map((item, index) => {
      const props = assign({
        item,
        position: (this.props.offset || 0) + 1 + index,
        key: 'result-' + (this.props.offset + index) + '-' + item.id,
      }, this.props.itemProps)

      return React.createElement(Component, props)
    })
  },

  render: function () {
    const containerProps = assign({
      style: {
        marginTop: '10px',
      }
    }, this.props.containerProps)

    return React.createElement('div', containerProps, this.renderResults())
  }
})

export default ResultsContainer

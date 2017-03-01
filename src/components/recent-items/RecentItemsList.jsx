import React from 'react'

const T = React.PropTypes

const RecentItemsList = React.createClass({
  propTypes: {
    items: T.arrayOf(T.shape({
      id: T.string,
      title: T.array,
    })).isRequired,

    buildUrl: T.func,
    title: T.string,
  },

  render: function () {
    return (
      <ul className="recent-items">
        {this.props.title ? <lh>{this.props.title}</lh> : ''}
        {this.props.items.map((item, index) => {
          if (!this.props.buildUrl)
            return <li key={index}>{item.title[0]}</li>

          const url = this.props.buildUrl(item)

          return <li key={index}><a href={url}>{item.title[0]}</a></li>
        })}
      </ul>
    )
  }
})

export default RecentItemsList

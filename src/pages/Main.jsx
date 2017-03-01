import React from 'react'
import assign from 'object-assign'
import { NotificationStack } from 'react-notification'

import Navbar from '../components/Navbar.jsx'
import NotificationCenter from '../components/NotificationCenter.jsx'

const Main = React.createClass({
  render: function () {
    return (
    <div>
      <Navbar />
      {React.Children.map(this.props.children, c => {
        const props = assign({}, this.props, c.props)
        return React.cloneElement(c, props, c.props.children)
      })}

      <NotificationCenter
        notifications={this.props.notifications}
        onClearNotification={this.props.clearNotification}
      />
    </div>

    )
  }
})

export default Main

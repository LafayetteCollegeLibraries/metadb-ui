// uses values from `response.pages` object from Blacklight results
//
// "current_page": 2,
// "next_page": 3,
// "prev_page": 1,
// "total_pages": 924,
// "limit_value": 25,
// "offset_value": 25,
// "total_count": 23088,
// "first_page?": false,
// "last_page?": false

import React from 'react'
import { sprintf } from 'sprintf-js'
import assign from 'object-assign'
import commafy from 'number-with-commas'

const T = React.PropTypes

const ResultsPager = React.createClass({
  propTypes: {
    onNextClick: T.func.isRequired,
    onPreviousClick: T.func.isRequired,

    // there are more values passed from Blacklight, but these
    // are the only ones we really need to populate the
    // `(start) - (end) of (total)` message
    limit_value: T.number.isRequired,
    next_page: T.number,
    offset_value: T.number.isRequired,
    prev_page: T.number,
    total_count: T.number.isRequired,

    // message generated between prev/next buttons
    // displaying current page info + total.
    //
    // if a string, it is passed to sprintf with the (en-US) commafied values:
    // start, end, total count
    //
    // if a function, these three values are passed (un-(en-US)commafied) to
    // the function, which is expected to return a string
    //
    // presently: html values are allowed (the string is passed
    // into `dangerouslySetInnerHtml`)
    //
    // (default: '%s &ndash; %s of <strong>%s</strong>')
    message: T.oneOfType([T.string, T.func]),

    // text used for next/prev buttons 

    // (default: 'Next »')
    nextText: T.string,

    // (default: '« Previous')
    previousText: T.string,

    style: T.object,
  },

  getDefaultProps: function () {
    return {
      next_page: null,
      prev_page: null,
      message: '%s &ndash; %s of <strong>%s</strong>',
      nextText: 'Next »',
      previousText: '« Previous',
    }
  },

  atFirstPage: function () {
    return this.props.prev_page === null
  },

  atLastPage: function () {
    return this.props.next_page === null
  },

  handleNextClick: function (ev) {
    ev.preventDefault && ev.preventDefault()
    this.props.onNextClick()
  },

  handlePreviousClick: function (ev) {
    ev.preventDefault && ev.preventDefault()
    this.props.onPreviousClick()
  },

  pagerText: function () {
    const total = this.props.total_count
    const offset = this.props.offset_value
    const lower = offset + 1

    // prevent the upper-bounds from exceeding the total value
    const upper = Math.min(offset + this.props.limit_value, total)
    let msg

    if (typeof this.props.message === 'function') {
      msg = this.props.message.call(null, lower, upper, total)
    } else {
      msg = sprintf(this.props.message,
        commafy(lower),
        commafy(upper),
        commafy(total)
      )
    }

    // the template currently uses HTML (for a <strong> tag), so we'll need
    // to `dangerouslySetInnerHTML`
    return React.createElement('span', {
      key: 'pager-message',
      dangerouslySetInnerHTML: {__html: msg}
    })
  },

  positionButtonProps: function (which, positionCheck, onClick, style) {
    const atLimit = positionCheck()
    const text = this.props[which + 'Text']

    const props = {
      children: text,
      key: 'dir-' + which,
      ref: e => this[which + 'Button'] = e,
      style: assign({}, {
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: '1em',
        outline: 'none',
        cursor: (atLimit ? 'default' : 'pointer'),
      }, style),
    }

    if (!atLimit)
      props.onClick = onClick
    else
      props.disabled = true

    return props
  },

  positionButtonStyles: function (direction) {
    const dir = direction === 'prev' ? 'prev' : 'next'
    const styleDir = dir === 'prev' ? 'Right' : 'Left'

    const style = {
      padding: '0 5px',
    }

    style['border' + styleDir] = '1px solid #000'
    style['margin' + styleDir] = '5px'

    return style
  },


  render: function () {
    const style = assign({}, {
      display: 'inline-block',
    }, this.props.style)

    const prevProps = this.positionButtonProps(
      'previous',
      this.atFirstPage,
      this.handlePreviousClick,
      this.positionButtonStyles('prev')
    )

    const nextProps = this.positionButtonProps(
      'next',
      this.atLastPage,
      this.handleNextClick,
      this.positionButtonStyles('next')
    )

    return (
      <div style={style}>
        <button {...prevProps} />
        {this.pagerText()}
        <button {...nextProps} />
      </div>
    )
  }
})

export default ResultsPager

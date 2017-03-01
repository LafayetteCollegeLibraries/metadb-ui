import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import assign from 'object-assign'

import DateInput from '../DateInput.jsx'

const wrap = xtend => {
  const props = assign({}, xtend)
  return shallow(React.createElement(DateInput, props))
}

describe('<DateInput />', function () {
  it('parses an ISO date string passed to `value`', function () {
    const d = new Date()
    const value = d.toISOString()

    const year = d.getUTCFullYear()
    let month = (d.getUTCMonth() + 1) + ''
    let day = d.getUTCDate() + ''

    if (month.length === 1)
      month = '0' + month

    if (day.length === 1)
      day = '0' + day

    const dateStr = `${year}-${month}-${day}`
    const $el = wrap({value})

    expect($el.state('date')).to.equal(dateStr)
  })

  it('passes a Date object to `onChange` when blurred', function (done) {
    const value = '2016-10-31'
    const split = value.split('-').map(Number)

    const onChange = (val) => {
      expect(val).to.be.an.instanceOf(Date)
      expect(val.getUTCFullYear()).to.equal(split[0])
      expect(val.getUTCMonth()).to.equal(split[1] - 1)
      expect(val.getUTCDate()).to.equal(split[2])
      done()
    }

    const $el = wrap({onChange, value})
    $el.simulate('blur')
  })

  it('updates the value in state on change', function (done) {
    const initial = '2016-10-31'
    const update = '1991-09-04'
    const split = update.split('-').map(Number)

    const onChange = (val) => {
      expect(val.getUTCFullYear()).to.equal(split[0])
      expect(val.getUTCMonth()).to.equal(split[1] - 1)
      expect(val.getUTCDate()).to.equal(split[2])
      done()
    }

    const $el = wrap({onChange, value: initial})

    $el.simulate('change', {target: {value: update}})
    $el.simulate('blur')
  })

  it('passes the string value as a second parameter to `onChange`', function (done) {
    const value = '2016-10-31'
    const onChange = (val, str) => {
      expect(val).to.be.an.instanceOf(Date)
      expect(str).to.be.a('string')
      expect(str).to.equal(value)
      done()
    }

    const $el = wrap({onChange})
    $el.simulate('change', {target: {value}})
    $el.simulate('blur')
  })

  it('returns null if no value is set', function (done) {
    const onChange = (val, str) => {
      expect(val).to.be.null
      done()
    }

    const $el = wrap({onChange})
    $el.simulate('blur')
  })
})

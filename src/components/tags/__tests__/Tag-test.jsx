import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import assign from 'object-assign'

import Tag from '../Tag.jsx'

const DEFAULT_TEST_TAG = 'Test Tag Value'
const noop = () => {}

const wrapElement = xtend => {
  const props = assign({value: DEFAULT_TEST_TAG}, xtend)
  return shallow(<Tag {...props} />)
}

describe('<Tag/>', function () {
  it('renders as a plain <span/> when no event handlers are passed', function () {
    const $kids = wrapElement().children()

    expect($kids).to.have.length(1)
    expect($kids.first().is('span')).to.be.true
  })

  it('renders as a plain <span /> when set to readOnly', function () {
    let clickCount = 0

    const $el = wrapElement({
      onClick: () => clickCount++,
      onRemove: () => clickCount++,
      readOnly: true,
    })

    expect($el.children()).to.have.length(1)
    expect($el.find('button')).to.have.length(0)

    $el.find('span').simulate('click', {preventDefault: noop})

    expect(clickCount).to.equal(0)
  })

  it('renders an `x` button when an `onRemove` prop is passed', function () {
    const $el = wrapElement({
      onRemove: noop
    })

    expect($el.children()).to.have.length(2)
    expect($el.find('button')).to.have.length(1)

    // kinda tenuous 
    expect($el.find('button').text()).to.equal('x')
  })

  it('triggers `onClick` when a handler is passed + span is clicked', function () {
    let count = 0
    const $el = wrapElement({
      onClick: () => count++
    })

    $el.find('span').simulate('click', {preventDefault: noop})

    expect(count).to.equal(1)
  })

  it('triggers `onRemove` when a handler is passed + button is clicked', function () {
    let count = 0
    const $el = wrapElement({
      onClick: noop,
      onRemove: () => count++,
    })

    $el.find('button').simulate('click', {preventDefault: noop})

    expect(count).to.equal(1)
  })

  it('ignores click event handler when prop `readOnly` is true', function () {
    let count = 0

    const $el = wrapElement({
      onClick: () => count++,
      onRemove: () => count++,
      readOnly: true,
    })

    $el.find('span').simulate('click', {preventDefault: noop})

    expect(count).to.equal(0)
  })
})

import React from 'react'
import assign from 'object-assign'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import TextInput from '../TextInput.jsx'

const shallowEl = xtend => {
  const props = assign({}, xtend)

  return shallow(React.createElement(TextInput, props))
}

describe('<TextInput />', function () {
  it('passes props to the textarea element', function () {
    const $el = shallowEl({disabled: true})
    const $txt = $el.find('textarea')

    expect($txt.prop('disabled')).to.be.true
  })

  it('calls `onBlur` handler if passed', function (done) {
    const onBlur = () => { done() }
    const $el = shallowEl({onBlur})

    $el.simulate('blur', {target: {value: 'hey'}})
  })

  it('calls `onFocus` handler if passed', function (done) {
    const onFocus = () => { done() }
    const $el = shallowEl({onFocus})

    $el.simulate('focus', {target: {value: 'hey'}})
  })

  it('sets `defaultValue` instead of `value` for textarea', function () {
    const value = 'vallllue'
    const $el = shallowEl({value})
    const $txt = $el.find('textarea')

    expect($txt.prop('value')).to.be.undefined
    expect($txt.prop('defaultValue')).to.not.be.undefined
    expect($txt.prop('defaultValue')).to.equal(value)
  })

  describe('the `onChange` handler`', function () {
    const initialValue = 'hey i am a value'

    it ('is called when the textarea is blurred + value has changed', function (done) {
      const onChange = val => {
        expect(val).to.not.equal(initialValue)
        done()
      }

      const $el = shallowEl({onChange})
      $el.simulate('focus', {target: {value: initialValue}})
      $el.simulate('blur', {target: {value: 'something else!!!'}})
    })

    it('is not called when textarea is blurred + value has not changed', function () {
      const onChange = () => {
        throw Error('`onChange` handler should not be called')
      }

      const $el = shallowEl({onChange})
      $el.simulate('focus', {target: {value: initialValue}})
      $el.simulate('blur', {target: {value: initialValue}})
    })

    it('is not called when textarea `change` is called', function () {
      const onChange = () => {
        throw Error('`onChange` handler should not be called')
      }

      const $el = shallowEl({onChange})
      $el.simulate('change', {target: {value: 'hi'}})
    })
  })
})

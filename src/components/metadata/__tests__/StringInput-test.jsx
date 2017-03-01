import React from 'react'
import assign from 'object-assign'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import StringInput from '../StringInput.jsx'

const shallowEl = xtend => {
  const props = assign({}, xtend)

  return shallow(React.createElement(StringInput, props))
}

describe('<StringInput />', function () {
  it('passes props to the input element', function () {
    const $el = shallowEl({type: 'search', readOnly: true})
    const $input = $el.find('input')

    expect($input.prop('type')).to.equal('search')
    expect($input.prop('readOnly')).to.be.true
  })

  it('calls `onBlur` handler if passed', function (done) {
    const onBlur = () => {
      done()
    }

    const $el = shallowEl({onBlur})
    $el.simulate('blur', {target: {value: 'hai'}})
  })

  it('calls `onFocus` handler if passed', function (done) {
    const onFocus = () => {
      done()
    }

    const $el = shallowEl({onFocus})
    $el.simulate('focus', {target: {value: 'hai'}})
  })

  it('sets `defaultValue` instead of `value` for input', function () {
    const value = 'value'
    const $el = shallowEl({value})
    const $input = $el.find('input')

    expect($input.prop('value')).to.be.undefined
    expect($input.prop('defaultValue')).to.not.be.undefined
    expect($input.prop('defaultValue')).to.equal(value)
  })

  describe('the `onChange` handler', function () {
    it('is called when the input is blurred + value has changed', function (done) {
      const value = 'hey i am the value'

      const onChange = val => {
        expect(val).to.not.equal(value)
        done()
      }

      const $el = shallowEl({onChange, value})
      $el.simulate('focus', {target: {value}})
      $el.simulate('blur', {target: {value: 'something else!!!'}})
    })

    it('is not called when input blurred and + value has not changed', function () {
      const value = 'hey i am the value'
      const onChange = () => {
        throw Error('`onChange` handler should not be called!')
      }

      const $el = shallowEl({onChange, value})
      $el.simulate('focus', {target: {value}})
      $el.simulate('blur', {target: {value}})
    })

    it('is not called when input `change` is called', function () {
      const onChange = () => {
        throw Error('`onChange` handler should not be called')
      }

      const $el = shallowEl({onChange})
      $el.simulate('change', {target: {value: 'hi'}})
    })
  })
})

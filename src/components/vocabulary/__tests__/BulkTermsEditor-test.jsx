import React from 'react'
import { expect } from 'chai'
import { shallow, mount } from 'enzyme'
import assign from 'object-assign'
import BulkTermsEditor from '../BulkTermsEditor.jsx'

import rawTerms from './data/line-delimited-terms.txt'

const noop = () => {}
const evClick = {preventDefault: noop}

const wrapComponent = (xtend, renderer) => {
  const opts = assign({}, {
    onSubmit: noop,
  }, xtend)

  return renderer(<BulkTermsEditor {...opts}/>)
}

const shallowWrap = xtend => wrapComponent(xtend, shallow)
const deepWrap = xtend => wrapComponent(xtend, mount)

describe('<BulkTermsEditor />', function () {
  it('renders terms array as new-line delimited text (in textarea)', function () {
    const terms = [
      'one', 'two', 'three', 'four', 'five'
    ]

    const $el = deepWrap({terms})
    const $txt = $el.find('textarea')

    const val = $txt.prop('value')
    expect(val).to.equal(terms.join('\n') + '\n')
  })

  it('splits textarea contents on newline when submitted', function (done) {
    const rawValue = 'this is one term\nand this is another one'
    const onSubmit = vals => {
      expect(vals).to.deep.equal(rawValue.split('\n'))
      done()
    }

    const $el = deepWrap({onSubmit})

    $el.find('textarea').simulate('change', {target: {value: rawValue}})
    $el.find('button').last().simulate('click', evClick)
  })

  it('removes empty terms from values on submit', function (done) {
    const terms = [
      'one', '', 'two', '', '', 'three', 'four', ''
    ]

    const filtered = terms.filter(Boolean)

    const onSubmit = vals => {
      expect(vals).to.deep.equal(filtered)
      done()
    }

    const $el = shallowWrap({onSubmit, terms})

    $el.find('button').last().simulate('click', evClick)
  })

  it('also removes empty terms from textarea on submit', function (done) {
    const rawValue = 'this is one term\nthis is another\n\nthis is a fourth term'
    const onSubmit = vals => {
      expect(vals).to.deep.equal(rawValue.split('\n').filter(Boolean))
      done()
    }

    const $el = deepWrap({onSubmit})

    $el.find('textarea').simulate('change', {target: {value: rawValue}})
    $el.find('button').last().simulate('click', evClick)
  })

  it('sets `overwrite` when the checkbox is checked', function () {
    const $el = deepWrap()
    
    expect($el.state('overwrite')).to.be.false

    const $toggle = $el.find('input[name="bulk-terms-overwrite-terms"]')
    $toggle.simulate('change', {target: {checked: true}})

    expect($el.state('overwrite')).to.be.true
  })

  it('loads dragged text file into textarea', function (done) {
    const files = [new Blob([rawTerms], {type: 'text/plain'})]

    const onSubmit = data => {
      expect(data).to.deep.equal(rawTerms.split('\n').filter(Boolean))
      done()
    }

    const $el = deepWrap({onSubmit})
    const $drop = $el.find('Dropzone')
    const $button = $el.find('button').last()

    $drop.simulate('drop', {dataTransfer: {files}})
    
    // need to wait for next-tick, otherwise we beat the file from being loaded
    window.setTimeout(() => $button.simulate('click', evClick), 1)
  })

  it('appends file terms to values by default', function (done) {
    const terms = [
      'one', 'two', 'three', 'four',
    ]

    const onSubmit = data => {
      const results = [].concat(terms, rawTerms.split('\n')).filter(Boolean)
      expect(data).to.deep.equal(results)
      done()
    }

    const files = [new Blob([rawTerms], {type: 'text/plain'})]
    const $el = deepWrap({terms, onSubmit})
    const $drop = $el.find('Dropzone')
    const $button = $el.find('button').last()

    $drop.simulate('drop', {dataTransfer: {files}})

    window.setTimeout(() => $button.simulate('click', evClick), 1)
  })

  it('replaces previous terms when `overwrite` state is true', function (done) {
    const terms = [
      'one', 'two', 'three', 'four',
    ]

    const onSubmit = data => {
      expect(data).to.deep.equal(rawTerms.split('\n').filter(Boolean))
      done()
    }

    const files = [new Blob([rawTerms], {type: 'text/plain'})]
    const $el = deepWrap({terms, onSubmit})
    const $drop = $el.find('Dropzone')
    const $button = $el.find('button').last()

    $el.setState({overwrite: true})

    $drop.simulate('drop', {dataTransfer: {files}})

    window.setTimeout(() => $button.simulate('click', evClick), 1)
  })
})

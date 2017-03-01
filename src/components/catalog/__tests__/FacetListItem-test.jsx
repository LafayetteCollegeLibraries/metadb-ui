import React from 'react'
import { expect } from 'chai'
import { mount } from 'enzyme'
import assign from 'object-assign'
import randomBool from 'random-bool'
import FacetListItem from '../FacetListItem.jsx'

const defaultProps = {
  data: {
    hits: 10,
    label: 'test label',
    value: 'test_value',
  },
  onClick: () => {},
}

const mountEl = (xtend) => {
  const props = assign({}, defaultProps, xtend)
  return mount(React.createElement(FacetListItem, props))
}

const LABEL_SEL = '.facet-label'
const COUNT_SEL = '.facet-count'

describe('<FacetListItem />', function () {
  it('renders a `span.facet-count` of the `hits` by default', function () {
    const hits = Math.floor(Math.random() * 1000)
    const data = assign({}, defaultProps.data, {hits})
    const $el = mountEl({data})
    const $span = $el.find(COUNT_SEL)
    expect($span).to.have.length(1)
    expect(parseInt($span.text(), 10)).to.equal(hits)
  })

  it('hides the `hits` count when `hideCount` is true', function () {
    const $el = mountEl({hideCount: true})
    expect($el.find('span.facet-count')).to.have.length(0)
  })

  it('calls `onClick` w/ the facet data when clicked ', function (done) {
    const props = {
      data: {
        label: 'new test label',
        value: 'hullo I am the value!',
        hits: 1234,
      },
      onClick: (facet) => {
        const data = props.data
        expect(facet.value).to.equal(data.value)
        expect(facet.label).to.equal(data.label)
        expect(facet.hits).to.equal(data.hits)
        done()
      },
    }

    const $el = mountEl(props)
    $el.find(LABEL_SEL).simulate('click')
  })
})

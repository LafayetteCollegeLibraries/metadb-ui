import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import assign from 'object-assign'

import OpenSeadragonViewer from '../OpenSeadragonViewer.jsx'

const defaultProps = {
  prefixUrl: '//localhost.localdomain/images/',
  tileSources: ['//localhost.localdomain/iiif/image.jp2/info.json'],
  sequenceMode: true,
  showReferenceStrip: true,
  referenceStripScroll: 'vertical',
  showNavigator: true
}

const noop = () => {}

const wrapEl = (xtend, renderer) => {
  const props = assign({}, {
    defaultProps,
    onClose: noop
  }, xtend)

  return renderer(React.createElement(OpenSeadragonViewer, props))
}

const shallowEl = xtend => wrapEl(xtend, shallow)

describe('<OpenSeadragonViewer />', () => {
  it('renders an OpenSeadragonViewer element', () => {
      const $el = shallowEl()
      expect($el.find(OpenSeadragonViewer)).to.be.a('Object');
  })
})

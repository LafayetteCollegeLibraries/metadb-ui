import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import ResultsGallery from '../ResultsGallery.jsx'

import docs from './data/docs.json'

describe('<ResultsGallery />', function () {
	it('renders a ResultsGalleryItem for each result item', function () {
		const $el = shallow(<ResultsGallery data={docs} />)
		const $items = $el.find('ResultsGalleryItem')

		expect($items).to.have.length(docs.length)
	})
})

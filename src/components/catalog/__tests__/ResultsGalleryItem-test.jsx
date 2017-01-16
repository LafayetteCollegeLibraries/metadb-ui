import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import assign from 'object-assign'
import randomIndex from 'random-array-index'

import ResultsGalleryItem from '../ResultsGalleryItem.jsx'
import docs from './data/docs.json'

const wrap = props => {
	return shallow(React.createElement(ResultsGalleryItem, props))
}

describe('ResultsGalleryItem', function () {
	it('uses classNames for each piece', function () {
		const idx = randomIndex(docs)
		const data = docs[idx]
		const $el = wrap({data})

		const classNames = [
			'search-results-gallery--item',
			'search-results-gallery--thumbnail',
			'search-results-gallery--caption',
		]

		classNames.forEach(function (cn) {
			expect($el.find(`.${cn}`)).to.have.length(1)
		})
	})

	describe('the link to the work', function () {
		const idx = randomIndex(docs)
		const data = docs[idx]

		const $el = wrap({data})
		const $link = $el.find('Link')

		it('has been generated', function () {
			expect($link).to.have.length(1)
		})

		it('uses the `id` prop for a location', function () {
			expect($link.prop('to')).to.contain(data.id)
		})
	})
})

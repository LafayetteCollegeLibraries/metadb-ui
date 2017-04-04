import React from 'react'
import chai, { expect } from 'chai'
import { shallow, mount } from 'enzyme'
import assign from 'object-assign'
import randomIndex from 'random-array-index'

import VocabularyList from '../VocabularyList.jsx'
import vocabResults from './data/multiple-vocabularies'

const noop = () => {}

const wrapComponent = (xtend, renderer) => {
	const props = assign({}, {
		onAddVocabulary: noop,
		onVocabularyClick: noop,
		vocabularies: vocabResults.vocabularies,
	}, xtend)

	return renderer(React.createElement(VocabularyList, props))
}

const wrapMount = xtend => wrapComponent(xtend, mount)
const wrapShallow = xtend => wrapComponent(xtend, shallow)

describe('<VocabularyList />', function () {
	describe('when loading', function () {
		const $el = wrapMount({isLoading: true})

		it('disables the filter input', function () {
			const $filter = $el.find('input.filter')
			expect($filter.prop('disabled')).to.be.true
		})

		it('renders an `--empty` div with caption', function () {
			const $div = $el.find('.vocab-list--empty')
			expect($div).to.have.length(1)
			expect($div.text()).to.match(/loading/ig)
		})
	})

	describe('the vocabulary list item', function () {
		const $el = wrapMount()

		it('renders for each vocabulary (on load)', function () {
			const vocabLength = vocabResults.vocabularies.length
			const $vocabItems = $el.find('.vocab-list--item')

			expect($vocabItems).to.have.length(vocabLength)
		})

		describe('when an item is hovered', function () {
			const $vocabItems = $el.find('.vocab-list--item')

			// $vocabItems isn't actually an array, but a ReactWrapper that
			// acts like an array, so we can't use the randomIndex function
			const idx = Math.floor(Math.random() * $vocabItems.length)
			const $hovered = $vocabItems.at(idx)

			$hovered.simulate('mouseOver')

			it('adds a `.hover` classname', function () {
				const classnames = ($hovered.prop('className') || '').split(' ')

				expect(classnames.length).to.be.greaterThan(0)
				expect(classnames.indexOf('hover')).to.be.greaterThan(-1)
			})

			it('sets the `hoverIndex` state', function () {
				expect($el.state('hoverIndex')).to.equal(idx)
			})
		})

		describe('when an item is clicked', function () {
			const vocabs = vocabResults.vocabularies
			const idx = randomIndex(vocabs)
			const item = vocabResults.vocabularies[idx]
			let called = false

			const onVocabularyClick = (data, index) => {
				expect(data).to.deep.equal(item)
				expect(index).to.equal(index)
				called = true
			}

			const $elClick = wrapMount({onVocabularyClick})
			const $target = $elClick.find('.vocab-list--item').at(idx)

			$target.simulate('click')

			// give it a second, just in case
			setTimeout(function () {
				expect(called).to.be.true
			}, 1)
		})

		describe('the term count text', function () {
			it('is displayed by default (using `term_count` field)', function () {
				const $vocabItems = $el.find('.vocab-list--item')

				const rawVocabs = vocabResults.vocabularies
				const idx = randomIndex(rawVocabs)
				const vocabData = rawVocabs[idx]
				const $vocabItem = $vocabItems.at(idx)

				expect(vocabData.term_count).to.not.be.undefined

				const $count = $vocabItem.find('.term-count')
				expect($count).to.have.length(1)

				const reg = new RegExp(`${vocabData.term_count} term`)
				expect($count.text()).to.match(reg)
			})

			it('will not display if no `count` field is passed', function () {
				const $newEl = wrapMount({keys: {label: 'label'}})
				expect($newEl.find('.term-count')).to.have.length(0)
			})

		})

		describe('when no vocabularies are provided', function () {
			it('renders an `--empty` div', function () {
				const $emptyEl = wrapMount({vocabularies: []})

				expect($emptyEl.find('.vocab-list--item')).to.have.length(0)

				const $div = $emptyEl.find('.vocab-list--empty')
				expect($div).to.have.length(1)
				expect($div.text()).to.match(/no vocabularies/ig)
			})
		})
	})

	describe('filtering items', function () {
		it('filters the vocabulary list on each `change` event', function () {
			const $el = wrapMount()
			const $filter = $el.find('.filter')
			const startLen = vocabResults.vocabularies.length

			expect($el.find('.vocab-list--item')).to.have.length(startLen)

			$filter.simulate('change', {target: {value: 'p'}})

			// ["Test Vocab Patch", "Test Vocab Put"]
			expect($el.find('.vocab-list--item')).to.have.length(2)

			// ["Test Vocab Patch"]
			$filter.simulate('change', {target: {value: 'pa'}})
			expect($el.find('.vocab-list--item')).to.have.length(1)

			// []
			$filter.simulate('change', {target: {value: 'pa$'}})
			expect($el.find('.vocab-list--item')).to.have.length(0)
		})

		describe('when no vocabs match', function () {
			const $el = wrapMount()
			const val = 'cats r kewl'
			$el.find('.filter').simulate('change', {target: {value: val}})

			it('renders an `--empty` div', function () {
				expect($el.find('.vocab-list--item')).to.have.length(0)
				expect($el.find('.vocab-list--empty')).to.have.length(1)
			})

			it('displays the input as part of its message', function () {
				const valreg = new RegExp(val, 'i')
				const txt = $el.find('.vocab-list--empty').text()

				expect(txt).to.match(/no vocabularies/i)
				expect(txt).to.match(valreg)
			})
		})

		describe('using up/down keys in filter', function () {
			const $el = wrapMount()
			const $filter = $el.find('.filter')

			const UP = 38
			const DOWN = 40

			let idx = -1

			it('increments the `hoverIndex` when DOWN is pressed', function () {
				expect($el.state('hoverIndex')).to.equal(idx)

				$filter.simulate('keyDown', {keyCode: DOWN})
				expect($el.state('hoverIndex')).to.equal(++idx)
				expect(
					$el.find('.vocab-list--item').at(idx).prop('className')
				).to.match(/hover/)

				$filter.simulate('keyDown', {keyCode: DOWN})
				expect($el.state('hoverIndex')).to.equal(++idx)

				expect(
					$el.find('.vocab-list--item').at(idx).prop('className')
				).to.match(/hover/)

				// + clears the previous item
				expect(
					$el.find('.vocab-list--item').at(idx - 1).prop('className')
				).to.not.match(/hover/)
			})

			it('decrements the `hoverIndex` when UP is pressed', function () {
				$filter.simulate('keyDown', {keyCode: UP})
				expect($el.state('hoverIndex')).to.equal(--idx)
				expect(
					$el.find('.vocab-list--item').at(idx).prop('className')
				).to.match(/hover/)
			})

			it('wraps to the end of the list when `hoverIndex` < 0', function () {
				const count = $el.find('.vocab-list--item').length

				$filter.simulate('keyDown', {keyCode: UP})
				expect($el.state('hoverIndex')).to.equal(count - 1)
				expect(
					$el.find('.vocab-list--item').at(count - 1).prop('className')
				).to.match(/hover/)
			})

			it('wraps to the beginning of the list when `hoverIndex` === length', function () {
				const count = $el.find('.vocab-list--item').length

				$filter.simulate('keyDown', {keyCode: DOWN})
				expect($el.state('hoverIndex')).to.equal(0)
				expect(
					$el.find('.vocab-list--item').at(0).prop('className')
				).to.match(/hover/)
			})
		})
	})

	describe('the add vocabulary button', function () {
		it('triggers `onAddVocabulary` prop', function (done) {
			const $el = wrapMount({onAddVocabulary: done})
			$el.find('button').simulate('click')
		})
	})

	describe('the `activeKey` prop', function () {
		const vocabs = vocabResults.vocabularies
		const idx = randomIndex(vocabs)
		const keys = {
			count: 'term_count',
			label: 'pref_label'
		}
		const activeKey = vocabs[idx][keys.label][0]
		const $el = wrapMount({keys, activeKey})
		const keyReg = new RegExp('^' + activeKey, 'i')

		describe('the matching vocab item', function () {
			it('has the class name `active`', function () {
				expect($el.find('.active')).to.have.length(1)

				expect($el.find('.active').text()).to.match(keyReg)
			})

			it('remains the same element when filter is applied', function () {
				const search = activeKey.slice(activeKey.length - 4, activeKey.length)
				$el.find('.filter').simulate('change', {target: {value: search}})

				expect($el.find('.vocab-list--item').length).to.be.lessThan(vocabs.length)
				expect($el.find('.active')).to.have.length(1)
				expect($el.find('.active').text()).to.match(keyReg)
			})

			it('does not render if filter does not match', function () {
				$el.find('.filter').simulate('change', {target: {value: '$$$$'}})
				expect($el.find('.active')).to.have.length(0)
			})
		})
	})

	describe('the `placeholder` prop', function () {
		it('is passed to the `input.filter` component', function () {
			const placeholder = 'HEY I HOLD PLACES'
			const $newEl = wrapMount({placeholder})

			expect($newEl.find('.filter').prop('placeholder')).to.equal(placeholder)
		})
	})

})

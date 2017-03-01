import React from 'react'
import assign from 'object-assign'
import { expect } from 'chai'
import { shallow, mount } from 'enzyme'
import GenericVocabularyForm from '../GenericVocabulary.jsx'

const noop = () => {}

const wrapEl = (xtend, renderer) => {
  const props = assign({
    onSubmit: noop,
  }, xtend)

  return renderer(React.createElement(GenericVocabularyForm, props))
}

const shallowEl = xtend => wrapEl(xtend, shallow)
const mountEl = xtend => wrapEl(xtend, mount)

describe('<GenericVocabulary /> form schema', function () {
  it('renders a single StringInput for the label', function () {
    const $el = shallowEl()
    const $field = $el.find('FormField').findWhere($e => $e.prop('name') === 'label')

    expect($field).to.have.length(1)
    expect($field.prop('multiple')).to.be.falsy

    const renderer = $field.prop('renderer')
    expect(renderer).to.be.a.function
    expect(renderer.displayName).to.equal('StringInput')
  })

  it('renders a single TextInput for the alt_label (description)', function () {
    const $el = shallowEl()
    const $field = $el.find('FormField').findWhere($e => $e.prop('name') === 'alt_label')

    expect($field).to.have.length(1)
    expect($field.prop('multiple')).to.be.falsy

    const renderer = $field.prop('renderer')
    expect(renderer).to.be.a.function
    expect(renderer.displayName).to.equal('TextInput')
  })

  it('passes `data.label` as Name and `data.alt_label` as Description', function () {
    const name = 'SOME OTHER NAME'
    const description = 'hey here is some info'

    const data = {
      label: [name],
      pref_label: [name],
      alt_label: [description],
      hidden_label: [],
    }

    const $el = mountEl({data})
    const $fields = $el.find('FormField')

    // using `findWhere` props.name === 'name' when mounting the component
    // returns 3 results:
    //   1. the FormField component
    //   2. the TextInput component
    //   3. the <input type="text" /> element for #2
    // since we're only looking to test against the first result,
    // we'll use `.first()`
    const $name = $fields.findWhere($e => $e.prop('name') === 'label').first()
    const $description = $fields.findWhere($e => $e.prop('name') === 'alt_label').first()

    expect($name.prop('value')).to.deep.equal(data.label)
    expect($description.prop('value')).to.deep.equal(data.alt_label)
  })

  describe('the `onSubmit` handler`', function () {
    const NAME = 'Test Vocabulary'
    const DESCRIPTION = `This is a description of "${NAME}"`

    it('is passed a term object', function (done) {
      const onSubmit = data => {
        expect(data).to.be.an.object

        expect(data).to.have.property('label')
        expect(data.label).to.be.an.array
        expect(data.label).to.have.length(1)
        expect(data.label[0]).to.equal(NAME)

        expect(data).to.have.property('alt_label')
        expect(data.alt_label).to.be.an.array
        expect(data.alt_label).to.have.length(1)
        expect(data.alt_label[0]).to.equal(DESCRIPTION)

        expect(data).to.have.property('pref_label')
        expect(data.pref_label).to.be.an.array
        expect(data.pref_label).to.have.length(1)
        expect(data.pref_label[0]).to.equal(NAME)

        expect(data).to.have.property('hidden_label')
        expect(data.hidden_label).to.be.an.array
        expect(data.hidden_label).to.be.empty

        done()
      }

      const $el = shallowEl({onSubmit})

      const $form = $el.find('MetadataForm')
      $form.simulate('change', 'label', 0, NAME)
      $form.simulate('change', 'alt_label', 0, DESCRIPTION)

      $el.find('MetadataForm').simulate('submit')
    })
  })
})

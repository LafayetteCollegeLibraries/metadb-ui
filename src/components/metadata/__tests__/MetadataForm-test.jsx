import React from 'react'
import assign from 'object-assign'
import { expect } from 'chai'
import { shallow, mount } from 'enzyme'
import MetadataForm from '../MetadataForm.jsx'
import FormField from '../FormField.jsx'

const defaultData = {
	title: ['this is a title value'],
	author: ['first author value', 'second author value'],
}

const defaultFormProps = {
	data: defaultData,
	defaultProps: {
		allowMultipleValues: true,
	},
	onAddValueField: noop,
	onChange: noop,
	onRemoveValueField: noop,
	onSubmit: noop,
}

const noop = () => {}

const wrapEl = (xtend, renderer) => {
	const props = assign({}, defaultFormProps, xtend)
	return renderer(React.createElement(MetadataForm, props))
}

const shallowEl = xtend => wrapEl(xtend, shallow)
const mountEl = xtend => wrapEl(xtend, mount)

describe('<MetadataForm />', function () {
	describe('when passed child elements', function () {
		it('passes values from `defaultProps` to children missing that prop', function () {
			const PROP_KEY = 'someRandomProp'
			const optsWithProp = {[PROP_KEY]: 'value'}
			const renderer = props => <p>{props.value}</p>

			const children = [
				<FormField name="with-prop" {...optsWithProp} renderer={renderer}/>,
				<FormField name="without-prop" renderer={renderer} />,
			]

			const defaultProps = {
				[PROP_KEY]: 'someRandomValue',
			}

			const $el = mountEl({defaultProps, children})

			const $withProp = $el.children().findWhere($c => $c.prop('name') === 'with-prop')
			const $withoutProp = $el.children().findWhere($c => $c.prop('name') === 'without-prop')

			expect($withProp.prop(PROP_KEY)).to.not.equal(defaultProps[PROP_KEY])
			expect($withoutProp.prop(PROP_KEY)).to.equal(defaultProps[PROP_KEY])
		})

		it('maps the values from `data` to those elements', function () {
			const renderer = props => <p>{props.value}</p>

			const children = [
				<FormField name="title" renderer={renderer} />,
				<FormField name="author" renderer={renderer} />,
			]

			const $el = shallowEl({children})
			const $children = $el.children()

			expect($children).to.have.length(children.length)

			$children.forEach($child => {
				const name = $child.prop('name')
				const value = $child.prop('value')

				expect(defaultData[name]).to.deep.equal(value)
			})
		})
	})
})

// GenericWork schema form
import React from 'react'

import MetadataForm from '../metadata/MetadataForm.jsx'
import FormField from '../metadata/FormField.jsx'
import StringInput from '../metadata/StringInput.jsx'
import TextInput from '../metadata/TextInput.jsx'
import ControlledVocabularyInput from '../metadata/ControlledVocabularyInput.jsx'
import DateInput from '../metadata/DateInput.jsx'
import Button from '../Button.jsx'

const labelFromName = name => {
	const split = name.split('_').map(s => s.slice(0,1).toUpperCase() + s.slice(1))

	if (split.length === 1)
		return split[0]

	return split.shift() + ' (' + split.join(', ') + ')'
}

const LargerField = props => {
	if (!props.label)
		props.label = labelFromName(props.name)

	return <FormField {...props} renderer={TextInput} />
}

const SubjectOCM = props => {
	const fetchTerms = () => {
		return fetch(`${process.env.API_BASE_URL}/vocabularies/eaic-subject-ocm.json`)
		.then(res => res.json())
		.then(res => res.terms)
	}

	return (
		<FormField {...props}
			fetchTerms={fetchTerms}
			highlightMatch
			label="Subject (OCM)"
			multiple
			name="subject_ocm"
			renderer={ControlledVocabularyInput}
		/>
	)
}

const TechnicalMetadata = props => {
	return <FormField {...props} renderer={TextInput} disabled />
}

const GenericWork = function (props) {
	const formProps = {
		defaultProps: {
			renderer: StringInput,
		},
		...props,
	}

	return (
		<MetadataForm {...formProps}>
			<FormField name="title" label="Title" />
			{ LargerField({name: 'description_note'}) }
			<FormField name="creator" label="Creator" multiple />
			<FormField name="subject_lcsh" label="Subject (LCSH)" multiple />
			{ SubjectOCM() }
			<FormField name="publisher" label="Publisher (Original)" multiple />
			<FormField name="date_original" label="Date (Original)" renderer={DateInput} type="month"/>
			<FormField name="format_medium" label="Format (Medium)" multiple />
			<TechnicalMetadata name="format_extent" label="Format Extent" />
			{ LargerField({name: 'description'}) }
			{ LargerField({name: 'description_condition'}) }
			{ LargerField({name: 'description_provenance'}) }
			{ LargerField({name: 'description_series'}) }
			<FormField name="identifier_itemnumber" label="Identifier (Item Number)" />
			<FormField name="publisher_original" label="Publisher (Original)" />
			<FormField name="publisher_digital" label="Publisher (Digital)" />
			<TechnicalMetadata name="format_digital" label="Format (Digital)" />
			<FormField name="source" label="Source" />
			<FormField name="rights" label="Rights (Digital)" renderer={TextInput} />
			<FormField name="relation_ispartof" label="Relation (IsPartOf)" />

			<Button>Save edits</Button>
		</MetadataForm>
	)
}

export default GenericWork

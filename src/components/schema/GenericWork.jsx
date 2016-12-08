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

const DateField = props => {
	return <FormField {...props} renderer={DateInput} type="month" />
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
			<FormField name="creator" label="Creator" multiple />

			<FormField name="subject_lcsh" label="Subject (LCSH)" multiple />
			{ SubjectOCM() }

			{ LargerField({name: 'description'}) }
			{ LargerField({name: 'description_note'}) }
			{ LargerField({name: 'description_condition'}) }
			{ LargerField({name: 'description_provenance'}) }
			{ LargerField({name: 'description_series'}) }

			<FormField name="publisher" label="Publisher (Original)" multiple />

			<DateField name="date_original" label="Date (Original)" />
			<DateField name="date_artifact_lower" label="Date (Artifact, Lower)" />
			<DateField name="date_artifact_upper" label="Date (Artifact, Upper)" />
			<DateField name="date_image_lower" label="Date (Image, Lower)" />
			<DateField name="date_image_upper" label="Date (Image, Upper)" />


			<FormField name="identifier_itemnumber" label="Identifier (Item Number)" />
			<FormField name="publisher_original" label="Publisher (Original)" />
			<FormField name="publisher_digital" label="Publisher (Digital)" />

			<TechnicalMetadata name="format_digital" label="Format (Digital)" />
			<TechnicalMetadata name="format_extent" label="Format (Extent)" />

			<FormField name="format_medium" label="Format (Medium)" multiple />
			<FormField name="source" label="Source" />
			<FormField name="rights" label="Rights (Digital)" renderer={TextInput} />
			<FormField name="relation_ispartof" label="Relation (IsPartOf)" />

			<Button type="success">Save edits</Button>
		</MetadataForm>
	)
}

export default GenericWork

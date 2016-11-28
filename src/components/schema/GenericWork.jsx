// GenericWork schema form
import React from 'react'

import MetadataForm from '../metadata/MetadataForm.jsx'
import FormField from '../metadata/FormField.jsx'
import StringInput from '../metadata/StringInput.jsx'
import ControlledVocabularyInput from '../metadata/ControlledVocabularyInput.jsx'

const GenericWork = function (props) {
	const formProps = {
		defaultProps: {
			renderer: StringInput,
		},
		...props,
	}

	const subjectOcmProps = {
		fetchTerms: () => {
			return fetch(process.env.API_BASE_URL + '/vocabularies/eaic-subject-ocm.json')
			.then(res => res.json())
			.then(res => res.terms)
		},
		highlightMatch: true,
		multiple: true,
		renderer: ControlledVocabularyInput,
	}

	return (
		<MetadataForm {...formProps}>
			<FormField name="title" label="Title" />
			<FormField name="description_note" label="Description (Note)" />
			<FormField name="creator" label="Creator" multiple />
			<FormField name="subject_lcsh" label="Subject (LCSH)" multiple />
			<FormField name="subject_ocm" label="Subject (OCM)" {...subjectOcmProps}/>
			<FormField name="publisher" label="Publisher (Original)" multiple />
			<FormField name="date_original" label="Date (Original)" />
			<FormField name="format_medium" label="Format (Medium)" multiple />
			<FormField name="format_extent" label="Format (Extent)" />
			<FormField name="description" label="Description" />
			<FormField name="description_condition" label="Description (Condition)" />
			<FormField name="description_provenance" label="Description (Provenance)" />
			<FormField name="description_series" label="Description (Series)" />
			<FormField name="identifier_itemnumber" label="Identifier (Item Number)" />
			<FormField name="publisher_original" label="Publisher (Original)" />
			<FormField name="publisher_digital" label="Publisher (Digital)" />
			<FormField name="format_digital" label="Format (Digital)" />
			<FormField name="source" label="Source" />
			<FormField name="rights" label="Rights (Digital)" />
			<FormField name="relation_ispartof" label="Relation (IsPartOf)" />
		</MetadataForm>
	)
}

export default GenericWork

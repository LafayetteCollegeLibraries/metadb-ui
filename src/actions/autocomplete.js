'use strict'

import { getVocabulary } from '../../lib/api'
import { RECEIVE_AUTOCOMPLETE_TERMS } from '../constants'

import Queue from 'promise-queue'

const queue = new Queue
let fetchedVocabularies = []

export const fetchAutocompleteTerms = vocabulary => (dispatch, getState) => {
	return queue.add(genGetVocab.bind(null, vocabulary)).then((data) => {
		if (!data)
			return

		const terms = data.terms.map(t => t.pref_label[0])

		dispatch({
			type: RECEIVE_AUTOCOMPLETE_TERMS,
			terms,
			vocabulary,
		})

		// reset when we reach zero
		if (queue.getPendingLength() === 0)
			fetchedVocabularies = []

		return
	})

	function genGetVocab (vocab) {
		if (fetchedVocabularies.indexOf(vocab.uri) > -1)
			return

		if (Object.keys(getState().autocompleteTerms).indexOf(vocab.uri) > -1)
			return

		fetchedVocabularies.push(vocab.uri)
		return getVocabulary(vocab)
	}
}



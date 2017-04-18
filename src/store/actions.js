// instead of adding _all_ of our action creators to the app's
// props (via `bindActionCreators`), this will allow us to
// cherry-pick those that are actually used within the app

export {
	addTermToVocabulary,
	bulkEditTermsInVocabulary,
	fetchTermsFromVocabulary,
	removeTermFromVocabulary,
	updateTermInVocabulary,
} from './active-vocabulary-terms/actions'

export { fetchAutocompleteTerms } from './autocomplete/actions'
export { batchUpdateWorks } from './batch/actions'
export { clearNotification } from './notifications/actions'

export {
	clearSearch,
	getResultsAtPage,
	searchCatalog,
	searchCatalogByQueryString,
	setSearchOption,
	toggleSearchFacet,
} from './search/actions'

export {
	createVocabulary,
	deleteVocabulary,
	fetchAllVocabularies,
	updateVocabularyMetadata,
} from './vocabulary/actions'

export {
	fetchWork,
	saveWork,
} from './work/actions'

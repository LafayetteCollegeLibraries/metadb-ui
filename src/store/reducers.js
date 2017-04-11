import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import activeVocabularyTerms from './active-vocabulary-terms/reducer'
import autocompleteTerms from './autocomplete/reducer'
import notifications from './notifications/reducer'
import search from './search/reducer'
import searchResults from './search-results/reducer'
import vocabularies from './vocabulary/reducer'
import work from './work/reducer'

const routeReducer = combineReducers({
	activeVocabularyTerms,
	autocompleteTerms,
	notifications,
	search,
	searchResults,
	vocabularies,
	work,

	routing: routerReducer,
})

export default routeReducer

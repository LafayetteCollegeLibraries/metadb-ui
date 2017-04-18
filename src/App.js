// essentially wrapping yr store to yr main component
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actionCreators from './store/actions'

import Main from './pages/Main.jsx'

function mapStateToProps (state) {
	return {
		activeVocabularyTerms: state.activeVocabularyTerms,
		autocompleteTerms: state.autocompleteTerms,

		notifications: state.notifications,

		search: state.search,
		searchResults: state.searchResults,

		vocabularies: state.vocabularies,

		work: state.work,
	}
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators(actionCreators, dispatch)
}

const App = connect(mapStateToProps, mapDispatchToProps)(Main)

export default App

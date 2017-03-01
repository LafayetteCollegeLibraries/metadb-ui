// essentially wrapping yr store to yr main component
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import assign from 'object-assign'

import * as actionCreators from './actions/'
import Main from './pages/Main.jsx'

function mapStateToProps (state) {
  return {
    // collection: state.collection,
    // collections: state.collections,

    // error: state.error,

    // schema: state.collection.schema,

    // activeVocabulary,
    activeVocabularyTerms: state.activeVocabularyTerms,
    autocompleteTerms: state.autocompleteTerms,
    
    notifications: state.notifications,

    search: state.search,

    vocabularies: state.vocabularies,

    work: state.work,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

const App = connect(mapStateToProps, mapDispatchToProps)(Main)

export default App

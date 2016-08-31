// yr main app
import React from 'react'
import { Provider } from 'react-redux'
import { render } from 'react-dom'
import Router from 'react-router/lib/Router'
import Route from 'react-router/lib/Route'
import IndexRoute from 'react-router/lib/IndexRoute'
import Redirect from 'react-router/lib/Redirect'

import store, { history } from './store'

// pages / wrappers
import App from './App.jsx'
import Home from './pages/Home.jsx'
import VocabularyManager from './pages/VocabularyManager.jsx'
import Work from './pages/Work.jsx'

const MetaDB = (
<Provider store={store}>
	<Router history={history}>
		<Route path="/" component={App}>
			<IndexRoute component={Home} />
			<Route path="vocabularies" component={VocabularyManager} />
			<Route path="works/:workId" component={Work} />
		</Route>
	</Router>
</Provider>
)

render(MetaDB, document.querySelector('#app'))

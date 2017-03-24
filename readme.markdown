<img width="250" alt="metaDB logo" src="https://cdn.rawgit.com/LafayetteCollegeLibraries/metadb-ui/master/build/assets/logo.svg">

[![Build Status](https://travis-ci.com/LafayetteCollegeLibraries/metadb-ui.svg?token=RMxCrEacXTux6rxyXvxo&branch=master)](https://travis-ci.com/LafayetteCollegeLibraries/metadb-ui)

metadb-ui is a [React][1]/[Redux][2] front-end to LafayettePreserve, a
[Sufia][3] implementation for Lafayette College Libraries. It is currently
in active development and **very much a work in progress**. 


getting started
---------------

```
git clone https://github.com/LafayetteCollegeLibraries/metadb-ui
cd metadb-ui
npm install
```

metadb-ui currently requires a Sufia instance that returns JSON instead of
rendering views. We've written a [mock-server][4] for testing that can be
used as a back-end in a pinch. It's included in the devDependencies but
can be installed with:

```
npm install lafayette-preserve-mock
```

To run metadb-ui with this mock-server, in one terminal window:

```
npm run mock-server
```

And in another:

```
API_BASE_URL=http://localhost:3000 npm run dev
```

after Webpack finishes booting, you'll be able to visit the site at
`http://localhost:8080`. (note: the mock-server will not actually
update search results with facets/queries, it's not _that_ smart!)

**Note:** the mock-server is _also_ a work-in-progress, and several Important
Features are still missing, namely: OpenSeadragon tiles for the work-editing
interface, individual thumbnails for works in Search Results, and all things
related to Vocabulary Management. As its primary focus is for end-to-end 
testing, the visual aspects will probably not be coming. However vocabularies
are on their way.


running tests
-------------

```
npm run test
```

will run tests for components, actionCreators, and reducers (as well as some
helpers throughout)

```
npm run test:e2e
```

will run end-to-end tests using Nightwatch.js and the aforementioned mock
server.


license
--------

GPL-3.0

[1]: https://facebook.github.io/react
[2]: http://redux.js.org
[3]: http://sufia.io
[4]: https://github.com/LafayetteCollegeLibraries/lafayette-preserve-mock

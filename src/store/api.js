import assign from 'object-assign'
import isAbsoluteUrl from 'is-absolute-url'

export const COLLECTION_PATH = 'collection'
export const VOCABULARY_PATH = '/vocabularies'
export const WORK_PATH = 'concern/generic_works'
export const JSON_EXTENSION = '.json'

export function del () {
	return apiRequest.bind(null, 'DELETE').apply(null, arguments)
}

export function get () {
	return apiRequest.bind(null, 'GET').apply(null, arguments)
}

export function patch () {
	return apiRequest.bind(null, 'PATCH').apply(null, arguments)
}

export function post () {
	return apiRequest.bind(null, 'POST').apply(null, arguments)
}

export function put () {
	return apiRequest.bind(null, 'PUT').apply(null, arguments)
}

const API_BASE_URL = process.env.API_BASE_URL

function buildUrl (path) {
	if (isAbsoluteUrl(path))
		return path

	const p = path.substr[0] === '/' ? path.substr(1) : path

	return API_BASE_URL + p
}

function apiRequest (method, path, data, options) {
	const uri = buildUrl(path)

	const defaults = {
		method,
		headers: {
			'Accept': 'application/json',
		}
	}

	if (data) {
		defaults.headers['Content-Type'] = 'application/json'
		defaults.body = JSON.stringify(data)
	}

	const opts = assign({}, defaults, options)

	return fetch(uri, opts)
		.then(handleResponseStatus)
		.then(parseJSON)
		.catch(err => { throw err })
}

// github example:
// https://github.com/github/fetch/blob/master/README.md#handling-http-error-statuses
function handleResponseStatus (response) {
	if (response.status >= 200 && response.status < 300)
		return response

	const err = new Error(response.statusText)
	err.status = response.status

	throw err
}

function parseJSON (response) {
	return response.json()
}

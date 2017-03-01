import { get } from './request'

const searchBase = process.env.SEARCH_BASE_URL || ''

export function search (querystring) {

  // prevent any double question-mark shenanigans from occurring
  // when passing the qs from the browser
  const url = searchBase + '/?' + querystring.replace(/^\?/, '')
  return get(url)
}

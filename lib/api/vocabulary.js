// vocabulary api things
import { del, get, post, patch } from './request'
import { VOCABULARY_PATH } from './constants'

export function createVocabulary (data) {
  const url = `/${VOCABULARY_PATH}.json`

  return post(url, data)
}

export function deleteVocabulary (data) {
  const url = data.absolute_path
  return del(url)
}

export function getVocabulary (path) {
  // TODO: correct this to take a vocabulary object as its parameter
  if (typeof path === 'object')
    path = path.absolute_path

  return get(path)
}

export function getVocabularies () {
  return get(`/${VOCABULARY_PATH}.json`)
}

export function updateVocabulary (vocab) {
  const url = vocab.absolute_path
  const data = {
    vocabulary: vocab,
  }

  return patch(url, data)
}

const API_BASE = process.env.API_BASE_URL
const AUTH_BASE = process.env.AUTH_BASE_URL

export default {
  vocabularies: [
    {
      'uri': `${AUTH_BASE}/ns/aWholeNewVocabulary`,
      'label': [
        'A Whole New Vocabulary'
      ],
      'alt_label': [
        'A fresh start!'
      ],
      'pref_label': [
        'A Whole New Vocabulary'
      ],
      'hidden_label': [],
      'absolute_path': `${API_BASE}/vocabularies/aWholeNewVocabulary.json`,
      'term_count': 7
    },
    {
      'uri': `${AUTH_BASE}/ns/testVocab`,
      'label': [
        'A Test Vocabulary',
        'Test Vocabulary Label Update',
        'A test vocabulary created using the RESTful endpoint',
        'testing PATCH updates for vocabularies'
      ],
      'alt_label': [
        'Test Vocabulary Alt. Label Update',
        'An alternative label for a test vocabulary created using the RESTful endpoint',
        'testing PATCH updates with multiple fields'
      ],
      'pref_label': [
        'A Test Vocabulary'
      ],
      'hidden_label': [],
      'absolute_path': `${API_BASE}/vocabularies/testVocab.json`,
      'term_count': 5
    },
    {
      'uri': `${AUTH_BASE}/ns/testVocab2`,
      'label': [
        'Test Vocab 2'
      ],
      'alt_label': [],
      'pref_label': [
        'Test Vocab 2'
      ],
      'hidden_label': [],
      'absolute_path': `${API_BASE}/vocabularies/testVocab2.json`,
      'term_count': 0
    },
    {
      'uri': `${AUTH_BASE}/ns/testVocab3`,
      'label': [
        'Test Vocab 3'
      ],
      'alt_label': [],
      'pref_label': [
        'Test Vocab 3'
      ],
      'hidden_label': [],
      'absolute_path': `${API_BASE}/vocabularies/testVocab3.json`,
      'term_count': 2
    },
    {
      'uri': `${AUTH_BASE}/ns/testVocabPatch`,
      'label': [
        'testing single PATCH updates for vocabularies'
      ],
      'alt_label': [
        'testing PATCH updates with multiple fields'
      ],
      'pref_label': [
        'Test Vocab Patch'
      ],
      'hidden_label': [],
      'absolute_path': `${API_BASE}/vocabularies/testVocabPatch.json`,
      'term_count': 0
    },
    {
      'uri': `${AUTH_BASE}/ns/testVocabPut`,
      'label': [
        'testing single PUT updates for vocabularies',
        'Test Vocab Put'
      ],
      'alt_label': [
        'testing PUT updates with multiple fields'
      ],
      'pref_label': [
        'Test Vocab Put'
      ],
      'hidden_label': [],
      'absolute_path': `${API_BASE}/vocabularies/testVocabPut.json`,
      'term_count': 2
    }
  ]
}

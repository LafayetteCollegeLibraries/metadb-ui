import { expect } from 'chai'
import createSortFacets from '../sort-facets'

const facetSet = [
  {
    'value': 'At the Library',
    'hits': 19523,
    'label': 'At the Library'
  },
  {
    'value': 'On order',
    'hits': 48,
    'label': 'On order'
  },
  {
    'value': 'Online',
    'hits': 8735,
    'label': 'Online'
  },
]

const sortedHitsAsc = [48, 8735, 19523]
const sortedHitsDesc = [19523, 8735, 48]
const sortedLabelAsc = ['At the Library', 'On order', 'Online']
const sortedLabelDesc = ['Online', 'On order', 'At the Library']

describe('lib/sort-factes', function () {
  it('returns a search function', function () {
    const res = createSortFacets('desc', 'hits')
    expect(res).to.be.a('function')
  })

  it('sorts by number for `hits` field', function () {
    const copyD = [].concat(facetSet)
    const copyA = [].concat(facetSet)

    copyD.sort(createSortFacets('desc', 'hits'))
    copyA.sort(createSortFacets('asc', 'hits'))

    expect(copyD.map(f => f.hits)).to.deep.equal(sortedHitsDesc)
    expect(copyA.map(f => f.hits)).to.deep.equal(sortedHitsAsc)
  })

  it('sorts by string for `label` field', function () {
    const copyD = [].concat(facetSet)
    const copyA = [].concat(facetSet)

    copyD.sort(createSortFacets('desc', 'label'))
    copyA.sort(createSortFacets('asc', 'label'))

    expect(copyD.map(f => f.label)).to.deep.equal(sortedLabelDesc)
    expect(copyA.map(f => f.label)).to.deep.equal(sortedLabelAsc)
  })

  it('sorts by string for `value` field', function () {
    const copyD = [].concat(facetSet)
    const copyA = [].concat(facetSet)

    copyD.sort(createSortFacets('desc', 'value'))
    copyA.sort(createSortFacets('asc', 'value'))

    expect(copyD.map(f => f.value)).to.deep.equal(sortedLabelDesc)
    expect(copyA.map(f => f.value)).to.deep.equal(sortedLabelAsc)
  })
})

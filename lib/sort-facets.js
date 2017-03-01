function sortNum (direction, field) {
  return function (a, b) {
    if (direction === 'desc')
      return b[field] - a[field]

    return a[field] - b[field]
  }
}

function sortStr (direction, field) {
  return function (a, b) {
    const aa = a[field].toLowerCase()
    const bb = b[field].toLowerCase()

    if (aa === bb) return 0

    if (direction === 'desc')
      return aa < bb ? 1 : -1

    return aa < bb ? -1 : 1
  }
}

export default function createFacetsSortFunction (direction, field) {
  const fields = ['hits', 'label', 'value']

  if (!direction || (direction !== 'asc' && direction !== 'desc'))
    direction = 'desc'

  if (!field || fields.indexOf(field) === -1)
    field = 'hits'

  if (field === 'hits')
    return sortNum(direction, field)

  return sortStr(direction, field)
}

import assign from 'object-assign'

export default function calculateRange (items, valueModifier) {
  if (!valueModifier)
    valueModifier = v => v

  let max = -Infinity
  let min = Infinity
  let totalHits = 0

  const cleaned = items.map(_item => {
    // prevent overwriting the original data
    const item = assign({}, _item)
    let value = item.value = valueModifier(item.value)

    if (value < min)
      min = value

    if (value > max)
      max = value

    totalHits += item.hits

    return item
  })

  return {
    items: cleaned,
    hits: totalHits,
    max,
    min,
  }
}

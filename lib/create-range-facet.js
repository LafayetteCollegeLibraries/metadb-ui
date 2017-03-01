export default function createRangeFacet (name, min, max) {
  const label = min === max ? `${min}` : `${min} - ${max}`

  return {
    label,
    name,
    value: {
      begin: min,
      end: max,
    },
    type: 'range'
  }
}

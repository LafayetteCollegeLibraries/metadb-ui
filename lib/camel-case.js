export default function camelCase (str) {
  if (!str)
    return ''

  if (typeof str !== 'string')
    str = '' + str

  return str.replace(/[^0-9a-zA-Z\s]/g, '')
    .replace(/\s+/, ' ')
    .toLowerCase()
    .split(' ')
    .map((w, i) => {
      if (i === 0) return w
      return w.substr(0,1).toUpperCase() + w.substr(1)
    }).join('')
}

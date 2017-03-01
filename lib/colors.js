import colorShade from 'color-shade'

export function lighten (start, amount) {
  const percentage = amount / 100
  return colorShade(percentage, start, '#ffffff')
}

export function darken (start, amount) {
  const percentage = amount / 100
  return colorShade(percentage, start, '#000000')
}

import { INTERVALS } from './date-intervals'

export default function formatDateValue (interval, timestamp) {
  const d = new Date(timestamp)

  switch (interval) {
    case INTERVALS.MONTH:
      return formatMonth(d)

    case INTERVALS.DAY:
      return formatDay(d)

    default:
      return formatYear(d)
  }
}

export function formatDay (date) {
  const yr = date.getUTCFullYear()
  const mo = padNumber(date.getUTCMonth() + 1)
  const day = padNumber(date.getUTCDate())

  return `${yr}-${mo}-${day}`
}

export function formatMonth (date) {
  const yr = date.getUTCFullYear()
  const mo = padNumber(date.getUTCMonth() + 1)

  return `${yr}-${mo}`
}

export function formatYear (date) {
  return `${date.getUTCFullYear()}`
}

function padNumber (val) {
  if (val < 10)
    return '0' + val

  return '' + val
}

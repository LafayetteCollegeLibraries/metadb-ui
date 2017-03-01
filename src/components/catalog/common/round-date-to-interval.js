import { INTERVALS } from './date-intervals'

export default function roundDateToInterval (interval, timestamp) {
  const date = new Date(timestamp)

  // isNaN
  if (date !== date)
    return timestamp

  switch (interval) {
    case INTERVALS.DAY:
      return roundDay(date)

    case INTERVALS.MONTH:
      return roundMonth(date)

    case INTERVALS.YEAR:
      return roundYear(date)
  }

  return timestamp
}

function roundDay (d) {
  return Date.UTC(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate()
  )
}

function roundMonth (d) {
  return Date.UTC(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    1
  )
}

function roundYear (d) {
  return Date.UTC(
    d.getUTCFullYear(),
    0,
    1
  )
}

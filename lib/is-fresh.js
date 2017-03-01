export default function isFresh (data, stalePeriod) {
  if (!data)
    return false

  if (!data.fetchedAt)
    return false

  if (!stalePeriod)
    stalePeriod = (5 * 60 * 1000)

  if ((Date.now() - data.fetchedAt) > stalePeriod)
    return false

  return true
}

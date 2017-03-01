export default function sortByHits (items, opts) {
  const sortAsc = (a, b) => a.hits - b.hits
  const sortDesc = (a, b) => b.hits - a.hits

  if (!opts)
    opts = {}

  const sortFn = opts.sortFn || (opts.sortAsc ? sortAsc : sortDesc)

  return items.sort(sortFn)
}

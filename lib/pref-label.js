export function getPrefLabel (obj) {
  const pref = obj.pref_label

  if (!pref)
    return null

  return Array.isArray(pref) ? pref[0] : pref
}

export function setPrefLabel (obj, val) {
  if (obj.pref_label) {
    if (Array.isArray(obj.pref_label))
      obj.pref_label = [val]
    else
      obj.pref_label = val
  }
}

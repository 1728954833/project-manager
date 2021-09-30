export const empty = (obj: { [index: string]: any }): Boolean => {
  if (!obj) return true
  return Object.keys(obj).length === 0
}

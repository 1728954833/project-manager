export const empty = (obj: { [index: string]: any }) => {
  return Object.keys(obj).length === 0
}

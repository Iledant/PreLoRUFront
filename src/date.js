export function formatNullDate (nd) {
  if (!nd) return null
  const [y, m, d] = nd.substring(0, 10).split('-')
  return `${d}/${m}/${y}`
}

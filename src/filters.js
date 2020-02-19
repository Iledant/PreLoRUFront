const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
})

const indexFormatter = new Intl.NumberFormat('fr-FR', {
  maximumFractionDigits: 2
})

const currencyFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR'
})

const percentageFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigit: 2
})

const numberFormatter = new Intl.NumberFormat('fr-FR')

export function bool2Str (b) {
  return b ? 'Oui' : 'Non'
}

export function nullable (n) {
  return n || '-'
}

export function date (d) {
  return d ? dateFormatter.format(new Date(d)) : '-'
}

/**
 * Convert a nullable currency backend value to a formatted string using euro sign
 * @param {any} c input to display
 */
export function currency (c) {
  return c !== null && !isNaN(c) ? currencyFormatter.format(c / 100) : '-'
}

/**
 * Convert a float calculated to a currency formatted string using euro sign
 * @param {Number} v value to convert
 */
export const float2Euros = v => (v ? currencyFormatter.format(v) : '-')

/**
 * displayBool returns the icon name to graphically represent a boolean value
 * @param {Boolean} v value to convert
 * @returns {String}
 */
export const displayBool = v => (v ? 'check' : 'remove')

export function nullIndex (n) {
  return n ? indexFormatter.format(n / 100) : '-'
}

export function percentage (n) {
  return percentageFormatter.format(n)
}

export function number (n) {
  return n ? numberFormatter.format(n) : '-'
}

/**
 * Trim the string to 50 cars adding ellipsis
 * @param {String} s string to trim if too long
 * @return {String} trimmed string
 */
export const trim50 = s => s ? (s.length > 50 ? s.substring(0, 47) + '...' : s) : '-'

const shortDateFormatter = new Intl.DateTimeFormat('fr-FR', {
  month: '2-digit',
  year: '2-digit'
})

/**
 * Filter a nullable date with month and year
 * @param {String} d date string to format
 * @return {String} formatted string, '-' for null, 'mm/yy' otherwise
*/
export const shortDate = d => d ? shortDateFormatter.format(new Date(d)) : '-'
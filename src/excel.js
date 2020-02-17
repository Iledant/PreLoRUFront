import * as XlsxPopulate from 'xlsx-populate/browser/xlsx-populate-no-encryption'

const blueStyle = {
  fill: { type: 'solid', color: '1F497D' },
  fontColor: 'FFFFFF'
}

export const valStyle = {
  width: 14,
  style: { numberFormat: '#,##0.00' },
  addTotal: true
}

export const percentStyle = {
  width: 8,
  style: { numberFormat: '0.00 %' },
  addTotal: true
}

export const dateStyle = {
  width: 12,
  style: { numberFormat: 'dd/mm/yyyy' }
}

function parseData (datas, keys) {
  const lineNumber = datas.length
  const parsed = []
  for (let i = 1; i < lineNumber && datas[i][0]._value; i++) {
    const item = {}
    keys.forEach((k, j) => {
      item[k] = datas[i][j]._value
    })
    parsed.push(item)
  }
  return parsed
}

function fetchKeys (datas, expectedHeaders) {
  const keys = datas[0].map(d => d._value)
  if (expectedHeaders.some(e => !keys.includes(e))) {
    throw new Error(
      `Format de fichier incorrect : champ ${expectedHeaders} obligatoire absent`
    )
  }
  return keys
}

export async function excelReadFile (
  file,
  expectedHeaders,
  successCallback,
  errorCallback,
  parseCallback = null
) {
  try {
    const workbook = await XlsxPopulate.fromDataAsync(file)
    const datas = workbook
      .sheet(0)
      .usedRange()
      .cells()
    const keys = fetchKeys(datas, expectedHeaders)
    let parsed = parseData(datas, keys)
    if (typeof parseCallback === 'function') {
      parsed = parsed.map(i => parseCallback(i))
    }
    if (typeof successCallback === 'function') {
      return successCallback(parsed)
    }
  } catch (e) {
    if (typeof errorCallback === 'function') {
      errorCallback(
        e instanceof Error ? e.message : 'Impossible de lire le fichier'
      )
    }
  }
}

function summaryParseData (datas, year) {
  const lineNumber = datas.length
  const housings = []
  for (let i = 1; i < lineNumber; i++) {
    const row = datas[i]
    if (row[27].value() === year && row[4].value() !== 'REAF' && row[4].value() !== 'F') {
      const PRU = row[31].value()
      const ANRU = PRU === 'Oui' || PRU === true
      const h = {
        InseeCode: row[1].value(),
        Address: row[3].value(),
        PLS: row[5].value() || 0,
        PLUS: row[6].value() || 0,
        PLAI: row[7].value() || 0,
        ReferenceCode: String(row[30].value() || row[67].value()),
        IRISCode: String(row[29].value()),
        ANRU
      }
      housings.push(h)
    }
  }
  return housings
}

export async function summaryReadFile (file, successCallback, errorCallback) {
  try {
    const workbook = await XlsxPopulate.fromDataAsync(file)
    const datas = workbook.sheet(0).usedRange().cells()
    const year = new Date().getFullYear()
    const housings = summaryParseData(datas, year)
    if (typeof successCallback === 'function') {
      return successCallback(housings)
    }
  } catch (e) {
    if (typeof errorCallback === 'function') {
      errorCallback(
        e instanceof Error ? e.message : 'Impossible de lire le fichier'
      )
    }
  }
}

function fileSave (blob, name) {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  document.body.appendChild(a)
  a.href = url
  a.download = name
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

export function getExcelColumnName (i) {
  const firstChar = i > 25 ? String.fromCharCode(65 + (i - 25) / 26) : ''
  const secondChar = String.fromCharCode(65 + (i % 26))

  return firstChar + secondChar
}

function generateFileName (name) {
  const now = new Date()
  const f = x => String(x).padStart(2, '0')
  const dateTimePrefix =
    now.getFullYear() +
    f(now.getMonth() + 1) +
    f(now.getDate()) +
    '_' +
    f(now.getHours()) +
    f(now.getMinutes()) +
    f(now.getSeconds())

  return `${dateTimePrefix}${name}.xlsx`
}

function setColumnHeaders (columns, firstRow, workbook) {
  columns.forEach((col, i) => {
    firstRow
      .cell(i + 1)
      .value(col.header)
      .style({ ...blueStyle, horizontalAlignment: 'center' })
    const column = workbook.sheet(0).column(i + 1)
    column.width(col.width)
    if (col.style) column.style(col.style)
  })
}

function fillCells (jsonObject, workbook, firstRowNumber, columns) {
  jsonObject.forEach((o, i) => {
    const row = workbook.sheet(0).row(i + firstRowNumber)
    columns.forEach((c, j) => {
      // eslint-disable-next-line no-prototype-builtins
      if (c.hasOwnProperty('formula')) {
        const formula = c.formula.replace(/£/g, i + firstRowNumber)
        row.cell(j + 1).formula(formula)
      } else {
        const key = c.key
        row.cell(j + 1).value(o[key] || '')
      }
    })
  })
}

function setTotalCells (workbook, filterLastRow, columns) {
  const firstRow = workbook.sheet(0).row(1)
  const lastRow = workbook.sheet(0).row(filterLastRow + 1)

  if (Object.prototype.hasOwnProperty.call(!columns[0], 'addTotal')) {
    firstRow.cell(1).value('Total')
    lastRow.cell(1).value('Total')
  }

  columns.forEach((c, i) => {
    firstRow.cell(i + 1).style(blueStyle)
    lastRow.cell(i + 1).style(blueStyle)
    if (Object.prototype.hasOwnProperty.call(c, 'addTotal')) {
      const column = getExcelColumnName(i)
      const formula = `SUBTOTAL(9,${column}3:${column}${filterLastRow})`
      firstRow.cell(i + 1).formula(formula)
      lastRow.cell(i + 1).formula(formula)
    }
  })
}

export async function excelExport (jsonObject, columns, name) {
  await XlsxPopulate.fromBlankAsync().then(workbook => {
    const addTotal = columns.some(c => Object.prototype.hasOwnProperty.call(c, 'addTotal'))
    const firstRowNumber = addTotal ? 3 : 2
    const firstRow = addTotal
      ? workbook.sheet(0).row(2)
      : workbook.sheet(0).row(1)
    const colLength = columns.length

    setColumnHeaders(columns, firstRow, workbook)

    fillCells(jsonObject, workbook, firstRowNumber, columns)

    if (colLength > 0) {
      const filterFirstRow = firstRowNumber - 1
      const filterLastRow = filterFirstRow + jsonObject.length
      const filterLastColumnName = getExcelColumnName(colLength - 1)
      workbook
        .sheet(0)
        .range(`A${filterFirstRow}:${filterLastColumnName}${filterLastRow}`)
        .autoFilter()

      if (addTotal) setTotalCells(workbook, filterLastRow, columns)
    }
    workbook.outputAsync().then(blob => {
      fileSave(blob, generateFileName(name))
    })
  })
}

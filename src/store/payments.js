import * as types from './types'
import { beginLoading, setErrorMessage } from './loading'
import Vue from 'vue'
import { excelReadFile, excelExport } from '../excel.js'

const state = {
  paymentsList: [],
  paymentsPage: 0,
  paymentsItemsCount: 0
}

async function exportPayments (payments) {
  const columns = [
    { header: 'Année', key: 'Year', width: 6 },
    {
      header: 'Création pmt',
      key: 'CreationDate',
      width: 10,
      style: { numberFormat: 'dd/mm/yy' }
    },
    {
      header: 'Modification pmt',
      key: 'ModificationDate',
      width: 10,
      style: { numberFormat: 'dd/mm/yy' }
    },
    { header: 'Numéro pmt', key: 'Number', width: 10 },
    {
      header: 'Montant pmt',
      key: 'Value',
      width: 14,
      style: { numberFormat: '#,##0.00' },
      addTotal: true
    },
    { header: 'Année egt', key: 'CommitmentYear', width: 10 },
    { header: 'Code egt', key: 'CommitmentCode', width: 10 },
    {
      header: 'Création pmt',
      key: 'CommitmentCreationDate',
      width: 10,
      style: { numberFormat: 'dd/mm/yy' }
    },
    {
      header: 'Montant egt',
      key: 'CommitmentValue',
      width: 14,
      style: { numberFormat: '#,##0.00' },
      addTotal: true
    },
    { header: 'Libellé egt', key: 'CommitmentName', width: 20 },
    { header: 'Bénéficiaire', key: 'BeneficiaryName', width: 20 },
    { header: 'Secteur', key: 'Sector', width: 6 },
    { header: 'Action', key: 'ActionName', width: 20 }
  ]
  await excelExport(payments, columns, 'Paiements')
}

const actions = {
  async [types.GET_PAYMENTS] ({ commit }, { Year, Page, Search }) {
    try {
      beginLoading(commit)
      const resp = await Vue.http.get('payments/paginated', {
        params: { Year, Page, Search }
      })
      commit(types.GET_PAYMENTS, resp.body)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.EXPORT_PAYMENTS] ({ commit }, { Year, Search }) {
    try {
      beginLoading(commit)
      const resp = await Vue.http.get('payments/export', {
        params: { Year, Search }
      })
      exportPayments(resp.body.ExportedPayment)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.UPLOAD_PAYMENTS] ({ commit }, file) {
    beginLoading(commit)
    try {
      const sendFunc = d => Vue.http.post('payments', { Payment: d })
      const parseFunc = d => ({
        CommitmentYear: Number(d.CommitmentYear),
        CommitmentCode: d.CommitmentCode,
        CommitmentNumber: Number(d.CommitmentNumber),
        CommitmentLine: Number(d.CommitmentLine),
        Year: Number(d.Year),
        CreationDate: Number(d.CreationDate),
        ModificationDate: Number(d.ModificationDate),
        Value: Number(d.Value),
        Number: Number(d.Number),
        ReceiptDate: d.ReceiptDate ? Number(d.ReceiptDate) : 0
      })
      await excelReadFile(
        file,
        [
          'CommitmentYear',
          'CommitmentCode',
          'CommitmentNumber',
          'CommitmentLine',
          'Year',
          'CreationDate',
          'ModificationDate',
          'Value',
          'Number'
        ],
        sendFunc,
        err => {
          setErrorMessage(commit, err)
        },
        parseFunc
      )
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  }
}

const mutations = {
  [types.GET_PAYMENTS] (state, payload) {
    state.paymentsList = [...payload.Payments]
    state.paymentsPage = payload.Page
    state.paymentsItemsCount = payload.ItemsCount
  }
}

export default { state, actions, mutations }

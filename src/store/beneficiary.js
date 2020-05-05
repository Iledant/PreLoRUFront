import { beginLoading, setErrorMessage } from './loading'
import * as types from './types'
import Vue from 'vue'
import { excelExport, dateStyle, valStyle } from '@/excel'

async function exportBeneficiaryDatas (datas) {
  const formattedDatas = datas.map(d => ({
    Date: new Date(d.Date),
    Name: d.Name,
    IRISCode: d.IRISCode,
    Value: d.Value * 0.01,
    Available: d.Available * 0.01,
    Caducity: d.Caducity ? new Date(d.Caducity) : null
  }))
  const columns = [
    { header: 'Date', key: 'Date', ...dateStyle },
    { header: 'Libellé', key: 'Name', width: 50 },
    { header: 'Fiche IRIS', key: 'IRISCode', width: 14 },
    { header: 'Montant', key: 'Value', ...valStyle },
    { header: 'RAM', key: 'Available', ...valStyle },
    { header: 'Caducité', key: 'Caducity', ...dateStyle }
  ]
  await excelExport(formattedDatas, columns, 'Engagement bénéficiaire')
}

const state = {
  beneficiaryDatas: [],
  beneficiaryItemsCount: 0,
  beneficiaryPage: 0,
  beneficiaryPayments: []
}

const actions = {
  async [types.GET_BENEFICIARY_DATAS] ({ commit }, { ID, Page, Search, Year }) {
    beginLoading(commit)
    try {
      commit(types.END_LOADING)
      const resp = await Vue.http.get(`beneficiary/${ID}/datas`, {
        params: { Page, Search, Year }
      })
      commit(types.GET_BENEFICIARY_DATAS, resp.body)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.EXPORT_BENEFICIARY_DATAS] ({ commit }, { ID, Search, Year }) {
    beginLoading(commit)
    try {
      commit(types.END_LOADING)
      const resp = await Vue.http.get(`beneficiary/${ID}/export`, {
        params: { Search, Year }
      })
      await exportBeneficiaryDatas(resp.body.BeneficiaryData)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.GET_BENEFICIARY_PAYMENTS] ({ commit }, ID) {
    beginLoading(commit)
    try {
      commit(types.END_LOADING)
      const { body } = await Vue.http.get(`beneficiary/${ID}/payments`)
      commit(types.GET_BENEFICIARY_PAYMENTS, body.BeneficiaryPayment)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  }
}

const mutations = {
  [types.GET_BENEFICIARY_DATAS] (state, payload) {
    state.beneficiaryDatas = [...payload.Datas]
    state.beneficiaryPage = payload.Page
    state.beneficiaryItemsCount = payload.ItemsCount
  },
  [types.GET_BENEFICIARY_PAYMENTS] (state, list) {
    state.beneficiaryPayments = [...list]
  }
}

export default { state, actions, mutations }

import * as types from './types'
import { beginLoading, setErrorMessage } from './loading'
import { excelReadFile, excelExport } from '../excel'
import Vue from 'vue'

const state = {
  rplsList: [],
  rplsReport: [],
  rplsYears: []
}

const actions = {
  async [types.GET_RPLS] ({ commit }) {
    beginLoading(commit)
    try {
      let { body } = await Vue.http.get('rpls')
      commit(types.GET_RPLS, body.RPLS)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.GET_RPLS_DATAS] ({ commit }) {
    beginLoading(commit)
    try {
      let { body } = await Vue.http.get('rpls/datas')
      commit(types.GET_RPLS, body.RPLS)
      commit(types.GET_CITIES, body.City)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.CREATE_RPLS] ({ commit }, payload) {
    beginLoading(commit)
    try {
      let { body } = await Vue.http.post('rpls', payload)
      commit(types.CREATE_RPLS, body.RPLS)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.UPDATE_RPLS] ({ commit }, payload) {
    beginLoading(commit)
    try {
      let { body } = await Vue.http.put('rpls', payload)
      commit(types.UPDATE_RPLS, body.RPLS)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.DEL_RPLS] ({ commit }, ID) {
    beginLoading(commit)
    try {
      await Vue.http.delete(`rpls/${ID}`)
      commit(types.DEL_RPLS, ID)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.UPLOAD_RPLS] ({ commit }, file) {
    beginLoading(commit)
    try {
      let sendFunc = d => Vue.http.post('rpls/batch', { RPLS: d })
      let parseFunc = d => ({
        InseeCode: parseInt(d.InseeCode),
        Year: parseInt(d.Year),
        Ratio: Number(d.Ratio)
      })
      await excelReadFile(
        file,
        ['InseeCode', 'Year', 'Ratio'],
        sendFunc,
        err => { setErrorMessage(commit, err) },
        parseFunc
      )
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.GET_RPLS_REPORT] ({ commit }, params) {
    beginLoading(commit)
    try {
      let { body } = await Vue.http.get('rpls/report', { params })
      commit(types.GET_RPLS_REPORT, body.RPLSReport)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.DOWNLOAD_DETAILED_RPLS_REPORT] ({ commit }, params) {
    beginLoading(commit)
    try {
      let { body: { RPLSDetailedReport } } =
        await Vue.http.get('rpls/detailed_report', { params })
      const formatted = RPLSDetailedReport.map(
        ({ CreationDate, Value, ...others }) =>
          ({
            CreationDate: new Date(CreationDate),
            Value: 0.01 * Value,
            ...others
          }))
      const columns = [
        { header: 'Date', key: 'CreationDate', width: 10, style: { numberFormat: 'dd/mm/yy' } },
        { header: 'Code IRIS', key: 'IrisCode', width: 10 },
        {
          header: 'Montant egt',
          key: 'Value',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true
        },
        { header: 'Code INSEE', key: 'InseeCode', width: 10 },
        { header: 'Ville', key: 'CityName', width: 30 },
        { header: 'RPLS', key: 'RPLS', width: 10, style: { numberFormat: '0.00 %' } },
        { header: 'Réf. prog.', key: 'Reference', width: 12 },
        { header: 'Adresse', key: 'Address', width: 30 },
        { header: 'PLAI', key: 'PLAI', width: 8 },
        { header: 'PLUS', key: 'PLUS', width: 8 },
        { header: 'PLS', key: 'PLS', width: 8 }
      ]
      await excelExport(formatted, columns, 'RPLS Détaillé')
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  }
}

const mutations = {
  [types.GET_RPLS] (state, list) {
    state.rplsList = [ ...list ]
  },
  [types.GET_RPLS_YEARS] (state, list) {
    state.rplsYears = [ ...list ]
  },
  [types.DEL_RPLS] (state, ID) {
    const idx = state.rplsList.findIndex(r => r.ID === ID)
    state.rplsList.splice(idx, 1)
  },
  [types.UPDATE_RPLS] (state, item) {
    const idx = state.rplsList.findIndex(r => r.ID === item.ID)
    state.rplsList.splice(idx, 1, item)
  },
  [types.CREATE_RPLS] (state, item) {
    state.rplsList.push(item)
  },
  [types.GET_RPLS_REPORT] (state, list) {
    state.rplsReport = [...list]
  }
}

export default { state, actions, mutations }

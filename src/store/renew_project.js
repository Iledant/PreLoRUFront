import * as types from './types.js'
import Vue from 'vue'
import { beginLoading, setErrorMessage } from './loading.js'
import { excelExport } from '@/excel'

const state = {
  renewProject: null,
  rpCommitments: [],
  rpPayments: [],
  rpForecasts: [],
  rpEvents: [],
  rpCmtCityJoins: [],
}

async function downloadReport (lines) {
  const columns = [
    { header: 'Reference', key: 'Reference', width: 12 },
    { header: 'Nom', key: 'Name', width: 20 },
    {
      header: 'Enveloppe',
      key: 'Budget',
      width: 14,
      style: { numberFormat: '#,##0.00' },
      addTotal: true,
    },
    {
      header: 'Engagements',
      key: 'Commitment',
      width: 14,
      style: { numberFormat: '#,##0.00' },
      addTotal: true,
    },
    {
      header: 'Paiements',
      key: 'Payment',
      width: 14,
      style: { numberFormat: '#,##0.00' },
      addTotal: true,
    },
    {
      header: 'Dernier événement',
      key: 'LastEventName',
      width: 20,
    },
    {
      header: 'Dernière date',
      key: 'LastEventDate',
      width: 10,
      style: { numberFormat: 'dd/mm/yyyy' },
    },
    { header: 'Ville', key: 'City1Name', width: 12 },
    { header: 'Interco', key: 'City1CommunityName', width: 12 },
    {
      header: 'Engagements',
      key: 'City1Cmt',
      width: 14,
      style: { numberFormat: '#,##0.00' },
      addTotal: true,
    },
    {
      header: 'Paiements',
      key: 'City1Pmt',
      width: 14,
      style: { numberFormat: '#,##0.00' },
      addTotal: true,
    },
    { header: 'Ville', key: 'City2Name', width: 12 },
    { header: 'Interco', key: 'City2CommunityName', width: 12 },
    {
      header: 'Engagements',
      key: 'City2Cmt',
      width: 14,
      style: { numberFormat: '#,##0.00' },
      addTotal: true,
    },
    {
      header: 'Paiements',
      key: 'City2Pmt',
      width: 14,
      style: { numberFormat: '#,##0.00' },
      addTotal: true,
    },
    { header: 'Ville', key: 'City3Name', width: 12 },
    { header: 'Interco', key: 'City3CommunityName', width: 12 },
    {
      header: 'Engagements',
      key: 'City3Cmt',
      width: 14,
      style: { numberFormat: '#,##0.00' },
      addTotal: true,
    },
    {
      header: 'Paiements',
      key: 'City3Pmt',
      width: 14,
      style: { numberFormat: '#,##0.00' },
      addTotal: true,
    },
  ]
  const formattedLines = lines.map(l => ({
    Reference: l.Reference,
    Name: l.Name,
    Budget: l.Budget ? l.Budget * 0.01 : 0,
    Commitment: l.Commitment ? l.Commitment * 0.01 : 0,
    Payment: l.Payment ? l.Payment * 0.01 : 0,
    LastEventName: l.LastEventName,
    LastEventDate: l.LastEventDate ? new Date(l.LastEventDate) : '',
    City1Name: l.City1Name,
    City1CommunityName: l.City1CommunityName,
    City1Cmt: l.City1Cmt ? l.City1Cmt * 0.01 : 0,
    City1Pmt: l.City1Pmt ? l.City1Pmt * 0.01 : 0,
    City2Name: l.City2Name,
    City2CommunityName: l.City2CommunityName,
    City2Cmt: l.City2Cmt ? l.City2Cmt * 0.01 : 0,
    City2Pmt: l.City2Pmt ? l.City2Pmt * 0.01 : 0,
    City3Name: l.City3Name,
    City3CommunityName: l.City3CommunityName,
    City3Cmt: l.City3Cmt ? l.City3Cmt * 0.01 : 0,
    City3Pmt: l.City3Pmt ? l.City3Pmt * 0.01 : 0,
  }))
  excelExport(formattedLines, columns, 'Report RU')
}

const actions = {
  async [types.GET_RENEW_PROJECT_DATAS] ({ commit }, ID) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.get(`renew_project/${ID}/datas`)
      commit(types.GET_RENEW_PROJECT_DATAS, body)
      commit(types.GET_COMMISSIONS, body.Commission)
      commit(types.GET_ACTIONS, body.BudgetAction)
      commit(types.GET_RP_EVENT_TYPES, body.RPEventType)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.CREATE_RENEW_PROJECT_FORECAST] (
    { commit },
    { RenewProjectForecast }
  ) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.post('renew_project_forecast', {
        RenewProjectForecast,
      })
      commit(types.CREATE_RENEW_PROJECT_FORECAST, body.RenewProjectForecast)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.UPDATE_RENEW_PROJECT_FORECAST] ({ commit }, item) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.put('renew_project_forecast', item)
      commit(types.UPDATE_RENEW_PROJECT_FORECAST, body.RenewProjectForecast)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.DELETE_RENEW_PROJECT_FORECAST] ({ commit }, ID) {
    beginLoading(commit)
    try {
      await Vue.http.delete(`renew_project_forecast/${ID}`)
      commit(types.DELETE_RENEW_PROJECT_FORECAST, ID)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.CREATE_RENEW_PROJECT_EVENT] ({ commit }, item) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.post('rp_event', item)
      commit(types.CREATE_RENEW_PROJECT_EVENT, body.RPEvent)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.UPDATE_RENEW_PROJECT_EVENT] ({ commit }, item) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.put('rp_event', item)
      commit(types.UPDATE_RENEW_PROJECT_EVENT, body.RPEvent)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.DELETE_RENEW_PROJECT_EVENT] ({ commit }, ID) {
    beginLoading(commit)
    try {
      await Vue.http.delete(`rp_event/${ID}`)
      commit(types.DELETE_RENEW_PROJECT_EVENT, ID)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.DOWNLOAD_RP_REPORT] ({ commit }, ID) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.get('renew_project/report')
      downloadReport(body.RenewProjectReport)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.CREATE_CMT_CITY_JOIN] ({ commit }, payload) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.post('rp_cmt_city_join', payload)
      commit(types.CREATE_CMT_CITY_JOIN, body.RPCmtCityJoin)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.UPDATE_CMT_CITY_JOIN] ({ commit }, payload) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.put('rp_cmt_city_join', payload)
      commit(types.UPDATE_CMT_CITY_JOIN, body.RPCmtCityJoin)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.DEL_CMT_CITY_JOIN] ({ commit }, ID) {
    beginLoading(commit)
    try {
      await Vue.http.delete(`rp_cmt_city_join/${ID}`)
      commit(types.DEL_CMT_CITY_JOIN, ID)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
}

const mutations = {
  [types.GET_RENEW_PROJECT_DATAS] (state, payload) {
    state.renewProject = payload.RenewProject
    state.rpCommitments = [...payload.Commitment]
    state.rpPayments = [...payload.Payment]
    state.rpForecasts = [...payload.RenewProjectForecast]
    state.rpEvents = [...payload.FullRPEvent]
    state.rpCmtCityJoins = [...payload.RPCmtCityJoin]
  },
  [types.GET_RENEW_PROJECT_COMMITMENTS] (state, commitments) {
    state.rpCommitments = [...commitments]
  },
  [types.GET_RENEW_PROJECT_PAYMENTS] (state, payments) {
    state.rpPayments = [...payments]
  },
  [types.GET_RENEW_PROJECT_FORECASTS] (state, payload) {
    state.rpForecasts = [...payload]
  },
  [types.UPDATE_RENEW_PROJECT_FORECAST] (state, payload) {
    const index = state.rpForecasts.findIndex(r => r.ID === payload.ID)
    state.rpForecasts.splice(index, 1, payload)
  },
  [types.DELETE_RENEW_PROJECT_FORECAST] (state, ID) {
    const index = state.rpForecasts.findIndex(r => r.ID === ID)
    state.rpForecasts.splice(index, 1)
  },
  [types.CREATE_RENEW_PROJECT_FORECAST] (state, payload) {
    state.rpForecasts.push(payload)
  },
  [types.UPDATE_RENEW_PROJECT_EVENT] (state, payload) {
    const index = state.rpEvents.findIndex(r => r.ID === payload.ID)
    state.rpEvents.splice(index, 1, payload)
  },
  [types.DELETE_RENEW_PROJECT_EVENT] (state, ID) {
    const index = state.rpEvents.findIndex(r => r.ID === ID)
    state.rpEvents.splice(index, 1)
  },
  [types.CREATE_RENEW_PROJECT_EVENT] (state, payload) {
    state.rpEvents.push(payload)
  },
  [types.CREATE_CMT_CITY_JOIN] (state, payload) {
    state.rpCmtCityJoins.push(payload)
  },
  [types.UPDATE_CMT_CITY_JOIN] (state, payload) {
    const index = state.rpCmtCityJoins.findIndex(r => r.ID === payload.ID)
    state.rpCmtCityJoins.splice(index, 1, payload)
  },
  [types.DEL_CMT_CITY_JOIN] (state, ID) {
    const index = state.rpCmtCityJoins.findIndex(r => r.ID === ID)
    state.rpCmtCityJoins.splice(index, 1)
  },
}

export default { state, actions, mutations }

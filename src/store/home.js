import * as types from './types.js'
import Vue from 'vue'
import { beginLoading, setErrorMessage } from './loading.js'

const state = {
  currentYearCommitments: [],
  currentYearLOPayments: [],
  currentYearPVPayments: [],
  previousYearCommitments: [],
  previousYearLOPayments: [],
  previousYearPVPayments: [],
  currentProgrammation: [],
  importLogs: [],
  homeMessage: null,
  paymentCreditSum: null,
  averagePayments: [],
  csfWeekTrend: {},
  flowStockDelays: {},
  paymentRate: {},
}

const actions = {
  async [types.GET_HOME_DATAS] ({ commit }) {
    beginLoading(commit)
    try {
      const resp = await Vue.http.get('home')
      commit(types.GET_HOME_DATAS, resp.body)
      commit(types.SET_HOME_MESSAGE, resp.body.HomeMessage)
      commit(types.GET_AVERAGE_PAYMENTS, resp.body.AveragePayment)
      commit(types.GET_CSF_WEEK_TREND, resp.body.CsfWeekTrend)
      commit(types.GET_FLOW_STOCK_DELAY, resp.body.FlowStockDelays)
      commit(types.GET_PAYMENT_RATE, resp.body.PaymentRate)
      commit(types.END_LOADING)
    } catch (err) {
      console.log(err)
      setErrorMessage(commit, err)
    }
  },
  async [types.SET_HOME_MESSAGE] ({ commit }, payload) {
    beginLoading(commit)
    try {
      await Vue.http.post('home_message', payload)
      commit(types.SET_HOME_MESSAGE, payload)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
}

const mutations = {
  [types.GET_HOME_DATAS] (state, payload) {
    state.currentYearCommitments = payload.Commitment.CurrentYear.map(c =>
      c.Value * 0.000001)
    state.previousYearCommitments = payload.Commitment.PreviousYear.map(c =>
      c.Value * 0.000001)
    state.currentProgrammation = payload.Programmation.map(c => c.Value * 0.000001)
    const currentMaxMonth = payload.Payment.CurrentYear.reduce((a, c) => a > c.Month ? a : c.Month, 0)
    const pastMaxMonth = payload.Payment.PreviousYear.reduce((a, c) => a > c.Month ? a : c.Month, 0)
    state.currentYearPVPayments = new Array(currentMaxMonth)
    state.currentYearPVPayments.fill(0)
    state.currentYearLOPayments = new Array(currentMaxMonth)
    state.currentYearLOPayments.fill(0, currentMaxMonth)
    state.previousYearPVPayments = new Array(pastMaxMonth)
    state.previousYearPVPayments.fill(0, pastMaxMonth)
    state.previousYearLOPayments = new Array(pastMaxMonth)
    state.previousYearLOPayments.fill(0, pastMaxMonth)
    const pastLen = payload.Payment.PreviousYear.length
    let pvAcc = 0
    let loAcc = 0
    let pvMonth = 0
    let loMonth = 0
    for (let i = 0; i < pastLen; i++) {
      const v = payload.Payment.PreviousYear[i]
      if (v.Sector === 'LO') {
        while (v.Month - 1 > loMonth) {
          state.previousYearLOPayments[loMonth] = loAcc
          loMonth++
        }
        loAcc = v.Value
        state.previousYearLOPayments[loMonth] = loAcc
      } else {
        while (v.Month - 1 > pvMonth) {
          state.previousYearPVPayments[pvMonth] = pvAcc
          pvMonth++
        }
        pvAcc = v.Value
        state.previousYearPVPayments[pvMonth] = pvAcc
      }
    }
    const curLen = payload.Payment.CurrentYear.length
    pvAcc = 0
    loAcc = 0
    pvMonth = 0
    loMonth = 0
    for (let i = 0; i < curLen; i++) {
      const v = payload.Payment.CurrentYear[i]
      if (v.Sector === 'LO') {
        while (v.Month - 1 > loMonth) {
          state.currentYearLOPayments[loMonth] = loAcc
          loMonth++
        }
        loAcc = v.Value
        state.currentYearLOPayments[loMonth] = loAcc
      } else {
        while (v.Month - 1 > pvMonth) {
          state.currentYearPVPayments[pvMonth] = pvAcc
          pvMonth++
        }
        pvAcc = v.Value
        state.currentYearPVPayments[pvMonth] = pvAcc
      }
    }
    if (loMonth < pvMonth) {
      for (;loMonth <= pvMonth; loMonth++) {
        state.currentYearLOPayments[loMonth] = loAcc
      }
    }
    if (pvMonth < loMonth) {
      for (;pvMonth <= loMonth; pvMonth++) {
        state.currentYearPVPayments[pvMonth] = pvAcc
      }
    }
    state.importLogs = [...payload.ImportLog]
    state.paymentCreditSum = payload.PaymentCreditSum * 0.000001
  },
  [types.SET_HOME_MESSAGE] (state, payload) {
    state.homeMessage = { ...payload }
    if (payload.Body) {
      state.homeMessage.Html =
        '<p>' +
        payload.Body
          .replace(/\n+/g, '</p><p>')
          .replace(/(\*)([^*]+)(\*)/g, '<strong>$2</strong>') +
        '</p>'
    }
  },
  [types.GET_AVERAGE_PAYMENTS] (state, list) {
    state.averagePayments = [...list]
  },
  [types.GET_CSF_WEEK_TREND] (state, payload) {
    state.csfWeekTrend = { ...payload }
  },
  [types.GET_FLOW_STOCK_DELAY] (state, payload) {
    state.flowStockDelays = { ...payload }
  },
  [types.GET_PAYMENT_RATE] (state, payload) {
    state.paymentRate = { ...payload }
  },
}

export default { state, actions, mutations }

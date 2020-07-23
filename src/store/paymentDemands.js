import * as types from './types'
import Vue from 'vue'
import { beginLoading, setErrorMessage } from './loading'

const state = {
  paymentDemands: [],
  paymentDemandCount: [],
  paymentDemandsStock: [],
}

const actions = {
  async [types.UPLOAD_PAYMENT_DEMANDS] ({ commit }, payload) {
    beginLoading(commit)
    try {
      await Vue.http.post('payment_demands', payload)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.GET_PAYMENT_DEMANDS] ({ commit }) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.get('payment_demands')
      commit(types.GET_PAYMENT_DEMANDS, body.PaymentDemand)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.UPDATE_PAYMENT_DEMAND] ({ commit }, { PaymentDemand }) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.put('payment_demands', { PaymentDemand })
      commit(types.UPDATE_PAYMENT_DEMAND, body.PaymentDemand)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.GET_PAYMENT_DEMANDS_STOCK] ({ commit }) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.get('payment_demand_stocks')
      commit(types.GET_PAYMENT_DEMANDS_STOCK, body.PaymentDemandsStock)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
}

const mutations = {
  [types.GET_PAYMENT_DEMANDS] (state, list) {
    state.paymentDemands = [...list]
  },
  [types.UPDATE_PAYMENT_DEMAND] (state, paymentDemand) {
    const index = state.paymentDemands.findIndex(p => p.ID === paymentDemand.ID)
    if (index !== -1) {
      state.paymentDemands.splice(index, 1, paymentDemand)
    }
  },
  [types.GET_PAYMENT_DEMAND_COUNTS] (state, list) {
    state.paymentDemandCount = [...list]
  },
  [types.GET_PAYMENT_DEMANDS_STOCK] (state, list) {
    state.paymentDemandsStock = [...list]
  },
}

export default { state, actions, mutations }

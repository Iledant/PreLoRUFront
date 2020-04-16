import * as types from './types'
import Vue from 'vue'
import { beginLoading, setErrorMessage } from './loading'

const state = {
  paymentDelays: []
}

const actions = {
  async [types.GET_PAYMENT_DELAYS] ({ commit }, payload) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.get('payment_delays', { params: payload })
      commit(types.GET_PAYMENT_DELAYS, body.PaymentDelay)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  }
}

const mutations = {
  [types.GET_PAYMENT_DELAYS] (state, list) {
    state.paymentDelays = [...list]
  }
}

export default { state, actions, mutations }

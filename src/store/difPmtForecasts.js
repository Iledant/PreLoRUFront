import * as types from './types'
import { beginLoading, setErrorMessage } from './loading'
import Vue from 'vue'

const state = {
  difPmtForecastsList: [],
}

const actions = {
  async [types.GET_DIF_PAYMENT_PREVISIONS] ({ commit }) {
    try {
      beginLoading(commit)
      const resp = await Vue.http.get('dif_action_pmt_prev')
      commit(types.GET_DIF_PAYMENT_PREVISIONS, resp.body.DifActionPmtPrevision)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
}

const mutations = {
  [types.GET_DIF_PAYMENT_PREVISIONS] ({ commit }, list) {
    state.difPmtForecastsList = [...list]
  },
}

export default { state, actions, mutations }

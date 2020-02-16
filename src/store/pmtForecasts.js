import Vue from 'vue'
import * as types from './types'
import { beginLoading, setErrorMessage } from './loading'

const state = {
  pmtForecastsList: []
}

const actions = {
  async [types.GET_PMT_FORECASTS] ({ commit }, { Year }) {
    beginLoading(commit)
    try {
      let resp = await Vue.http.get('payments/forecasts', { params: { Year } })
      commit(types.GET_PMT_FORECASTS, resp.body.PmtForecast)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  }
}

const mutations = {
  [types.GET_PMT_FORECASTS] (state, list) {
    state.pmtForecastsList = [...list]
  }
}

export default { state, actions, mutations }

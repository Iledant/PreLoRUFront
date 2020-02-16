import Vue from 'vue'
import * as types from './types'
import { beginLoading, setErrorMessage } from './loading'

const state = {
  cmtForecastsList: []
}

const actions = {
  async [types.GET_CMT_FORECASTS] ({ commit }) {
    beginLoading(commit)
    try {
      let resp = await Vue.http.get('commitments/forecasts')
      commit(types.GET_CMT_FORECASTS, resp.body.CmtForecast)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  }
}

const mutations = {
  [types.GET_CMT_FORECASTS] (state, list) {
    state.cmtForecastsList = [...list]
  }
}

export default { state, actions, mutations }

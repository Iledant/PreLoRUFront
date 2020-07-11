import * as types from './types'
import { beginLoading, setErrorMessage } from './loading'
import Vue from 'vue'

const state = {
  ratiosList: [],
  ratiosYears: [],
}

const actions = {
  async [types.GET_YEAR_RATIOS] ({ commit }, { Year }) {
    beginLoading(commit)
    try {
      const resp = await Vue.http.get('ratios', { params: { Year } })
      commit(types.GET_YEAR_RATIOS, resp.body.PmtRatio)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.SAVE_YEAR_RATIOS] ({ commit }, { Ratios, Year }) {
    beginLoading(commit)
    try {
      await Vue.http.post('ratios', { Ratios, Year })
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.GET_RATIOS_YEARS] ({ commit }) {
    beginLoading(commit)
    try {
      const resp = await Vue.http.get('ratios/years')
      commit(types.GET_RATIOS_YEARS, resp.body.PmtRatiosYear)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
}

const mutations = {
  [types.GET_YEAR_RATIOS] (state, list) {
    state.ratiosList = [...list]
  },
  [types.GET_RATIOS_YEARS] (state, list) {
    state.ratiosYears = [...list]
  },
}

export default { state, actions, mutations }

import * as types from './types.js'
import Vue from 'vue'
import { beginLoading, setErrorMessage } from './loading.js'

const state = {
  dptReport: [],
  cityReport: []
}

const actions = {
  async [types.GET_DPT_REPORT] ({ commit }, { firstYear, lastYear }) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.get('department_report', {
        params: { firstYear, lastYear }
      })
      commit(types.GET_DPT_REPORT, body.DptReport)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.GET_CITY_REPORT] (
    { commit },
    { firstYear, lastYear, inseeCode }
  ) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.get('city_report', {
        params: { firstYear, lastYear, inseeCode }
      })
      commit(types.GET_CITY_REPORT, body.CityReport)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.GET_SUMMARIES_DATAS] ({ commit }) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.get('summaries/datas')
      commit(types.GET_CITIES, body.City)
      commit(types.GET_RPLS_YEARS, body.RPLSYear)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  }
}

const mutations = {
  [types.GET_DPT_REPORT] (state, payload) {
    state.dptReport = [...payload]
  },
  [types.GET_CITY_REPORT] (state, payload) {
    state.cityReport = [...payload]
  }
}

export default { state, actions, mutations }

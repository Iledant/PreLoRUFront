import Vue from 'vue'
import * as types from './types'
import { beginLoading, setErrorMessage } from './loading'

const state = {
  progList: [],
}

const actions = {
  async [types.GET_PROG] ({ commit }, { Year }) {
    beginLoading(commit)
    try {
      const resp = await Vue.http.get('prog', { params: { Year } })
      commit(types.GET_PROG, resp.body.Prog)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.GET_PROG_AND_DATAS] ({ commit }, { Year }) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.get('prog/datas', { params: { Year } })
      commit(types.GET_PROG, body.Prog)
      commit(types.GET_ACTIONS, body.BudgetAction)
      commit(types.GET_COMMISSIONS, body.Commission)
      commit(types.GET_RENEW_PROJECTS, body.RenewProject)
      commit(types.GET_COPROS, body.Copro)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.SET_PROG] ({ commit }, { Prog, Kind, Year }) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.post(`prog?Year=${Year}`, { Prog })
      commit(types.GET_PROG, body.Prog)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
}

const mutations = {
  [types.GET_PROG] (state, list) {
    state.progList = [...list]
  },
}

export default { state, actions, mutations }

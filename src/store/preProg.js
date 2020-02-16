import Vue from 'vue'
import * as types from './types'
import { beginLoading, setErrorMessage } from './loading'

const state = {
  preProgList: []
}

const actions = {
  async [types.GET_KIND_PRE_PROG] ({ commit }, { Year, Kind }) {
    beginLoading(commit)
    try {
      let resp = await Vue.http.get(`pre_prog/${Kind}`, { params: { Year } })
      commit(types.GET_PRE_PROG, resp.body.FcPreProg)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.GET_ALL_PRE_PROG] ({ commit }, { Year }) {
    beginLoading(commit)
    try {
      let resp = await Vue.http.get(`pre_prog`, { params: { Year } })
      commit(types.GET_PRE_PROG, resp.body.PreProg)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.SET_PRE_PROG] ({ commit }, { PreProg, Kind, Year }) {
    beginLoading(commit)
    try {
      await Vue.http.post(`pre_prog/${Kind}?Year=${Year}`, { PreProg })
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  }
}

const mutations = {
  [types.GET_PRE_PROG] (state, list) {
    state.preProgList = [...list]
  }
}

export default { state, actions, mutations }

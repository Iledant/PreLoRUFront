import * as types from './types'
import { beginLoading, setErrorMessage } from './loading'
import Vue from 'vue'

const state = {
  placementList: [],
}

const actions = {
  async [types.GET_PLACEMENTS] ({ commit }) {
    try {
      beginLoading(commit)
      const resp = await Vue.http.get('placements')
      commit(types.GET_PLACEMENTS, resp.body.Placement)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.UPDATE_PLACEMENT] ({ commit }, { ID, Comment }) {
    try {
      beginLoading(commit)
      const resp = await Vue.http.put(`placement/${ID}`, { Placement: { Comment } })
      commit(types.UPDATE_PLACEMENT, resp.body.Placement)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.UPLOAD_PLACEMENTS] ({ commit }, { Placement }) {
    beginLoading(commit)
    try {
      await Vue.http.post('placements', { Placement })
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
}

const mutations = {
  [types.GET_PLACEMENTS] (state, payload) {
    state.placementList = [...payload]
  },
  [types.UPDATE_PLACEMENT] (state, placement) {
    const index = state.placementList.findIndex(p => p.ID === placement.ID)
    state.placementList.splice(index, 1, placement)
  },
}

export default { state, actions, mutations }

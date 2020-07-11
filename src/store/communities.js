import * as types from './types'
import Vue from 'vue'
import { beginLoading, setErrorMessage } from './loading.js'

const state = {
  communitiesList: [],
}

const actions = {
  async [types.CREATE_COMMUNITY] ({ commit }, { Code, Name }) {
    beginLoading(commit)
    try {
      const resp = await Vue.http.post('community', {
        Community: { Code, Name },
      })
      commit(types.END_LOADING)
      commit(types.CREATE_COMMUNITY, resp.body.Community)
    } catch (resp) {
      setErrorMessage(commit, resp)
    }
  },
  async [types.UPDATE_COMMUNITY] ({ commit }, { ID, Code, Name }) {
    beginLoading(commit)
    try {
      const resp = await Vue.http.put('community', {
        Community: { ID, Code, Name },
      })
      commit(types.END_LOADING)
      commit(types.UPDATE_COMMUNITY, resp.body.Community)
    } catch (resp) {
      setErrorMessage(commit, resp)
    }
  },
  async [types.DEL_COMMUNITY] ({ commit }, ID) {
    beginLoading(commit)
    try {
      await Vue.http.delete(`community/${ID}`)
      commit(types.END_LOADING)
      commit(types.DEL_COMMUNITY, ID)
    } catch (resp) {
      setErrorMessage(commit, resp)
    }
  },
  async [types.UPLOAD_COMMUNITIES] ({ commit }, { Community }) {
    beginLoading(commit)
    try {
      const resp = await Vue.http.post('communities', { Community })
      commit(types.GET_COMMUNITIES, resp.body.Community)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
}

const mutations = {
  [types.GET_COMMUNITIES] (state, communities) {
    state.communitiesList = [...communities]
  },
  [types.CREATE_COMMUNITY] (state, community) {
    state.communitiesList.push(community)
  },
  [types.UPDATE_COMMUNITY] (state, community) {
    const index = state.communitiesList.findIndex(b => b.ID === community.ID)
    state.communitiesList.splice(index, 1, community)
  },
  [types.DEL_COMMUNITY] (state, ID) {
    const index = state.communitiesList.findIndex(b => b.ID === ID)
    state.communitiesList.splice(index, 1)
  },
}

export default { state, actions, mutations }

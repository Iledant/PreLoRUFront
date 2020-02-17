import * as types from './types.js'
import Vue from 'vue'
import { beginLoading, setErrorMessage } from './loading.js'

const state = {
  coproEventTypeList: [],
  coproEventType: null
}

const actions = {
  async [types.GET_COPRO_EVENT_TYPE] ({ commit }, { ID }) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.get(`copro_event_type/${ID}`)
      commit(types.GET_COPRO_EVENT_TYPE, body.CoproEventType)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.DELETE_COPRO_EVENT_TYPE] ({ commit }, ID) {
    beginLoading(commit)
    try {
      await Vue.http.delete(`copro_event_type/${ID}`)
      commit(types.DELETE_COPRO_EVENT_TYPE, ID)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.UPDATE_COPRO_EVENT_TYPE] ({ commit }, { ID, Name }) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.put('copro_event_type', { ID, Name })
      commit(types.UPDATE_COPRO_EVENT_TYPE, body.CoproEventType)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.CREATE_COPRO_EVENT_TYPE] ({ commit }, { Name }) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.post('copro_event_type', { Name })
      commit(types.CREATE_COPRO_EVENT_TYPE, body.CoproEventType)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.GET_COPRO_EVENT_TYPES] ({ commit }) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.get('copro_event_types')
      commit(types.GET_COPRO_EVENT_TYPES, body.CoproEventType)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  }
}

const mutations = {
  [types.GET_COPRO_EVENT_TYPE] (state, payload) {
    state.coproEventType = payload
  },
  [types.GET_COPRO_EVENT_TYPES] (state, payload) {
    state.coproEventTypeList = [...payload]
  },
  [types.UPDATE_COPRO_EVENT_TYPE] (state, payload) {
    const index = state.coproEventTypeList.findIndex(e => e.ID === payload.ID)
    state.coproEventTypeList.splice(index, 1, payload)
  },
  [types.DELETE_COPRO_EVENT_TYPE] (state, ID) {
    const index = state.coproEventTypeList.findIndex(e => e.ID === ID)
    state.coproEventTypeList.splice(index, 1)
  },
  [types.CREATE_COPRO_EVENT_TYPE] (state, payload) {
    state.coproEventTypeList.push(payload)
  }
}

export default { state, actions, mutations }

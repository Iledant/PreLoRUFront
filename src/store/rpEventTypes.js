import * as types from './types.js'
import Vue from 'vue'
import { beginLoading, setErrorMessage } from './loading.js'

const state = {
  eventTypeList: [],
  eventType: null
}

const actions = {
  async [types.GET_RP_EVENT_TYPE] ({ commit }, { ID }) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.get(`rp_event_type/${ID}`)
      commit(types.GET_RP_EVENT_TYPE, body.RPEventType)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.DELETE_RP_EVENT_TYPE] ({ commit }, ID) {
    beginLoading(commit)
    try {
      await Vue.http.delete(`rp_event_type/${ID}`)
      commit(types.DELETE_RP_EVENT_TYPE, ID)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.UPDATE_RP_EVENT_TYPE] ({ commit }, { ID, Name }) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.put('rp_event_type', { ID, Name })
      commit(types.UPDATE_RP_EVENT_TYPE, body.RPEventType)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.CREATE_RP_EVENT_TYPE] ({ commit }, { Name }) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.post('rp_event_type', { Name })
      commit(types.CREATE_RP_EVENT_TYPE, body.RPEventType)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.GET_RP_EVENT_TYPES] ({ commit }) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.get('rp_event_types')
      commit(types.GET_RP_EVENT_TYPES, body.RPEventType)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  }
}

const mutations = {
  [types.GET_RP_EVENT_TYPE] (state, payload) {
    state.eventType = payload
  },
  [types.GET_RP_EVENT_TYPES] (state, payload) {
    state.eventTypeList = [...payload]
  },
  [types.UPDATE_RP_EVENT_TYPE] (state, payload) {
    const index = state.eventTypeList.findIndex(e => e.ID === payload.ID)
    state.eventTypeList.splice(index, 1, payload)
  },
  [types.DELETE_RP_EVENT_TYPE] (state, ID) {
    const index = state.eventTypeList.findIndex(e => e.ID === ID)
    state.eventTypeList.splice(index, 1)
  },
  [types.CREATE_RP_EVENT_TYPE] (state, payload) {
    state.eventTypeList.push(payload)
  }
}

export default { state, actions, mutations }

import * as types from './types.js'
import Vue from 'vue'
import { beginLoading, setErrorMessage } from './loading.js'

const state = {
  copro: null,
  coproCommitments: [],
  coproPayments: [],
  coproForecasts: [],
  coproEvents: [],
  coproDocs: []
}

const actions = {
  async [types.GET_COPRO_DATAS] ({ commit }, ID) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.get(`copro/${ID}/datas`)
      commit(types.GET_COPRO_DATAS, body)
      commit(types.GET_COMMISSIONS, body.Commission)
      commit(types.GET_ACTIONS, body.BudgetAction)
      commit(types.GET_COPRO_EVENT_TYPES, body.CoproEventType)
      commit(types.GET_COPRO_EVENTS, body.FullCoproEvent)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.CREATE_COPRO_FORECAST] ({ commit }, { CoproForecast }) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.post('copro_forecast', {
        CoproForecast
      })
      commit(types.CREATE_COPRO_FORECAST, body.CoproForecast)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.UPDATE_COPRO_FORECAST] ({ commit }, item) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.put('copro_forecast', item)
      commit(types.UPDATE_COPRO_FORECAST, body.CoproForecast)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.DELETE_COPRO_FORECAST] ({ commit }, ID) {
    beginLoading(commit)
    try {
      await Vue.http.delete(`copro_forecast/${ID}`)
      commit(types.DELETE_COPRO_FORECAST, ID)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.CREATE_COPRO_EVENT] ({ commit }, item) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.post('copro_event', item)
      commit(types.CREATE_COPRO_EVENT, body.CoproEvent)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.UPDATE_COPRO_EVENT] ({ commit }, item) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.put('copro_event', item)
      commit(types.UPDATE_COPRO_EVENT, body.CoproEvent)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.DELETE_COPRO_EVENT] ({ commit }, ID) {
    beginLoading(commit)
    try {
      await Vue.http.delete(`copro_event/${ID}`)
      commit(types.DELETE_COPRO_EVENT, ID)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.CREATE_COPRO_DOC] ({ commit }, item) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.post(`copro/${item.CoproID}/copro_doc`,
        { CoproDoc: item })
      commit(types.CREATE_COPRO_DOC, body.CoproDoc)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.UPDATE_COPRO_DOC] ({ commit }, item) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.put(`copro/${item.CoproID}/copro_doc`,
        { CoproDoc: item })
      commit(types.UPDATE_COPRO_DOC, body.CoproDoc)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.DELETE_COPRO_DOC] ({ commit }, { CoproID, ID }) {
    beginLoading(commit)
    try {
      await Vue.http.delete(`copro/${CoproID}/copro_doc/${ID}`)
      commit(types.DELETE_COPRO_DOC, ID)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  }
}

const mutations = {
  [types.GET_COPRO_DATAS] (state, payload) {
    state.copro = payload.Copro
    state.coproCommitments = [...payload.Commitment]
    state.coproPayments = [...payload.Payment]
    state.coproForecasts = [...payload.CoproForecast]
  },
  [types.GET_COPRO_COMMITMENTS] (state, commitments) {
    state.coproCommitments = [...commitments]
  },
  [types.GET_COPRO_PAYMENTS] (state, payments) {
    state.coproPayments = [...payments]
  },
  [types.GET_COPRO_FORECASTS] (state, payload) {
    state.coproForecasts = [...payload]
  },
  [types.UPDATE_COPRO_FORECAST] (state, payload) {
    const index = state.coproForecasts.findIndex(r => r.ID === payload.ID)
    state.coproForecasts.splice(index, 1, payload)
  },
  [types.DELETE_COPRO_FORECAST] (state, ID) {
    const index = state.coproForecasts.findIndex(r => r.ID === ID)
    state.coproForecasts.splice(index, 1)
  },
  [types.CREATE_COPRO_FORECAST] (state, payload) {
    state.coproForecasts.push(payload)
  },
  [types.GET_COPRO_EVENTS] (state, payload) {
    state.coproEvents = [...payload]
  },
  [types.UPDATE_COPRO_EVENT] (state, payload) {
    const index = state.coproEvents.findIndex(r => r.ID === payload.ID)
    state.coproEvents.splice(index, 1, payload)
  },
  [types.DELETE_COPRO_EVENT] (state, ID) {
    const index = state.coproEvents.findIndex(r => r.ID === ID)
    state.coproEvents.splice(index, 1)
  },
  [types.CREATE_COPRO_EVENT] (state, payload) {
    state.coproEvents.push(payload)
  },
  [types.GET_COPRO_DOCS] (state, payload) {
    state.coproDocs = [...payload]
  },
  [types.UPDATE_COPRO_DOC] (state, payload) {
    const index = state.coproDocs.findIndex(r => r.ID === payload.ID)
    state.coproDocs.splice(index, 1, payload)
  },
  [types.DELETE_COPRO_DOC] (state, ID) {
    const index = state.coproDocs.findIndex(r => r.ID === ID)
    state.coproDocs.splice(index, 1)
  },
  [types.CREATE_COPRO_DOC] (state, payload) {
    state.coproDocs.push(payload)
  }
}

export default { state, actions, mutations }

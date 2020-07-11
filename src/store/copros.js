import * as types from './types.js'
import Vue from 'vue'
import { beginLoading, setErrorMessage } from './loading.js'

const state = {
  coprosList: [],
  coproReport: [],
}

const actions = {
  async [types.GET_COPROS] ({ commit }) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.get('copro')
      commit(types.GET_COPROS, body.Copro)
      commit(types.GET_CITIES, body.City)
      commit(types.GET_COMMISSIONS, body.Commission)
      commit(types.GET_ACTIONS, body.BudgetAction)
      commit(types.GET_PRE_PROG, body.FcPreProg)
      commit(types.GET_COPRO_EVENT_TYPES, body.CoproEventType)
      commit(types.GET_COPRO_REPORT, body.CoproReport)
      commit(types.END_LOADING)
    } catch (response) {
      setErrorMessage(commit, response)
    }
  },
  async [types.CREATE_COPRO] (
    { commit },
    { Reference, Name, Address, ZipCode, LabelDate, Budget }
  ) {
    beginLoading(commit)
    try {
      const response = await Vue.http.post('copro', {
        Copro: { Reference, Name, Address, ZipCode, LabelDate, Budget },
      })
      commit(types.CREATE_COPRO, response.body.Copro)
      commit(types.END_LOADING)
    } catch (response) {
      setErrorMessage(commit, response)
    }
  },
  async [types.UPDATE_COPRO] (
    { commit },
    { ID, Reference, Name, Address, ZipCode, LabelDate, Budget }
  ) {
    beginLoading(commit)
    try {
      const response = await Vue.http.put('copro', {
        Copro: { ID, Reference, Name, Address, ZipCode, LabelDate, Budget },
      })
      commit(types.UPDATE_COPRO, response.body.Copro)
      commit(types.END_LOADING)
    } catch (response) {
      setErrorMessage(commit, response)
    }
  },
  async [types.DEL_COPRO] ({ commit }, ID) {
    beginLoading(commit)
    try {
      await Vue.http.delete(`copro/${ID}`)
      commit(types.DEL_COPRO, ID)
      commit(types.END_LOADING)
    } catch (response) {
      setErrorMessage(commit, response)
    }
  },
  async [types.UPLOAD_COPROS] ({ commit }, { Copro }) {
    beginLoading(commit)
    try {
      await Vue.http.post('copros', { Copro })
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.UPLOAD_COPRO_COMMITMENT_LINK] ({ commit }, { CoproCommitmentBatch }) {
    beginLoading(commit)
    try {
      await Vue.http.post('copro/commitments', { CoproCommitmentBatch })
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
}

const mutations = {
  [types.GET_COPROS] (state, list) {
    state.coprosList = [...list]
  },
  [types.CREATE_COPRO] (state, item) {
    state.coprosList.push(item)
  },
  [types.UPDATE_COPRO] (state, item) {
    const index = state.coprosList.findIndex(i => i.ID === item.ID)
    state.coprosList.splice(index, 1, item)
  },
  [types.DEL_COPRO] (state, ID) {
    const index = state.coprosList.findIndex(i => i.ID === ID)
    state.coprosList.splice(index, 1)
  },
  [types.GET_COPRO_REPORT] (state, list) {
    state.coproReport = [...list]
  },
}

export default { state, actions, mutations }

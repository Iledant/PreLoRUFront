import * as types from './types'
import { beginLoading, setErrorMessage } from './loading'
import Vue from 'vue'

const state = {
  beneficiariesList: [],
  beneficiariesPage: 0,
  beneficiariesItemsCount: 0,
}

const actions = {
  async [types.GET_BENEFICIARIES] ({ commit }, { Page, Search }) {
    try {
      beginLoading(commit)
      const resp = await Vue.http.get('beneficiaries/paginated', {
        params: { Page, Search },
      })
      commit(types.GET_BENEFICIARIES, resp.body)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.GET_ALL_BENEFICIARIES] ({ commit }) {
    try {
      beginLoading(commit)
      const resp = await Vue.http.get('beneficiaries')
      commit(types.GET_ALL_BENEFICIARIES, resp.body.Beneficiary)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.CREATE_BENEFICIARY] ({ commit }, { Beneficiary }) {
    try {
      beginLoading(commit)
      await Vue.http.post('beneficiary', { Beneficiary })
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.UPDATE_BENEFICIARY] ({ commit }, { Beneficiary }) {
    try {
      beginLoading(commit)
      await Vue.http.put('beneficiary', { Beneficiary })
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.DELETE_BENEFICIARY] ({ commit }, ID) {
    try {
      beginLoading(commit)
      await Vue.http.delete(`beneficiary/${ID}`)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
}

const mutations = {
  [types.GET_BENEFICIARIES] (state, payload) {
    state.beneficiariesList = [...payload.Beneficiary]
    state.beneficiariesPage = payload.Page
    state.beneficiariesItemsCount = payload.ItemsCount
  },
  [types.GET_ALL_BENEFICIARIES] (state, list) {
    state.beneficiariesList = [...list]
  },
}

export default { state, actions, mutations }

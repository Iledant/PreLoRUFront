import * as types from './types'
import { beginLoading, setErrorMessage } from './loading'
import Vue from 'vue'

const state = {
  housingTypesList: []
}

const actions = {
  async [types.GET_HOUSING_TYPES] ({ commit }) {
    try {
      beginLoading(commit)
      const resp = await Vue.http.get('housing_types')
      commit(types.GET_HOUSING_TYPES, resp.body.HousingType)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.CREATE_HOUSING_TYPE] ({ commit }, payload) {
    try {
      beginLoading(commit)
      const resp = await Vue.http.post('housing_type', { HousingType: { ...payload } })
      commit(types.CREATE_HOUSING_TYPE, resp.body.HousingType)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.UPDATE_HOUSING_TYPE] ({ commit }, payload) {
    try {
      beginLoading(commit)
      const resp = await Vue.http.put('housing_type', { HousingType: { ...payload } })
      commit(types.UPDATE_HOUSING_TYPE, resp.body.HousingType)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.DELETE_HOUSING_TYPE] ({ commit }, ID) {
    try {
      beginLoading(commit)
      await Vue.http.delete(`housing_type/${ID}`)
      commit(types.DELETE_HOUSING_TYPE, ID)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.UPLOAD_IRIS_HOUSING_TYPES] ({ commit }, { IRISHousingType }) {
    beginLoading(commit)
    try {
      await Vue.http.post('iris_housing_type', { IRISHousingType })
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  }
}

const mutations = {
  [types.GET_HOUSING_TYPES] (state, payload) {
    state.housingTypesList = [...payload]
  },
  [types.CREATE_HOUSING_TYPE] (state, payload) {
    state.housingTypesList.push(payload)
  },
  [types.UPDATE_HOUSING_TYPE] (state, payload) {
    const index = state.housingTypesList.findIndex(h => h.ID === payload.ID)
    state.housingTypesList.splice(index, 1, payload)
  },
  [types.DELETE_HOUSING_TYPE] (state, ID) {
    const index = state.housingTypesList.findIndex(h => h.ID === ID)
    state.housingTypesList.splice(index, 1)
  }
}

export default { state, actions, mutations }

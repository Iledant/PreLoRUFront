import * as types from './types'
import Vue from 'vue'
import { beginLoading, setErrorMessage } from './loading.js'

const state = {
  usersList: []
}

const actions = {
  async [types.GET_USERS] ({ commit }) {
    beginLoading(commit)
    try {
      const response = await Vue.http.get('users')
      commit(types.GET_USERS, response.body.User)
      commit(types.END_LOADING)
    } catch (response) {
      setErrorMessage(commit, response)
    }
  },
  async [types.UPDATE_USER] ({ commit }, { ID, Name, Email, Password, Rights }) {
    beginLoading(commit)
    try {
      const resp = await Vue.http.put(`user/${ID}`, {
        Name,
        Email,
        Password,
        Rights
      })
      commit(types.UPDATE_USER, resp.body.User)
      commit(types.END_LOADING)
    } catch (response) {
      setErrorMessage(commit, response)
    }
  },
  async [types.DEL_USER] ({ commit }, ID) {
    beginLoading(commit)
    try {
      await Vue.http.delete(`user/${ID}`)
      commit(types.DEL_USER, ID)
      commit(types.END_LOADING)
    } catch (response) {
      setErrorMessage(commit, response)
    }
  },
  async [types.CREATE_USER] ({ commit }, { Name, Email, Password, Rights }) {
    beginLoading(commit)
    try {
      const response = await Vue.http.post('user', {
        Name,
        Email,
        Password,
        Rights
      })
      commit(types.CREATE_USER, response.body.User)
      commit(types.END_LOADING)
    } catch (response) {
      setErrorMessage(commit, response)
    }
  },
  async [types.CHANGE_PWD] ({ commit }, payload) {
    beginLoading(commit)
    try {
      await Vue.http.post('user/password', payload)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  }
}

const mutations = {
  [types.GET_USERS] (state, usersList) {
    state.usersList = [...usersList]
  },
  [types.UPDATE_USER] (state, user) {
    const index = state.usersList.findIndex(i => i.ID === user.ID)
    state.usersList.splice(index, 1, user)
  },
  [types.DEL_USER] (state, ID) {
    const index = state.usersList.findIndex(i => i.ID === ID)
    state.usersList.splice(index, 1)
  },
  [types.CREATE_USER] (state, user) {
    state.usersList.push(user)
  }
}

export default { state, actions, mutations }

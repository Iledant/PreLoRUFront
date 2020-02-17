import * as types from './types.js'
import Vue from 'vue'
import { beginLoading, setErrorMessage } from './loading.js'
import { excelReadFile } from '../excel.js'

const state = {
  renewProjectsList: [],
  renewProjectReport: []
}

const actions = {
  async [types.GET_RENEW_PROJECTS] ({ commit }) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.get('renew_projects')
      commit(types.GET_RENEW_PROJECTS, body.RenewProject)
      commit(types.GET_CITIES, body.City)
      commit(types.GET_RP_EVENT_TYPES, body.RPEventType)
      commit(types.GET_PRE_PROG, body.FcPreProg)
      commit(types.GET_COMMISSIONS, body.Commission)
      commit(types.GET_ACTIONS, body.BudgetAction)
      commit(types.GET_RENEW_PROJECT_REPORT, body.RPMultiAnnualReport)
      commit(types.END_LOADING)
    } catch (response) {
      setErrorMessage(commit, response)
    }
  },
  async [types.CREATE_RENEW_PROJECT] ({ commit }, project) {
    beginLoading(commit)
    try {
      const response = await Vue.http.post('renew_project', {
        RenewProject: project
      })
      commit(types.CREATE_RENEW_PROJECT, response.body.RenewProject)
      commit(types.END_LOADING)
    } catch (response) {
      setErrorMessage(commit, response)
    }
  },
  async [types.UPDATE_RENEW_PROJECT] ({ commit }, project) {
    beginLoading(commit)
    try {
      const response = await Vue.http.put('renew_project', {
        RenewProject: project
      })
      commit(types.UPDATE_RENEW_PROJECT, response.body.RenewProject)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.DEL_RENEW_PROJECT] ({ commit }, ID) {
    beginLoading(commit)
    try {
      await Vue.http.delete(`renew_project/${ID}`)
      commit(types.DEL_RENEW_PROJECT, ID)
      commit(types.END_LOADING)
    } catch (response) {
      setErrorMessage(commit, response)
    }
  },
  async [types.UPLOAD_RENEW_PROJECTS] ({ commit }, file) {
    beginLoading(commit)
    try {
      const parseFunc = d => ({
        Reference: d.Reference,
        Name: d.Name,
        PRIN: Boolean(d.PRIN),
        CityCode1: parseInt(d.CityCode1),
        CityCode2: parseInt(d.CityCode2),
        CityCode3: parseInt(d.CityCode3),
        Budget: parseInt(100 * d.Budget),
        Population: d.Population ? parseInt(d.Population) : null,
        CompositeIndex: d.CompositeIndex ? parseInt(d.CompositeIndex) : null
      })
      await excelReadFile(
        file,
        [
          'Reference',
          'Name',
          'Budget',
          'PRIN',
          'CityCode1',
          'CityCode2',
          'CityCode3',
          'Population',
          'CompositeIndex'
        ],
        d => Vue.http.post('renew_projects', { RenewProject: d }),
        err => setErrorMessage(commit, err),
        parseFunc
      )
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  }
}

const mutations = {
  [types.GET_RENEW_PROJECTS] (state, list) {
    state.renewProjectsList = [...list]
  },
  [types.CREATE_RENEW_PROJECT] (state, item) {
    state.renewProjectsList.push(item)
  },
  [types.UPDATE_RENEW_PROJECT] (state, item) {
    const index = state.renewProjectsList.findIndex(i => i.ID === item.ID)
    state.renewProjectsList.splice(index, 1, item)
  },
  [types.DEL_RENEW_PROJECT] (state, ID) {
    const index = state.renewProjectsList.findIndex(i => i.ID === ID)
    state.renewProjectsList.splice(index, 1)
  },
  [types.GET_RENEW_PROJECT_REPORT] (state, list) {
    state.renewProjectReport = [...list]
  }
}

export default { state, actions, mutations }

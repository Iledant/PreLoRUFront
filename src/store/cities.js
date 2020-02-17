import * as types from './types'
import Vue from 'vue'
import { beginLoading, setErrorMessage } from './loading.js'
import { excelReadFile } from '../excel.js'

const state = {
  citiesList: [],
  citiesPage: 0,
  citiesItemsCount: 0
}

const actions = {
  async [types.GET_CITIES] ({ commit }) {
    beginLoading(commit)
    try {
      const resp = await Vue.http.get('cities')
      commit(types.END_LOADING)
      commit(types.GET_CITIES, resp.body.City)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.CREATE_CITY] ({ commit }, { InseeCode, Name, CommunityID, QPV }) {
    beginLoading(commit)
    try {
      const resp = await Vue.http.post('city', {
        City: { InseeCode, Name, CommunityID, QPV }
      })
      commit(types.END_LOADING)
      commit(types.CREATE_CITY, resp.body.City)
    } catch (resp) {
      setErrorMessage(commit, resp)
    }
  },
  async [types.UPDATE_CITY] ({ commit }, { InseeCode, Name, CommunityID, QPV }) {
    beginLoading(commit)
    try {
      const resp = await Vue.http.put('city', {
        City: { InseeCode, Name, CommunityID, QPV }
      })
      commit(types.END_LOADING)
      commit(types.UPDATE_CITY, resp.body.City)
    } catch (resp) {
      setErrorMessage(commit, resp)
    }
  },
  async [types.GET_PAGINATED_CITIES] ({ commit }, { Page, Search }) {
    try {
      beginLoading(commit)
      const resp = await Vue.http.get('cities/paginated', {
        params: { Page, Search }
      })
      commit(types.GET_PAGINATED_CITIES, resp.body)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.DEL_CITY] ({ commit }, InseeCode) {
    beginLoading(commit)
    try {
      await Vue.http.delete(`city/${InseeCode}`)
      commit(types.END_LOADING)
      commit(types.DEL_CITY, InseeCode)
    } catch (resp) {
      setErrorMessage(commit, resp)
    }
  },
  async [types.UPLOAD_CITIES] ({ commit }, file) {
    beginLoading(commit)
    try {
      const sendFunc = d => Vue.http.post('cities', { City: d })
      const parseFunc = d => ({
        InseeCode: d.InseeCode,
        Name: d.Name,
        CommunityCode: d.CommunityCode
          ? d.CommunityCode !== ''
            ? String(d.CommunityCode)
            : null
          : null,
        QPV: d.QPV
      })
      const resp = await excelReadFile(
        file,
        ['InseeCode', 'Name', 'CommunityCode', 'QPV'],
        sendFunc,
        err => {
          setErrorMessage(commit, err)
        },
        parseFunc
      )
      commit(types.GET_CITIES, resp.body.City)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  }
}

const mutations = {
  [types.GET_CITIES] (state, cities) {
    state.citiesList = [...cities]
  },
  [types.GET_PAGINATED_CITIES] (state, payload) {
    state.citiesList = [...payload.City]
    state.citiesPage = payload.Page
    state.citiesItemsCount = payload.ItemsCount
  },
  [types.CREATE_CITY] (state, city) {
    state.citiesList.push(city)
  },
  [types.UPDATE_CITY] (state, city) {
    const index = state.citiesList.findIndex(b => b.InseeCode === city.InseeCode)
    state.citiesList.splice(index, 1, city)
  },
  [types.DEL_CITY] (state, InseeCode) {
    const index = state.citiesList.findIndex(b => b.InseeCode === InseeCode)
    state.citiesList.splice(index, 1)
  }
}

export default { state, actions, mutations }

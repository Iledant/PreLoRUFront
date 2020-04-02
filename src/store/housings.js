import * as types from './types.js'
import Vue from 'vue'
import { beginLoading, setErrorMessage } from './loading.js'

const state = {
  housingsList: [],
  housingsPage: 0,
  housingsItemsCount: 0,
  housingForecastsList: [],
  housing: null,
  housingCommitments: [],
  housingPayments: []
}

const actions = {
  async [types.GET_HOUSINGS] ({ commit }) {
    beginLoading(commit)
    try {
      const response = await Vue.http.get('housings')
      commit(types.GET_HOUSINGS, response.body.Housing)
      commit(types.END_LOADING)
    } catch (response) {
      setErrorMessage(commit, response)
    }
  },
  async [types.GET_HOUSINGS_DATAS] ({ commit }) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.get('housings/datas')
      commit(types.GET_PAGINATED_HOUSINGS, body)
      commit(types.GET_CITIES, body.City)
      commit(types.GET_COMMISSIONS, body.Commission)
      commit(types.GET_ACTIONS, body.BudgetAction)
      commit(types.GET_HOUSING_FORECASTS, body.HousingForecast)
      commit(types.GET_PRE_PROG, body.FcPreProg)
      commit(types.GET_HOUSING_TYPES, body.HousingType)
      commit(types.END_LOADING)
    } catch (response) {
      setErrorMessage(commit, response)
    }
  },
  async [types.GET_HOUSING_DATAS] ({ commit }, ID) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.get(`housing/${ID}/datas`)
      commit(types.GET_HOUSING_DATAS, body)
      commit(types.END_LOADING)
    } catch (response) {
      setErrorMessage(commit, response)
    }
  },
  async [types.GET_PAGINATED_HOUSINGS] ({ commit }, { Page, Search }) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.get('housings/paginated', {
        params: { Page, Search }
      })
      commit(types.GET_PAGINATED_HOUSINGS, body)
      commit(types.END_LOADING)
    } catch (response) {
      setErrorMessage(commit, response)
    }
  },
  async [types.CREATE_HOUSING] ({ commit }, payload) {
    beginLoading(commit)
    try {
      const response = await Vue.http.post('housing', { Housing: payload })
      commit(types.CREATE_HOUSING, response.body.Housing)
      commit(types.END_LOADING)
    } catch (response) {
      setErrorMessage(commit, response)
    }
  },
  async [types.UPDATE_HOUSING] ({ commit }, payload) {
    beginLoading(commit)
    try {
      const response = await Vue.http.put('housing', { Housing: payload })
      commit(types.UPDATE_HOUSING, response.body.Housing)
      commit(types.END_LOADING)
    } catch (response) {
      setErrorMessage(commit, response)
    }
  },
  async [types.DEL_HOUSING] ({ commit }, ID) {
    beginLoading(commit)
    try {
      await Vue.http.delete(`housing/${ID}`)
      commit(types.DEL_HOUSING, ID)
      commit(types.END_LOADING)
    } catch (response) {
      setErrorMessage(commit, response)
    }
  },
  async [types.UPLOAD_HOUSINGS] ({ commit }, { Housing }) {
    beginLoading(commit)
    try {
      await Vue.http.post('housings', { Housing })
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.UPLOAD_HOUSING_COMMITMENT_LINK] ({ commit },
    { HousingCommitmentBach }) {
    beginLoading(commit)
    try {
      await Vue.http.post('housing/commitments', { HousingCommitmentBach })
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.UPLOAD_HOUSING_SUMMARY] ({ commit }, { HousingSummary }) {
    beginLoading(commit)
    try {
      await Vue.http.post('housing_summary', { HousingSummary })
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.GET_HOUSING_FORECASTS] ({ commit }) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.get('housing_forecasts')
      commit(types.GET_HOUSING_FORECASTS, body.HousingForecast)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.CREATE_HOUSING_FORECAST] ({ commit }, HousingForecast) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.post('housing_forecast', {
        HousingForecast
      })
      commit(types.CREATE_HOUSING_FORECAST, body.HousingForecast)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.UPDATE_HOUSING_FORECAST] ({ commit }, HousingForecast) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.put('housing_forecast', { HousingForecast })
      commit(types.UPDATE_HOUSING_FORECAST, body.HousingForecast)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.DELETE_HOUSING_FORECAST] ({ commit }, payload) {
    beginLoading(commit)
    try {
      await Vue.http.delete(`housing_forecast/${payload.ID}`)
      commit(types.DELETE_HOUSING_FORECAST, payload)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  }
}

const mutations = {
  [types.GET_HOUSINGS] (state, list) {
    state.housingsList = [...list]
  },
  [types.GET_PAGINATED_HOUSINGS] (state, payload) {
    state.housingsList = [...payload.Housing]
    state.housingsPage = payload.Page
    state.housingsItemsCount = payload.ItemsCount
  },
  [types.CREATE_HOUSING] (state, item) {
    state.housingsList.push(item)
  },
  [types.UPDATE_HOUSING] (state, item) {
    const index = state.housingsList.findIndex(i => i.ID === item.ID)
    state.housingsList.splice(index, 1, item)
  },
  [types.DEL_HOUSING] (state, ID) {
    const index = state.housingsList.findIndex(i => i.ID === ID)
    state.housingsList.splice(index, 1)
  },
  [types.GET_HOUSING_FORECASTS] (state, list) {
    state.housingForecastsList = [...list]
  },
  [types.CREATE_HOUSING_FORECAST] (state, item) {
    state.housingForecastsList.push(item)
  },
  [types.UPDATE_HOUSING_FORECAST] (state, item) {
    const index = state.housingForecastsList.findIndex(i => i.ID === item.ID)
    state.housingForecastsList.splice(index, 1, item)
  },
  [types.DELETE_HOUSING_FORECAST] (state, item) {
    const index = state.housingForecastsList.findIndex(i => i.ID === item.ID)
    state.housingForecastsList.splice(index, 1)
  },
  [types.GET_HOUSING_DATAS] (state, payload) {
    state.housing = payload.Housing
    state.housingCommitments = [...payload.Commitment]
    state.housingPayments = [...payload.Payment]
  },
  [types.GET_HOUSING_COMMITMENTS] (state, commitments) {
    state.housingCommitments = [...commitments]
  },
  [types.GET_HOUSING_PAYMENTS] (state, payments) {
    state.housingPayments = [...payments]
  },
  [types.GET_HOUSING_DATAS] (state, payload) {
    state.housing = payload.Housing
    state.housingCommitments = [...payload.Commitment]
    state.housingPayments = [...payload.Payment]
  }
}

export default { state, actions, mutations }

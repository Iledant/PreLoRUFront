import * as types from './types'
import Vue from 'vue'
import { beginLoading, setErrorMessage } from './loading.js'

const state = {
  budgetSectorsList: [],
  budgetActionsList: [],
  commissionsList: []
}

const actions = {
  async [types.GET_SETTINGS] ({ commit }) {
    beginLoading(commit)
    try {
      let resp = await Vue.http.get('settings')
      commit(types.END_LOADING)
      commit(types.GET_SECTORS, resp.body.BudgetSector)
      commit(types.GET_ACTIONS, resp.body.BudgetAction)
      commit(types.GET_COMMISSIONS, resp.body.Commission)
      commit(types.GET_COMMUNITIES, resp.body.Community)
      commit(types.GET_PAGINATED_CITIES, resp.body.PaginatedCity)
      commit(types.GET_PAYMENTS, resp.body.PaginatedPayment)
      commit(types.GET_COMMITMENTS, resp.body.PaginatedCommitment)
    } catch (resp) {
      setErrorMessage(commit, resp)
    }
  },
  async [types.GET_SECTORS] ({ commit }) {
    beginLoading(commit)
    try {
      let resp = await Vue.http.get('budget_sectors')
      commit(types.END_LOADING)
      commit(types.GET_SECTORS, resp.body.BudgetSector)
    } catch (resp) {
      setErrorMessage(commit, resp)
    }
  },
  async [types.GET_ACTIONS] ({ commit }) {
    beginLoading(commit)
    try {
      let resp = await Vue.http.get('budget_actions')
      commit(types.END_LOADING)
      commit(types.GET_SECTORS, resp.body.BudgetSector)
      commit(types.GET_ACTIONS, resp.body.BudgetAction)
    } catch (resp) {
      setErrorMessage(commit, resp)
    }
  },
  async [types.GET_COMMISSIONS] ({ commit }) {
    beginLoading(commit)
    try {
      let resp = await Vue.http.get('commissions')
      commit(types.END_LOADING)
      commit(types.GET_COMMISSIONS, resp.body.Commission)
    } catch (resp) {
      setErrorMessage(commit, resp)
    }
  },
  async [types.GET_COMMUNITIES] ({ commit }) {
    beginLoading(commit)
    try {
      let resp = await Vue.http.get('communities')
      commit(types.END_LOADING)
      commit(types.GET_COMMUNITIES, resp.body.Community)
    } catch (resp) {
      setErrorMessage(commit, resp)
    }
  },
  async [types.CREATE_SECTOR] ({ commit }, { Name, FullName }) {
    beginLoading(commit)
    try {
      let resp = await Vue.http.post('budget_sector', {
        BudgetSector: { Name, FullName }
      })
      commit(types.END_LOADING)
      commit(types.CREATE_SECTOR, resp.body.BudgetSector)
    } catch (resp) {
      setErrorMessage(commit, resp)
    }
  },
  async [types.UPDATE_SECTOR] ({ commit }, { ID, Name, FullName }) {
    beginLoading(commit)
    try {
      let resp = await Vue.http.put('budget_sector', {
        BudgetSector: { ID, Name, FullName }
      })
      commit(types.END_LOADING)
      commit(types.UPDATE_SECTOR, resp.body.BudgetSector)
    } catch (resp) {
      setErrorMessage(commit, resp)
    }
  },
  async [types.DEL_SECTOR] ({ commit }, ID) {
    beginLoading(commit)
    try {
      await Vue.http.delete(`budget_sector/${ID}`)
      commit(types.END_LOADING)
      commit(types.DEL_SECTOR, ID)
    } catch (resp) {
      setErrorMessage(commit, resp)
    }
  },
  async [types.CREATE_ACTION] ({ commit }, { Code, Name, SectorID }) {
    beginLoading(commit)
    try {
      let resp = await Vue.http.post('budget_action', {
        BudgetAction: { Code, Name, SectorID }
      })
      commit(types.END_LOADING)
      commit(types.CREATE_ACTION, resp.body.BudgetAction)
    } catch (resp) {
      setErrorMessage(commit, resp)
    }
  },
  async [types.UPDATE_ACTION] ({ commit }, { ID, Code, Name, SectorID }) {
    beginLoading(commit)
    try {
      let resp = await Vue.http.put('budget_action', {
        BudgetAction: { ID, Code, Name, SectorID }
      })
      commit(types.END_LOADING)
      commit(types.UPDATE_ACTION, resp.body.BudgetAction)
    } catch (resp) {
      setErrorMessage(commit, resp)
    }
  },
  async [types.DEL_ACTION] ({ commit }, ID) {
    beginLoading(commit)
    try {
      await Vue.http.delete(`budget_action/${ID}`)
      commit(types.END_LOADING)
      commit(types.DEL_ACTION, ID)
    } catch (resp) {
      setErrorMessage(commit, resp)
    }
  },
  async [types.CREATE_COMMISSION] ({ commit }, { Name, Date }) {
    beginLoading(commit)
    try {
      let resp = await Vue.http.post('commission', {
        Commission: { Name, Date }
      })
      commit(types.END_LOADING)
      commit(types.CREATE_COMMISSION, resp.body.Commission)
    } catch (resp) {
      setErrorMessage(commit, resp)
    }
  },
  async [types.UPDATE_COMMISSION] ({ commit }, { ID, Name, Date }) {
    beginLoading(commit)
    try {
      let resp = await Vue.http.put('commission', {
        Commission: { ID, Name, Date }
      })
      commit(types.END_LOADING)
      commit(types.UPDATE_COMMISSION, resp.body.Commission)
    } catch (resp) {
      setErrorMessage(commit, resp)
    }
  },
  async [types.DEL_COMMISSION] ({ commit }, ID) {
    beginLoading(commit)
    try {
      await Vue.http.delete(`commission/${ID}`)
      commit(types.END_LOADING)
      commit(types.DEL_COMMISSION, ID)
    } catch (resp) {
      setErrorMessage(commit, resp)
    }
  }
}

const mutations = {
  [types.GET_SECTORS] (state, sectors) {
    state.budgetSectorsList = [...sectors]
  },
  [types.CREATE_SECTOR] (state, sector) {
    state.budgetSectorsList.push(sector)
  },
  [types.UPDATE_SECTOR] (state, sector) {
    let index = state.budgetSectorsList.findIndex(b => b.ID === sector.ID)
    state.budgetSectorsList.splice(index, 1, sector)
  },
  [types.DEL_SECTOR] (state, ID) {
    let index = state.budgetSectorsList.find(b => b.ID === ID)
    state.budgetSectorsList.splice(index, 1)
  },
  [types.GET_ACTIONS] (state, actions) {
    state.budgetActionsList = [...actions]
  },
  [types.CREATE_ACTION] (state, action) {
    state.budgetActionsList.push(action)
  },
  [types.UPDATE_ACTION] (state, action) {
    let index = state.budgetActionsList.findIndex(b => b.ID === action.ID)
    state.budgetActionsList.splice(index, 1, action)
  },
  [types.DEL_ACTION] (state, ID) {
    let index = state.budgetActionsList.find(b => b.ID === ID)
    state.budgetActionsList.splice(index, 1)
  },
  [types.GET_COMMISSIONS] (state, commissions) {
    state.commissionsList = [...commissions]
  },
  [types.CREATE_COMMISSION] (state, commission) {
    state.commissionsList.push(commission)
  },
  [types.UPDATE_COMMISSION] (state, commission) {
    let index = state.commissionsList.findIndex(b => b.ID === commission.ID)
    state.commissionsList.splice(index, 1, commission)
  },
  [types.DEL_COMMISSION] (state, ID) {
    let index = state.commissionsList.find(b => b.ID === ID)
    state.commissionsList.splice(index, 1)
  }
}

export default { state, actions, mutations }

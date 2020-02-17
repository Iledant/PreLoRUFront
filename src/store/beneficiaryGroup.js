import * as types from './types'
import { beginLoading, setErrorMessage } from './loading'
import Vue from 'vue'
import { excelExport, dateStyle, valStyle } from '../excel'

async function exportBeneficiaryGroupDatas (datas) {
  const formattedDatas = datas.map(d => ({
    Date: new Date(d.Date),
    Name: d.Name,
    IRISCode: d.IRISCode,
    BeneficiaryCode: d.BeneficiaryCode,
    BeneficiaryName: d.BeneficiaryName,
    Value: d.Value * 0.01,
    Available: d.Available * 0.01,
    Caducity: d.Caducity ? new Date(d.Caducity) : null
  }))
  const columns = [
    { header: 'Date', key: 'Date', ...dateStyle },
    { header: 'Libellé', key: 'Name', width: 50 },
    { header: 'Fiche IRIS', key: 'IRISCode', width: 12 },
    { header: 'Code béné.', key: 'BeneficiaryCode', width: 14 },
    { header: 'Bénéficiaire', key: 'BeneficiaryName', width: 30 },
    { header: 'Montant', key: 'Value', ...valStyle },
    { header: 'RAM', key: 'Available', ...valStyle },
    { header: 'Caducité', key: 'Caducity', ...dateStyle }
  ]
  await excelExport(formattedDatas, columns, 'Engagements groupe de bénéficiaires')
}

const state = {
  beneficiariesGroupList: [],
  beneficiariesGroupItems: [],
  beneficiaryGroupDatas: [],
  beneficiaryGroupItemsCount: 0,
  beneficiaryGroupPage: 0
}

const actions = {
  async [types.GET_BENEFICIARY_GROUPS] ({ commit }) {
    try {
      beginLoading(commit)
      const resp = await Vue.http.get('beneficiary_groups')
      commit(types.GET_BENEFICIARY_GROUPS, resp.body.BeneficiaryGroup)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.GET_BENEFICIARY_GROUP_ITEMS] ({ commit }, ID) {
    try {
      beginLoading(commit)
      const resp = await Vue.http.get(`beneficiary_group/${ID}`)
      commit(types.GET_BENEFICIARY_GROUP_ITEMS, resp.body.Beneficiary)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.CREATE_BENEFICIARY_GROUP] ({ commit }, { BeneficiaryGroup }) {
    try {
      beginLoading(commit)
      const resp = await Vue.http.post('beneficiary_group', { BeneficiaryGroup })
      commit(types.CREATE_BENEFICIARY_GROUP, resp.body.BeneficiaryGroup)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.UPDATE_BENEFICIARY_GROUP] ({ commit }, { BeneficiaryGroup }) {
    try {
      beginLoading(commit)
      const resp = await Vue.http.put('beneficiary_group', { BeneficiaryGroup })
      commit(types.UPDATE_BENEFICIARY_GROUP, resp.body.BeneficiaryGroup)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.DELETE_BENEFICIARY_GROUP] ({ commit }, ID) {
    try {
      beginLoading(commit)
      await Vue.http.delete(`beneficiary_group/${ID}`)
      commit(types.DELETE_BENEFICIARY_GROUP, ID)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.SET_BENEFICIARY_GROUP_ITEMS] ({ commit }, { ID, BeneficiaryIDs }) {
    try {
      beginLoading(commit)
      const resp = await Vue.http.post(`beneficiary_group/${ID}`, { BeneficiaryIDs })
      commit(types.GET_BENEFICIARY_GROUP_ITEMS, resp.body.Beneficiary)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.GET_BENEFICIARY_GROUP_DATAS] ({ commit }, { ID, Page, Search, Year }) {
    beginLoading(commit)
    try {
      commit(types.END_LOADING)
      const resp = await Vue.http.get(`beneficiary_group/${ID}/datas`, {
        params: { Page, Search, Year }
      })
      commit(types.GET_BENEFICIARY_GROUP_DATAS, resp.body)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.GET_BENEFICIARY_GROUP_PLACEMENTS] ({ commit }, ID) {
    beginLoading(commit)
    try {
      commit(types.END_LOADING)
      const resp = await Vue.http.get(`beneficiary_group/${ID}/placements`)
      commit(types.GET_PLACEMENTS, resp.body.Placement)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.EXPORT_BENEFICIARY_GROUP_DATAS] ({ commit }, { ID, Search, Year }) {
    beginLoading(commit)
    try {
      commit(types.END_LOADING)
      const resp = await Vue.http.get(`beneficiary_group/${ID}/export`, {
        params: { Search, Year }
      })
      await exportBeneficiaryGroupDatas(resp.body.BeneficiaryGroupData)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  }
}

const mutations = {
  [types.GET_BENEFICIARY_GROUPS] (state, list) {
    state.beneficiariesGroupList = [...list]
  },
  [types.GET_BENEFICIARY_GROUP_ITEMS] (state, list) {
    state.beneficiariesGroupItems = [...list]
  },
  [types.CREATE_BENEFICIARY_GROUP] (state, item) {
    state.beneficiariesGroupList.push(item)
  },
  [types.UPDATE_BENEFICIARY_GROUP] (state, item) {
    const index = state.beneficiariesGroupList.findIndex(b => b.ID === item.ID)
    state.beneficiariesGroupList.splice(index, 1, item)
  },
  [types.DELETE_BENEFICIARY_GROUP] (state, ID) {
    const index = state.beneficiariesGroupList.findIndex(b => b.ID === ID)
    state.beneficiariesGroupList.splice(index, 1)
  },
  [types.GET_BENEFICIARY_GROUP_DATAS] (state, payload) {
    state.beneficiaryGroupDatas = [...payload.Datas]
    state.beneficiaryGroupPage = payload.Page
    state.beneficiaryGroupItemsCount = payload.ItemsCount
  }
}

export default { state, actions, mutations }

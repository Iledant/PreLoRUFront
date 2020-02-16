import * as types from './types'
import { beginLoading, setErrorMessage } from './loading'
import { excelReadFile } from '../excel.js'
import Vue from 'vue'

const state = {
  placementList: []
}

const actions = {
  async [types.GET_PLACEMENTS] ({ commit }) {
    try {
      beginLoading(commit)
      let resp = await Vue.http.get('placements')
      commit(types.GET_PLACEMENTS, resp.body.Placement)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.UPDATE_PLACEMENT] ({ commit }, { ID, Comment }) {
    try {
      beginLoading(commit)
      let resp = await Vue.http.put(`placement/${ID}`, { Placement: { Comment } })
      commit(types.UPDATE_PLACEMENT, resp.body.Placement)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.UPLOAD_PLACEMENTS] ({ commit }, file) {
    beginLoading(commit)
    try {
      let sendFunc = d => Vue.http.post('placements', { Placement: d })
      let parseFunc = o => ({
        IrisCode: String(o.IrisCode),
        Count: o.Count ? parseInt(o.Count) : 0,
        ContractYear: o.ContractYear ? parseInt(o.ContractYear) : null
      })
      await excelReadFile(
        file,
        [
          'IrisCode',
          'Count',
          'ContractYear'
        ],
        sendFunc,
        err => {
          setErrorMessage(commit, err)
        },
        parseFunc
      )
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  }
}

const mutations = {
  [types.GET_PLACEMENTS] (state, payload) {
    state.placementList = [...payload]
  },
  [types.UPDATE_PLACEMENT] (state, placement) {
    const index = state.placementList.findIndex(p => p.ID === placement.ID)
    state.placementList.splice(index, 1, placement)
  }
}

export default { state, actions, mutations }

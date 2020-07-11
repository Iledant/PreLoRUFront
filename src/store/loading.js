import * as types from './types'

export function beginLoading (commit) {
  commit(types.BEGIN_LOADING, true)
  commit(types.SET_ERROR_MESSAGE, null)
}

export function setErrorMessage (commit, response) {
  commit(types.END_LOADING)
  let errMsg = ''
  if (typeof response === 'string') {
    errMsg = response
  } else {
    errMsg = response.body
      ? response.body.error
      : 'Impossible de récupérer les données'
  }
  commit(types.SET_ERROR_MESSAGE, errMsg)
}

const state = {
  loading: 0,
  errorMsg: '',
}

const getters = {
  loading: state => state.loading !== 0,
  errorMsg: state => state.errorMsg,
}

const mutations = {
  [types.BEGIN_LOADING] (state) {
    state.loading++
  },
  [types.END_LOADING] (state) {
    if (state.loading > 0) state.loading--
  },
  [types.SET_ERROR_MESSAGE] (state, payload) {
    state.errorMsg = payload
  },
}

export default { state, getters, mutations }

import * as types from './types'
import { beginLoading, setErrorMessage } from './loading'
import Vue from 'vue'

const state = {
  paymentCreditJournal: [],
  paymentCredits: []
}

const actions = {
  async [types.GET_ALL_PAYMENT_CREDITS] ({ commit }, Year) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.get('payment_credits_and_journal', { params: { Year } })
      commit(types.GET_PAYMENT_CREDIT_JOURNAL, body.PaymentCreditJournal)
      commit(types.GET_PAYMENT_CREDITS, body.PaymentCredit)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.UPLOAD_PAYMENT_CREDITS] ({ commit }, { PaymentCredit }) {
    beginLoading(commit)
    try {
      await Vue.http.post('payment_credits', { PaymentCredit })
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.UPLOAD_PAYMENT_CREDIT_JOURNAL] ({ commit }, { PaymentCreditJournal }) {
    beginLoading(commit)
    try {
      await Vue.http.post('payment_credit_journal', { PaymentCreditJournal })
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  }
}

const mutations = {
  [types.GET_PAYMENT_CREDIT_JOURNAL] (state, payload) {
    state.paymentCreditJournal = [...payload]
  },
  [types.GET_PAYMENT_CREDITS] (state, payload) {
    state.paymentCredits = [...payload]
  }
}

export default { state, mutations, actions }

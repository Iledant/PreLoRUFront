import * as types from './types'
import { beginLoading, setErrorMessage } from './loading'
import Vue from 'vue'
import { excelReadFile } from '../excel.js'

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
  async [types.UPLOAD_PAYMENT_CREDITS] ({ commit }, file) {
    beginLoading(commit)
    try {
      const sendFunc = d => Vue.http.post('payment_credits', { PaymentCredit: d })
      const parseFunc = o => ({
        Chapter: Number(o.Chapter),
        Function: Number(o.Function),
        Primitive: parseInt(100 * o.Primitive),
        Reported: parseInt(100 * o.Reported),
        Added: parseInt(100 * o.Added),
        Modified: parseInt(100 * o.Modified),
        Movement: parseInt(100 * o.Movement)
      })
      await excelReadFile(
        file,
        [
          'Chapter',
          'Function',
          'Primitive',
          'Reported',
          'Added',
          'Modified',
          'Movement'
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
  },
  async [types.UPLOAD_PAYMENT_CREDIT_JOURNAL] ({ commit }, file) {
    beginLoading(commit)
    try {
      const sendFunc = d => Vue.http.post('payment_credit_journal', { PaymentCreditJournal: d })
      const parseFunc = o => ({
        Chapter: Number(o.Chapter),
        Function: Number(o.Function),
        CreationDate: parseInt(o.CreationDate),
        ModificationDate: parseInt(o.ModificationDate),
        Name: o.Name,
        Value: parseInt(100 * o.Value)
      })
      await excelReadFile(
        file,
        [
          'Chapter',
          'Function',
          'CreationDate',
          'ModificationDate',
          'Name',
          'Value'
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
  [types.GET_PAYMENT_CREDIT_JOURNAL] (state, payload) {
    state.paymentCreditJournal = [...payload]
  },
  [types.GET_PAYMENT_CREDITS] (state, payload) {
    state.paymentCredits = [...payload]
  }
}

export default { state, mutations, actions }

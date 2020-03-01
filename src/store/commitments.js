import * as types from './types'
import { beginLoading, setErrorMessage } from './loading'
import Vue from 'vue'
import { excelReadFile, excelExport, valStyle, dateStyle } from '../excel.js'

const state = {
  commitmentsList: [],
  commitmentsPage: 0,
  commitmentsItemsCount: 0,
  unlinkedCommitmentsList: [],
  unlinkedCommitmentsPage: 0,
  unlinkedCommitmentsItemsCount: 0
}

async function exportCommitments (commitments) {
  const columns = [
    { header: 'Année', key: 'Year', width: 6 },
    { header: 'Secteur', key: 'Sector', width: 6 },
    { header: 'Action', key: 'ActionName', width: 30 },
    { header: 'Création', key: 'CreationDate', ...dateStyle },
    { header: 'Modification', key: 'ModificationDate', ...dateStyle },
    { header: 'Code', key: 'Code', width: 10 },
    { header: 'Numéro', key: 'Number', width: 10 },
    { header: 'Ligne', key: 'Line', width: 6 },
    { header: 'Libellé', key: 'Name', width: 30 },
    { header: 'Montant', key: 'Value', ...valStyle },
    { header: 'Bénéficiaire', key: 'BeneficiaryName', width: 30 },
    { header: 'Code IRIS', key: 'IrisCode', width: 10 },
    { header: 'Logement', key: 'HousingName', width: 14 },
    { header: 'Copro', key: 'CoproName', width: 14 },
    { header: 'Projet RU', key: 'RenewProjectName', width: 14 }
  ]
  await excelExport(commitments, columns, 'Engagements')
}

async function exportSoldCommitments (commitments) {
  const columns = [
    { header: 'Année', key: 'Year', width: 6 },
    { header: 'Secteur', key: 'Sector', width: 6 },
    { header: 'Action', key: 'ActionCode', width: 12 },
    { header: 'Action', key: 'ActionName', width: 30 },
    { header: 'Création', key: 'CreationDate', ...dateStyle },
    { header: 'Modification', key: 'ModificationDate', ...dateStyle },
    { header: 'Code', key: 'Code', width: 10 },
    { header: 'Numéro', key: 'Number', width: 10 },
    { header: 'Ligne', key: 'Line', width: 6 },
    { header: 'Libellé', key: 'Name', width: 20 },
    { header: 'Montant', key: 'Value', ...valStyle },
    { header: 'Soldé', key: 'SoldOut', ...valStyle },
    { header: 'Bénéficiaire', key: 'Beneficiary', width: 30 },
    { header: 'Code IRIS', key: 'IrisCode', width: 10 }
  ]
  await excelExport(commitments, columns, 'Engagements')
}

const actions = {
  async [types.GET_COMMITMENTS] ({ commit }, { Year, Page, Search }) {
    try {
      beginLoading(commit)
      const resp = await Vue.http.get('commitments/paginated', {
        params: { Year, Page, Search }
      })
      commit(types.GET_COMMITMENTS, resp.body)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.GET_UNLINKED_COMMITMENTS] ({ commit }, { Year, Page, Search }) {
    try {
      beginLoading(commit)
      const { body } = await Vue.http.get('commitments/unlinked', {
        params: { Year, Page, Search }
      })
      commit(types.GET_UNLINKED_COMMITMENTS, body)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.EXPORT_COMMITMENTS] ({ commit }, { Year, Search }) {
    try {
      beginLoading(commit)
      const resp = await Vue.http.get('commitments/export', {
        params: { Year, Search }
      })
      exportCommitments(resp.body.ExportedCommitment)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.UPLOAD_COMMITMENTS] ({ commit }, file) {
    beginLoading(commit)
    try {
      const sendFunc = d => Vue.http.post('commitments', { Commitment: d })
      const parseFunc = d => ({
        Year: Number(d.Year),
        Code: d.Code,
        Number: Number(d.Number),
        Line: Number(d.Line),
        CreationDate: Number(d.CreationDate),
        ModificationDate: Number(d.ModificationDate),
        CaducityDate: d.CaducityDate ? Number(d.CaducityDate) : null,
        Name: d.Name,
        Value: Number(d.Value),
        BeneficiaryCode: Number(d.BeneficiaryCode),
        BeneficiaryName: d.BeneficiaryName,
        IrisCode: d.IrisCode ? String(d.IrisCode) : null,
        Sector: d.Sector,
        ActionCode: d.ActionCode ? Number(d.ActionCode) : null,
        ActionName: d.ActionName,
        SoldOut: d.SoldOut
      })
      await excelReadFile(
        file,
        [
          'Year',
          'Code',
          'Number',
          'Line',
          'CreationDate',
          'ModificationDate',
          'Name',
          'Value',
          'BeneficiaryCode',
          'BeneficiaryName',
          'IrisCode',
          'Sector',
          'ActionCode',
          'ActionName',
          'SoldOut'
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
  async [types.UNLINK_COMMITMENTS] ({ commit }, IDs) {
    beginLoading(commit)
    try {
      await Vue.http.post('commitments/unlink', { IDs })
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.LINK_COMMITMENTS] ({ commit }, payload) {
    beginLoading(commit)
    try {
      const { body } = await Vue.http.post('commitments/link', payload)
      switch (payload.Type) {
        case 'Copro':
          commit(types.GET_COPRO_COMMITMENTS, body.Commitment)
          commit(types.GET_COPRO_PAYMENTS, body.Payment)
          break
        case 'RenewProject':
          commit(types.GET_RENEW_PROJECT_COMMITMENTS, body.Commitment)
          commit(types.GET_RENEW_PROJECT_PAYMENTS, body.Payment)
          break
        case 'Housing':
          commit(types.GET_HOUSING_COMMITMENTS, body.Commitment)
          commit(types.GET_HOUSING_PAYMENTS, body.Payment)
          break
      }
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.EXPORT_ELDEST_COMMITMENTS] ({ commit }) {
    try {
      beginLoading(commit)
      const resp = await Vue.http.get('commitments/eldest')
      const parsed = resp.body.SoldCommitment.map(
        ({ CreationDate, ModificationDate, Value, ...others }) => ({
          CreationDate: new Date(CreationDate),
          ModificationDate: new Date(ModificationDate),
          Value: 0.01 * Value,
          ...others
        }))
      exportSoldCommitments(parsed)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.EXPORT_UNPAID_COMMITMENTS] ({ commit }) {
    try {
      beginLoading(commit)
      const resp = await Vue.http.get('commitments/unpaid')
      const parsed = resp.body.SoldCommitment.map(
        ({ CreationDate, ModificationDate, Value, ...others }) => ({
          CreationDate: new Date(CreationDate),
          ModificationDate: new Date(ModificationDate),
          Value: 0.01 * Value,
          ...others
        }))
      exportSoldCommitments(parsed)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  }
}

const mutations = {
  [types.GET_COMMITMENTS] (state, payload) {
    state.commitmentsList = [...payload.Commitment]
    state.commitmentsPage = payload.Page
    state.commitmentsItemsCount = payload.ItemsCount
  },
  [types.GET_UNLINKED_COMMITMENTS] (state, payload) {
    state.unlinkedCommitmentsList = [...payload.Commitment]
    state.unlinkedCommitmentsPage = payload.Page
    state.unlinkedCommitmentsItemsCount = payload.ItemsCount
  }
}

export default { state, actions, mutations }

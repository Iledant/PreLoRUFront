import * as types from './types'
import { beginLoading, setErrorMessage } from './loading'
import Vue from 'vue'
import { excelReadFile, excelExport, dateStyle, valStyle } from '../excel.js'

const state = {
  reservationFeesList: [],
  reservationFeesPage: 0,
  reservationFeesItemsCount: 0,
  conventionTypesList: [],
  housingCommentsList: [],
  housingTypologiesList: [],
  housingTransfersList: []
}

async function exportReservationFees (reservationFees) {
  const items = reservationFees.map(({ TransferDate, ConventionDate, ...others }) => ({
    TransferDate: TransferDate ? new Date(TransferDate) : null,
    ConventionDate: ConventionDate ? new Date(ConventionDate) : null,
    ...others
  }))
  const columns = [
    { header: 'Bailleur actuel', key: 'CurrentBeneficiary', width: 20 },
    { header: 'Bailleur initial', key: 'FirstBeneficiary', width: 20 },
    { header: 'Code INSEE', key: 'CityCode', width: 10 },
    { header: 'Ville', key: 'City', width: 14 },
    { header: 'Type', key: 'Typology', width: 10 },
    { header: 'Num', key: 'AddressNumber', width: 10 },
    { header: 'Adresse', key: 'AddressStreet', width: 20 },
    { header: 'RPLS', key: 'RPLS', width: 10 },
    { header: 'N° convention', key: 'Convention', width: 14 },
    { header: 'Type LLS', key: 'ConventionType', width: 10 },
    { header: 'Nombre', key: 'Count', width: 10 },
    { header: 'Date cession', key: 'TransferDate', ...dateStyle },
    { header: 'Cession', key: 'Transfer', width: 14 },
    { header: 'PMR ?', key: 'PMR', width: 10 },
    { header: 'Année MES', key: 'EndYear', width: 10 },
    { header: 'Date conv.', key: 'ConventionDate', ...dateStyle },
    { header: 'Réf. ELISE', key: 'EliseRef', width: 10 },
    { header: 'Surface', key: 'Area', ...valStyle },
    { header: 'Loyer', key: 'Loan', ...valStyle },
    { header: 'Charges', key: 'Charges', ...valStyle }
  ]
  await excelExport(items, columns, 'Paiements')
}

const parseFunc = ({
  CurrentBeneficiary,
  CityCode,
  Count,
  TransferDate,
  ConventionDate,
  Convention,
  Area,
  EndYear,
  Loan,
  Charges,
  PMR,
  RPLS,
  AddressNumber,
  ...others
}) => ({
  CurrentBeneficiary: CurrentBeneficiary.trim(),
  CityCode: CityCode ? parseInt(CityCode) : null,
  Count: Count ? parseInt(Count) : null,
  TransferDate: TransferDate ? parseInt(TransferDate) : null,
  ConventionDate: ConventionDate ? parseInt(ConventionDate) : null,
  Area: Area ? parseFloat(Area) : null,
  Loan: Loan ? parseFloat(Loan) : null,
  Charges: Charges ? parseFloat(Charges) : null,
  EndYear: EndYear ? parseInt(EndYear) : null,
  PMR: !!PMR,
  Convention: Convention ? String(Convention) : null,
  RPLS: RPLS ? String(RPLS) : null,
  AddressNumber: AddressNumber ? String(AddressNumber) : null,
  ...others
})

const requiredColumns = [
  'CurrentBeneficiary',
  'FirstBeneficiary',
  'City',
  'AddressNumber',
  'AddressStreet',
  'RPLS',
  'Convention',
  'Typology',
  'ConventionType',
  'Count',
  'Transfer',
  'TransferDate',
  'PMR',
  'Comment',
  'ConventionDate',
  'Area',
  'EndYear',
  'Loan',
  'Charges'
]

const actions = {
  async [types.GET_RESERVATION_FEES] ({ commit }, { Page, Search }) {
    try {
      beginLoading(commit)
      const resp = await Vue.http.get('reservation_fees',
        { params: { Page, Search } })
      commit(types.GET_RESERVATION_FEES, resp.body)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.GET_INITIAL_RESERVATION_FEES] ({ commit }, { Page, Search }) {
    try {
      beginLoading(commit)
      const { body } = await Vue.http.get('reservation_fees/initial',
        { params: { Page, Search } })
      commit(types.GET_RESERVATION_FEES, body)
      commit(types.GET_CITIES, body.City)
      commit(types.GET_ALL_BENEFICIARIES, body.Beneficiary)
      commit(types.GET_HOUSING_COMMENTS, body.HousingComment)
      commit(types.GET_HOUSING_TYPOLOGIES, body.HousingTypology)
      commit(types.GET_HOUSING_TRANSFERS, body.HousingTransfer)
      commit(types.GET_CONVENTION_TYPES, body.ConventionType)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.GET_RESERVATION_FEES_SETTINGS] ({ commit }) {
    try {
      beginLoading(commit)
      const resp = await Vue.http.get('reservation_fees/settings')
      commit(types.GET_HOUSING_COMMENTS, resp.body.HousingComment)
      commit(types.GET_HOUSING_TYPOLOGIES, resp.body.HousingTypology)
      commit(types.GET_HOUSING_TRANSFERS, resp.body.HousingTransfer)
      commit(types.GET_CONVENTION_TYPES, resp.body.ConventionType)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.CREATE_RESERVATION_FEE] ({ commit }, { ReservationFee }) {
    try {
      beginLoading(commit)
      await Vue.http.post('reservation_fee', { ReservationFee })
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.UPDATE_RESERVATION_FEE] ({ commit }, { ReservationFee }) {
    try {
      beginLoading(commit)
      await Vue.http.put('reservation_fee', { ReservationFee })
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.DELETE_RESERVATION_FEE] ({ commit }, ID) {
    try {
      beginLoading(commit)
      await Vue.http.delete(`reservation_fee/${ID}`)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.EXPORT_RESERVATION_FEES] ({ commit }, { Year, Search }) {
    try {
      beginLoading(commit)
      const resp = await Vue.http.get('reservation_fees/export',
        { params: { Search } })
      exportReservationFees(resp.body.ExportedReservationFee)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.UPLOAD_RESERVATION_FEES] ({ commit }, file) {
    beginLoading(commit)
    try {
      const sendFunc = d => Vue.http.post('reservation_fee/batch',
        { ReservationFee: d })
      await excelReadFile(
        file,
        requiredColumns,
        sendFunc,
        err => { setErrorMessage(commit, err) },
        parseFunc
      )
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.TEST_UPLOAD_RESERVATION_FEES] ({ commit }, file) {
    beginLoading(commit)
    try {
      const sendFunc = d => Vue.http.post('reservation_fee/batch/test',
        { ReservationFee: d })
      const resp = await excelReadFile(
        file,
        requiredColumns,
        sendFunc,
        err => { setErrorMessage(commit, err) },
        parseFunc
      )
      commit(types.END_LOADING)
      return resp.body
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.GET_HOUSING_TYPOLOGIES] ({ commit }) {
    try {
      beginLoading(commit)
      const resp = await Vue.http.get('housing_typologies')
      commit(types.GET_HOUSING_TYPOLOGIES, resp.body.HousingTypology)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.GET_HOUSING_COMMENTS] ({ commit }) {
    try {
      beginLoading(commit)
      const resp = await Vue.http.get('housing_comments')
      commit(types.GET_HOUSING_COMMENTS, resp.body.HousingComment)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.GET_CONVENTION_TYPES] ({ commit }) {
    try {
      beginLoading(commit)
      const resp = await Vue.http.get('convention_types')
      commit(types.GET_CONVENTION_TYPES, resp.body.ConventionType)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.GET_HOUSING_TRANSFERS] ({ commit }) {
    try {
      beginLoading(commit)
      const resp = await Vue.http.get('housing_transfers')
      commit(types.GET_HOUSING_TRANSFERS, resp.body.HousingTransfer)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.CREATE_HOUSING_TYPOLOGY] ({ commit }, payload) {
    try {
      beginLoading(commit)
      const resp = await Vue.http.post('housing_typology', { HousingTypology: { ...payload } })
      commit(types.CREATE_HOUSING_TYPOLOGY, resp.body.HousingTypology)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.UPDATE_HOUSING_TYPOLOGY] ({ commit }, payload) {
    try {
      beginLoading(commit)
      const resp = await Vue.http.put('housing_typology', { HousingTypology: { ...payload } })
      commit(types.UPDATE_HOUSING_TYPOLOGY, resp.body.HousingTypology)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.DELETE_HOUSING_TYPOLOGY] ({ commit }, ID) {
    try {
      beginLoading(commit)
      await Vue.http.delete(`housing_typology/${ID}`)
      commit(types.DELETE_HOUSING_TYPOLOGY, ID)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.CREATE_HOUSING_COMMENT] ({ commit }, payload) {
    try {
      beginLoading(commit)
      const resp = await Vue.http.post('housing_comment', { HousingComment: { ...payload } })
      commit(types.CREATE_HOUSING_COMMENT, resp.body.HousingComment)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.UPDATE_HOUSING_COMMENT] ({ commit }, payload) {
    try {
      beginLoading(commit)
      const resp = await Vue.http.put('housing_comment', { HousingComment: { ...payload } })
      commit(types.UPDATE_HOUSING_COMMENT, resp.body.HousingComment)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.DELETE_HOUSING_COMMENT] ({ commit }, ID) {
    try {
      beginLoading(commit)
      await Vue.http.delete(`housing_comment/${ID}`)
      commit(types.DELETE_HOUSING_COMMENT, ID)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.CREATE_HOUSING_TRANSFER] ({ commit }, payload) {
    try {
      beginLoading(commit)
      const resp = await Vue.http.post('housing_transfer', { HousingTransfer: { ...payload } })
      commit(types.CREATE_HOUSING_TRANSFER, resp.body.HousingTransfer)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.UPDATE_HOUSING_TRANSFER] ({ commit }, payload) {
    try {
      beginLoading(commit)
      const resp = await Vue.http.put('housing_transfer', { HousingTransfer: { ...payload } })
      commit(types.UPDATE_HOUSING_TRANSFER, resp.body.HousingTransfer)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.DELETE_HOUSING_TRANSFER] ({ commit }, ID) {
    try {
      beginLoading(commit)
      await Vue.http.delete(`housing_transfer/${ID}`)
      commit(types.DELETE_HOUSING_TRANSFER, ID)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.CREATE_CONVENTION_TYPE] ({ commit }, payload) {
    try {
      beginLoading(commit)
      const resp = await Vue.http.post('convention_type', { ConventionType: { ...payload } })
      commit(types.CREATE_CONVENTION_TYPE, resp.body.ConventionType)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.UPDATE_CONVENTION_TYPE] ({ commit }, payload) {
    try {
      beginLoading(commit)
      const resp = await Vue.http.put('convention_type', { ConventionType: { ...payload } })
      commit(types.UPDATE_CONVENTION_TYPE, resp.body.ConventionType)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  },
  async [types.DELETE_CONVENTION_TYPE] ({ commit }, ID) {
    try {
      beginLoading(commit)
      await Vue.http.delete(`convention_type/${ID}`)
      commit(types.DELETE_CONVENTION_TYPE, ID)
      commit(types.END_LOADING)
    } catch (err) {
      setErrorMessage(commit, err)
    }
  }
}

const mutations = {
  [types.GET_RESERVATION_FEES] (state, payload) {
    state.reservationFeesList = [...payload.ReservationFee]
    state.reservationFeesPage = payload.Page
    state.reservationFeesItemsCount = payload.ItemsCount
  },
  [types.GET_HOUSING_TYPOLOGIES] (state, payload) {
    state.housingTypologiesList = [...payload]
  },
  [types.GET_HOUSING_COMMENTS] (state, payload) {
    state.housingCommentsList = [...payload]
  },
  [types.GET_CONVENTION_TYPES] (state, payload) {
    state.conventionTypesList = [...payload]
  },
  [types.GET_HOUSING_TRANSFERS] (state, payload) {
    state.housingTransfersList = [...payload]
  },
  [types.CREATE_HOUSING_TYPOLOGY] (state, payload) {
    state.housingTypologiesList.push(payload)
  },
  [types.UPDATE_HOUSING_TYPOLOGY] (state, payload) {
    const index = state.housingTypologiesList.findIndex(h => h.ID === payload.ID)
    state.housingTypologiesList.splice(index, 1, payload)
  },
  [types.DELETE_HOUSING_TYPOLOGY] (state, ID) {
    const index = state.housingTypologiesList.findIndex(h => h.ID === ID)
    state.housingTypologiesList.splice(index, 1)
  },
  [types.CREATE_HOUSING_TRANSFER] (state, payload) {
    state.housingTransfersList.push(payload)
  },
  [types.UPDATE_HOUSING_TRANSFER] (state, payload) {
    const index = state.housingTransfersList.findIndex(h => h.ID === payload.ID)
    state.housingTransfersList.splice(index, 1, payload)
  },
  [types.DELETE_HOUSING_TRANSFER] (state, ID) {
    const index = state.housingTransfersList.findIndex(h => h.ID === ID)
    state.housingTransfersList.splice(index, 1)
  },
  [types.CREATE_HOUSING_COMMENT] (state, payload) {
    state.housingCommentsList.push(payload)
  },
  [types.UPDATE_HOUSING_COMMENT] (state, payload) {
    const index = state.housingCommentsList.findIndex(h => h.ID === payload.ID)
    state.housingCommentsList.splice(index, 1, payload)
  },
  [types.DELETE_HOUSING_COMMENT] (state, ID) {
    const index = state.housingCommentsList.findIndex(h => h.ID === ID)
    state.housingCommentsList.splice(index, 1)
  },
  [types.CREATE_CONVENTION_TYPE] (state, payload) {
    state.conventionTypesList.push(payload)
  },
  [types.UPDATE_CONVENTION_TYPE] (state, payload) {
    const index = state.conventionTypesList.findIndex(h => h.ID === payload.ID)
    state.conventionTypesList.splice(index, 1, payload)
  },
  [types.DELETE_CONVENTION_TYPE] (state, ID) {
    const index = state.conventionTypesList.findIndex(h => h.ID === ID)
    state.conventionTypesList.splice(index, 1)
  }
}

export default { state, actions, mutations }

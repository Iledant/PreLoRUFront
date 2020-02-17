import * as types from './types'
import Vue from 'vue'
import { beginLoading, setErrorMessage } from './loading.js'

const state = {
  token: null,
  user: null,
  rights: 0,
  allMenuItems: [
    {
      id: 1,
      title: 'Accueil',
      icon: 'home',
      routerLink: { name: 'Home' },
      allowUser: true,
      allowObserver: true,
      needReservationRight: false
    },
    {
      id: 2,
      title: 'Logement social',
      icon: 'location_city',
      routerLink: { name: 'Housings' },
      allowUser: true,
      allowObserver: true,
      needReservationRight: false
    },
    {
      id: 3,
      title: 'Contingent régional',
      icon: 'folder_shared',
      routerLink: { name: 'ReservationFees' },
      allowUser: false,
      allowObserver: false,
      needReservationRight: true
    },
    {
      id: 4,
      title: 'Copropriétés',
      icon: 'domain',
      routerLink: { name: 'Copros' },
      allowUser: true,
      allowObserver: true,
      needReservationRight: false
    },
    {
      id: 5,
      title: 'Renouvellement urbain',
      icon: 'domain_disabled',
      routerLink: { name: 'RenewProjects' },
      allowUser: true,
      allowObserver: true,
      needReservationRight: false
    },
    {
      id: 6,
      title: 'Bénéficiaires',
      icon: 'person_outline',
      routerLink: { name: 'Beneficiaries' },
      allowUser: true,
      allowObserver: true,
      needReservationRight: false
    },
    {
      id: 7,
      title: 'Groupes de bénéficiaires',
      icon: 'people_outline',
      routerLink: { name: 'BeneficiaryGroups' },
      allowUser: true,
      allowObserver: true,
      needReservationRight: false
    },
    {
      id: 8,
      title: 'Stagiaires',
      icon: 'people',
      routerLink: { name: 'Placement' },
      allowUser: true,
      allowObserver: true,
      needReservationRight: false
    },
    {
      id: 9,
      title: 'Programmation',
      icon: 'assignment_turned_in',
      routerLink: { name: 'Programmation' },
      allowUser: true,
      allowObserver: true,
      needReservationRight: false
    },
    {
      id: 10,
      title: 'Prévisions d\'AP',
      icon: 'trending_up',
      routerLink: { name: 'Forecasts' },
      allowUser: true,
      allowObserver: true,
      needReservationRight: false
    },
    {
      id: 11,
      title: 'Prévisions de CP',
      icon: 'timeline',
      routerLink: { name: 'PaymentForecast' },
      allowUser: true,
      allowObserver: true,
      needReservationRight: false
    },
    {
      id: 12,
      title: 'Synthèses territoriales',
      icon: 'map',
      routerLink: { name: 'Summaries' },
      allowUser: true,
      allowObserver: true,
      needReservationRight: false
    }
  ],
  settingsMenuItems: [
    {
      id: 1,
      title: 'Utilisateurs',
      icon: 'people',
      routerLink: { name: 'Users' }
    },
    {
      id: 2,
      title: 'Secteurs budgétaires',
      icon: 'pie_chart',
      routerLink: { name: 'BudgetSector' }
    },
    {
      id: 3,
      title: 'Actions budgétaires',
      icon: 'bookmarks',
      routerLink: { name: 'BudgetAction' }
    },
    {
      id: 4,
      title: 'Commissions',
      icon: 'calendar_today',
      routerLink: { name: 'Commission' }
    },
    {
      id: 5,
      title: 'Intercommunalités',
      icon: 'layers',
      routerLink: { name: 'Communities' }
    },
    {
      id: 6,
      title: 'Communes',
      icon: 'account_balance',
      routerLink: { name: 'Cities' }
    },
    {
      id: 7,
      title: 'RPLS',
      icon: 'equalizer',
      routerLink: { name: 'RPLS' }
    },
    {
      id: 8,
      title: 'Logement social',
      icon: 'location_city',
      routerLink: { name: 'HousingSettings' }
    },
    {
      id: 9,
      title: 'Contingent régional',
      icon: 'folder_shared',
      routerLink: { name: 'ReservationFeeSettings' }
    },
    {
      id: 10,
      title: 'Engagements',
      icon: 'assignment_turned_in',
      routerLink: { name: 'Commitments' }
    },
    {
      id: 11,
      title: 'Paiements',
      icon: 'credit_card',
      routerLink: { name: 'Payments' }
    }
  ]
}

// Rights bits and masks
const ActiveRightBit = 1
const SuperAdminRightBit = 1 << 1
const AdminRightBit = 1 << 2
const CoproRightBit = 1 << 3
const RenewProjectRightBit = 1 << 4
const ObserverRightBit = 1 << 5
const HousingBit = 1 << 6
const PreProgBit = 1 << 7
const ReservationBit = 1 << 8
const ActiveAdminRight = ActiveRightBit | AdminRightBit
const ActiveObserverRight = ActiveRightBit | ObserverRightBit
const ActiveCoproRight = ActiveRightBit | CoproRightBit
const ActiveCoproPreProgRight = ActiveRightBit | CoproRightBit | PreProgBit
const ActiveRenewProjectRight = ActiveRightBit | RenewProjectRightBit
const ActiveRenewProjectPreProgRight = ActiveRightBit | RenewProjectRightBit | PreProgBit
const ActiveHousingRight = ActiveRightBit | HousingBit
const ActiveHousingPreProgRight = ActiveRightBit | HousingBit | PreProgBit
const ActiveReservationRight = ActiveRightBit | ReservationBit

const getters = {
  isAdmin: state =>
    state.rights & SuperAdminRightBit ||
    (state.rights & ActiveAdminRight) === ActiveAdminRight,
  isUser: state =>
    state.rights & ActiveRightBit && (state.rights & ObserverRightBit) === 0,
  isObserver: state =>
    (state.rights & ActiveObserverRight) === ActiveObserverRight,
  hasCoproRight: state =>
    state.rights & SuperAdminRightBit ||
    (state.rights & ActiveAdminRight) === ActiveAdminRight ||
    (state.rights & ActiveCoproRight) === ActiveCoproRight,
  hasCoproPreProgRight: state =>
    state.rights & SuperAdminRightBit ||
    (state.rights & ActiveAdminRight) === ActiveAdminRight ||
    (state.rights & ActiveCoproPreProgRight) === ActiveCoproPreProgRight,
  hasRenewProjectRight: state =>
    state.rights & SuperAdminRightBit ||
    (state.rights & ActiveAdminRight) === ActiveAdminRight ||
    (state.rights & ActiveRenewProjectRight) === ActiveRenewProjectRight,
  hasRenewProjectPreProgRight: state =>
    state.rights & SuperAdminRightBit ||
    (state.rights & ActiveAdminRight) === ActiveAdminRight ||
    (state.rights & ActiveRenewProjectPreProgRight) === ActiveRenewProjectPreProgRight,
  hasHousingRight: state =>
    state.rights & SuperAdminRightBit ||
    (state.rights & ActiveAdminRight) === ActiveAdminRight ||
    (state.rights & ActiveHousingRight) === ActiveHousingRight,
  hasHousingPreProgRight: state =>
    state.rights & SuperAdminRightBit ||
    (state.rights & ActiveAdminRight) === ActiveAdminRight ||
    (state.rights & ActiveHousingPreProgRight) === ActiveHousingPreProgRight,
  hasReservationRight: state =>
    state.rights & SuperAdminRightBit ||
    (state.rights & ActiveAdminRight) === ActiveAdminRight ||
    (state.rights & ActiveReservationRight) === ActiveReservationRight,
  menuItems: (state, getters) =>
    state.allMenuItems.filter(
      i =>
        getters.isAdmin ||
        getters.isSuperAdmin ||
        (getters.isObserver && i.allowObserver) ||
        (getters.isUser && i.allowUser) ||
        (getters.hasReservationRight && i.needReservationRight)
    )
}

const actions = {
  async [types.LOG_IN] ({ commit }, { email, password }) {
    beginLoading(commit)
    try {
      const response = await Vue.http.post('user/login', { email, password })
      commit(types.SET_TOKEN, response.body)
      commit(types.END_LOADING)
    } catch (response) {
      if (response.status === 401) {
        setErrorMessage(commit, 'Erreur de login ou de mot de passe')
      } else if (response.status === 403) {
        setErrorMessage(commit, 'Compte non activé par un administrateur')
      } else setErrorMessage(commit, 'Erreur de connexion')
    }
  },
  async [types.LOG_OUT] ({ commit }) {
    beginLoading(commit)
    commit(types.DEL_TOKEN)
    try {
      await Vue.http.post('user/logout')
      commit(types.END_LOADING)
    } catch (response) {
      setErrorMessage(commit, response.body.error)
    }
  }
}

// mutations
const mutations = {
  [types.RETRIEVE_TOKEN] (state) {
    state.token = window.localStorage.getItem('PreloruToken')
    Vue.http.headers.common.Authorization = 'Bearer ' + state.token
    const name = window.localStorage.getItem('PreloruUserName')
    state.user = name ? { Name: name } : null
    const sRights = window.localStorage.getItem('PreloruRights')
    state.rights = sRights ? Number(sRights) : 0
  },
  [types.SET_TOKEN] (state, payload) {
    state.token = payload.Token
    state.user = payload.User
    state.rights = payload.User.Rights
    Vue.http.headers.common.Authorization = 'Bearer ' + payload.Token
    window.localStorage.setItem('PreloruToken', payload.Token)
    window.localStorage.setItem('PreloruUserName', payload.User.Name)
    window.localStorage.setItem('PreloruRights', state.rights)
  },
  [types.DEL_TOKEN] (state) {
    window.localStorage.removeItem('PreloruToken')
    window.localStorage.removeItem('PreloruUserName')
    window.localStorage.removeItem('PreloruRights')
    state.token = null
    state.user = null
    state.rights = 0
    Vue.http.headers.common.Authorization = ''
  },
  [types.REFRESH_TOKEN] (state, { token }) {
    state.token = token
    Vue.http.headers.common.Authorization = 'Bearer ' + token
    window.localStorage.setItem('PreloruToken', token)
  }
}

export default { state, mutations, getters, actions }

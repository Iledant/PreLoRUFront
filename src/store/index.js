import Vue from 'vue'
import Vuex from 'vuex'

import token from './token'
import loading from './loading'
import users from './users'
import housings from './housings'
import copros from './copros'
import renewProjects from './renew_projects'
import settings from './settings'
import cities from './cities'
import communities from './communities'
import commitments from './commitments'
import payments from './payments'
import beneficiaries from './beneficiaries'
import home from './home'
import beneficiary from './beneficiary'
import ratios from './ratios'
import pmtForecasts from './pmtForecasts'
import renewProject from './renew_project'
import copro from './copro'
import cmtForecasts from './cmtForecasts'
import rpEventTypes from './rpEventTypes'
import summaries from './summaries'
import preProg from './preProg'
import prog from './prog'
import rpls from './rpls'
import coproEventTypes from './coproEventTypes'
import paymentCredit from './paymentCredit'
import placement from './placement'
import beneficiaryGroup from './beneficiaryGroup'
import reservationFees from './reservationFees'
import housingTypes from './housingTypes'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    loading,
    token,
    users,
    housings,
    copros,
    renewProjects,
    settings,
    cities,
    communities,
    commitments,
    payments,
    beneficiaries,
    home,
    beneficiary,
    ratios,
    pmtForecasts,
    renewProject,
    copro,
    cmtForecasts,
    rpEventTypes,
    summaries,
    preProg,
    prog,
    rpls,
    coproEventTypes,
    paymentCredit,
    placement,
    beneficiaryGroup,
    reservationFees,
    housingTypes
  }
})

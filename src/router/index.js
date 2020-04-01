import Vue from 'vue'
import Router from 'vue-router'
import Users from '@/components/Settings/Users.vue'
import Housings from '@/components/Housings.vue'
import Copros from '@/components/Copros.vue'
import RenewProjects from '@/components/RenewProjects.vue'
import Home from '@/components/Home.vue'
import Beneficiaries from '@/components/Beneficiaries.vue'
import Beneficiary from '@/components/Beneficiary.vue'
import Forecasts from '@/components/Forecasts.vue'
import RenewProject from '@/components/RenewProject.vue'
import Copro from '@/components/Copro.vue'
import BudgetSector from '@/components/Settings/BudgetSector.vue'
import BudgetAction from '@/components/Settings/BudgetAction.vue'
import Commission from '@/components/Settings/Commission.vue'
import Communities from '@/components/Settings/Communities.vue'
import Cities from '@/components/Settings/Cities.vue'
import Commitments from '@/components/Settings/Commitments.vue'
import Payments from '@/components/Settings/Payments.vue'
import Housing from '@/components/Housing.vue'
import Summaries from '@/components/Summaries.vue'
import Programmation from '@/components/Programmation.vue'
import RPLS from '@/components/Settings/RPLS.vue'
import Placement from '@/components/Placement.vue'
import BeneficiaryGroups from '@/components/BeneficiaryGroups.vue'
import BeneficiaryGroup from '@/components/BeneficiaryGroup.vue'
import ReservationFees from '@/components/ReservationFees.vue'
import ReservationFeeSettings from '@/components/Settings/ReservationFeeSettings.vue'
import PaymentForecast from '@/components/PaymentForecast.vue'
import HousingSettings from '@/components/Settings/HousingSettings.vue'
import PaymentDemands from '@/components/Settings/PaymentDemands.vue'
import Uploads from '@/components/Settings/Uploads.vue'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', component: Home, name: 'Home' },
    {
      path: '/users',
      component: Users,
      name: 'Users',
      meta: { requiresAdmin: true }
    },
    { path: '/housings', component: Housings, name: 'Housings' },
    { path: '/housing/:ID', component: Housing, name: 'Housing' },
    { path: '/copros', component: Copros, name: 'Copros' },
    {
      path: '/renew_projects',
      component: RenewProjects,
      name: 'RenewProjects'
    },
    { path: '/beneficiaries', component: Beneficiaries, name: 'Beneficiaries' },
    { path: '/beneficiary/:ID', component: Beneficiary, name: 'Beneficiary' },
    { path: '/forecasts', component: Forecasts, name: 'Forecasts' },
    {
      path: '/payment_forecast',
      component: PaymentForecast,
      name: 'PaymentForecast'
    },
    { path: '/renew_project/:ID', component: RenewProject, name: 'RenewProject' },
    { path: '/copro/:ID', component: Copro, name: 'Copro' },
    { path: '/sector', component: BudgetSector, name: 'BudgetSector' },
    { path: '/action', component: BudgetAction, name: 'BudgetAction' },
    {
      path: '/commission',
      component: Commission,
      name: 'Commission',
      meta: { requiresAdmin: true }
    },
    {
      path: '/communities',
      component: Communities,
      name: 'Communities',
      meta: { requiresAdmin: true }
    },
    {
      path: '/cities',
      component: Cities,
      name: 'Cities',
      meta: { requiresAdmin: true }
    },
    { path: '/commitments', component: Commitments, name: 'Commitments' },
    { path: '/payments', component: Payments, name: 'Payments' },
    { path: '/summaries', component: Summaries, name: 'Summaries' },
    { path: '/programmation', component: Programmation, name: 'Programmation' },
    {
      path: '/rpls',
      component: RPLS,
      name: 'RPLS',
      meta: { requiresAdmin: true }
    },
    { path: '/placement', component: Placement, name: 'Placement' },
    {
      path: '/beneficiary_groups',
      component: BeneficiaryGroups,
      name: 'BeneficiaryGroups'
    },
    {
      path: '/beneficiary_group/:ID',
      component: BeneficiaryGroup,
      name: 'BeneficiaryGroup'
    },
    {
      path: '/reservation_fees',
      component: ReservationFees,
      name: 'ReservationFees',
      meta: { requiresReservation: true }
    },
    {
      path: '/reservation_fee_settings',
      component: ReservationFeeSettings,
      name: 'ReservationFeeSettings',
      meta: { requiresAdmin: true }
    },
    {
      path: '/housing_settings',
      component: HousingSettings,
      name: 'HousingSettings',
      meta: { requiresAdmin: true }
    },
    {
      path: '/payment_demands',
      component: PaymentDemands,
      name: 'PaymentDemands',
      meta: { requiresAdmin: true }
    },
    {
      path: '/uploads',
      component: Uploads,
      name: 'Uploads',
      meta: { requiresAdmin: true }
    }
  ]
})

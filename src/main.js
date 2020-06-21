import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import * as types from './store/types'
import VueResource from 'vue-resource'
import VueCurrencyInput from 'vue-currency-input'
import {
  bool2Str,
  nullable,
  date,
  currency,
  nullIndex,
  percentage,
  number,
  displayBool,
  float2Euros,
  trim50,
  shortDate,
  float2MEuros
} from './filters.js'
import vueDebounce from 'vue-debounce'

Vue.use(VueResource)
Vue.use(vueDebounce)
Vue.use(VueCurrencyInput, {
  globalOptions: { locale: 'fr-FR', distractionFree: false, min: 0 }
})

// API route is defined in .env
Vue.http.options.root = '/api'

// Check token and root to a safe place and renew token if necessary
Vue.http.interceptors.push((request, next) => {
  next(response => {
    const error = response.body.error
    if (types.TOKEN_ERROR_MESSAGES.includes(error)) {
      store.commit(types.DEL_TOKEN)
      store.commit(types.SET_ERROR_MESSAGE, 'Erreur de connexion, merci de vous identifier')
    }
    const Authorization = response.headers.get('Authorization')
    if (Authorization) {
      const token = Authorization.replace('Bearer ', '')
      store.commit(types.REFRESH_TOKEN, { token })
    }
  })
})

// Route guards
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    if (!store.getters.isAdmin) {
      next({ name: 'Home' })
    } else {
      next()
    }
  } else {
    if (to.matched.some(record => record.meta.requiresReservation)) {
      if (!store.getters.hasReservationRight) {
        next({ name: 'Home' })
      } else {
        next()
      }
    } else {
      next()
    }
  }
})

// Set global filters
Vue.filter('bool2Str', bool2Str)
Vue.filter('nullable', nullable)
Vue.filter('date', date)
Vue.filter('currency', currency)
Vue.filter('nullIndex', nullIndex)
Vue.filter('percentage', percentage)
Vue.filter('number', number)
Vue.filter('displayBool', displayBool)
Vue.filter('float2Euros', float2Euros)
Vue.filter('trim50', trim50)
Vue.filter('shortDate', shortDate)
Vue.filter('float2MEuros', float2MEuros)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

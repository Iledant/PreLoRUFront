<template>
  <v-card>
    <v-card-title class="white--text primary text-h5">Prévisions de CP</v-card-title>
    <v-tabs v-model="active" slider-color="tertiary" background-color="primary" dark centered>
      <v-tab ripple>Prévisions par ratios</v-tab>
      <v-tab-item>
        <PaymentForecasts />
      </v-tab-item>
      <v-tab ripple>Prévisions par RAM</v-tab>
      <v-tab-item>
        <DifPaymentForecasts />
      </v-tab-item>
      <v-tab ripple>Enveloppes de CP</v-tab>
      <v-tab-item>
        <payment-credit />
      </v-tab-item>
      <v-tab ripple>Ratios AP CP</v-tab>
      <v-tab-item>
        <Ratios />
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import Ratios from './PaymentForecast/Ratios.vue'
import PaymentForecasts from './PaymentForecast/PaymentForecasts.vue'
import DifPaymentForecasts from './PaymentForecast/DifPaymentForecasts.vue'
import PaymentCredit from './PaymentForecast/PaymentCredit.vue'
export default {
  name: 'PaymentForecast',
  components: { PaymentForecasts, PaymentCredit, Ratios, DifPaymentForecasts },
  data () {
    return {
      active: null,
    }
  },
}
</script>

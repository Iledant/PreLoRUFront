<template>
  <v-card>
    <v-card-title class="white--text primary headline">Prévisions</v-card-title>
    <v-tabs v-model="active" slider-color="tertiary" background-color="primary" dark centered>
      <v-tab ripple>Prévisions AP</v-tab>
      <v-tab-item>
        <CommitmentForecasts />
      </v-tab-item>
      <v-tab ripple>Prévisions CP</v-tab>
      <v-tab-item>
        <PaymentForecasts />
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
import Ratios from './Ratios.vue'
import PaymentForecasts from './PaymentForecasts.vue'
import CommitmentForecasts from './CommitmentForecasts.vue'
import PaymentCredit from './PaymentCredit.vue'
export default {
  name: 'Forecasts',
  components: { Ratios, PaymentForecasts, CommitmentForecasts, PaymentCredit },
  data () {
    return {
      active: null
    }
  }
}
</script>

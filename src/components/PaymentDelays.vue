<template>
  <v-card>
    <v-card-title class="primary title white--text">Délais de mandatement</v-card-title>
    <v-container fluid class="pa-0">
      <v-tabs v-model="activeTab" background-color="secondary" slider-color="primary" centered>
        <v-tab ripple>Evolution</v-tab>
        <v-tab-item>
          <delay-chart />
        </v-tab-item>
        <v-tab ripple>Distribution</v-tab>
        <v-tab-item>
          <delay-distribution />
        </v-tab-item>
        <v-tab ripple>Stock de CSF</v-tab>
        <v-tab-item>
          <demands-stock />
        </v-tab-item>
      </v-tabs>
    </v-container>
  </v-card>
</template>

<script>
import DelayDistribution from './PaymentDelays/DelayDistribution.vue'
import DelayChart from './PaymentDelays/DelayChart.vue'
import DemandsStock from './PaymentDelays/DemandsStock.vue'
export default {
  name: 'PaymentDelays',
  components: { DelayDistribution, DelayChart, DemandsStock },
  data () {
    return {
      activeTab: null,
    }
  },
}
</script>

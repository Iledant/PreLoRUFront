<template>
  <v-card>
    <v-card-title class="white--text primary text-h5">Prévisions d'AP</v-card-title>
    <v-tabs v-model="active" slider-color="tertiary" background-color="primary" dark centered>
      <v-tab ripple>Prévisions pluriannuelles</v-tab>
      <v-tab-item>
        <CommitmentForecasts />
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import CommitmentForecasts from './Forecasts/CommitmentForecasts.vue'
export default {
  name: 'Forecasts',
  components: { CommitmentForecasts },
  data () {
    return {
      active: null
    }
  }
}
</script>

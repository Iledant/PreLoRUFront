<template>
  <v-card>
    <v-card-title class="white--text primary">Logement social</v-card-title>

    <v-tabs
      v-model="active"
      background-color="primary"
      slider-color="tertiary"
      centered
      dark
    >
      <v-tab ripple>Programmes</v-tab>
      <v-tab-item><housings-card /></v-tab-item>
      <v-tab>Besoins</v-tab>
      <v-tab-item><housing-forecast-card /></v-tab-item>
      <v-tab>Préprogrammation</v-tab>
      <v-tab-item><housing-pre-prog-card /></v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import HousingsCard from './Housings/HousingsCard.vue'
import HousingForecastCard from './Housings/HousingForecastCard.vue'
import HousingPreProgCard from './Housings/HousingPreProgCard.vue'
import * as types from '@/store/types.js'
export default {
  name: 'Housings',
  components: { HousingsCard, HousingForecastCard, HousingPreProgCard },
  data () {
    return {
      active: null
    }
  },
  created () {
    this.$store.dispatch(types.GET_HOUSINGS_DATAS)
  }
}
</script>

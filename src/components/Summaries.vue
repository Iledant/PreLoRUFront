<template>
  <v-card>
    <v-card-title class="white--text primary">Synthèses territoriales</v-card-title>

    <v-tabs v-model="active" background-color="primary" slider-color="tertiary" centered dark>
      <v-tab ripple>Départements</v-tab>
      <v-tab-item>
        <dpt-report />
      </v-tab-item>
      <v-tab>Communes</v-tab>
      <v-tab-item>
        <city-report />
      </v-tab-item>
      <v-tab>RPLS</v-tab>
      <v-tab-item>
        <rpls-report />
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import * as types from '@/store/types'
import DptReport from './Summaries/DptReport'
import CityReport from './Summaries/CityReport'
import RplsReport from './Summaries/RplsReport'
export default {
  name: 'Summaries',
  components: { DptReport, CityReport, RplsReport },
  data () {
    return {
      active: null
    }
  },
  created () {
    this.$store.dispatch(types.GET_SUMMARIES_DATAS)
  }
}
</script>

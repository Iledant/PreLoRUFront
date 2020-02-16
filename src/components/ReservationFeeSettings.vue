<template>
  <v-card>
    <v-card-title class="white--text primary headline">Administration des droits de réservation</v-card-title>
    <v-tabs v-model="tab" dark background-color="primary" slider-color="tertiary" centered>
      <v-tab>Typologies</v-tab>
      <v-tab-item>
        <housing-typologies />
      </v-tab-item>
      <v-tab ripple>Commentaires</v-tab>
      <v-tab-item>
        <housing-comments />
      </v-tab-item>
      <v-tab ripple>Cessions</v-tab>
      <v-tab-item>
        <housing-transfers />
      </v-tab-item>
      <v-tab ripple>Types de conventions</v-tab>
      <v-tab-item>
        <convention-types />
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import * as types from '../store/types.js'
import HousingTypologies from './HousingTypologies.vue'
import HousingComments from './HousingComments.vue'
import HousingTransfers from './HousingTransfers.vue'
import ConventionTypes from './ConventionTypes.vue'
export default {
  name: 'ReservationFeeSettings',
  components: { HousingTypologies, HousingComments, HousingTransfers, ConventionTypes },
  data () {
    return {
      tab: null
    }
  },
  created () {
    this.$store.dispatch(types.GET_RESERVATION_FEES_SETTINGS)
  }
}
</script>

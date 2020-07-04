<template>
  <v-card>
    <v-card-title class="white--text primary text-h5">Copropriétés</v-card-title>
    <v-tabs v-model="tab" dark background-color="primary" slider-color="tertiary" centered>
      <v-tab>Opérations</v-tab>
      <v-tab-item>
        <copros-card />
      </v-tab-item>
      <v-tab ripple>Événements type</v-tab>
      <v-tab-item>
        <copro-event-types />
      </v-tab-item>
      <v-tab>Préprogrammation</v-tab>
      <v-tab-item>
        <copro-pre-prog-card />
      </v-tab-item>
      <v-tab>Pluriannuel</v-tab>
      <v-tab-item>
        <copro-report />
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import * as types from '@/store/types.js'
import CoprosCard from './Copros/CoprosCard'
import CoproPreProgCard from './Copros/CoproPreProgCard.vue'
import CoproEventTypes from './Copros/CoproEventTypes.vue'
import CoproReport from './Copros/CoproReport.vue'
export default {
  name: 'Copros',
  components: { CoprosCard, CoproPreProgCard, CoproEventTypes, CoproReport },
  data () {
    return {
      tab: null
    }
  },
  created () {
    this.$store.dispatch(types.GET_COPROS)
  }
}
</script>

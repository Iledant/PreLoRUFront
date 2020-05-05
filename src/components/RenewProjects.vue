<template>
  <v-card>
    <v-card-title class="white--text primary">Projets de renouvellement urbain</v-card-title>
    <v-tabs v-model="active" background-color="primary" slider-color="tertiary" centered dark>
      <v-tab ripple>Projets</v-tab>
      <v-tab-item>
        <renew-projects-card />
      </v-tab-item>
      <v-tab ripple>Événements type</v-tab>
      <v-tab-item>
        <r-p-event-types />
      </v-tab-item>
      <v-tab ripple>Préprogrammation</v-tab>
      <v-tab-item>
        <renew-projects-pre-prog-card />
      </v-tab-item>
      <v-tab ripple>Pluriannuel</v-tab>
      <v-tab-item>
        <renew-project-report />
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import * as types from '@/store/types.js'
import RPEventTypes from './RenewProjects/RPEventTypes.vue'
import RenewProjectsCard from './RenewProjects/RenewProjectsCard.vue'
import RenewProjectsPreProgCard from './RenewProjects/RenewProjectsPreProgCard.vue'
import RenewProjectReport from './RenewProjects/RenewProjectReport.vue'
export default {
  name: 'RenewProjects',
  components: { RenewProjectsCard, RPEventTypes, RenewProjectsPreProgCard, RenewProjectReport },
  data () {
    return {
      active: null
    }
  },
  created () {
    this.$store.dispatch(types.GET_RENEW_PROJECTS)
  }
}
</script>

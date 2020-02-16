<template>
  <v-card>
    <v-card-title class="white--text primary headline">
      [{{ project ? project.Reference : '' }}]
      {{ project ? project.Name : '' }}
    </v-card-title>
    <v-tabs background-color="primary" v-model="active" slider-color="tertiary" dark centered>
      <v-tab ripple>Description</v-tab>
      <v-tab-item>
        <renew-project-card :project="project" />
      </v-tab-item>
      <v-tab ripple>Événements</v-tab>
      <v-tab-item>
        <renew-project-events />
      </v-tab-item>
      <v-tab ripple>Engagements</v-tab>
      <v-tab-item>
        <commitments-card
          :commitments="commitments"
          :loading="loading"
          :fileName="project ? project.Reference : ''"
        />
      </v-tab-item>
      <v-tab ripple>Paiements</v-tab>
      <v-tab-item>
        <payments-card
          :payments="payments"
          :loading="loading"
          :fileName="project ? project.Reference : ''"
        />
      </v-tab-item>
      <v-tab ripple>Besoins</v-tab>
      <v-tab-item>
        <renew-project-forecast />
      </v-tab-item>
      <v-tab ripple>Engagements par ville</v-tab>
      <v-tab-item>
        <renew-project-cmt-city-join />
      </v-tab-item>
      <v-tab ripple>Rattachements</v-tab>
      <v-tab-item>
        <unlinked-commitment
          :destID="project ? project.ID : 0"
          type="RenewProject"
          :allowLink="hasRenewProjectRight"
        />
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>
<script>
import * as types from '../store/types'
import UnlinkedCommitment from './UnlinkedCommitments.vue'
import CommitmentsCard from './CommitmentsCard.vue'
import PaymentsCard from './PaymentsCard'
import RenewProjectForecast from './RenewProjectForecast'
import RenewProjectEvents from './RenewProjectEvents'
import RenewProjectCmtCityJoin from './RenewProjectCmtCityJoin'
import RenewProjectCard from './RenewProjectCard'
export default {
  name: 'RenewProject',
  components: {
    UnlinkedCommitment,
    CommitmentsCard,
    RenewProjectForecast,
    PaymentsCard,
    RenewProjectEvents,
    RenewProjectCmtCityJoin,
    RenewProjectCard
  },
  data () {
    return {
      active: null
    }
  },
  computed: {
    project () {
      return this.$store.state.renewProject.renewProject
    },
    loading () {
      return this.$store.getters.loading
    },
    commitments () {
      return this.$store.state.renewProject.rpCommitments
    },
    payments () {
      return this.$store.state.renewProject.rpPayments
    },
    hasRenewProjectRight () {
      return this.$store.getters.hasRenewProjectRight
    }
  },
  created () {
    this.$store.dispatch(types.GET_RENEW_PROJECT_DATAS, this.$route.params.ID)
  }
}
</script>

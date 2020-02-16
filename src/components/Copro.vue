<template>
  <v-card>
    <v-card-title class="white--text primary headline">
      [{{ project ? project.Reference : '' }}]
      {{ project ? project.Name : '' }}
    </v-card-title>
    <v-container fluid class="pa-0">
      <v-layout wrap>
        <v-flex xs12>
          <v-tabs background-color="primary" centered v-model="active" slider-color="tertiary" dark>
            <v-tab ripple>Description</v-tab>
            <v-tab-item>
              <copro-card :project="project" />
            </v-tab-item>
            <v-tab ripple>Événements</v-tab>
            <v-tab-item>
              <copro-events :project="project" />
            </v-tab-item>
            <v-tab ripple>Documents</v-tab>
            <v-tab-item>
              <copro-docs :project="project" />
            </v-tab-item>
            <v-tab ripple>Engagements</v-tab>
            <v-tab-item>
              <commitments-card
                :loading="loading"
                :commitments="commitments"
                :fileName="project ? project.Reference : ''"
              />
            </v-tab-item>
            <v-tab ripple>Paiements</v-tab>
            <v-tab-item>
              <payments-card
                :loading="loading"
                :payments="payments"
                :fileName="project ? project.Reference : ''"
              />
            </v-tab-item>
            <v-tab ripple>Besoins</v-tab>
            <v-tab-item>
              <copro-forecast-card :project="project" />
            </v-tab-item>
            <v-tab ripple>Rattachements</v-tab>
            <v-tab-item>
              <unlinked-commitment
                :destID="project ? project.ID : 0"
                type="Copro"
                :allowLink="hasCoproRight"
              />
            </v-tab-item>
          </v-tabs>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>
<script>
import * as types from '../store/types'
import UnlinkedCommitment from './UnlinkedCommitments.vue'
import CommitmentsCard from './CommitmentsCard.vue'
import CoproCard from './CoproCard.vue'
import PaymentsCard from './PaymentsCard.vue'
import CoproEvents from './CoproEvents.vue'
import CoproDocs from './CoproDocs.vue'
import CoproForecastCard from './CoproForecastCard'
export default {
  name: 'Copro',
  components: {
    UnlinkedCommitment,
    CommitmentsCard,
    PaymentsCard,
    CoproForecastCard,
    CoproCard,
    CoproEvents,
    CoproDocs
  },
  data () {
    return {
      active: null
    }
  },
  computed: {
    project () {
      return this.$store.state.copro.copro
    },
    loading () {
      return this.$store.state.loading.loading !== 0
    },
    commitments () {
      return this.$store.state.copro.coproCommitments
    },
    payments () {
      return this.$store.state.copro.coproPayments
    },
    forecasts () {
      return this.$store.state.copro.coproForecasts
    },
    hasCoproRight () {
      return this.$store.getters.hasCoproRight
    }
  },
  created () {
    this.$store.dispatch(types.GET_COPRO_DATAS, this.$route.params.ID)
  }
}
</script>

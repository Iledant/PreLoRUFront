<template>
  <v-card>
    <v-card-title class="white--text primary">
      [{{ project ? project.Reference : '' }}]
      {{ project ? `${project.Address} - ${project.CityName}` : '' }}
    </v-card-title>
    <v-tabs :active="active" background-color="primary" slider-color="tertiary" centered dark>
      <v-tab ripple>Description</v-tab>
      <v-tab-item>
        <housing-description />
      </v-tab-item>
      <v-tab ripple>Engagements</v-tab>
      <v-tab-item>
        <housing-commitments />
      </v-tab-item>
      <v-tab ripple>Paiements</v-tab>
      <v-tab-item>
        <housing-payments />
      </v-tab-item>
      <v-tab ripple v-if="hasHousingRight">Rattachements</v-tab>
      <v-tab-item v-if="hasHousingRight">
        <unlinked-commitments :destID="project ? project.ID : 0" type="Housing" allowLink />
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import * as types from '@/store/types'
import HousingCommitments from './Housing/HousingCommitments.vue'
import HousingPayments from './Housing/HousingPayments.vue'
import HousingDescription from './Housing/HousingDescription'
import UnlinkedCommitments from './UnlinkedCommitments'
export default {
  name: 'Housing',
  components: {
    HousingCommitments,
    HousingPayments,
    HousingDescription,
    UnlinkedCommitments
  },
  data () {
    return {
      active: null
    }
  },
  created () {
    this.$store.dispatch(types.GET_HOUSING_DATAS, this.$route.params.ID)
  },
  computed: {
    project () {
      return this.$store.state.housings.housing
    },
    hasHousingRight () {
      return this.$store.getters.hasHousingRight
    }
  }
}
</script>

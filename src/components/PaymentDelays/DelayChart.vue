<template>
  <v-card>
    <v-container grid-list-md fluid>
      <v-layout row wrap>
        <v-flex xs12>
          <avg-pmt-time-chart :height="400" class="mt-2" />
        </v-flex>
        <v-flex xs12>
          <v-tooltip bottom color="primary">
            <template #activator="{ on }">
              <v-icon small v-on="on" class="pl-1">info</v-icon>
            </template>
            <span>
              Ce graphique représente la moyenne mobile sur les 12 derniers mois
              du délai entre
              <ul>
                <li>
                  les dates inscrites dans CORIOLIS de réception des
                  factures
                </li>
                <li>les dates inscrites dans CORIOLIS de proposition de mandatement</li>
              </ul>
            </span>
          </v-tooltip>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import AvgPmtTimeChart from './AvgPmtTimeChart.js'
import * as types from '@/store/types.js'
export default {
  name: 'DelayChart',
  components: { AvgPmtTimeChart },
  mounted () {
    this.$store.dispatch(types.GET_AVERAGE_PAYMENT_TIME)
  },
}
</script>

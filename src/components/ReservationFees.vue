<template>
  <v-card>
    <v-card-title class="white--text primary">Contingent régional</v-card-title>

    <v-tabs v-model="active" background-color="primary" slider-color="tertiary" centered dark>
      <v-tab ripple>Réservations</v-tab>
      <v-tab-item>
        <reservation-fees-card />
      </v-tab-item>
      <v-tab ripple>Report</v-tab>
      <v-tab-item>
        <reservation-report-card />
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import ReservationFeesCard from './ReservationFees/ReservationFeesCard.vue'
import ReservationReportCard from './ReservationFees/ReservationReportCard.vue'
export default {
  name: 'ReservationFees',
  components: { ReservationFeesCard, ReservationReportCard },
  data () {
    return {
      active: null,
    }
  },
}
</script>

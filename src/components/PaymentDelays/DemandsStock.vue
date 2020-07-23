<template>
  <v-card>
    <v-container grid-list-md fluid>
      <v-layout row wrap>
        <v-flex xs12>
          <payment-demands-stock-chart :height="400" class="mt-2" />
        </v-flex>
        <v-flex xs12>
          <v-tooltip bottom color="primary">
            <template #activator="{ on }">
              <v-icon small v-on="on" class="pl-1">info</v-icon>
            </template>
            <span>
              Ce graphique représente l'évolution quotidienne sur les 30
              derniers jours
              <br />du stock de DVS arrivés à la région.
              <br />Il mesure le nombre de DVS qui n'ont pas reçu de CSF de la direction
              <br />et le nombre de DVS non encore mandatés ou rejetés par la direction
              de la comptabilité.
              <br />Seules les DVS non exclues sont prises en compte.
            </span>
          </v-tooltip>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import PaymentDemandsStockChart from './PaymentDemandsStockChart.js'
import * as types from '@/store/types.js'
export default {
  name: 'DemandsStock',
  components: { PaymentDemandsStockChart },
  mounted () {
    this.$store.dispatch(types.GET_PAYMENT_DEMANDS_STOCK)
  },
}
</script>

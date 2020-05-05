<template>
  <v-card>
    <v-card-text>
      <v-layout wrap class="pa-2">
        <v-flex xs12>
          <v-data-table
            :headers="headers"
            :items="items"
            class="elevation-1"
            item-key="ActionID"
            :loading="loading"
            dense
          >
            <template #item="{ item }">
              <tr>
                <td>{{ item.Sector }}</td>
                <td>{{ item.ActionName }}</td>
                <td class="text-right text-no-wrap">{{ item.Y0 | float2MEuros }}</td>
                <td class="text-right text-no-wrap">{{ item.Y1 | float2MEuros }}</td>
                <td class="text-right text-no-wrap">{{ item.Y2 | float2MEuros }}</td>
                <td class="text-right text-no-wrap">{{ item.Y3 | float2MEuros }}</td>
                <td class="text-right text-no-wrap">{{ item.Y4 | float2MEuros }}</td>
              </tr>
            </template>
            <template #body.append="">
              <tr class="font-weight-medium">
                <td colspan="2">Total</td>
                <td class="text-right text-no-wrap">{{ TY0 | float2MEuros }}</td>
                <td class="text-right text-no-wrap">{{ TY1 | float2MEuros }}</td>
                <td class="text-right text-no-wrap">{{ TY2 | float2MEuros }}</td>
                <td class="text-right text-no-wrap">{{ TY3 | float2MEuros }}</td>
                <td class="text-right text-no-wrap">{{ TY4 | float2MEuros }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-btn color="primary" text @click="download">Export Excel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import * as types from '@/store/types'
import { excelExport, valStyle } from '@/excel'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'DifPaymentForecasts',
  data () {
    return {
      headers: [
        { text: 'Secteur', value: 'Sector' },
        { text: 'Action budgétaire', value: 'ActionName' },
        { text: 'Y0', value: 'Y0', align: 'right' },
        { text: 'Y1', value: 'Y1', align: 'right' },
        { text: 'Y2', value: 'Y2', align: 'right' },
        { text: 'Y3', value: 'Y3', align: 'right' },
        { text: 'Y4', value: 'Y4', align: 'right' }
      ]
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      items: state => state.difPmtForecasts.difPmtForecastsList
    }),
    TY0 () { return this.items.reduce((a, c) => a + c.Y0, 0) },
    TY1 () { return this.items.reduce((a, c) => a + c.Y1, 0) },
    TY2 () { return this.items.reduce((a, c) => a + c.Y2, 0) },
    TY3 () { return this.items.reduce((a, c) => a + c.Y3, 0) },
    TY4 () { return this.items.reduce((a, c) => a + c.Y4, 0) }
  },
  methods: {
    download () {
      const now = new Date().getFullYear()
      const columns = [
        { header: 'Secteur', key: 'Sector', width: 10 },
        { header: 'Code', key: 'ActionCode', width: 10 },
        { header: 'Nom', key: 'ActionName', width: 70 },
        { header: String(now), key: 'Y0', ...valStyle },
        { header: String(now + 1), key: 'Y1', ...valStyle },
        { header: String(now + 2), key: 'Y2', ...valStyle },
        { header: String(now + 3), key: 'Y3', ...valStyle },
        { header: String(now + 4), key: 'Y4', ...valStyle }
      ]
      excelExport(this.items, columns, 'Prévisions RAM CP')
    }
  },
  created () {
    const now = new Date().getFullYear()
    for (let i = 2; i < 7; i++) {
      this.headers[i].text = String(now + i - 1)
    }
    this.$store.dispatch(types.GET_DIF_PAYMENT_PREVISIONS)
  }
}
</script>

<template>
  <v-card>
    <v-card-text>
      <v-layout wrap class="pa-2">
        <v-flex xs12 sm6 offset-sm3>
          <v-select :items="years" v-model="ratioYear" label="Engagements de l'année" class />
        </v-flex>
        <v-flex xs12>
          <v-data-table
            :headers="headers"
            :items="items"
            class="elevation-1"
            item-key="ActionID"
            :loading="loading"
            dense
          >
            <template v-slot:item="{ item }">
              <tr>
                <td>{{ item.ActionName }}</td>
                <td class="text-right">{{ item.Y0 | float2Euros }}</td>
                <td class="text-right">{{ item.Y1 | float2Euros }}</td>
                <td class="text-right">{{ item.Y2 | float2Euros }}</td>
                <td class="text-right">{{ item.Y3 | float2Euros }}</td>
                <td class="text-right">{{ item.Y4 | float2Euros }}</td>
              </tr>
            </template>
            <template v-slot:body.append="">
              <tr class="font-weight-medium">
                <td>Total</td>
                <td class="text-right">{{ TY0 | float2Euros }}</td>
                <td class="text-right">{{ TY1 | float2Euros }}</td>
                <td class="text-right">{{ TY2 | float2Euros }}</td>
                <td class="text-right">{{ TY3 | float2Euros }}</td>
                <td class="text-right">{{ TY4 | float2Euros }}</td>
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
import * as types from '../store/types'
import { excelExport } from '../excel'
export default {
  name: 'PaymentForecasts',
  data () {
    return {
      headers: [
        { text: 'Action budgétaire', value: 'ActionName', align: 'center' },
        { text: 'Y0', value: 'Y0', align: 'center' },
        { text: 'Y1', value: 'Y1', align: 'center' },
        { text: 'Y2', value: 'Y2', align: 'center' },
        { text: 'Y3', value: 'Y3', align: 'center' },
        { text: 'Y4', value: 'Y4', align: 'center' }
      ],
      ratioYear: null,
      TY0: 0,
      TY1: 0,
      TY2: 0,
      TY3: 0,
      TY4: 0
    }
  },
  computed: {
    items () {
      return this.$store.state.pmtForecasts.pmtForecastsList
    },
    years () {
      return this.$store.state.ratios.ratiosYears
    },
    loading () {
      return this.$store.state.loading.loading !== 0
    }
  },
  methods: {
    download () {
      const now = new Date().getFullYear()
      const columns = [
        { header: 'Code', key: 'ActionCode', width: 10 },
        { header: 'Nom', key: 'ActionName', width: 70 },
        {
          header: String(now),
          key: 'Y0',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true
        },
        {
          header: String(now + 1),
          key: 'Y1',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true
        },
        {
          header: String(now + 2),
          key: 'Y2',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true
        },
        {
          header: String(now + 3),
          key: 'Y3',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true
        },
        {
          header: String(now + 4),
          key: 'Y4',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true
        }
      ]
      excelExport(this.items, columns, 'Prévisions CP')
    }
  },
  created () {
    const now = new Date().getFullYear()
    for (let i = 1; i < 6; i++) {
      this.headers[i].text = String(now + i - 1)
    }
    this.$store.dispatch(types.GET_RATIOS_YEARS)
  },
  watch: {
    async ratioYear (val) {
      if (val) {
        await this.$store.dispatch(types.GET_PMT_FORECASTS, { Year: val })
        this.TY0 = 0
        this.TY1 = 0
        this.TY2 = 0
        this.TY3 = 0
        this.TY4 = 0
        const itemsCount = this.items.length
        for (let i = 0; i < itemsCount; i++) {
          const item = this.items[i]
          this.TY0 += item.Y0
          this.TY1 += item.Y1
          this.TY2 += item.Y2
          this.TY3 += item.Y3
          this.TY4 += item.Y4
        }
      }
    }
  }
}
</script>

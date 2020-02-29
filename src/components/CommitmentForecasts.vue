<template>
  <v-card>
    <v-card-text>
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
            <td>{{ item.ActionName }}</td>
            <td class="text-right">{{ item.Y0 | currency }}</td>
            <td class="text-right">{{ item.Y1 | currency }}</td>
            <td class="text-right">{{ item.Y2 | currency }}</td>
            <td class="text-right">{{ item.Y3 | currency }}</td>
            <td class="text-right">{{ item.Y4 | currency }}</td>
          </tr>
        </template>
        <template #body.append="">
          <tr class="font-weight-medium">
            <td>Total</td>
            <td class="text-right">{{ TY0 | currency }}</td>
            <td class="text-right">{{ TY1 | currency }}</td>
            <td class="text-right">{{ TY2 | currency }}</td>
            <td class="text-right">{{ TY3 | currency }}</td>
            <td class="text-right">{{ TY4 | currency }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-btn color="primary" text small @click="excelExport">Export Excel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import * as types from '../store/types'
import { excelExport } from '../excel.js'

export default {
  name: 'CommitmentForecasts',
  data () {
    return {
      headers: [
        { text: 'Action budgétaire', value: 'ActionName' },
        { text: 'Y0', value: 'Y0' },
        { text: 'Y1', value: 'Y1' },
        { text: 'Y2', value: 'Y2' },
        { text: 'Y3', value: 'Y3' },
        { text: 'Y4', value: 'Y4' }
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
      return this.$store.state.cmtForecasts.cmtForecastsList
    },
    loading () {
      return this.$store.state.loading.loading !== 0
    }
  },
  watch: {
    items (items) {
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
  },
  methods: {
    async excelExport () {
      const thisYear = new Date().getFullYear()
      const cmtForecasts = this.items.map(c => ({
        ActionCode: c.ActionCode,
        ActionName: c.ActionName,
        Y0: 0.01 * c.Y0,
        Y1: 0.01 * c.Y1,
        Y2: 0.01 * c.Y2,
        Y3: 0.01 * c.Y3,
        Y4: 0.01 * c.Y4
      }))
      const columns = [
        { header: 'Code action', key: 'ActionCode', width: 14 },
        { header: 'Nom action', key: 'ActionName', width: 50 },
        {
          header: String(thisYear),
          key: 'Y0',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true
        },
        {
          header: String(thisYear + 1),
          key: 'Y1',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true
        },
        {
          header: String(thisYear + 2),
          key: 'Y2',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true
        },
        {
          header: String(thisYear + 3),
          key: 'Y3',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true
        },
        {
          header: String(thisYear + 4),
          key: 'Y4',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true
        }
      ]
      await excelExport(cmtForecasts, columns, 'Prévisions engagement')
    }
  },
  created () {
    const now = new Date().getFullYear()
    for (let i = 1; i < 6; i++) {
      this.headers[i].text = String(now + i - 1)
    }
    this.$store.dispatch(types.GET_CMT_FORECASTS)
  }
}
</script>

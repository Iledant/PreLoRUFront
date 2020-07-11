<template>
  <v-card>
    <v-container fluid grid-list-md>
      <v-layout wrap>
        <v-flex xs6 offset-xs3>
          <v-select label="Année du RPLS" :items="rplsYears" v-model="rplsYear" />
        </v-flex>
        <v-flex xs3 />
        <v-flex xs6 md3>
          <v-text-field
            label="Première année egt"
            v-debounce:500ms="firstYear"
            :rules="[yearRule]"
            prepend-icon="calendar_today"
          />
        </v-flex>
        <v-flex xs6 md3>
          <v-text-field
            label="Dernière année egt"
            v-debounce:500ms="lastYear"
            :rules="[yearRule, lastRule]"
            prepend-icon="calendar_today"
          />
        </v-flex>
        <v-flex xs6 md3>
          <v-text-field
            label="Taux mini RPLS"
            v-debounce:500ms="rplsMin"
            :rules="[ratioRule]"
            reverse
            prefix="%"
          />
        </v-flex>
        <v-flex xs6 md3>
          <v-text-field
            label="Taux maxi RPLS"
            v-debounce:500ms="rplsMax"
            :rules="[ratioRule, maxRule]"
            reverse
            prefix="%"
          />
        </v-flex>
        <v-flex xs12>
          <v-data-table :headers="headers" :items="items" class="elevation-1" dense>
            <template #body.prepend="">
              <tr class="font-weight-medium">
                <td class="text-center">Total</td>
                <td class="text-right">{{ totalValue | currency }}</td>
              </tr>
            </template>
            <template #item="{ item }">
              <tr>
                <td>{{ item.Dpt }}</td>
                <td class="text-right">{{ item.Value | currency }}</td>
              </tr>
            </template>
            <template #body.append="">
              <tr class="font-weight-medium">
                <td class="text-center">Total</td>
                <td class="text-right">{{ totalValue | currency }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-btn color="primary" small text @click="download" :disabled="disabled">Export Excel</v-btn>
      <v-btn
        color="primary"
        small
        text
        @click="detailedDownLoad"
        :disabled="disabled"
      >Export détaillé Excel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { yearRule, ratioRule } from '@/components/mixins'
import * as types from '@/store/types'
import { excelExport } from '@/excel'
export default {
  name: 'RplsReport',
  mixins: [yearRule, ratioRule],
  data () {
    return {
      headers: [
        { text: 'Département', value: 'Dpt' },
        { text: 'Montant', value: 'Value', align: 'right' },
      ],
      first: null,
      last: null,
      min: null,
      max: null,
      rplsYear: null,
    }
  },
  computed: {
    items () {
      return this.$store.state.rpls.rplsReport
    },
    rplsYears () {
      return this.$store.state.rpls.rplsYears
    },
    disabled () {
      return this.first === null ||
        this.last === null ||
        this.last < this.first ||
        this.min === null ||
        this.max === null ||
        this.max < this.min ||
        this.rplsYear === null
    },
    totalValue () {
      return this.items.reduce((a, c) => a + c.Value, 0)
    },
  },
  methods: {
    lastRule (l) {
      return l >= this.first || 'La dernière année doit être plus élevée que la première'
    },
    maxRule (m) {
      return m * 0.01 >= this.min || 'Le taux max doit être supérieur au taux mini'
    },
    firstYear (y) {
      if (!this.yearCheck(y)) {
        this.first = null
        return
      }
      this.first = parseInt(y)
      this.getReport()
    },
    lastYear (y) {
      if (!this.yearCheck(y)) {
        this.last = null
        return
      }
      this.last = parseInt(y)
      this.getReport()
    },
    rplsMin (r) {
      if (!this.ratioCheck(r)) {
        this.min = null
        return
      }
      this.min = 0.01 * parseFloat(r.replace(',', '.'))
      this.getReport()
    },
    rplsMax (r) {
      if (!this.ratioCheck(r)) {
        this.max = null
        return
      }
      this.max = 0.01 * parseFloat(r.replace(',', '.'))
      this.getReport()
    },
    getReport () {
      if (!this.disabled) {
        this.$store.dispatch(types.GET_RPLS_REPORT, {
          FirstYear: this.first,
          LastYear: this.last,
          RPLSMin: this.min,
          RPLSMax: this.max,
          RPLSYear: this.rplsYear,
        })
      }
    },
    download () {
      if (this.items.length === 0) {
        return
      }
      const columns = [
        { header: 'Dpt', key: 'Dpt', width: 10 },
        {
          header: 'Montant',
          key: 'Value',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true,
        },
      ]
      const formatted = this.items.map(({ Value, ...others }) =>
        ({ Value: Value * 0.01, ...others }))
      excelExport(formatted, columns, 'Rapport RPLS')
    },
    detailedDownLoad () {
      if (this.items.length > 0) {
        this.$store.dispatch(types.DOWNLOAD_DETAILED_RPLS_REPORT, {
          FirstYear: this.first,
          LastYear: this.last,
          RPLSMin: this.min,
          RPLSMax: this.max,
          RPLSYear: this.rplsYear,
        })
      }
    },
  },
  watch: {
    rplsYear () {
      this.getReport()
    },
  },
}
</script>

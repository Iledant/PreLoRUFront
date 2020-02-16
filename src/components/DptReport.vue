<template>
  <v-card>
    <v-container fluid grid-list-md>
      <v-layout wrap>
        <v-flex xs6>
          <v-text-field label="Première année" v-debounce:500ms="firstYear" :rules="[yearRule]" />
        </v-flex>
        <v-flex xs6>
          <v-text-field label="Dernière année" v-debounce:500ms="lastYear" :rules="[yearRule]" />
        </v-flex>
        <v-flex xs12>
          <v-data-table :headers="headers" :items="items" class="elevation-1" dense>
            <template v-slot:item="{ item }">
              <tr>
                <td>{{ item.Code }}</td>
                <td>{{ item.Name }}</td>
                <td>{{ item.Year }}</td>
                <td class="text-right">{{ item.Commitment | currency }}</td>
                <td class="text-right">{{ item.Payment | currency }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-btn color="primary" small text @click="download">Export Excel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { yearRule } from './mixins'
import * as types from '../store/types'
import { excelExport } from '../excel'
export default {
  name: 'DptReport',
  mixins: [yearRule],
  data () {
    return {
      headers: [
        { text: 'Numéro', value: 'Code', align: 'center' },
        { text: 'Nom', value: 'Name', align: 'center' },
        { text: 'Année', value: 'Year', align: 'center' },
        { text: 'Engagements', value: 'Commitment', align: 'center' },
        { text: 'Paiements', value: 'Payment', align: 'center' }
      ],
      first: null,
      last: null
    }
  },
  computed: {
    items () {
      return this.$store.state.summaries.dptReport
    }
  },
  methods: {
    firstYear (y) {
      if (!this.yearCheck(y)) {
        this.first = null
        return
      }
      this.first = parseInt(y)
      if (this.last !== null) this.getReport()
    },
    lastYear (y) {
      if (!this.yearCheck(y)) {
        this.last = null
        return
      }
      this.last = parseInt(y)
      if (this.first !== null) this.getReport()
    },
    getReport () {
      this.$store.dispatch(types.GET_DPT_REPORT, {
        firstYear: this.first,
        lastYear: this.last
      })
    },
    download () {
      if (this.item.length === 0) {
        return
      }
      const columns = [
        { header: 'Numéro', key: 'Code', width: 10 },
        { header: 'Nom', key: 'Name', width: 20 },
        { header: 'Année', key: 'Year', width: 10 },
        {
          header: 'Engagements',
          key: 'Commitment',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true
        },
        {
          header: 'Paiements',
          key: 'Payment',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true
        }
      ]
      const formatted = this.items.map(({ Commitment, Payment, ...others }) => {
        return {
          Commitment: Commitment * 0.01,
          Payment: Payment * 0.01,
          ...others
        }
      })
      excelExport(formatted, columns, 'Rapport dpt')
    }
  }
}
</script>

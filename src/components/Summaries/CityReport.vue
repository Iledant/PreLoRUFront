<template>
  <v-card>
    <v-container fluid grid-list-md>
      <v-layout wrap>
        <v-flex xs12 sm6 offset-sm3>
          <v-autocomplete
            :items="cities"
            item-text="Name"
            item-value="InseeCode"
            v-model="inseeCode"
            label="Commune"
          />
        </v-flex>
        <v-flex xs6 class="pr-1">
          <v-text-field
            label="Première année"
            v-debounce:500ms="firstYear"
            :rules="[yearRule]"
            prepend-icon="search"
          />
        </v-flex>
        <v-flex xs6 class="pl-1">
          <v-text-field
            label="Dernière année"
            v-debounce:500ms="lastYear"
            :rules="[yearRule]"
            prepend-icon="search"
          />
        </v-flex>
        <v-flex xs12>
          <v-data-table :headers="headers" :items="items" class="elevation-1" dense>
            <template #item="{ item }">
              <tr>
                <td>{{ item.Kind }}</td>
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
import { yearRule } from '@/components/mixins'
import * as types from '@/store/types'
import { excelExport } from '@/excel'
export default {
  name: 'CityReport',
  mixins: [yearRule],
  data () {
    return {
      headers: [
        { text: 'Type', value: 'Kind', align: 'center' },
        { text: 'Année', value: 'Year', align: 'center' },
        { text: 'Engagements', value: 'Commitment', align: 'center' },
        { text: 'Paiements', value: 'Payment', align: 'center' }
      ],
      first: null,
      last: null,
      inseeCode: null
    }
  },
  computed: {
    items () {
      return this.$store.state.summaries.cityReport.map(({ Kind, ...others }) =>
        ({ Kind: types.explicitKind[Kind - 1], ...others }))
    },
    cities () {
      return this.$store.state.cities.citiesList
    },
    cityName () {
      if (this.inseeCode === null) {
        return null
      }
      const city = this.cities.find(c => c.InseeCode === this.inseeCode)
      return city.Name
    }
  },
  methods: {
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
    getReport () {
      if (
        this.first !== null &&
        this.last !== null &&
        this.inseeCode !== null
      ) {
        this.$store.dispatch(types.GET_CITY_REPORT, {
          firstYear: this.first,
          lastYear: this.last,
          inseeCode: this.inseeCode
        })
      }
    },
    download () {
      if (this.items.length === 0) {
        return
      }
      const columns = [
        { header: 'Type', key: 'Kind', width: 10 },
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
      excelExport(formatted, columns, 'Rapport ' + this.cityName)
    }
  },
  watch: {
    inseeCode () {
      this.getReport()
    }
  }
}
</script>

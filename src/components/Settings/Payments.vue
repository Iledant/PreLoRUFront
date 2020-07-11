<template>
  <v-card>
    <v-card-title class="white--text primary text-h5">Paiements</v-card-title>
    <v-container fluid grid-list-md>
      <v-layout wrap>
        <v-flex xs12 sm6>
          <v-text-field
            label="Rechercher (engagement, bénéficiaire, action)"
            v-debounce:500ms="newSearch"
            prepend-icon="search"
          />
        </v-flex>
        <v-flex xs12 sm6>
          <v-text-field
            label="À partir de l'année"
            v-debounce:500ms="newYear"
            :rules="[yearRule]"
            prepend-icon="calendar_today"
          />
        </v-flex>
        <v-flex xs12>
          <v-data-table
            :headers="headers"
            :items="items"
            item-key="ID"
            :loading="loading"
            :server-items-length="itemsCount"
            :page.sync="page"
            dense
            class="elevation-1"
            no-data-text="Aucun mandat trouvé"
            no-results-text="Recherche infructueuse"
            :footer-props="{ disableItemsPerPage: true }"
          >
            <template #item="{ item }">
              <tr>
                <td class="text-left text-no-wrap">{{ item.CreationDate | date }}</td>
                <td class="text-left">{{ item.Number }}</td>
                <td class="text-right text-no-wrap">{{ item.Value | currency }}</td>
                <td class="text-left text-no-wrap">{{ item.CommitmentDate | date }}</td>
                <td class="text-left">{{ item.CommitmentName }}</td>
                <td class="text-right text-no-wrap">{{ item.CommitmentValue | currency }}</td>
                <td class="text-left">{{ item.Beneficiary }}</td>
                <td class="text-left">{{ item.Budget }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-btn text @click="excelExport()" color="primary">Export Excel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import * as types from '@/store/types.js'
import { yearRule } from '@/components/mixins'
export default {
  name: 'Payments',
  mixins: [yearRule],
  data () {
    return {
      search: '',
      year: 0,
      headers: [
        { text: 'Date pmt', value: 'CreationDate', sortable: false },
        { text: 'Année/num pmt', value: 'Number', sortable: false },
        { text: 'Montant pmt', value: 'Value', sortable: false },
        { text: 'Date egt', value: 'CommitmentDate', sortable: false },
        { text: 'Nom egt', value: 'CommitmentName', sortable: false },
        { text: 'Montant egt', value: 'CommitmentValue', sortable: false },
        { text: 'Bénéficiaire', value: 'Beneficiary', sortable: false },
        { text: 'Budget', value: 'Budget', sortable: false },
      ],
      page: 1,
    }
  },
  methods: {
    newSearch (val) {
      this.search = val
      this.getPayments(this.page)
    },
    newYear (val) {
      if (this.yearCheck(val)) {
        this.year = parseInt(val)
        this.getPayments(this.page)
      }
      if (val === '' || !val) {
        this.year = 0
        this.getPayments(this.page)
      }
    },
    async getPayments (p) {
      await this.$store.dispatch(types.GET_PAYMENTS, {
        Year: this.year,
        Search: this.search,
        Page: p,
      })
      if (this.currentPage !== this.page) {
        this.page = this.currentPage
      }
    },
    excelExport () {
      this.$store.dispatch(types.EXPORT_PAYMENTS, {
        Year: this.year,
        Search: this.search,
      })
    },
  },
  computed: {
    items () {
      return this.$store.state.payments.paymentsList.map(p => ({
        CreationDate: p.CreationDate,
        Number: '[' + p.Year + '] ' + p.Number,
        Value: p.Value,
        CommitmentDate: p.CommitmentDate,
        CommitmentValue: p.CommitmentValue,
        CommitmentName: p.CommitmentName,
        Beneficiary: p.Beneficiary,
        Budget: '[' + p.Sector + '] ' + p.ActionName,
      }))
    },
    loading () {
      return this.$store.state.loading.loading !== 0
    },
    itemsCount () {
      return this.$store.state.payments.paymentsItemsCount
    },
    currentPage () {
      return this.$store.state.payments.paymentsPage
    },
  },
  created () {
    this.$store.dispatch(types.GET_PAYMENTS, { Year: 0, Page: 0, Search: '' })
  },
  watch: {
    async page (p) {
      if (p !== this.currentPage) {
        this.getPayments(p)
      }
    },
  },
}
</script>

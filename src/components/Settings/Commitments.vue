<template>
  <v-card>
    <v-card-title class="white--text primary text-h5">Engagements</v-card-title>
    <v-card-text>
      <v-layout wrap>
        <v-flex xs12 sm6 pa-2>
          <v-text-field
            label="Rechercher (nom, code, bénéficiaire)"
            v-debounce:500ms="newSearch"
            prepend-icon="search"
          />
        </v-flex>
        <v-flex xs12 sm6 pa-2>
          <v-text-field
            label="À partir de l'année"
            v-debounce:500ms="newYear"
            :rules="[yearRule]"
            prepend-icon="search"
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
            show-select
            v-model="selected"
            dense
            class="elevation-1"
            no-data-text="Aucun bénéficiaire trouvé"
            no-results-text="Recherche infructueuse"
            :footer-props="{ disableItemsPerPage: true }"
          >
            <template #item.CreationDate="{ item }">
              <div class="text-left text-no-wrap">{{ item.CreationDate | date }}</div>
            </template>
            <template #item.Value="{ item }">
              <div class="text-right text-no-wrap">{{ item.Value | currency }}</div>
            </template>
            <template #item.SoldOut="{ item }">
              <v-icon>{{ item.SoldOut | displayBool }}</v-icon>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-actions class="tertiary">
      <v-btn
        text
        small
        @click="unlink()"
        color="primary"
        :disabled="selected.length === 0"
      >Supprimer le lien</v-btn>
      <v-spacer />
      <v-btn text @click="eldestExport()" color="primary">Export Excel RAM</v-btn>
      <v-btn text @click="unpaidExport()" color="primary">Export Excel caducité</v-btn>
      <v-btn text @click="excelExport()" color="primary">Export Excel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import * as types from '@/store/types.js'
import { yearRule, chkAndUpload } from '@/components/mixins'
export default {
  name: 'Commitments',
  mixins: [yearRule, chkAndUpload],
  data () {
    return {
      search: '',
      year: 0,
      headers: [
        { text: 'Date', value: 'CreationDate', sortable: false },
        { text: 'Budget', value: 'Budget', sortable: false },
        { text: 'Lié', value: 'Linked', sortable: false },
        { text: 'Code', value: 'FullCode', sortable: false },
        { text: 'Objet', value: 'Name', sortable: false },
        { text: 'Bénéficiaire', value: 'Beneficiary', sortable: false },
        { text: 'Montant', value: 'Value', sortable: false },
        { text: 'Soldé', value: 'SoldOut', sortable: false }
      ],
      page: 1,
      selected: []
    }
  },
  methods: {
    newSearch (val) {
      this.search = val
      this.getCommitments(this.page)
    },
    newYear (val) {
      if (this.yearCheck(val)) {
        this.year = Number(val)
        this.getCommitments(this.page)
      }
      if (val === '' || !val) {
        this.year = 0
        this.getCommitments(this.page)
      }
    },
    async getCommitments (p) {
      await this.$store.dispatch(types.GET_COMMITMENTS, {
        Year: this.year,
        Search: this.search,
        Page: p
      })
      if (this.page !== this.currentPage) {
        this.page = this.currentPage
      }
    },
    excelExport () {
      this.$store.dispatch(types.EXPORT_COMMITMENTS, {
        Year: this.year,
        Search: this.search
      })
    },
    async unpaidExport () {
      await this.$store.dispatch(types.EXPORT_UNPAID_COMMITMENTS)
    },
    async eldestExport () {
      await this.$store.dispatch(types.EXPORT_ELDEST_COMMITMENTS)
    },
    async unlink () {
      const IDs = this.selected.map(i => i.ID)
      await this.$store.dispatch(types.UNLINK_COMMITMENTS, IDs)
      this.selected = []
    }
  },
  computed: {
    items () {
      return this.$store.state.commitments.commitmentsList.map(c => ({
        ID: c.ID,
        Year: c.Year,
        FullCode: c.Code + '/' + c.Number + '/' + c.Line,
        CreationDate: c.CreationDate,
        Name: c.Name,
        Beneficiary: c.BeneficiaryName,
        Value: c.Value,
        Budget: '[' + c.Sector + '] ' + c.ActionName,
        CoproID: c.CoproID,
        RenewProjectID: c.RenewProjectID,
        HousingID: c.HousingID,
        Linked: c.CoproID ? 'C' : (c.RenewProjectID ? 'R' : (c.HousingID ? 'L' : '-')),
        SoldOut: c.SoldOut
      }))
    },
    hasLinked () {
      return this.items.some(i => i.Linked)
    },
    loading () {
      return this.$store.state.loading.loading !== 0
    },
    itemsCount () {
      return this.$store.state.commitments.commitmentsItemsCount
    },
    currentPage () {
      return this.$store.state.commitments.commitmentsPage
    }
  },
  created () {
    this.$store.dispatch(types.GET_COMMITMENTS, { Year: 0, Page: 1, Search: '' })
  },
  watch: {
    async page (p) {
      if (p !== this.currentPage) {
        this.getCommitments(p)
      }
    }
  }
}
</script>

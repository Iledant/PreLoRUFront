<template>
  <v-card>
    <v-container fluid grid-list-md>
      <v-layout wrap>
        <v-flex xs12 sm6 pa-2>
          <v-text-field label="Rechercher (nom, code, bénéficiaire)" v-debounce:500ms="newSearch" />
        </v-flex>
        <v-flex xs12 sm6 pa-2>
          <v-text-field label="À partir de l'année" v-debounce:500ms="newYear" :rules="[yearRule]" />
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
            class="elevation-1"
            no-data-text="Aucun engagement trouvé"
            no-results-text="Recherche infructueuse"
            :footer-props="{ disableItemsPerPage: true }"
          >
            <template v-slot:item.CreationDate="{ item }">
              <div class="text-no-wrap">{{ item.CreationDate | date }}</div>
            </template>
            <template v-slot:item.Value="{ item }">
              <div class="text-no-wrap">{{ item.Value | currency }}</div>
            </template>
            <template v-slot:item.SoldOut="{ item }">
              <div class="text-center">
                <v-icon>{{ item.SoldOut | displayBool }}</v-icon>
              </div>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions v-if="allowLink" class="tertiary">
      <v-spacer />
      <v-btn text small @click="link" color="primary" :disabled="selected.length === 0">Rattacher</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import * as types from '../store/types'
import { yearRule } from './mixins'
export default {
  name: 'UnlinkedCommitments',
  mixins: [yearRule],
  data () {
    return {
      search: '',
      year: 0,
      headers: [
        { text: 'Date', value: 'CreationDate' },
        { text: 'Budget', value: 'Budget' },
        { text: 'Code', value: 'FullCode' },
        { text: 'Objet', value: 'Name' },
        { text: 'Bénéficiaire', value: 'Beneficiary' },
        { text: 'Montant', value: 'Value' },
        { text: 'Soldé', value: 'SoldOut' }
      ],
      page: 1,
      selected: []
    }
  },
  props: {
    destID: { type: Number, required: true },
    allowLink: { type: Boolean, default: false },
    type: {
      validator: t => ['Copro', 'RenewProject', 'Housing'].indexOf(t) !== -1
    }
  },
  methods: {
    newSearch (val) {
      this.search = val
      this.getCommitments(this.page)
    },
    newYear (val) {
      if (this.yearCheck(val)) {
        this.year = parseInt(val)
        this.getCommitments(this.page)
      }
      if (val === '' || !val) {
        this.year = 0
        this.getCommitments(this.page)
      }
    },
    toggleAll () {
      if (this.selected.length) this.selected = []
      else this.selected = this.items.slice()
    },
    async getCommitments (p) {
      await this.$store.dispatch(types.GET_UNLINKED_COMMITMENTS, {
        Year: this.year,
        Search: this.search,
        Page: p
      })
      if (this.page !== this.currentPage) {
        this.page = this.currentPage
      }
    },
    async link () {
      if (this.destID !== 0) {
        const IDs = this.selected.map(i => i.ID)
        await this.$store.dispatch(types.LINK_COMMITMENTS,
          { DestID: this.destID, Type: this.type, IDs }
        )
      }
    }
  },
  computed: {
    items () {
      return this.$store.state.commitments.unlinkedCommitmentsList.map(c => ({
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
        Linked: c.CoproID || c.RenewProjectID || c.HousingID,
        SoldOut: c.SoldOut
      }))
    },
    loading () {
      return this.$store.state.loading.loading !== 0
    },
    itemsCount () {
      return this.$store.state.commitments.unlinkedCommitmentsItemsCount
    },
    currentPage () {
      return this.$store.state.commitments.unlinkedCommitmentsPage
    }
  },
  mounted () {
    this.getCommitments(this.page)
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

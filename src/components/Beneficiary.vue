<template>
  <v-card>
    <v-card-title class="white--text primary headline">
      Situation de {{ beneficiaryName }}
    </v-card-title>
    <v-tabs background-color="primary" slider-color="tertiary" v-model="tab" centered dark>
      <v-tab>Engagements</v-tab>
      <v-tab-item>
        <v-container fluid grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm6>
              <v-text-field
                label="Rechercher (libellé)"
                v-model="search"
                v-debounce:500ms="newSearch"
                prepend-icon="search"
              />
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field
                label="À partir de l'année"
                v-model="year"
                :rules="[emptyOrYearRule]"
                v-debounce:500ms="yearChanged"
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
                dense
                class="elevation-1"
                no-data-text="Aucun bénéficiaire trouvé"
                no-results-text="Recherche infructueuse"
                :footer-props="{ disableItemsPerPage: true }"
              >
                <template #item="{ item }">
                  <tr>
                    <td class="text-right">{{ item.Date | date }}</td>
                    <td>{{ item.Name }}</td>
                    <td>{{ item.IRISCode }}</td>
                    <td class="text-right">{{ item.Value | currency }}</td>
                    <td class="text-right">{{ item.Available | currency }}</td>
                    <td class="text-right">{{ item.Caducity | date }}</td>
                  </tr>
                </template>
              </v-data-table>
            </v-flex>
            <v-flex xs12 class="text-right">
              <v-btn color="primary" text @click="download">Export Excel</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-tab-item>
      <v-tab>Consommation de CP</v-tab>
      <v-tab-item>
        <v-container fluid>
          <beneficiary-pmt-chart :beneficiaryId="beneficiaryID" />
        </v-container>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import * as types from '../store/types.js'
import BeneficiaryPmtChart from './BeneficiaryPmtChart'
import { yearRule } from './mixins'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'Beneficiary',
  mixins: [yearRule],
  components: { BeneficiaryPmtChart },
  data () {
    return {
      search: '',
      tab: null,
      page: 1,
      year: 0,
      headers: [
        { text: 'Date', value: 'Date', align: 'right', sortable: false },
        { text: 'Libellé', value: 'Name', sortable: false },
        { text: 'Fiche IRIS', value: 'IRISCode', sortable: false },
        { text: 'Montant', value: 'Value', align: 'right', sortable: false },
        { text: 'RAM', value: 'Available', align: 'right', sortable: false },
        { text: 'Caducité', value: 'Caducity', align: 'right', sortable: false }
      ]
    }
  },
  methods: {
    newSearch (val) {
      this.search = val
      this.getDatas(this.page)
    },
    yearChanged (val) {
      if (!val) {
        this.year = 0
        this.getDatas(this.page)
        return
      }
      if (this.yearCheck(val)) {
        this.year = parseInt(val)
        this.getDatas(this.page)
      }
    },
    async getDatas (p) {
      if (this.beneficiaryID) {
        await this.$store.dispatch(types.GET_BENEFICIARY_DATAS,
          { ID: this.beneficiaryID, Search: this.search, Year: this.year, Page: p })
        if (this.currentPage !== this.page) {
          this.page = this.currentPage
        }
      }
    },
    download () {
      if (this.beneficiaryID) {
        this.$store.dispatch(types.EXPORT_BENEFICIARY_DATAS,
          { ID: this.beneficiaryID, Search: this.search, Year: this.year })
      }
    }
  },
  computed: {
    beneficiaryID () { return this.$route.params.ID },
    beneficiaryName () { return this.$route.params.Name },
    ...mapGetters(['loading']),
    ...mapState({
      itemsCount: state => state.beneficiary.beneficiaryItemsCount,
      items: state => state.beneficiary.beneficiaryDatas,
      currentPage: state => state.beneficiary.beneficiaryPage
    })
  },
  mounted () { this.getDatas(this.page) },
  watch: {
    async page (p) {
      if (p !== this.currentPage) {
        await this.getDatas(p)
      }
    }
  }
}
</script>

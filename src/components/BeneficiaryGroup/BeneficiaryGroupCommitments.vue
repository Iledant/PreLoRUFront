<template>
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
          :headers="cmtHeaders"
          :items="commitments"
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
</template>

<script>
import * as types from '@/store/types.js'
import { yearRule } from '@/components/mixins'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'BeneficiaryGroupCommitments',
  mixins: [yearRule],
  data () {
    return {
      search: '',
      year: 0,
      page: 1,
      cmtHeaders: [
        { text: 'Date', value: 'Date', align: 'right', sortable: false },
        { text: 'Libellé', value: 'Name', sortable: false },
        { text: 'Fiche IRIS', value: 'IRISCode', sortable: false },
        { text: 'Montant', value: 'Value', align: 'right', sortable: false },
        { text: 'RAM', value: 'Available', align: 'right', sortable: false },
        { text: 'Caducité', value: 'Caducity', align: 'right', sortable: false },
      ],
    }
  },
  methods: {
    yearChanged (val) {
      if (val === null || val === '') {
        this.year = 0
        this.getDatas(this.page)
        return
      }
      if (this.yearCheck(val)) {
        this.year = Number(val)
        this.getDatas(this.page)
      }
    },
    async getDatas (p) {
      if (this.ID) {
        await this.$store.dispatch(types.GET_BENEFICIARY_GROUP_DATAS,
          { ID: this.ID, Search: this.search, Year: this.year, Page: p })
        if (this.currentPage !== this.page) {
          this.page = this.currentPage
        }
      }
    },
    download () {
      if (this.ID) {
        this.$store.dispatch(types.EXPORT_BENEFICIARY_GROUP_DATAS,
          { ID: this.ID, Search: this.search, Year: this.year })
      }
    },
    newSearch (val) {
      this.search = val
      this.getDatas(this.page)
    },
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      itemsCount: state => state.beneficiaryGroup.beneficiaryGroupItemsCount,
      currentPage: state => state.beneficiaryGroup.beneficiaryGroupPage,
      commitments: state => state.beneficiaryGroup.beneficiaryGroupDatas,
    }),
    ID () { return this.$route.params.ID },
  },
  mounted () { this.getDatas(this.page) },
  watch: {
    async page (p) {
      if (p !== this.currentPage) {
        await this.getDatas(p)
      }
    },
  },
}
</script>

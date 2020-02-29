<template>
  <v-card>
    <v-container fluid grid-list-md>
      <v-layout wrap>
        <v-flex xs12 md6 offset-md3>
          <v-text-field
            label="Rechercher (référence, adresse, code INSEE)"
            v-model="search"
            v-debounce:500ms="newSearch"
            prepend-icon="search"
          />
        </v-flex>
        <v-flex md3 />
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
            no-data-text="Aucun projet de logement social trouvé"
            no-results-text="Recherche infructueuse"
            :footer-props="{ disableItemsPerPage: true }"
          >
            <template v-slot:item="{ item }">
              <tr>
                <td class="table-link" @click="goTo(item)">{{ item.Reference }}</td>
                <td class="table-link" @click="goTo(item)">{{ item.CityName }}</td>
                <td class="table-link" @click="goTo(item)">{{ item.Address | nullable }}</td>
                <td class="text-right">{{ item.HousingTypeShortName || 'nc' }}</td>
                <td class="text-right">{{ item.PLAI }}</td>
                <td class="text-right">{{ item.PLUS }}</td>
                <td class="text-right">{{ item.PLS }}</td>
                <td class="text-center">
                  <v-icon>{{ item.ANRU | displayBool }}</v-icon>
                </td>
                <td class="px-0">
                  <v-tooltip left v-if="hasHousingRight" color="primary">
                    <template v-slot:activator="{ on }">
                      <v-btn color="primary" icon small text class="pa-0" @click="modify(item)">
                        <v-icon class="pa-0" v-on="on">create</v-icon>
                      </v-btn>
                    </template>
                    <span>Modifier</span>
                  </v-tooltip>
                </td>
                <td class="px-0">
                  <v-tooltip left v-if="hasHousingRight" color="primary">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        color="primary"
                        icon
                        small
                        text
                        class="pa-0"
                        @click="remove(item)"
                        v-on="on"
                      >
                        <v-icon class="pa-0" v-on="on">delete</v-icon>
                      </v-btn>
                    </template>
                    <span>Supprimer</span>
                  </v-tooltip>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
        <v-flex xs12 class="text-right">
          <v-tooltip left color="primary">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" fab dark x-small @click="add" v-on="on">
                <v-icon>add</v-icon>
              </v-btn>
            </template>
            <span>Créer une nouvelle opération</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions v-if="hasHousingRight" class="tertiary">
      <v-spacer />
      <v-file-input
        accept="*.xlsx"
        label="Importer des liens dossiers IRIS/programmes"
        :loading="loading"
        show-size
        @change="chkAndUpload($event,commitentLinkUpload)"
      />
      <v-file-input
        accept="*.xlsx"
        label="Importer des programmes"
        :loading="loading"
        show-size
        @change="chkAndUpload($event,operationUpload)"
      />
      <v-file-input
        accept="*.xlsx"
        label="Importer le bilan détaillé"
        :loading="loading"
        show-size
        @change="chkAndUpload($event,summaryUpload)"
      />
    </v-card-actions>

    <housing-dlg
      v-model="opDlg"
      :title="dlgTitle"
      :button="dlgBtn"
      :cities="cities"
      :item="item"
      @confirm="save"
    />

    <delete-dialog
      v-model="delDlg"
      sentence="Supprimer le logement définitivement ?"
      @confirm="delConfirm"
    />
  </v-card>
</template>

<script>
import HousingDlg from './HousingDlg.vue'
import DeleteDialog from './DeleteDialog.vue'
import { chkAndUpload } from './mixins'
import * as types from '../store/types.js'
const nullHousing = {
  ID: null,
  Reference: '',
  Address: '',
  ZipCode: null,
  PLAI: 0,
  PLUS: 0,
  PLS: 0,
  ANRU: false
}
export default {
  name: 'HousingsCard',
  mixins: [chkAndUpload],
  props: {
    loading: { type: Boolean, default: false }
  },
  components: { HousingDlg, DeleteDialog },
  data () {
    return {
      search: '',
      headers: [
        { text: 'Référence', value: 'Reference', sortable: false },
        { text: 'Commune', value: 'CityName', sortable: false },
        { text: 'Adresse', value: 'Address', sortable: false },
        { text: 'Type', value: 'HousingTypeShortName', sortable: false },
        { text: 'PLAI', value: 'PLAI', align: 'right', sortable: false },
        { text: 'PLUS', value: 'PLUS', align: 'right', sortable: false },
        { text: 'PLS', value: 'PLS', align: 'right', sortable: false },
        { text: 'ANRU', value: 'ANRU', align: 'center', sortable: false },
        { text: '', value: '', sortable: false, width: '1%' },
        { text: '', value: '', sortable: false, width: '1%' }
      ],
      page: 1,
      item: { ...nullHousing },
      opDlg: false,
      dlgTitle: 'Créer un logement',
      dlgBtn: 'Créer',
      delDlg: false
    }
  },
  computed: {
    housings () {
      return this.$store.state.housings.housingsList
    },
    itemsCount () {
      return this.$store.state.housings.housingsItemsCount
    },
    currentPage () {
      return this.$store.state.housings.housingsPage
    },
    items () {
      return this.housings
    },
    cities () {
      return this.$store.state.cities.citiesList
    },
    hasHousingRight () {
      return this.$store.getters.hasHousingRight
    },
    commissions () {
      return this.$store.state.settings.commissionsList
    },
    budgetActions () {
      return this.$store.state.settings.budgetActionsList
    }
  },
  methods: {
    newSearch (val) {
      this.opSearch = val
      this.getHousings(this.page)
    },
    goTo ({ ID }) {
      this.$router.push({ name: 'Housing', params: { ID } })
    },
    add () {
      this.item = { ...nullHousing }
      this.dlgTitle = 'Créer un logement'
      this.dlgBtn = 'Créer'
      this.opDlg = true
    },
    modify (item) {
      const i = this.housings.find(i => i.ID === item.ID)
      this.item = { ...i }
      this.dlgTitle = 'Modifier un logement'
      this.dlgBtn = 'Modifier'
      this.opDlg = true
    },
    remove (item) {
      this.item.ID = item.ID
      this.delDlg = true
    },
    operationUpload (file) {
      this.$store.dispatch(types.UPLOAD_HOUSINGS, file)
    },
    async commitentLinkUpload (file) {
      await this.$store.dispatch(types.UPLOAD_HOUSING_COMMITMENT_LINK, file)
      this.getHousings(this.page)
    },
    async summaryUpload (file) {
      await this.$store.dispatch(types.UPLOAD_HOUSING_SUMMARY, file)
      this.getHousings(this.page)
    },
    async delConfirm () {
      await this.$store.dispatch(types.DEL_HOUSING, this.item.ID)
    },
    async save (h) {
      const dispatch =
        this.dlgBtn === 'Créer' ? types.CREATE_HOUSING : types.UPDATE_HOUSING
      this.$store.dispatch(dispatch, h)
    },
    async getHousings (p) {
      await this.$store.dispatch(types.GET_PAGINATED_HOUSINGS,
        { Search: this.opSearch, Page: p })
      if (this.currentPage !== this.page) {
        this.page = this.currentPage
      }
    }
  },
  watch: {
    async page (p) {
      if (p !== this.currentPage) {
        await this.getHousings(p)
      }
    }
  }
}
</script>

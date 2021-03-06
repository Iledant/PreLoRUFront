<template>
  <v-card>
    <v-container fluid grid-list-md>
      <v-layout wrap>
        <v-flex xs12 md6 offset-md3>
          <v-text-field
            label="Rechercher (référence, adresse, ville, code INSEE)"
            v-model="search"
            v-debounce:500ms="newSearch"
            prepend-icon="search"
          />
        </v-flex>
        <v-flex md3 />
        <v-flex xs12>
          <v-data-table
            :headers="headers"
            :items="housings"
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
            <template #item="{ item }">
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
                    <template #activator="{ on }">
                      <v-btn color="primary" icon small text class="pa-0" @click="modify(item)">
                        <v-icon class="pa-0" v-on="on">create</v-icon>
                      </v-btn>
                    </template>
                    <span>Modifier</span>
                  </v-tooltip>
                </td>
                <td class="px-0">
                  <v-tooltip left v-if="hasHousingRight" color="primary">
                    <template #activator="{ on }">
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
            <template #activator="{ on }">
              <v-btn color="primary" fab dark x-small @click="add" v-on="on">
                <v-icon>add</v-icon>
              </v-btn>
            </template>
            <span>Créer une nouvelle opération</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
    </v-container>

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
import DeleteDialog from '@/components/DeleteDialog.vue'
import { chkAndUpload } from '@/components/mixins'
import * as types from '@/store/types.js'
import { mapGetters, mapState } from 'vuex'
const nullHousing = {
  ID: null,
  Reference: '',
  Address: '',
  ZipCode: null,
  PLAI: 0,
  PLUS: 0,
  PLS: 0,
  ANRU: false,
}
export default {
  name: 'HousingsCard',
  mixins: [chkAndUpload],
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
        { text: '', value: '', sortable: false, width: '1%' },
      ],
      page: 1,
      item: { ...nullHousing },
      opDlg: false,
      dlgTitle: 'Créer un logement',
      dlgBtn: 'Créer',
      delDlg: false,
    }
  },
  computed: {
    ...mapGetters(['hasHousingRight', 'loading']),
    ...mapState({
      housings: state => state.housings.housingsList,
      itemsCount: state => state.housings.housingsItemsCount,
      currentPage: state => state.housings.housingsPage,
      cities: state => state.cities.citiesList,
      commissions: state => state.settings.commissionsList,
      budgetActions: state => state.settings.budgetActionsList,
    }),
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
    },
  },
  watch: {
    async page (p) {
      if (p !== this.currentPage) {
        await this.getHousings(p)
      }
    },
  },
}
</script>

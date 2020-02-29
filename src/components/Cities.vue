<template>
  <v-card>
    <v-card-title class="white--text primary headline">Communes</v-card-title>
    <v-container fluid grid-list-md>
      <v-layout wrap>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field
            label="Rechercher (code, nom)"
            v-debounce:500ms="newSearch"
            prepend-icon="search"
          />
        </v-flex>
        <v-flex xs12>
          <v-data-table
            :headers="headers"
            :items="items"
            item-key="InseeCode"
            :loading="loading"
            :server-items-length="itemsCount"
            :page.sync="page"
            dense
            class="elevation-1"
            no-data-text="Aucune commune trouvée"
            no-results-text="Recherche infructueuse"
            :footer-props="{ disableItemsPerPage: true }"
          >
            <template v-slot:item="{ item }">
              <tr>
                <td class="text-left">{{ item.InseeCode }}</td>
                <td class="text-left">{{ item.Name }}</td>
                <td class="text-left">{{ item.CommunityName | nullable }}</td>
                <td>
                  <v-icon>{{ item.QPV | displayBool }}</v-icon>
                </td>
                <td class="px-0">
                  <v-tooltip left color="primary">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        color="primary"
                        small
                        text
                        icon
                        class="pa-0"
                        @click="modify(item)"
                        v-on="on"
                      >
                        <v-icon>create</v-icon>
                      </v-btn>
                    </template>
                    Modifier
                  </v-tooltip>
                </td>
                <td class="px-0">
                  <v-tooltip left color="primary">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        color="primary"
                        small
                        icon
                        text
                        class="pa-0"
                        v-on="on"
                        @click="remove(item)"
                      >
                        <v-icon>delete</v-icon>
                      </v-btn>
                    </template>
                    Supprimer
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
            <span>Ajouter une nouvelle ligne</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-file-input
        accept="*.xlsx"
        label="Importer des communes"
        :loading="loading"
        show-size
        @change="chkAndUpload($event,upload)"
      />
    </v-card-actions>

    <v-dialog v-model="dialog" persistent :overlay="false" max-width="500px">
      <v-card>
        <v-card-title class="primary white--text headline">{{ dlgTitle }}</v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  label="Code INSEE"
                  v-model="item.InseeCode"
                  @keyup.esc="dialog = false"
                  @keyup.enter="save"
                />
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  label="Nom"
                  v-model="item.Name"
                  @keyup.esc="dialog = false"
                  @keyup.enter="save"
                />
              </v-flex>
              <v-flex xs12>
                <v-autocomplete
                  :items="communities"
                  item-text="Name"
                  item-value="ID"
                  v-model="item.CommunityID"
                  label="Intercommunalité"
                />
              </v-flex>
              <v-flex xs12>
                <v-checkbox label="QPV" v-model="item.QPV" />
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>

        <v-card-actions class="tertiary">
          <v-spacer />
          <v-btn color="primary" small text @click="dialog = false">Annuler</v-btn>
          <v-btn color="primary" small text @click="save" :disabled="disabled">{{ dlgBtn }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <delete-dialog
      v-model="delDlg"
      sentence="Supprimer la commune définitivement ?"
      @confirm="delConfirm"
    />
  </v-card>
</template>

<script>
import * as types from '../store/types.js'
import DeleteDialog from './DeleteDialog'
import { chkAndUpload } from './mixins'
export default {
  name: 'Cities',
  mixins: [chkAndUpload],
  components: { DeleteDialog },
  data () {
    return {
      search: '',
      headers: [
        { text: 'Code', value: 'InseeCode', align: 'center' },
        { text: 'Nom', value: 'Name', align: 'center' },
        { text: 'Interco', value: 'Community', align: 'center' },
        { text: 'QPV', value: 'QPV', align: 'center' },
        { text: '', value: '', sortable: false, width: '1%' },
        { text: '', value: '', sortable: false, width: '1%' }
      ],
      dialog: false,
      delDlg: false,
      item: { InseeCode: null, Name: null, CommunityID: null, QPV: false },
      dlgTitle: 'Nouvelle commune',
      dlgBtn: 'Créer',
      menu: null,
      page: 1
    }
  },
  methods: {
    newSearch (val) {
      this.search = val
      this.getCities(this.page)
    },
    remove (item) {
      this.item.InseeCode = item.InseeCode
      this.delDlg = true
    },
    modify (item) {
      this.item = { ...item }
      this.dlgTitle = 'Modifier la commune'
      this.dlgBtn = 'Modifier'
      this.dialog = true
    },
    add (item) {
      this.item.Name = null
      this.item.InseeCode = null
      this.item.CommunityID = null
      this.item.QPV = false
      this.dlgTitle = 'Nouvelle commune'
      this.dlgBtn = 'Créer'
      this.dialog = true
    },
    async save () {
      if (!this.disabled) {
        const dispatch =
          this.dlgBtn === 'Créer' ? types.CREATE_CITY : types.UPDATE_CITY
        await this.$store.dispatch(dispatch, {
          Name: this.item.Name,
          InseeCode: parseInt(this.item.InseeCode),
          CommunityID: this.item.CommunityID,
          QPV: this.item.QPV
        })
        this.dialog = false
      }
    },
    async delConfirm () {
      await this.$store.dispatch(types.DEL_CITY, this.item.InseeCode)
    },
    upload (file) {
      this.$store.dispatch(types.UPLOAD_CITIES, file)
    },
    async getCities (p) {
      await this.$store.dispatch(types.GET_PAGINATED_CITIES, {
        Search: this.search,
        Page: p
      })
      if (this.page !== this.currentPage) {
        this.page = this.currentPage
      }
    }
  },
  computed: {
    communities () {
      return this.$store.state.communities.communitiesList
    },
    items () {
      return this.$store.state.cities.citiesList
    },
    itemsCount () {
      return this.$store.state.cities.citiesItemsCount
    },
    currentPage () {
      return this.$store.state.cities.citiesPage
    },
    loading () {
      return this.$store.state.loading.loading !== 0
    },
    disabled () {
      return (
        this.item.Name === null ||
        this.item.Name === '' ||
        !/^\d{5}$/.test(this.item.InseeCode)
      )
    }
  },
  created () {
    this.$store.dispatch(types.GET_COMMUNITIES)
    this.$store.dispatch(types.GET_PAGINATED_CITIES, { Page: 0, Search: '' })
  },
  watch: {
    async page (p) {
      if (p !== this.currentPage) {
        await this.getCities(p)
      }
    }
  }
}
</script>

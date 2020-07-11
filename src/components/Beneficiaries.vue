<template>
  <v-container grid-list-md fluid>
    <v-layout wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-text-field
          label="Rechercher (code, nom)"
          v-debounce:500ms="newSearch"
          prepend-icon="search"
        />
      </v-flex>
      <v-flex sm3 />
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
              <td class="table-link" @click="details(item)">{{ item.Code }}</td>
              <td class="table-link" @click="details(item)">{{ item.Name }}</td>
              <td class="px-0">
                <v-tooltip left color="primary">
                  <template #activator="{ on }">
                    <v-btn color="primary"
                      small
                      text
                      icon
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
                  <template #activator="{ on }">
                    <v-btn
                      color="primary"
                      small
                      icon
                      text
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
          <template #activator="{ on }">
            <v-btn color="primary" fab dark x-small @click="add" v-on="on">
              <v-icon>add</v-icon>
            </v-btn>
          </template>
          <span>Ajouter un nouveau bénéficiaire</span>
        </v-tooltip>
      </v-flex>
    </v-layout>
    <delete-dlg v-model="delDlg" :sentence="delSentence" @confirm="confirmRemove" />
    <beneficiary-dlg v-model="dlg" @confirm="confirm" :item="item" :action="action" />
  </v-container>
</template>

<script>
import * as types from '@/store/types.js'
import BeneficiaryDlg from './Beneficiaries/BeneficiaryDlg.vue'
import DeleteDlg from '@/components/DeleteDialog.vue'
import { mapState, mapGetters } from 'vuex'
const nullItem = { Code: null, Name: '' }
export default {
  name: 'Beneficiaries',
  components: { DeleteDlg, BeneficiaryDlg },
  data () {
    return {
      search: '',
      headers: [
        { text: 'Code', value: 'Code', sortable: false },
        { text: 'Nom', value: 'Name', sortable: false },
        { text: '', value: '', sortable: false, width: '1%' },
        { text: '', value: '', sortable: false, width: '1%' },
      ],
      page: 1,
      dlg: false,
      delDlg: false,
      action: 'create',
      item: { ...nullItem },
    }
  },
  methods: {
    newSearch (val) {
      this.search = val
      this.getBeneficiaries(this.page)
    },
    async getBeneficiaries (p) {
      await this.$store.dispatch(types.GET_BENEFICIARIES,
        { Search: this.search, Page: p })
      if (this.page !== this.currentPage) {
        this.page = this.currentPage
      }
    },
    details ({ Name, ID }) {
      this.$router.push({ name: 'Beneficiary', params: { ID, Name } })
    },
    add () {
      this.item = { ...nullItem }
      this.action = 'create'
      this.dlg = true
    },
    modify (item) {
      this.item = { ...item }
      this.action = 'modify'
      this.dlg = true
    },
    remove (item) {
      this.item = { ...item }
      this.delDlg = true
    },
    async confirm (beneficiary) {
      const action = this.action === 'create'
        ? types.CREATE_BENEFICIARY
        : types.UPDATE_BENEFICIARY
      await this.$store.dispatch(action, { Beneficiary: { ...beneficiary } })
      this.dlg = false
      await this.getBeneficiaries(this.page)
    },
    async confirmRemove () {
      await this.$store.dispatch(types.DELETE_BENEFICIARY, this.item.ID)
      this.delDlg = false
      await this.getBeneficiaries(this.page)
    },
  },
  mounted () {
    this.getBeneficiaries(1)
  },
  computed: {
    ...mapState({
      items: state => state.beneficiaries.beneficiariesList,
      itemsCount: state => state.beneficiaries.beneficiariesItemsCount,
      currentPage: state => state.beneficiaries.beneficiariesPage,
    }),
    ...mapGetters(['loading']),
    delSentence () {
      return 'Supprimer le bénéficiaire ' + (this.item ? this.item.Name : '') + ' ?'
    },
  },
  watch: {
    async page (p) {
      if (p !== this.currentPage) {
        await this.getBeneficiaries(p)
      }
    },
  },
}
</script>

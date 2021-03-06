<template>
  <v-card>
    <v-container fluid grid-list-md>
      <v-layout wrap>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field
            prepend-icon="search"
            label="Rechercher (commune, bailleur,adresse...)"
            v-debounce:500ms="newSearch"
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
            :single-expand="true"
            show-expand
            class="elevation-1"
            no-data-text="Aucune réservation trouvée"
            no-results-text="Recherche infructueuse"
            :footer-props="{ disableItemsPerPage: true }"
          >
            <template #item.modify="{ item }">
              <v-tooltip left color="primary">
                <template #activator="{ on }">
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
            </template>
            <template #item.remove="{ item }">
              <v-tooltip left color="primary">
                <template #activator="{ on }">
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
            </template>
            <template #expanded-item="{ headers, item }">
              <td :colspan="headers.length">
                Bailleur initial: {{ item.FirstBeneficiary || 'inchangé' }}
                <br />
                Loyer : {{item.Loan || '-' }},
                Charges : {{item.Charges || '-' }},
                Surface : {{ item.Area || '-'}}
                <br />
                RPLS : {{ item.RPLS || '-'}},
                Convention : {{item.Convention || '-' }}
                <br />
                Type : {{item.Typology ||'-' }}
                <br />
                Date de cession : {{ item.TransferDate | date }},
                Cédé à : {{ item.Transfer || '-'}}
              </td>
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
            <span>Ajouter une nouvelle réservation</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-btn color="primary" text @click="download">Export Excel</v-btn>
    </v-card-actions>
    <reservation-fee-dlg v-model="dlg" :item="item" :action="action" @confirm="confirm" />
    <delete-dlg v-model="delDlg" :sentence="delMsg" @confirm="delConfirm()" />
  </v-card>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import * as types from '@/store/types.js'
import ReservationFeeDlg from './ReservationFeeDlg.vue'
import DeleteDlg from '@/components/DeleteDialog.vue'
const nullItem = {
  CurrentBeneficiaryID: null,
  CurrentBeneficiary: '',
  FirstBeneficiaryID: null,
  FirstBeneficiary: '',
  CityCode: null,
  City: null,
  AddressNumber: '',
  AddressStreet: '',
  RPLS: '',
  Convention: '',
  ConventionTypeID: null,
  ConventionType: '',
  Count: null,
  TransferDate: null,
  CommentID: null,
  Comment: null,
  TransferID: null,
  Transfer: null,
  PMR: false,
  ConventionDate: null,
  EliseRef: null,
  Area: null,
  EndYear: null,
  Loan: null,
  Charges: null,
}
export default {
  name: 'ReservationFeesCard',
  components: { ReservationFeeDlg, DeleteDlg },
  data () {
    return {
      search: '',
      headers: [
        { text: 'Ville', value: 'City', sortable: false },
        { text: 'Num.', value: 'AddressNumber', sortable: false },
        { text: 'Adresse', value: 'AddressStreet', sortable: false },
        { text: 'Bailleur', value: 'CurrentBeneficiary', sortable: false },
        { text: 'Convention', value: 'ConventionType', sortable: false },
        { text: '', value: 'modify', sortable: false, width: '1%' },
        { text: '', value: 'remove', sortable: false, width: '1%' },
        { text: '', value: 'data-table-expand' },
      ],
      page: 1,
      item: {},
      dlg: false,
      action: 'create',
      delDlg: false,
    }
  },
  methods: {
    newSearch (val) {
      this.search = val
      this.getReservationFees(this.page)
    },
    async getReservationFees (p) {
      await this.$store.dispatch(types.GET_RESERVATION_FEES,
        { Search: this.search, Page: p })
      if (this.currentPage !== this.page) {
        this.page = this.currentPage
      }
    },
    async download () {
      await this.$store.dispatch(types.EXPORT_RESERVATION_FEES,
        { Search: this.search })
    },
    async delete (item) {
      await this.$store.dispatch(types.DELETE_RESERVATION_FEE, item.ID)
    },
    modify (item) {
      this.item = { ...item }
      this.action = 'modify'
      this.dlg = true
    },
    add () {
      this.item = { ...nullItem }
      this.action = 'create'
      this.dlg = true
    },
    remove (item) {
      this.item = { ...item }
      this.delDlg = true
    },
    async confirm (reservationFee) {
      const action = this.action === 'modify'
        ? types.UPDATE_RESERVATION_FEE
        : types.CREATE_RESERVATION_FEE
      await this.$store.dispatch(action, { ReservationFee: { ...reservationFee } })
      await this.getReservationFees(this.page)
    },
    async delConfirm () {
      await this.$store.dispatch(types.DELETE_RESERVATION_FEE, this.item.ID)
      this.delDlg = false
      await this.getReservationFees(this.page)
    },
  },
  computed: {
    ...mapGetters(['isAdmin', 'loading']),
    ...mapState({
      items: state => state.reservationFees.reservationFeesList,
      itemsCount: state => state.reservationFees.reservationFeesItemsCount,
      currentPage: state => state.reservationFees.reservationFeesPage,
    }),
    delMsg () {
      return `Supprimer la réservation du ${this.item.AddressNumber} ${this.item.AddressStreet} à ${this.item.City}`
    },
  },
  created () {
    this.$store.dispatch(types.GET_INITIAL_RESERVATION_FEES, { Page: 0, Search: '' })
  },
  watch: {
    async page (p) {
      if (p !== this.currentPage) {
        this.getReservationFees(p)
      }
    },
  },
}
</script>

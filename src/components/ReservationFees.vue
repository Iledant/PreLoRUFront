<template>
  <v-card>
    <v-card-title class="white--text primary headline">Contingent régional</v-card-title>
    <v-container fluid grid-list-md>
      <v-layout wrap>
        <v-flex xs12 sm6>
          <v-text-field
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
            class="elevation-1"
            no-data-text="Aucune réservation trouvée"
            no-results-text="Recherche infructueuse"
            :footer-props="{ disableItemsPerPage: true }"
          >
            <template v-slot:item="{ item }">
              <tr>
                <td class="text-left">{{ item.City }}</td>
                <td class="text-left">{{ item.AddressNumber }}</td>
                <td class="text-left">{{ item.AddressStreet }}</td>
                <td class="text-left">{{ item.CurrentBeneficiary }}</td>
                <td class="text-left">{{ item.ConventionType }}</td>
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
            <span>Ajouter une nouvelle réservation</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-btn text small @click="excelExport()" color="primary">Export Excel</v-btn>
      <v-file-input
        accept="*.xlsx"
        label="Tester l'import d'un contingent"
        :loading="loading"
        show-size
        @change="chkAndUpload($event,testUpload)"
        v-if="isAdmin"
      />
      <v-file-input
        accept="*.xlsx"
        label="Importer un contingent"
        :loading="loading"
        show-size
        @change="chkAndUpload($event,upload)"
        v-if="isAdmin"
      />
    </v-card-actions>
    <reservation-fee-dlg v-model="dlg" :item="item" :action="action" @confirm="confirm" />
    <delete-dlg v-model="delDlg" :sentence="delMsg" @confirm="delConfirm()" />
    <v-dialog max-width="500px" v-model="testDlg">
      <v-card>
        <v-card-title class="title primary white--text">Résultat du test</v-card-title>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>Nombre de lignes lues : {{batchSize}}</v-flex>
            <v-flex xs12>Bénéficiaires manquants : {{missingBeneficiaries.toString()}}</v-flex>
            <v-flex xs12>Villes manquantes : {{missingCities.toString()}}</v-flex>
          </v-layout>
        </v-container>
        <v-card-actions class="tertiary">
          <v-spacer />
          <v-btn text color="primary" @click="testDlg = false">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import * as types from '../store/types.js'
import { chkAndUpload } from './mixins'
import ReservationFeeDlg from './ReservationFeeDlg.vue'
import DeleteDlg from './DeleteDialog.vue'
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
  Charges: null
}
export default {
  name: 'ReservationFees',
  components: { ReservationFeeDlg, DeleteDlg },
  mixins: [chkAndUpload],
  data () {
    return {
      search: '',
      headers: [
        { text: 'Ville', value: 'City', sortable: false },
        { text: 'Num.', value: 'AddressNumber', sortable: false },
        { text: 'Adresse', value: 'AddressStreet', sortable: false },
        { text: 'Bailleur', value: 'CurrentBeneficiary', sortable: false },
        { text: 'Convention', value: 'ConventionType', sortable: false },
        { text: '', value: '', sortable: false, width: '1%' },
        { text: '', value: '', sortable: false, width: '1%' }
      ],
      page: 1,
      item: {},
      dlg: false,
      action: 'create',
      delDlg: false,
      batchSize: 0,
      missingCities: [],
      missingBeneficiaries: [],
      testDlg: false
    }
  },
  methods: {
    async upload (file) {
      await this.$store.dispatch(types.UPLOAD_RESERVATION_FEES, file)
      this.getReservationFees(this.page)
    },
    async testUpload (file) {
      const resp = await this.$store.dispatch(types.TEST_UPLOAD_RESERVATION_FEES, file)
      if (resp !== null) {
        this.batchSize = resp.BatchSize
        this.missingCities = [...resp.MissingCities]
        this.missingBeneficiaries = [...resp.MissingBeneficiaries]
        this.testDlg = true
      }
    },
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
    async excelExport () {
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
    }
  },
  computed: {
    ...mapGetters(['isAdmin', 'loading']),
    ...mapState({
      items: state => state.reservationFees.reservationFeesList,
      itemsCount: state => state.reservationFees.reservationFeesItemsCount,
      currentPage: state => state.reservationFees.reservationFeesPage
    }),
    delMsg () {
      return `Supprimer la réservation du ${this.item.AddressNumber} ${this.item.AddressStreet} à ${this.item.City}`
    }
  },
  created () {
    this.$store.dispatch(types.GET_INITIAL_RESERVATION_FEES, { Page: 0, Search: '' })
  },
  watch: {
    async page (p) {
      if (p !== this.currentPage) {
        this.getReservationFees(p)
      }
    }
  }
}
</script>

<template>
  <v-card>
    <v-container fluid grid-list-md>
      <v-layout wrap>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field label="Rechercher" v-model="search" prepend-icon="search"/>
        </v-flex>
        <v-flex xs12>
          <v-data-table
            :headers="headers"
            :items="items"
            item-key="ID"
            :loading="loading"
            :search="search"
            dense
            class="elevation-1"
            no-data-text="Aucun report trouvé"
            no-results-text="Recherche infructueuse"
          >
            <template #item="{ item }">
              <tr>
                <td>{{ item.Beneficiary }}</td>
                <td>{{ item.SourceIRISCode }}</td>
                <td>{{ item.Area | number }}</td>
                <td>{{ item.DestIRISCode || '-' }}</td>
                <td>{{ item.DestDate | date }}</td>
                <td class="text-center px-0">
                  <v-btn text icon color="primary" @click="edit(item)">
                    <v-icon>create</v-icon>
                  </v-btn>
                </td>
                <td class="text-center px-0">
                  <v-btn text icon color="primary" @click="remove(item)">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
        <v-flex xs12 class="text-right">
          <v-tooltip left color="primary">
            <template #activator="{ on }">
              <v-btn color="primary" fab dark x-small @click="addReport" v-on="on">
                <v-icon>add</v-icon>
              </v-btn>
            </template>
            <span>Ajouter un nouveau report</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
    </v-container>
    <reservation-report-dlg
      v-model="dialog"
      :title="dlgTitle"
      :button="dlgBtn"
      :item="item"
      @confirm="save"
    />

    <delete-dialog
      v-model="delDlg"
      sentence="Supprimer le report définitivement ?"
      @confirm="delConfirm"
    />
  </v-card>
</template>

<script>
import DeleteDialog from '@/components/DeleteDialog.vue'
import ReservationReportDlg from './ReservationReportDlg.vue'
import * as types from '@/store/types'
const nullItem = {
  ID: 0,
  Area: null,
  SourceIRISCode: '',
  BeneficiaryID: 0,
  BeneficiaryName: '',
  DestIRISCode: null,
  DestDate: null,
}
export default {
  name: 'ReservationReportCard',
  components: { DeleteDialog, ReservationReportDlg },
  data () {
    return {
      search: '',
      headers: [
        { text: 'Bénéficiaire', value: 'Beneficiary' },
        { text: 'Code IRIS', value: 'SourceIRISCode' },
        { text: 'Surface', value: 'Area' },
        { text: 'Utilisé sur', value: 'DestIRISCode' },
        { text: 'Utilisé le', value: 'DestDate' },
        { text: '', name: '', width: '1%', sortable: false },
        { text: '', name: '', width: '1%', sortable: false },
      ],
      item: { ...nullItem },
      delDlg: false,
      dialog: false,
      dlgTitle: 'Créer un nouveau report',
      dlgBtn: 'Créer',
    }
  },
  computed: {
    items () {
      return this.$store.state.reservationFees.reservationReportList
    },
    loading () {
      return this.$store.getters.loading
    },
  },
  methods: {
    remove (item) {
      this.item = { ...item }
      this.delDlg = true
    },
    delConfirm () {
      this.$store.dispatch(types.DELETE_RESERVATION_REPORT, this.item.ID)
    },
    addReport () {
      this.item = { ...nullItem }
      this.dlgTitle = 'Créer un nouveau report'
      this.dlgBtn = 'Créer'
      this.dialog = true
    },
    edit (item) {
      this.item = { ...item }
      this.dlgTitle = 'Modifier le report'
      this.dlgBtn = 'Modifier'
      this.dialog = true
    },
    save (r) {
      const action =
        this.dlgBtn === 'Créer'
          ? types.CREATE_RESERVATION_REPORT
          : types.UPDATE_RESERVATION_REPORT
      this.$store.dispatch(action, r)
    },
  },
}
</script>

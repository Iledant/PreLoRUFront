<template>
  <v-card>
    <v-card-title class="secondary white--text headline">
      Gestion des demandes de paiement
    </v-card-title>
    <v-container grid-list-md fluid>
      <v-layout row wrap>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field
            label="Recherche"
            single-line
            hide-details
            v-model="search"
            prepend-icon="search"
          />
        </v-flex>
        <v-flex sm3 />
        <v-flex xs12>
          <v-data-table
            :loading="loading"
            :headers="headers"
            :items="paymentDemands"
            :search="search"
            dense
            class="elevation-1"
            no-data-text="Aucune demande de paiement trouvée"
            no-results-text="Recherche infructueuse"
          >
            <template #item="{item}">
              <tr>
                <td class="px-0">
                  <v-tooltip right color="primary">
                    <template #activator="{ on }">
                      <v-btn
                        text
                        icon
                        small
                        @click="edit(item)"
                        color="secondary"
                        v-on="on"
                      >
                        <v-icon>edit</v-icon>
                      </v-btn>
                    </template>
                    <span>Modifier l'exclusion</span>
                  </v-tooltip>
                </td>
                <td>{{ item.ImportDate | date }}</td>
                <td>{{ item.IrisCode }}</td>
                <td>{{ item.Beneficiary }}</td>
                <td>{{ item.DemandDate | date }}</td>
                <td>{{ item.DemandValue | currency }}</td>
                <td>
                  <v-tooltip left color="primary">
                    <template #activator="{ on }">
                      <div v-on="on">{{ item.CsfDate | date }}</div>
                    </template>
                    <span>{{ item.CsfComment || '-' }}</span>
                  </v-tooltip>
                </td>
                <td>{{ item.ProcessedDate | date }}</td>
                <td>
                  <v-tooltip left color="primary">
                    <template #activator="{ on }">
                      <v-icon v-on="on">{{ item.Excluded | displayBool }}</v-icon>
                    </template>
                    <span>{{ item.ExcludedComment || '-' }}</span>
                  </v-tooltip>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-btn color="primary" text @click="download">Export Excel</v-btn>
    </v-card-actions>
    <payment-demand-dlg :paymentDemand="item" v-model="showDlg" @save="save" />
  </v-card>
</template>

<script>
import * as types from '@/store/types.js'
import PaymentDemandDlg from './PaymentDemands/PaymentDemandDlg.vue'
import { excelExport, valStyle, dateStyle } from '@/excel'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'PaymentDemands',
  components: { PaymentDemandDlg },
  data: () => ({
    search: '',
    headers: [
      { text: '', value: '', sortable: false, width: '1%' },
      { text: 'Import', value: 'ImportDate' },
      { text: 'Code IRIS', value: 'IrisCode' },
      { text: 'Bénéficiaire', value: 'Beneficiary' },
      { text: 'Demandé le', value: 'DemandDate' },
      { text: 'Montant', value: 'DemandValue' },
      { text: 'CSF le', value: 'CsfDate' },
      { text: 'Traité le', value: 'ProcessedDate' },
      { text: 'Exclus', value: 'Excluded' }
    ],
    item: { excluded: false, excluded_comment: null },
    showDlg: false
  }),
  computed: {
    ...mapGetters(['loading']),
    ...mapState({
      paymentDemands: state => state.paymentDemands.paymentDemands
    })
  },
  methods: {
    edit (item) {
      this.item = { ...item }
      this.showDlg = true
    },
    save () {
      this.$store.dispatch(types.UPDATE_PAYMENT_DEMAND,
        { PaymentDemand: this.item })
    },
    download () {
      const lines = this.paymentDemands.map(l =>
        ({
          ImportDate: new Date(l.ImportDate),
          IrisCode: l.IrisCode,
          IrisName: l.IrisName,
          BeneficiaryCode: l.BeneficiaryCode,
          Beneficiary: l.Beneficiary,
          DemandNumber: l.DemandNumber,
          DemandDate: new Date(l.DemandDate),
          ReceiptDate: new Date(l.ReceiptDate),
          DemandValue: l.DemandValue * 0.01,
          CsfDate: l.CsfDate ? new Date(l.CsfDate) : null,
          CsfComment: l.CsfComment,
          DemandStatus: l.DemandStatus,
          StatusComment: l.StatusComment,
          Excluded: l.Excluded,
          ExcludedComment: l.ExcludedComment,
          ProcessedDate: l.ProcessedDate ? new Date(l.ProcessedDate) : null
        })
      )
      const columns = [
        { header: 'Importé le', key: 'ImportDate', ...dateStyle },
        { header: 'Code IRIS', key: 'IrisCode', width: 20 },
        { header: 'Nom IRIS', key: 'IrisName', width: 30 },
        { header: 'Code bén.', key: 'BeneficiaryCode', width: 10 },
        { header: 'Bénéficiaire', key: 'Beneficiary', width: 30 },
        { header: 'Num. ', key: 'DemandNumber', width: 8 },
        { header: 'Demandé le', key: 'DemandDate', ...dateStyle },
        { header: 'Reçu le', key: 'ReceiptDate', ...dateStyle },
        { header: 'Montant', key: 'DemandValue', ...valStyle },
        { header: 'CSF le', key: 'CsfDate', ...dateStyle },
        { header: 'Commentaire', key: 'CsfComment', width: 30 },
        { header: 'Status', key: 'DemandStatus', width: 20 },
        { header: 'Commentaire', key: 'StatusComment', width: 20 },
        { header: 'Exclus', key: 'Excluded', width: 8 },
        { header: 'Commentaire', key: 'ExcludedComment', width: 20 },
        { header: 'Traité le', key: 'ProcessedDate', ...dateStyle }
      ]
      excelExport(lines, columns, 'Demandes de paiement')
    }
  },
  created () {
    this.$store.dispatch(types.GET_PAYMENT_DEMANDS)
  }
}
</script>

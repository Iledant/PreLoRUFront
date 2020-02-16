<template>
  <v-card>
    <v-card-text>
      <v-layout wrap>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field v-model="search" label="Rechercher" />
        </v-flex>
        <v-flex xs12>
          <v-data-table
            :headers="headers"
            :items="commitments"
            class="elevation-1"
            item-key="ID"
            :loading="loading"
            :search="search"
            dense
          >
            <template v-slot:item="{ item }">
              <tr>
                <td class="text-left text-no-wrap">{{ item.CreationDate | date }}</td>
                <td class="text-left text-no-wrap">{{ item.CaducityDate | date }}</td>
                <td class="text-left">{{ item.BeneficiaryName }}</td>
                <td class="text-left">{{ item.Name }}</td>
                <td class="text-left text-no-wrap">{{ item.IrisCode }}</td>
                <td class="text-right text-no-wrap">{{ item.Value | currency }}</td>
                <td class="text-center">
                  <v-icon>{{ item.SoldOut | displayBool }}</v-icon>
                </td>
              </tr>
            </template>
            <template v-slot:body.append="">
              <tr class="font-weight-medium">
                <td class="text-left">Total</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td class="text-right">{{ total | currency }}</td>
                <td></td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-btn color="primary" text @click="download">Export Excel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { excelExport } from '../excel'
export default {
  name: 'CommitmentsCard',
  props: {
    commitments: { type: Array, default: () => [] },
    loading: { type: Boolean, required: true },
    fileName: { type: String, required: true }
  },
  data () {
    return {
      headers: [
        { text: 'Date', value: 'CreationDate', align: 'center' },
        { text: 'Caducité', value: 'CaducityDate', align: 'center' },
        { text: 'Bénéficiaire', value: 'BeneficiaryName', align: 'center' },
        { text: 'Objet', value: 'Name', align: 'center' },
        { text: 'IRIS', value: 'IrisCode', align: 'center' },
        { text: 'Montant', value: 'Value', align: 'center' },
        { text: 'Soldé', value: 'SoldOut', align: 'center' }
      ],
      search: ''
    }
  },
  computed: {
    total () {
      return this.commitments.reduce((a, c) => a + c.Value, 0)
    }
  },
  methods: {
    download () {
      const columns = [
        { header: 'Année', key: 'Year', width: 6 },
        {
          header: 'Création',
          key: 'CreationDate',
          width: 10,
          style: { numberFormat: 'dd/mm/yy' }
        },
        {
          header: 'Modification',
          key: 'ModificationDate',
          width: 10,
          style: { numberFormat: 'dd/mm/yy' }
        },
        {
          header: 'Caducité',
          key: 'CaducityDate',
          width: 10,
          style: { numberFormat: 'dd/mm/yy' }
        },
        { header: 'Code', key: 'Code', width: 10 },
        { header: 'Numéro', key: 'Number', width: 10 },
        { header: 'Ligne', key: 'Line', width: 6 },
        { header: 'Libellé', key: 'Name', width: 20 },
        {
          header: 'Montant',
          key: 'Value',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true
        },
        { header: 'Bénéficiaire', key: 'BeneficiaryName', width: 20 },
        { header: 'Code IRIS', key: 'IrisCode', width: 10 },
        { header: 'Soldé', key: 'SoldOut', width: 6 }
      ]
      const formattedCommitments = this.commitments.map(
        ({ Value, SoldOut, ...others }) => ({
          Value: 0.01 * Value,
          SoldOut: SoldOut ? 'Oui' : 'Non',
          ...others
        })
      )
      excelExport(formattedCommitments, columns, 'Engagements' + this.fileName)
    }
  }
}
</script>

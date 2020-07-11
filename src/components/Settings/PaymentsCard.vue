<template>
  <v-card>
    <v-container grid-list-md fluid>
      <v-layout wrap>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field v-model="search" label="Rechercher" prepend-icon="search"/>
        </v-flex>
        <v-flex xs12>
          <v-data-table
            :headers="headers"
            :items="payments"
            class="elevation-1"
            item-key="ID"
            :loading="loading"
            :search="search"
            dense
          >
            <template #item="{ item }">
              <tr>
                <td class="text-left">{{ item.CreationDate | date }}</td>
                <td class="text-left">{{ item.ModificationDate | date }}</td>
                <td class="text-left">{{ item.Number }}</td>
                <td class="text-right">{{ item.Value | currency }}</td>
              </tr>
            </template>
            <template #body.append="">
              <tr class="font-weight-medium">
                <td colspan="3" class="text-center">Total</td>
                <td class="text-right">{{ total | currency }}</td>
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
  </v-card>
</template>

<script>
import { excelExport } from '@/excel'
export default {
  name: 'PaymentsCard',
  props: {
    payments: { type: Array, default: () => [] },
    loading: { type: Boolean, required: true },
    fileName: { type: String, required: true },
  },
  data () {
    return {
      search: '',
      headers: [
        { text: 'Date création', value: 'CreationDate', align: 'center' },
        { text: 'Date modif.', value: 'ModificationDate', align: 'center' },
        { text: 'Num mandat', value: 'Number', align: 'center' },
        { text: 'Montant', value: 'Value', align: 'center' },
      ],
    }
  },
  computed: {
    total () {
      return this.payments.reduce((a, c) => a + c.Value, 0)
    },
  },
  methods: {
    download () {
      const columns = [
        { header: 'Année', key: 'Year', width: 6 },
        {
          header: 'Création',
          key: 'CreationDate',
          width: 10,
          style: { numberFormat: 'dd/mm/yy' },
        },
        {
          header: 'Modification',
          key: 'ModificationDate',
          width: 10,
          style: { numberFormat: 'dd/mm/yy' },
        },
        { header: 'Code egt', key: 'CommitmentCode', width: 10 },
        { header: 'Numéro egt', key: 'CommitmentNumber', width: 10 },
        { header: 'Ligne egt', key: 'CommitmentLine', width: 6 },
        { header: 'Numéro mandat', key: 'Number', width: 20 },
        {
          header: 'Montant',
          key: 'Value',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true,
        },
      ]
      const formattedPayments = this.payments.map(
        ({ Value, CreationDate, ModificationDate, ...others }) =>
          ({
            Value: 0.01 * Value,
            CreationDate: new Date(CreationDate),
            ModificationDate: new Date(ModificationDate),
            ...others,
          }))
      excelExport(formattedPayments, columns, 'Paiements' + this.fileName)
    },
  },
}
</script>

<template>
  <v-card>
    <v-card-text>
      <v-layout wrap>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field label="Rechercher" v-model="search" prepend-icon="search" />
        </v-flex>
        <v-flex xs12>
          <v-data-table
            :headers="headers"
            :items="items"
            item-key="ID"
            :loading="loading"
            :search="search"
            class="elevation-1"
          >
            <template #item="{ item }">
              <tr>
                <td class="text-left">{{ item.CommitmentYear }}</td>
                <td class="text-left">{{ item.CommitmentCode }}</td>
                <td class="text-left">{{ item.Year }}</td>
                <td class="text-left">{{ item.CreationDate | date }}</td>
                <td class="text-left">{{ item.Number }}</td>
                <td class="text-right">{{ item.Value | currency }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" text @click="excelExport">Export Excel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { excelExport } from '@/excel'
export default {
  name: 'HousingPayments',
  data () {
    return {
      search: '',
      headers: [
        { text: 'Année egt', value: 'CommitmentYear' },
        { text: 'Code egt', value: 'CommitmentCode' },
        { text: 'Exercice mandat', value: 'Year' },
        { text: 'Date mandat', value: 'CreationDate' },
        { text: 'Numéro mandat', value: 'Number' },
        { text: 'Montant', value: 'Value' }
      ]
    }
  },
  computed: {
    loading () {
      return this.$store.state.loading.loading !== 0
    },
    items () {
      return this.$store.state.housings.housingPayments.map(p => ({
        CreationDate: p.CreationDate,
        ModificationDate: p.ModificationDate,
        Year: p.Year,
        CommitmentYear: p.CommitmentYear,
        CommitmentCode: `${p.CommitmentCode}/${p.CommitmentNumber}/${
          p.CommitmentLine
        }`,
        Value: p.Value,
        Number: p.Number
      }))
    }
  },
  methods: {
    excelExport () {
      const columns = [
        { header: 'Année egt', key: 'CommitmentYear', width: 8 },
        { header: 'Code egt', key: 'CommitmentCode', width: 20 },
        { header: 'Exercice', key: 'Year', width: 8 },
        {
          header: 'Date création',
          key: 'CreationDate',
          width: 12,
          style: { numberFormat: 'dd/mm/yyyy' }
        },
        {
          header: 'Date modification',
          key: 'ModificationDate',
          width: 12,
          style: { numberFormat: 'dd/mm/yyyy' }
        },
        { header: 'Numéro mandat', key: 'Number', width: 10 },
        {
          header: 'Montant',
          key: 'Value',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true
        }
      ]
      const formattedItems = this.items.map(
        ({ CreationDate, ModificationDate, Value, ...others }) => ({
          CreationDate: new Date(CreationDate),
          ModificationDate: new Date(ModificationDate),
          Value: Value * 0.01,
          ...others
        })
      )
      excelExport(formattedItems, columns, 'Paiement logts')
    }
  }
}
</script>

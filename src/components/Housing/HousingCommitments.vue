<template>
  <v-card>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="items"
        class="elevation-1"
        item-key="ID"
        :loading="loading"
      >
        <template #item="{ item }">
          <tr>
            <td class="text-left text-no-wrap">{{ item.CreationDate | date }}</td>
            <td class="text-left text-no-wrap">{{ item.CaducityDate | date }}</td>
            <td class="text-left text-no-wrap">{{ item.IrisCode }}</td>
            <td class="text-left">{{ item.FullCode }}</td>
            <td class="text-left">{{ item.Name }}</td>
            <td class="text-left">{{ item.Beneficiary }}</td>
            <td class="text-right text-no-wrap">{{ item.Value | currency }}</td>
            <td class="text-center">
              <v-icon>{{ item.SoldOut | displayBool }}</v-icon>
            </td>
          </tr>
        </template>
      </v-data-table>
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
  name: 'HousingCommitments.vue',
  data () {
    return {
      headers: [
        { text: 'Date', value: 'CreationDate' },
        { text: 'Caducité', value: 'CaducityDate' },
        { text: 'Code IRIS', value: 'IrisCode' },
        { text: 'Code Egt', value: 'FullCode' },
        { text: 'Objet', value: 'Name' },
        { text: 'Bénéficiaire', value: 'Beneficiary' },
        { text: 'Montant', value: 'Value' },
        { text: 'Soldé', value: 'SoldOut' },
      ],
    }
  },
  computed: {
    loading () {
      return this.$store.state.loading.loading !== 0
    },
    items () {
      return this.$store.state.housings.housingCommitments.map(c => ({
        ID: c.ID,
        Year: c.Year,
        FullCode: c.Code + '/' + c.Number + '/' + c.Line,
        CreationDate: c.CreationDate,
        ModificationDate: c.ModificationDate,
        Name: c.Name,
        Beneficiary: c.BeneficiaryName,
        Value: c.Value,
        IrisCode: c.IrisCode,
        CoproID: c.CoproID,
        RenewProjectID: c.RenewProjectID,
        HousingID: c.HousingID,
        SoldOut: c.SoldOut,
      }))
    },
  },
  methods: {
    excelExport () {
      const columns = [
        { header: 'Année', key: 'Year', width: 8 },
        {
          header: 'Date création',
          key: 'CreationDate',
          width: 12,
          style: { numberFormat: 'dd/mm/yyyy' },
        },
        {
          header: 'Date modification',
          key: 'ModificationDate',
          width: 12,
          style: { numberFormat: 'dd/mm/yyyy' },
        },
        { header: 'Libellé', key: 'Name', width: 60 },
        { header: 'Bénéficiaire', key: 'Beneficiary', width: 30 },
        { header: 'Code IRIS', key: 'IrisCode', width: 10 },
        { header: 'Code egt', key: 'FullCode', width: 14 },
        {
          header: 'Montant',
          key: 'Value',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true,
        },
        {
          header: 'Soldé',
          key: 'SoldOut',
          width: 8,
        },
      ]
      const formattedItems = this.items.map(
        ({ CreationDate, ModificationDate, SoldOut, Value, ...others }) => ({
          CreationDate: new Date(CreationDate),
          ModificationDate: new Date(ModificationDate),
          SoldOut: SoldOut ? 'Oui' : 'Non',
          Value: 0.01 * Value,
          ...others,
        })
      )
      excelExport(formattedItems, columns, 'Engagements logts')
    },
  },
}
</script>

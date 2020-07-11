<template>
  <v-card>
    <v-container grid-list-md fluid>
      <v-layout wrap>
        <v-flex xs12 md6 offset-md3>
          <v-text-field
            label="Recherche dans la synthèse"
            v-model="search"
            prepend-icon="search"
          />
        </v-flex>
        <v-flex xs12>
          <v-data-table
            :headers="headers"
            :items="items"
            item-key="InseeCode"
            :loading="loading"
            :search="search"
            class="elevation-1"
            dense
          >
            <template #body.prepend="">
              <tr class="font-weight-medium grey-lighten-4">
                <td colspan="3" class="text-center">Total</td>
                <td class="text-right">{{ totalBudget | currency }}</td>
                <td class="text-right">{{ totalCommitment | currency }}</td>
                <td class="text-right">{{ totalProg | currency }}</td>
                <td class="text-right">{{ totalY1 | currency }}</td>
                <td class="text-right">{{ totalY2 | currency }}</td>
                <td class="text-right">{{ totalY3 | currency }}</td>
                <td class="text-right">{{ totalY4 | currency }}</td>
                <td class="text-right">{{ totalY5 | currency }}</td>
              </tr>
            </template>
            <template #item="{ item }">
              <tr>
                <td>{{ item.InseeCode }}</td>
                <td>{{ item.CityName }}</td>
                <td>{{ item.RenewProjectName }}</td>
                <td class="text-right">{{ item.Budget | currency }}</td>
                <td class="text-right">{{ item.Commitment | currency }}</td>
                <td class="text-right">{{ item.Prog | currency }}</td>
                <td class="text-right">{{ item.Y1 | currency }}</td>
                <td class="text-right">{{ item.Y2 | currency }}</td>
                <td class="text-right">{{ item.Y3 | currency }}</td>
                <td class="text-right">{{ item.Y4 | currency }}</td>
                <td class="text-right">{{ item.Y5 | currency }}</td>
              </tr>
            </template>
            <template #body.append="">
              <tr class="grey lighten-4 font-weight-medium">
                <td colspan="3" class="text-center">Total</td>
                <td class="text-right">{{ totalBudget | currency }}</td>
                <td class="text-right">{{ totalCommitment | currency }}</td>
                <td class="text-right">{{ totalProg | currency }}</td>
                <td class="text-right">{{ totalY1 | currency }}</td>
                <td class="text-right">{{ totalY2 | currency }}</td>
                <td class="text-right">{{ totalY3 | currency }}</td>
                <td class="text-right">{{ totalY4 | currency }}</td>
                <td class="text-right">{{ totalY5 | currency }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-btn small text color="primary" @click="download">Exporter en Excel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { excelExport } from '@/excel'
const year = new Date().getFullYear()
export default {
  name: 'CoproReport',
  data () {
    return {
      search: '',
      headers: [
        { text: 'Insee', value: 'InseeCode', sortable: true },
        { text: 'Commune', value: 'CityName', sortable: true },
        { text: 'Projet RU', value: 'RenewProjectName', sortable: true },
        { text: 'Budget', value: 'Budget', sortable: true, align: 'right' },
        { text: 'Egt', value: 'Commitment', sortable: true, align: 'right' },
        { text: 'Prog.', value: 'Prog', sortable: true, align: 'right' },
        { text: String(year + 1), value: 'Y1', sortable: true, align: 'right' },
        { text: String(year + 2), value: 'Y2', sortable: true, align: 'right' },
        { text: String(year + 3), value: 'Y3', sortable: true, align: 'right' },
        { text: String(year + 4), value: 'Y4', sortable: true, align: 'right' },
        { text: String(year + 5), value: 'Y5', sortable: true, align: 'right' },
      ],
    }
  },
  computed: {
    loading () {
      return this.$store.state.loading.loading !== 0
    },
    items () {
      return this.$store.state.renewProjects.renewProjectReport
    },
    totalBudget () {
      return this.items.reduce((a, c) => a + c.Budget || 0, 0)
    },
    totalCommitment () {
      return this.items.reduce((a, c) => a + c.Commitment || 0, 0)
    },
    totalProg () {
      return this.items.reduce((a, c) => a + c.Prog || 0, 0)
    },
    totalY1 () {
      return this.items.reduce((a, c) => a + c.Y1 || 0, 0)
    },
    totalY2 () {
      return this.items.reduce((a, c) => a + c.Y2 || 0, 0)
    },
    totalY3 () {
      return this.items.reduce((a, c) => a + c.Y3 || 0, 0)
    },
    totalY4 () {
      return this.items.reduce((a, c) => a + c.Y4 || 0, 0)
    },
    totalY5 () {
      return this.items.reduce((a, c) => a + c.Y5 || 0, 0)
    },
  },
  methods: {
    download () {
      if (this.items.length === 0) {
        return
      }
      const formattedReport = this.items.map(
        ({ Budget, Commitment, Prog, Y1, Y2, Y3, Y4, Y5, ...others }) =>
          ({
            Budget: Budget ? Budget * 0.01 : null,
            Commitment: Commitment ? Commitment * 0.01 : null,
            Prog: Prog ? Prog * 0.01 : null,
            Y1: Y1 ? Y1 * 0.01 : null,
            Y2: Y2 ? Y2 * 0.01 : null,
            Y3: Y3 ? Y3 * 0.01 : null,
            Y4: Y4 ? Y4 * 0.01 : null,
            Y5: Y5 ? Y5 * 0.01 : null,
            ...others,
          }))
      const columns = [
        { header: 'Code INSEE', key: 'InseeCode', width: 10 },
        { header: 'Commune', key: 'CityName', width: 20 },
        { header: 'Projet RU', key: 'RenewProjectName', width: 30 },
        {
          header: 'Budget',
          key: 'Budget',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true,
        },
        {
          header: 'Egt.',
          key: 'Commitment',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true,
        },
        {
          header: 'Prog.',
          key: 'Prog',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true,
        },
        {
          header: String(year + 1),
          key: 'Y1',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true,
        },
        {
          header: String(year + 2),
          key: 'Y2',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true,
        },
        {
          header: String(year + 3),
          key: 'Y3',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true,
        },
        {
          header: String(year + 4),
          key: 'Y4',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true,
        },
        {
          header: String(year + 5),
          key: 'Y5',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true,
        },
      ]
      excelExport(formattedReport, columns, 'Preprog RU')
    },
  },
}
</script>

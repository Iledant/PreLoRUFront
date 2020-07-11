<template>
  <v-container fluid grid-list-md>
    <v-layout wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-text-field label="Recherche" v-model="search" prepend-icon="search"/>
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
          no-data-text="Aucun engagement stagiaire trouvé"
          no-results-text="Recherche infructueuse"
        >
          <template #item="{ item }">
            <tr>
              <td class="text-right">{{ item.CreationDate | date }}</td>
              <td>{{ item.IrisCode }}</td>
              <td>{{ item.BeneficiaryName }}</td>
              <td class="text-right">{{ item.Count }}</td>
              <td class="text-right">{{ item.ContractYear | nullable }}</td>
              <td>{{ item.Comment }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
      <v-flex xs12 class="text-right tertiary">
        <v-btn color="primary" small text @click="download">Export Excel</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { excelExport, dateStyle, valStyle } from '@/excel'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'BeneficiaryGroupPlacements',
  data () {
    return {
      search: '',
      headers: [
        { text: 'Date engt', value: 'CreationDate', align: 'right' },
        { text: 'IRIS', value: 'IrisCode' },
        { text: 'Bénéficiaire', value: 'BeneficiaryName' },
        { text: 'Nombre', value: 'Count', align: 'right' },
        { text: 'Grand compte', value: 'ContractYear', align: 'right' },
        { text: 'Commentaire', value: 'Comment' },
      ],
    }
  },
  methods: {
    download () {
      if (this.items.length === 0) {
        return
      }
      const columns = [
        { header: 'Date CP', key: 'CreationDate', ...dateStyle },
        { header: 'Code IRIS', key: 'IrisCode', width: 14 },
        { header: 'Secteur', key: 'Sector', width: 10 },
        { header: 'Code action', key: 'ActionCode', width: 12 },
        { header: 'Nom action', key: 'ActionName', width: 30 },
        { header: 'Montant', key: 'CommitmentValue', ...valStyle },
        { header: 'Bénéficiaire', key: 'BeneficiaryName', width: 20 },
        { header: 'Nombre', key: 'Count', width: 10, addTotal: true },
        { header: 'Année convention', key: 'ContractYear', width: 14 },
        { header: 'Commentaire', key: 'Comment', width: 50 },
      ]
      const formatted = this.items.map(
        ({ CreationDate, CommitmentValue, ...others }) =>
          ({
            CreationDate: new Date(CreationDate),
            CommitmentValue: CommitmentValue ? CommitmentValue * 0.01 : 0,
            ...others,
          })
      )
      excelExport(formatted, columns, 'Stagiaires groupe')
    },
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({ items: state => state.placement.placementList }),
  },
}
</script>

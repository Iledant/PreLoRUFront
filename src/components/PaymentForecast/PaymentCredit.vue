<template>
  <v-card>
    <v-container grid-list-md fluid>
      <v-flex xs12 class="title">Enveloppes disponibles</v-flex>
      <v-layout wrap align-center>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field
            prepend-icon="search"
            label="Recherche"
            single-line
            hide-details
            v-model="creditsSearch"
          />
        </v-flex>
        <v-flex sm3 />
        <v-flex xs12>
          <v-data-table
            :headers="creditsHeaders"
            :items="credits"
            class="elevation-1"
            :loading="loading"
            dense
            :search="creditsSearch"
            no-data-text="Aucune ligne à afficher"
            no-results-text="Recherche infructueuse"
          >
            <template #body.prepend="">
              <tr class="font-weight-medium grey lighten-3">
                <td colspan="7" class="text-center">Total</td>
                <td class="text-right">{{ creditsTotal | currency }}</td>
              </tr>
            </template>
            <template #item="{ item }">
              <tr>
                <td>{{ item.Chapter }}</td>
                <td>{{ item.Function }}</td>
                <td class="text-right">{{ item.Primitive | currency }}</td>
                <td class="text-right">{{ item.Reported | currency }}</td>
                <td class="text-right">{{ item.Added | currency }}</td>
                <td class="text-right">{{ item.Modified | currency }}</td>
                <td class="text-right">{{ item.Movement | currency }}</td>
                <td class="text-right">{{ item.Total | currency }}</td>
              </tr>
            </template>
            <template #body.append="">
              <tr class="font-weight-medium grey lighten-3">
                <td colspan="7" class="text-center">Total</td>
                <td class="text-right">{{ creditsTotal | currency }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
        <v-flex xs12 class="text-right">
          <v-btn
            color="primary"
            text
            small
            @click="creditsDownload"
            :disabled="credits.length === 0"
          >Export Excel</v-btn>
        </v-flex>
        <v-flex xs12 class="title">Historique des mouvements</v-flex>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field
            prepend-icon="search"
            label="Recherche"
            single-line
            hide-details
            v-model="journalSearch"
          />
        </v-flex>
        <v-flex sm3 />
        <v-flex xs12>
          <v-data-table
            :headers="journalHeaders"
            :items="journal"
            class="elevation-1"
            :loading="loading"
            dense
            :search="journalSearch"
            no-data-text="Aucune ligne à afficher"
            no-results-text="Recherche infructueuse"
          >
            <template #body.prepend="">
              <tr class="font-weight-medium grey lighten-3">
                <td colspan="4" class="text-center">Total</td>
                <td class="text-right">{{ journalTotal | currency }}</td>
              </tr>
            </template>
            <template #item="{ item }">
              <tr>
                <td>{{ item.Chapter }}</td>
                <td>{{ item.Function }}</td>
                <td>{{ item.CreationDate | date }}</td>
                <td>{{ item.Name }}</td>
                <td class="text-right">{{ item.Value | currency }}</td>
              </tr>
            </template>
            <template #body.append="">
              <tr class="font-weight-medium grey lighten-3">
                <td colspan="4" class="text-center">Total</td>
                <td class="text-right">{{ journalTotal | currency }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
        <v-flex xs12 class="text-right">
          <v-btn
            color="primary"
            text
            small
            @click="journalDownload"
            :disabled="credits.length === 0"
          >Export Excel</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import { excelExport, valStyle, dateStyle } from '@/excel.js'
import * as types from '@/store/types.js'
import { mapGetters } from 'vuex'
const actualYear = new Date().getFullYear()
export default {
  name: 'PaymentCredit',
  data: () => ({
    journalHeaders: [
      { text: 'Chapitre', value: 'Chapter' },
      { text: 'Fonction', value: 'Function' },
      { text: 'Date', value: 'CreationDate' },
      { text: 'Libellé du mouvement', value: 'Name' },
      { text: 'Montant', value: 'Value', align: 'right' }
    ],
    creditsHeaders: [
      { text: 'Chapitre', value: 'Chapter' },
      { text: 'Fonction', value: 'Function' },
      { text: 'Budget primitif', value: 'Primitive' },
      { text: 'Report', value: 'Reported' },
      { text: 'Budget suppl.', value: 'Added', align: 'right' },
      { text: 'DM', value: 'Modified', align: 'right' },
      { text: 'Mouvements', value: 'Movement', align: 'right' },
      { text: 'Total', value: 'Total', align: 'right' }
    ],
    journalSearch: '',
    creditsSearch: ''
  }),
  computed: {
    ...mapGetters(['loading', 'isAdmin']),
    journal () {
      return this.$store.state.paymentCredit.paymentCreditJournal.filter(o =>
        o.Chapter === 905 && o.Function !== 52)
    },
    journalTotal () {
      return this.journal.reduce((a, c) => a + c.Value, 0)
    },
    credits () {
      return this.$store.state.paymentCredit.paymentCredits.filter(
        o => o.Chapter === 905 && o.Function !== 52).map(o => ({
        Chapter: o.Chapter,
        Function: o.Function,
        Primitive: o.Primitive,
        Reported: o.Reported,
        Added: o.Added,
        Modified: o.Modified,
        Movement: o.Movement,
        Total: o.Primitive + o.Reported + o.Added + o.Modified + o.Movement
      }))
    },
    creditsTotal () {
      return this.credits.reduce((a, c) => a + c.Total, 0)
    }
  },
  methods: {
    fileError () {
      this.$store.commit(
        types.SET_ERROR_MESSAGE,
        'Erreur de fichier, vérifier si les colonnes requises sont présentes'
      )
    },
    journalDownload () {
      const lines = this.journal.map(
        ({ CreationDate, ModificationDate, Value, ...others }) => ({
          CreationDate: new Date(CreationDate),
          ModificationDate: new Date(ModificationDate),
          Value: 0.01 * Value,
          ...others
        })
      )
      const columns = [
        { header: 'Chapitre', key: 'Chapter', width: 10 },
        { header: 'Fonction', key: 'Function', width: 10 },
        { header: 'Création', key: 'CreationDate', ...dateStyle },
        { header: 'Modification', key: 'ModificationDate', ...dateStyle },
        { header: 'Libellé', key: 'Name', width: 10 },
        { header: 'Montant', key: 'Value', ...valStyle }
      ]
      excelExport(lines, columns, 'Enveloppes de CP')
    },
    creditsDownload () {
      const lines = this.credits.map(l => ({
        Chapter: l.Chapter,
        Function: l.Function,
        Primitive: l.Primitive * 0.01,
        Reported: l.Reported * 0.01,
        Added: l.Added * 0.01,
        Modified: l.Modified * 0.01,
        Movement: l.Movement * 0.01,
        Total: l.Total * 0.01
      }))
      const columns = [
        { header: 'Chapitre', key: 'Chapter', width: 10 },
        { header: 'Fonction', key: 'Function', width: 10 },
        { header: 'Budget primitif', key: 'Primitive', ...valStyle },
        { header: 'Report', key: 'Reported', ...valStyle },
        { header: 'Budget supplémentaire', key: 'Added', ...valStyle },
        { header: 'Décision modificative', key: 'Modified', ...valStyle },
        { header: 'Mouvements', key: 'Movement', ...valStyle },
        { header: 'Total', key: 'Total', ...valStyle }
      ]
      excelExport(lines, columns, 'Enveloppes de CP')
    }
  },
  created () {
    this.$store.dispatch(types.GET_ALL_PAYMENT_CREDITS, actualYear)
  }
}
</script>

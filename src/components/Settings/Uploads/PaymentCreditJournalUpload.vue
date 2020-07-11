<template>
  <v-layout row wrap>
    <v-flex xs12 sm6>
      <v-file-input
        label="Télécharger"
        @change="checkFile($event,upload)"
        :loading="loading"
      />
    </v-flex>
    <v-flex xs12 sm6 class="text-body-2">
      Import d'un fichier Excel (.xlsx) comportant la liste des mouvements
      d'enveloppes de crédits de paiement (mise en réserve, virements). Il est
      généré par une requête de l'infocentre CORIOLIS.
    </v-flex>
  </v-layout>
</template>

<script>
import { excelReadFile } from '@/excel'
import checkFile from './checkFile'
import * as types from '@/store/types'
export default {
  name: 'PaymentCreditJournalUpload',
  mixins: [checkFile],
  data () {
    return {
      loading: false,
    }
  },
  methods: {
    async upload (file) {
      const expectedHeaders = [
        'Chapter',
        'Function',
        'CreationDate',
        'ModificationDate',
        'Name',
        'Value',
      ]
      const parse = o => ({
        Chapter: Number(o.Chapter),
        Function: Number(o.Function),
        CreationDate: parseInt(o.CreationDate),
        ModificationDate: parseInt(o.ModificationDate),
        Name: o.Name,
        Value: parseInt(100 * o.Value),
      })
      const save = o => {
        this.$store.dispatch(types.UPLOAD_PAYMENT_CREDIT_JOURNAL,
          { PaymentCreditJournal: o })
      }
      this.loading = true
      await excelReadFile(file, expectedHeaders, save, this.fileError, parse)
      this.loading = false
    },
  },
}
</script>

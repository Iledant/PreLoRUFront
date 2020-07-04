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
      Import d'un fichier Excel (.xlsx) comportant la liste de la situation des
      enveloppes de crédits de paiement (votés, mise en réserve, virés). Il est
      généré par une requête de l'infocentre CORIOLIS.
    </v-flex>
  </v-layout>
</template>

<script>
import { excelReadFile } from '@/excel'
import checkFile from './checkFile'
import * as types from '@/store/types'
export default {
  name: 'PaymentCreditUpload',
  mixins: [checkFile],
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async upload (file) {
      const expectedHeaders = [
        'Chapter',
        'Function',
        'Primitive',
        'Reported',
        'Added',
        'Modified',
        'Movement'
      ]
      const parse = o => ({
        Chapter: Number(o.Chapter),
        Function: Number(o.Function),
        Primitive: parseInt(100 * o.Primitive),
        Reported: parseInt(100 * o.Reported),
        Added: parseInt(100 * o.Added),
        Modified: parseInt(100 * o.Modified),
        Movement: parseInt(100 * o.Movement)
      })
      const save = o => {
        this.$store.dispatch(types.UPLOAD_PAYMENT_CREDITS, { PaymentCredit: o })
      }
      this.loading = true
      await excelReadFile(file, expectedHeaders, save, this.fileError, parse)
      this.loading = false
    }
  }
}
</script>

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
      Import d'un fichier Excel (.xlsx) permettant de mettre à jour la base de
      données de PreLoRU. Le fichier à utiliser est celui généré par la requête
      dédiée de l'infocentre CORIOLIS.
    </v-flex>
  </v-layout>
</template>

<script>
import { excelReadFile } from '@/excel'
import checkFile from './checkFile'
import * as types from '@/store/types'
export default {
  name: 'PaymentUpload',
  mixins: [checkFile],
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async upload (file) {
      const expectedHeaders = [
        'CommitmentYear',
        'CommitmentCode',
        'CommitmentNumber',
        'CommitmentLine',
        'Year',
        'CreationDate',
        'ModificationDate',
        'Value',
        'Number'
      ]
      const parse = d => ({
        CommitmentYear: Number(d.CommitmentYear),
        CommitmentCode: d.CommitmentCode,
        CommitmentNumber: Number(d.CommitmentNumber),
        CommitmentLine: Number(d.CommitmentLine),
        Year: Number(d.Year),
        CreationDate: Number(d.CreationDate),
        ModificationDate: Number(d.ModificationDate),
        Value: Number(d.Value),
        Number: Number(d.Number),
        ReceiptDate: d.ReceiptDate ? Number(d.ReceiptDate) : 0
      })
      const save = o => {
        this.$store.dispatch(types.UPLOAD_PAYMENTS, { Payment: o })
      }
      this.loading = true
      await excelReadFile(file, expectedHeaders, save, this.fileError, parse)
      this.loading = false
    }
  }
}
</script>

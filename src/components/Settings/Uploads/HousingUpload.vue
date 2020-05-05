<template>
  <v-layout row wrap>
    <v-flex xs12 sm6>
      <v-file-input
        label="Télécharger"
        @change="checkFile($event,upload)"
        :loading="loading"
      />
    </v-flex>
    <v-flex xs12 sm6 class="body-2">
      Import d'un fichier Excel (.xlsx) la liste des programmes de logement
      social. Le tableau doit contenir les colonnes "Reference", "Address",
      "PLAI", "PLUS", "PLS", "ANRU".
    </v-flex>
  </v-layout>
</template>

<script>
import { excelReadFile } from '@/excel'
import checkFile from './checkFile'
import * as types from '@/store/types'
export default {
  name: 'HousingUpload',
  mixins: [checkFile],
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async upload (file) {
      const expectedHeaders =
        ['Reference', 'Address', 'PLAI', 'PLUS', 'PLS', 'ANRU']
      const parse = d => ({
        Reference: d.Reference,
        Address: d.Address,
        ZipCode: d.ZipCode ? parseInt(d.ZipCode) : null,
        PLAI: parseInt(d.PLAI),
        PLUS: parseInt(d.PLUS),
        PLS: parseInt(d.PLS),
        ANRU: Boolean(d.ANRU)
      })
      const save = o => {
        this.$store.dispatch(types.UPLOAD_HOUSINGS, { Housing: o })
      }
      this.loading = true
      await excelReadFile(file, expectedHeaders, save, this.fileError, parse)
      this.loading = false
    }
  }
}
</script>

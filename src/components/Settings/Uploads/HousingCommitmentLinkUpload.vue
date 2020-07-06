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
  name: 'HousingCommitmentLinkUpload',
  mixins: [checkFile],
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async upload (file) {
      const expectedHeaders = ['Reference', 'IRISCode']
      const parse = d => ({
        Reference: String(d.Reference),
        IRISCode: String(d.IRISCode)
      })

      const save = o => {
        this.$store.dispatch(types.UPLOAD_HOUSING_COMMITMENT_LINK,
          { HousingCommitmentBach: o })
      }
      this.loading = true
      await excelReadFile(file, expectedHeaders, save, this.fileError, parse)
      this.loading = false
    }
  }
}
</script>

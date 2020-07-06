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
      Import d'un fichier Excel (.xlsx) la liste des couples numéros de fiche
      IRIS et référence de copropriétés pour faire le lien entre les engagements
      pris par la commission permanente et les labels. Le fichier doit comporter
      les colonnes "Reference" et "IRISCode". Utiliser le tableau de bord IRIS
      "PreLuRO - Lien copro engagements".
    </v-flex>
  </v-layout>
</template>

<script>
import { excelReadFile } from '@/excel'
import checkFile from './checkFile'
import * as types from '@/store/types'
export default {
  name: 'CoproCommitmentLinkUpload',
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
        this.$store.dispatch(types.UPLOAD_COPRO_COMMITMENT_LINK,
          { CoproCommitmentBatch: o })
      }
      this.loading = true
      await excelReadFile(file, expectedHeaders, save, this.fileError, parse)
      this.loading = false
    }
  }
}
</script>

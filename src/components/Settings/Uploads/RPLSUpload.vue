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
      Import d'un fichier Excel (.xlsx) de mettre à jour ou de compléter la base
      de données de PreLoRU sur le taux officiel de logement social des communes
      pour une année donnée. Le fichier doit contenir trois colonnes : le code
      INSEE de la commune ("InseeCode"), l'année du RPLS ("Year") et le taux de
      logements sociaux ("Ratio").
    </v-flex>
  </v-layout>
</template>

<script>
import { excelReadFile } from '@/excel'
import checkFile from './checkFile'
import * as types from '@/store/types'
export default {
  name: 'RPLSUpload',
  mixins: [checkFile],
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async upload (file) {
      const expectedHeaders = ['InseeCode', 'Year', 'Ratio']
      const parse = d => ({
        InseeCode: parseInt(d.InseeCode),
        Year: parseInt(d.Year),
        Ratio: Number(d.Ratio)
      })
      const save = o => {
        this.$store.dispatch(types.UPLOAD_RPLS, { RPLS: o })
      }
      this.loading = true
      await excelReadFile(file, expectedHeaders, save, this.fileError, parse)
      this.loading = false
    }
  }
}
</script>

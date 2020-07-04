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
      Import d'un fichier Excel (.xlsx) permettant de remplir le type de
      logement concerné pour une fiche IRIS pour mettre à jour la base de
      données de PreLoRU. Le tableau doit contenir deux colonnes : celui du code
      IRIS ("IRISCode") et le nom court du type de logement
      ("HousingTypeShortName").
    </v-flex>
  </v-layout>
</template>

<script>
import { excelReadFile } from '@/excel'
import checkFile from './checkFile'
import * as types from '@/store/types'
export default {
  name: 'IRISHousingTypesUpload',
  mixins: [checkFile],
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async upload (file) {
      const expectedHeaders = ['IRISCode', 'HousingTypeShortName']
      const parse = d => ({
        IRISCode: String(d.IRISCode),
        HousingTypeShortName: d.HousingTypeShortName
      })
      const save = o => {
        this.$store.dispatch(types.UPLOAD_IRIS_HOUSING_TYPES,
          { IRISHousingType: o })
      }
      this.loading = true
      await excelReadFile(file, expectedHeaders, save, this.fileError, parse)
      this.loading = false
    }
  }
}
</script>

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
      Import d'un fichier Excel (.xlsx) comportant la liste des projets urbains
      à ajouter à la base de données de PreLoRU. Le tableau doit contenir les
      colonnes "Reference", "Name", "Budget", "PRIN", "CityCode1", "CityCode2",
      "CityCode3", "Population", "CompositeIndex".
    </v-flex>
  </v-layout>
</template>

<script>
import { excelReadFile } from '@/excel'
import checkFile from './checkFile'
import * as types from '@/store/types'
export default {
  name: 'CityUpload',
  mixins: [checkFile],
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async upload (file) {
      const expectedHeaders = ['InseeCode', 'Name', 'CommunityCode', 'QPV']
      const parse = d => ({
        InseeCode: d.InseeCode,
        Name: d.Name,
        CommunityCode: d.CommunityCode
          ? d.CommunityCode !== ''
            ? String(d.CommunityCode)
            : null
          : null,
        QPV: d.QPV
      })
      const save = o => {
        this.$store.dispatch(types.UPLOAD_CITIES, { City: o })
      }
      this.loading = true
      await excelReadFile(file, expectedHeaders, save, this.fileError, parse)
      this.loading = false
    }
  }
}
</script>

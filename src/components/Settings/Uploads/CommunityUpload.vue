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
      Import d'un fichier Excel (.xlsx) comportant une liste d'intercommunalité.
      Le tableau doit contenir deux colonnes : celui du code INSEE (Code) et
      celui du nom de cette intercommunalité ('Name').
    </v-flex>
  </v-layout>
</template>

<script>
import { excelReadFile } from '@/excel'
import checkFile from './checkFile'
import * as types from '@/store/types'
export default {
  name: 'CommunityUpload',
  mixins: [checkFile],
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async upload (file) {
      const expectedHeaders = ['Code', 'Name', 'DepartmentCode']
      const parse = d => ({ Code: String(d.Code), Name: d.Name })
      const save = o => {
        this.$store.dispatch(types.UPLOAD_COMMUNITIES, { Community: o })
      }
      this.loading = true
      await excelReadFile(file, expectedHeaders, save, this.fileError, parse)
      this.loading = false
    }
  }
}
</script>

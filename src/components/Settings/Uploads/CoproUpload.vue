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
      Import d'un fichier Excel (.xlsx) comportant la liste des données de
      copropriétés à importer. Le fichier doit contenir les champs "Reference",
      "Name", "Address" et "ZipCode". Il correspond au tableau de bord IRIS
      "PreLoRU - Copros".
    </v-flex>
  </v-layout>
</template>

<script>
import { excelReadFile } from '@/excel'
import checkFile from './checkFile'
import * as types from '@/store/types'
export default {
  name: 'CoproUpload',
  mixins: [checkFile],
  data () {
    return {
      loading: false,
    }
  },
  methods: {
    async upload (file) {
      const expectedHeaders = ['Reference', 'Name', 'Address', 'ZipCode']
      const parse = d => ({
        Reference: d.Reference,
        Name: d.Name ? (d.Name.length > 0 ? d.Name : d.Address) : d.Address,
        Address: d.Address,
        ZipCode: parseInt(d.ZipCode),
        LabelDate: d.LabelDate,
        Budget: d.Budget ? parseInt(d.Budget) * 100 : null,
      })
      const save = o => {
        this.$store.dispatch(types.UPLOAD_COPROS, { Copro: o })
      }
      this.loading = true
      await excelReadFile(file, expectedHeaders, save, this.fileError, parse)
      this.loading = false
    },
  },
}
</script>

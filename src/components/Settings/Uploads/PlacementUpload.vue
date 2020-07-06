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
      Import d'un fichier Excel (.xlsx) contenant la liste des engagements de
      stagiaires pour les code IRIS. Il faut utiliser le tableau de bord IRIS
      "PreLoRU - Suivi stage W0008183". Il doit contenir les colonnes "IrisCode",
      "Count", et "ContractYear".
    </v-flex>
  </v-layout>
</template>

<script>
import { excelReadFile } from '@/excel'
import checkFile from './checkFile'
import * as types from '@/store/types'
export default {
  name: 'PlacementUpload',
  mixins: [checkFile],
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async upload (file) {
      const expectedHeaders = ['IrisCode', 'Count', 'ContractYear']
      const parse = o => ({
        IrisCode: String(o.IrisCode),
        Count: o.Count ? parseInt(o.Count) : 0,
        ContractYear: o.ContractYear ? parseInt(o.ContractYear) : null
      })
      const save = o => {
        this.$store.dispatch(types.UPLOAD_PLACEMENTS, { Placement: o })
      }
      this.loading = true
      await excelReadFile(file, expectedHeaders, save, this.fileError, parse)
      this.loading = false
    }
  }
}
</script>

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
      Import du fichier Excel de bilan global de la mandature qui contient
      toutes les informations sur les affectations proposées en commission
      permanente. Cet import doit être réalisé après une commission permanente
      une fois l'import des engagements CORIOLIS réalisés. Il permet de créer les
      nouveaux programmes de logement social à partir des données du tableau et
      de faire automatiquement les rattachements entre les engagements CORIOLIS
      et les programmes qui sont créés.
    </v-flex>
  </v-layout>
</template>

<script>
import { summaryReadFile } from '@/excel'
import checkFile from './checkFile'
import * as types from '@/store/types'
export default {
  name: 'HousingSummaryUpload',
  mixins: [checkFile],
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async upload (file) {
      const save = o => {
        this.$store.dispatch(types.UPLOAD_HOUSING_SUMMARY, { HousingSummary: o })
      }
      this.loading = true
      await summaryReadFile(file, save, this.fileError)
      this.loading = false
    }
  }
}
</script>

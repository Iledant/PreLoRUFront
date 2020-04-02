<template>
  <v-card>
    <v-card-title class="white--text primary headline">
      Imports de fichiers
    </v-card-title>
    <v-container grid-list-md fluid>
      <v-layout row wrap align-baseline>
        <v-flex xs12 md6 offset-md3>
          <v-autocomplete
            :items="items"
            label="Sélectionner le type de données à importer"
            v-model="selected" />
        </v-flex>
        <v-flex xs12>
          <component v-if="selected" :is="selected" />
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import PmtDemandUpload from './Uploads/PmtDemandUpload.vue'
import PlacementUpload from './Uploads/PlacementUpload.vue'

export default {
  name: 'Uploads',
  data () {
    return {
      selected: null,
      items: [
        { text: 'Demandes de paiement (DVS)', value: PmtDemandUpload },
        { text: 'Stagiaires', value: PlacementUpload }
      ]
    }
  }
}
</script>

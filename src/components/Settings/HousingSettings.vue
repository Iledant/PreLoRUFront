<template>
  <v-card>
    <v-card-title class="white--text primary text-h5">
      Administration des logements sociaux
    </v-card-title>
    <v-tabs
      v-model="tab"
      dark background-color="primary"
      slider-color="tertiary"
      centered
    >
      <v-tab>Types</v-tab>
      <v-tab-item>
        <housing-types />
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import * as types from '@/store/types.js'
import HousingTypes from './HousingTypes.vue'
export default {
  name: 'HousingSettings',
  components: { HousingTypes },
  data () {
    return {
      tab: null,
    }
  },
  created () {
    this.$store.dispatch(types.GET_HOUSING_TYPES)
  },
}
</script>

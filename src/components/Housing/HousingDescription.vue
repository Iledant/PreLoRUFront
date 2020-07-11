<template>
  <v-card>
    <v-card-text>
      <span class="font-weight-medium pr-2">Référence :</span>
      {{ housing ? housing.Reference : '' }}<br />
      <span class="font-weight-medium pr-2">Adresse :</span>
      {{ housing ? housing.Address : '' }}<br />
      <span class="font-weight-medium pr-2">Ville :</span>
      {{ housing ? housing.CityName : '' }}<br />
      <span class="font-weight-medium pr-2">Nombre de PLAI :</span>
      {{ housing ? housing.PLAI : '' }}<br />
      <span class="font-weight-medium pr-2">Nombre de PLUS :</span>
      {{ housing ? housing.PLUS : '' }}<br />
      <span class="font-weight-medium pr-2">Nombre de PLS :</span>
      {{ housing ? housing.PLS : '' }}<br />
      <span class="font-weight-medium pr-2">Reconstitution ANRU :</span>
      {{ housing ? (housing.ANRU ? 'oui' : 'non') : '' }}<br />
      <span class="font-weight-medium pr-2">Type de logement social :</span>
      {{ housing ? housing.HousingTypeLongName || 'nc' : '' }}
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'HousingDescription',
  computed: {
    housing () {
      return this.$store.state.housings.housing
    },
  },
}
</script>

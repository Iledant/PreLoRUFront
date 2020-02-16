<template>
  <v-card>
    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Référence</v-list-item-title>
          <v-list-item-subtitle>{{ housing ? housing.Reference : '' }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Adresse</v-list-item-title>
          <v-list-item-subtitle>{{ housing ? housing.Address : '' }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Ville</v-list-item-title>
          <v-list-item-subtitle>{{ housing ? housing.CityName : '' }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Adresse</v-list-item-title>
          <v-list-item-subtitle>{{ housing ? housing.Address : '' }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Nombre de PLAI</v-list-item-title>
          <v-list-item-subtitle>{{ housing ? housing.PLAI : '' }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Nombre de PLUS</v-list-item-title>
          <v-list-item-subtitle>{{ housing ? housing.PLUS : '' }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Nombre de PLS</v-list-item-title>
          <v-list-item-subtitle>{{ housing ? housing.PLS : '' }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Reconstitution ANRU</v-list-item-title>
          <v-list-item-subtitle>{{ housing ? (housing.ANRU ? 'oui' : 'non') : '' }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
export default {
  name: 'HousingDescription',
  computed: {
    housing () {
      return this.$store.state.housings.housing
    }
  }
}
</script>

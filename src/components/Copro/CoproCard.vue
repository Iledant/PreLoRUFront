<template>
  <v-card class="elevation-1">
    <v-list>
      <v-list-item>
        <v-list-item-content>
        <v-list-item-title>Adresse</v-list-item-title>
        <v-list-item-subtitle>{{ project ? project.Address : '' }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
        <v-list-item-title>Commune</v-list-item-title>
        <v-list-item-subtitle>{{ project ? project.CityName : '' }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
        <v-list-item-title>Enveloppe régionale</v-list-item-title>
        <v-list-item-subtitle>{{ project ? project.Budget : null | currency }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
        <v-list-item-title>Date de labellisation</v-list-item-title>
        <v-list-item-subtitle>{{ project ? project.LabelDate : null | date }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
export default {
  name: 'CoproCard',
  props: {
    project: { type: Object, default: v => {} },
  },
}
</script>

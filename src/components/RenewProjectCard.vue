<template>
  <v-card class="elevation-1">
    <v-list>
      <v-list-item>
        <v-list-item-content>
        <v-list-item-title>Type</v-list-item-title>
        <v-list-item-subtitle>
          {{ project ? (project.PRIN ? 'PRIN' : 'PRIR') : '' }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
        <v-list-item-title>Commune(s) :</v-list-item-title>
        <v-list-item-subtitle>{{ cities }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
        <v-list-item-title>Enveloppe régionale</v-list-item-title>
        <v-list-item-subtitle>
          {{ project ? project.Budget : null | currency }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
        <v-list-item-title>Catégorie région</v-list-item-title>
        <v-list-item-subtitle>
          {{ project ? project.CompositeIndex : null | number }}
        </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
export default {
  name: 'RenewProjectCard',
  props: {
    project: { type: Object, default: v => {} }
  },
  computed: {
    cities () {
      const p = this.project
      return p
        ? p.CityName1 +
            (p.CityName2 ? ',' + p.CityName2 : '') +
            (p.CityName3 ? ',' + p.CityName3 : '')
        : ''
    }
  }
}
</script>

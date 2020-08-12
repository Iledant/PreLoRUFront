<template>
  <v-container fluid>
    <v-row>
      <v-col cols="auto">
        <v-list dense>
          <v-list-item-group>
          <v-list-item dense v-for="(item, i) in tableOfContents" :key=i :href="'#' + item.link">
              {{item.title}}
          </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
      <v-col>
        <v-sheet max-width="800" class="overflow-y-auto text-justify">
        <intro />
        <principles />
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Intro from './Help/Intro.md'
import Principles from './Help/Principles.md'
export default {
  name: 'Help',
  components: { Intro, Principles },
  data () {
    return {
      tableOfContents: [
        { title: 'Introduction', link: 'intro' },
        { title: 'Principes généraux', link: 'principles' },
        { title: 'Logement social', link: 'housing' },
        { title: 'Copropriétés', link: 'copro' },
        { title: 'Renouvellement urbain', link: 'renew_project' },
        { title: 'Bénéficiaires', link: 'beneficiary' },
        { title: 'Groupes de bénéficiaires', link: 'beneficiary_group' },
        { title: 'Droits de réservation', link: 'reservation_fee' },
        { title: 'Programmation', link: 'programmation' },
        { title: 'Prévisions', link: 'prevision' },
      ],
    }
  },
}
</script>

<style scoped>
.v-sheet {
  height: calc(100vh - 136px)
}
</style>

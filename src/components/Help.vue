<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="auto">
        <v-list>
          <v-list-item-group>
          <v-list-item>
                Introduction
          </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
      <v-col style="max-width: 800px">
        <intro />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Intro from './Help/Intro.md'
export default {
  name: 'Help',
  components: { Intro },
}
</script>

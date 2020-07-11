<template>
  <v-dialog
    :value="value"
    @input="$emit('input', false)"
    persistent
    :overlay="false"
    max-width="500px"
  >
    <v-card>
      <v-card-title class="primary white--text">{{ title }}</v-card-title>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12>
            <v-text-field label="Nom" v-model="item.Name" :rules="[notEmpty]" />
          </v-flex>
        </v-layout>
      </v-container>

      <v-card-actions class="tertiary">
        <v-spacer />
        <v-btn color="primary" small text @click="$emit('input', false)">Annuler</v-btn>
        <v-btn color="primary" small text @click="confirm" :disabled="disabled">{{ button }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'RPEventTypeDlg',
  props: {
    value: { type: Boolean, default: false },
    button: { type: String, default: 'Créer' },
    title: { type: String, default: 'Créer un nouveau type d\'événement' },
    item: { type: Object, default: v => {} },
  },
  computed: {
    disabled () {
      return this.item.Name === ''
    },
  },
  methods: {
    notEmpty (x) {
      return x.length > 0 || 'Le nom doit être renseigné'
    },
    confirm () {
      if (!this.disabled) {
        this.$emit('confirm', this.item)
        this.$emit('input', false)
      }
    },
  },
}
</script>

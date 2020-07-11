<template>
  <v-dialog
    :value="value"
    @input="$emit('input', $event.target.value)"
    persistent
    max-width="500px"
  >
    <v-card>
      <v-card-title class="primary white--text"
        >Confirmer la suppression</v-card-title
      >
      <v-container grid-list-md>{{ sentence }}</v-container>

      <v-card-actions class="tertiary">
        <v-spacer />
        <v-btn color="primary" small text @click="$emit('input', false)"
          >Annuler</v-btn
        >
        <v-btn color="primary" small text @click="confirm">Supprimer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DeleteDialog',
  props: {
    sentence: { type: String, required: true },
    value: { type: Boolean, required: true },
  },
  methods: {
    confirm () {
      this.$emit('confirm')
      this.$emit('input', false)
    },
  },
}
</script>

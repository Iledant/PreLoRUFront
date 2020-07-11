<template>
  <v-dialog
    :value="value"
    @input="this.$emit('input', $event.target.value)"
    persistent
    :overlay="false"
    max-width="500px"
  >
    <v-card>
      <v-card-title class="primary white--text text-h5"
        >Lien engagement / ville</v-card-title
      >
      <v-card-text>
        <v-layout wrap>
          <v-flex xs12>
            <v-autocomplete
              :items="cities"
              item-text="Name"
              item-value="Code"
              v-model="item.CityCode"
              label="Commune"
            />
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" small text @click="$emit('input', false)"
          >Annuler</v-btn
        >
        <v-btn color="primary" small text @click="confirm" :disabled="disabled"
          >Lier</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'RenewProjectCmtCityJoinDlg',
  props: {
    value: { type: Boolean, default: false },
    item: { type: Object, default: v => {} },
    cities: { type: Array, default: v => [] },
  },
  computed: {
    disabled () {
      return this.item.CityCode === null
    },
  },
  methods: {
    confirm () {
      if (!this.disabled) {
        this.$emit('confirm', this.item)
        this.$emit('input', false)
      }
    },
  },
}
</script>

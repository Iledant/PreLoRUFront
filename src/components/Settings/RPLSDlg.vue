<template>
  <v-dialog :value="value" @input="$emit('input', false)" persistent max-width="500px">
    <v-card>
      <v-card-title class="primary white--text">{{ title }}</v-card-title>
      <v-container fluid grid-list-md>
        <v-layout wrap>
          <v-flex xs12>
            <v-autocomplete
              :items="cities"
              item-text="Name"
              item-value="InseeCode"
              v-model="item.InseeCode"
              label="Commune"
            />
          </v-flex>
          <v-flex xs12>
            <v-text-field label="Année" v-model="item.Year" :rules="[yearRule]" year reverse />
          </v-flex>
          <v-flex xs12>
            <v-text-field label="Ratio" v-model="ratio" :rules="[ratioRule]" reverse prefix="%" />
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions class="tertiary">
        <v-spacer />
        <v-btn text small color="primary" @click="$emit('input', false)">Annuler</v-btn>
        <v-btn text small color="primary" @click="confirm" :disabled="disabled">{{ button }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { yearRule, ratioRule } from '@/components/mixins'
const percentFormat = v => new Intl.NumberFormat('fr-FR', 'percent').format(v)
export default {
  name: 'RPLSDlg',
  mixins: [yearRule, ratioRule],
  props: {
    title: { type: String, default: 'Nouveau RPLS' },
    button: { type: String, default: 'Créer' },
    item: { type: Object, default: v => {} },
    value: { type: Boolean, default: false }
  },
  data () {
    return {
      ratio: ''
    }
  },
  methods: {
    confirm () {
      if (this.disabled) {
        return
      }
      const y = parseInt(this.item.Year)
      this.item.Year = y
      const c = this.cities.find(c => c.InseeCode === this.item.InseeCode)
      this.cities.CityName = c.Name
      const r = this.ratio.replace(',', '.')
      this.item.Ratio = 0.01 * parseFloat(r)
      this.$emit('confirm')
      this.$emit('input', false)
    }
  },
  computed: {
    disabled () {
      return this.item.Insee === null ||
        !this.yearCheck(this.item.Year) ||
        !this.ratioCheck(this.ratio)
    },
    cities () {
      return this.$store.state.cities.citiesList
    }
  },
  watch: {
    value () {
      this.ratio = this.item.Ratio ? percentFormat(this.item.Ratio * 100) : ''
    }
  }
}
</script>

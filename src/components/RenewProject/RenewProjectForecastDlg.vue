<template>
  <v-dialog
    :overlay="false"
    :value="value"
    @input="$emit('input', false)"
    persistent
    max-width="500px"
  >
    <v-card>
      <v-card-title class="primary white--text text-h5">{{ title }}</v-card-title>
      <v-card-text>
        <v-layout wrap>
          <v-flex xs12>
            <v-autocomplete
              v-model="forecast.CommissionID"
              :items="commissions"
              :loading="loading"
              hide-no-data
              hide-selected
              item-text="Name"
              item-value="ID"
              label="Commission"
              required
              :rules="[notNull]"
            />
          </v-flex>
          <v-flex xs12>
            <v-autocomplete
              v-model="forecast.ActionID"
              :items="budgetActions"
              :loading="loading"
              hide-no-data
              hide-selected
              item-text="Name"
              item-value="ID"
              label="Action budgétaire"
              required
              :rules="[notNull]"
            />
          </v-flex>
          <v-flex xs12>
            <v-text-field
              label="Montant"
              v-model="val"
              :rules="[valueRequired]"
              v-currency
              reverse
            />
          </v-flex>
          <v-flex xs12>
            <v-text-field label="Projet" v-model="forecast.Project" />
          </v-flex>
          <v-flex xs12>
            <v-textarea label="Commentaire" v-model="forecast.Comment" />
          </v-flex>
        </v-layout>
      </v-card-text>

      <v-card-actions class="tertiary">
        <v-spacer />
        <v-btn color="primary" small text @click="$emit('input', false)">Annuler</v-btn>
        <v-btn color="primary" small text @click="confirm" :disabled="disabled">{{ button }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { currencyFormat } from '@/components/mixins'
export default {
  name: 'RenewProjectForecastDlg',
  mixins: [currencyFormat],
  props: {
    value: { type: Boolean, default: false },
    title: { type: String, default: 'Créer une prévision' },
    button: { type: String, default: 'Créer' },
    forecast: { type: Object, default: v => {} },
  },
  data () {
    return {
      val: '',
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    commissions () {
      return this.$store.state.settings.commissionsList
    },
    disabled () {
      return (
        this.forecast.CommissionID === null ||
        this.val === '' ||
        this.forecast.ActionID === null
      )
    },
    budgetActions () {
      return this.$store.state.settings.budgetActionsList
    },
  },
  methods: {
    confirm () {
      if (!this.disabled) {
        this.$emit('input', false)
        this.forecast.Value = this.parseCurrency(this.val)
        this.$emit('confirm', this.forecast)
      }
    },
    notNull (x) {
      return x !== null || 'Une commission doit être choisie'
    },
    valueRequired (x) {
      return x !== '' || 'Montant de la prévision nécessaire'
    },
  },
  watch: {
    value () {
      this.val = this.currencyFormat(this.forecast.Value)
    },
  },
}
</script>

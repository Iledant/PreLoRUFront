<template>
  <v-dialog
    :value="value"
    @input="this.$emit('input', $event.target.value)"
    persistent
    :overlay="false"
    max-width="500px"
  >
    <v-card>
      <v-card-title class="primary white--text text-h5">
        {{ title }}
      </v-card-title>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12>
            <v-autocomplete
              :items="commissions"
              item-text="Name"
              item-value="ID"
              v-model="item.CommissionID"
              label="Commission"
              :rules="[comRequired]"
            />
          </v-flex>
          <v-flex xs12>
            <v-autocomplete
              :items="budgetActions"
              item-text="Name"
              item-value="ID"
              v-model="item.ActionID"
              label="Action budgétaire"
              :rules="[actionRequired]"
            />
          </v-flex>
          <v-flex xs12>
            <v-text-field
              label="Montant"
              v-model="val"
              v-currency
              reverse
              :rules="[prevRequired]"
            />
          </v-flex>
          <v-flex xs12>
            <v-textarea label="Commentaire" v-model="item.Comment" />
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
import { currencyFormat, prevRequired } from '@/components/mixins'
export default {
  name: 'HousingForecastDlg',
  mixins: [currencyFormat, prevRequired],
  props: {
    value: { type: Boolean, default: false },
    title: { type: String, default: 'Créer une nouvelle prévision' },
    button: { type: String, default: 'Créer' },
    item: { type: Object, default: v => {} },
    commissions: { type: Array, default: v => [] },
    budgetActions: { type: Array, default: v => [] }
  },
  data () {
    return {
      val: ''
    }
  },
  computed: {
    disabled () {
      return (
        this.item.CommissionID === null ||
        this.val === '' ||
        this.item.ActionID === null
      )
    }
  },
  methods: {
    comRequired (x) {
      return x !== null || 'Une commission doit être choisie'
    },
    actionRequired (x) {
      return x !== null || 'Une action budgétaire doit être choisie'
    },
    confirm () {
      if (!this.disabled) {
        this.$emit('input', false)
        this.item.Value = this.parseCurrency(this.val)
        this.$emit('confirm', this.item)
      }
    }
  },
  watch: {
    value () {
      this.val = this.currencyFormat(this.item.Value)
    }
  }
}
</script>

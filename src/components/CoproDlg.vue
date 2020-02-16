<template>
  <v-dialog
    :value="value"
    @input="$emit('input', $event.target.value)"
    persistent
    :overlay="false"
    max-width="500px"
  >
    <v-card>
      <v-card-title class="primary white--text">{{ title }}</v-card-title>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs6>
            <v-text-field label="Référence" v-model="item.Reference" />
          </v-flex>
          <v-flex xs6>
            <v-text-field label="Nom" v-model="item.Name" />
          </v-flex>
          <v-flex xs12>
            <v-text-field label="Adresse" v-model="item.Address" />
          </v-flex>
          <v-flex xs12>
            <v-autocomplete
              :items="cities"
              item-text="Name"
              item-value="InseeCode"
              v-model="item.ZipCode"
              label="Commune"
            />
          </v-flex>
          <v-flex xs12>
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="item.LabelDate"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="formattedDate"
                  label="Date du label"
                  prepend-icon="event"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="item.LabelDate" no-title scrollable>
                <v-spacer />
                <v-btn text color="primary" @click="menu = false">Annuler</v-btn>
                <v-btn text color="primary" @click="$refs.menu.save(item.LabelDate)">OK</v-btn>
              </v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs12>
            <v-text-field label="Budget" v-model="budget" v-currency reverse />
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
import { currencyFormat } from './mixins'
import { formatNullDate } from '../date.js'
export default {
  name: 'CoproDlg',
  mixins: [currencyFormat],
  props: {
    item: { type: Object, default: v => {} },
    button: { type: String, default: 'Créer' },
    title: { type: String, default: 'Créer une copropriété' },
    value: { type: Boolean, default: false }
  },
  data () {
    return {
      menu: false,
      budget: ''
    }
  },
  methods: {
    confirm () {
      if (!this.disabled) {
        this.$emit('input', false)
        this.item.Budget = this.parseCurrency(this.budget)
        let labelDate = null
        if (this.item.LabelDate) {
          const date = new Date(this.item.LabelDate)
          labelDate = date.toISOString()
        }
        this.item.LabelDate = labelDate
        if (this.item.Address === '') {
          this.item.Address = null
        }
        this.$emit('confirm', this.item)
      }
    }
  },
  computed: {
    disabled () {
      return (
        this.item.Reference === '' ||
        this.item.Name === ''
      )
    },
    cities () {
      return this.$store.state.cities.citiesList
    },
    formattedDate () {
      return formatNullDate(this.item.LabelDate)
    }
  },
  watch: {
    value () {
      this.budget = this.currencyFormat(this.item.Budget)
    }
  }
}
</script>

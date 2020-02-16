<template>
  <v-dialog
    :value="value"
    @input="$emit('input', false)"
    persistent
    :overlay="false"
    max-width="500px"
  >
    <v-card>
      <v-card-title class="primary white--text headline">{{
        title
      }}</v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs6>
              <v-text-field
                label="Référence"
                v-model="item.Reference"
                :rules="[refRule]"
              />
            </v-flex>
            <v-flex xs6>
              <v-checkbox label="PRIN" v-model="item.PRIN" />
            </v-flex>
            <v-flex xs6>
              <v-text-field
                label="Nom"
                v-model="item.Name"
                :rules="[notEmpty]"
              />
            </v-flex>
            <v-flex xs6>
              <v-text-field
                label="Enveloppe totale"
                v-model="budget"
                v-currency
                reverse
              />
            </v-flex>
            <v-flex xs6>
              <v-autocomplete
                v-model="item.CityCode1"
                :items="cityItems"
                :loading="loading"
                hide-no-data
                hide-selected
                item-text="Name"
                item-value="InseeCode"
                label="Première ville"
                required
                :rules="[notNull]"
              />
            </v-flex>
            <v-flex xs6>
              <v-text-field
                label="Enveloppe 1ère ville"
                v-model="budgetCity1"
                v-currency
                reverse
              />
            </v-flex>
            <v-flex xs6>
              <v-autocomplete
                v-model="item.CityCode2"
                :items="cityItems"
                :loading="loading"
                hide-no-data
                hide-selected
                item-text="Name"
                item-value="InseeCode"
                label="Deuxième ville"
              />
            </v-flex>
            <v-flex xs6>
              <v-text-field
                label="Enveloppe 2ème ville"
                v-model="budgetCity2"
                v-currency
                reverse
              />
            </v-flex>
            <v-flex xs6>
              <v-autocomplete
                v-model="item.CityCode3"
                :items="cityItems"
                :loading="loading"
                hide-no-data
                hide-selected
                item-text="Name"
                item-value="InseeCode"
                label="Troisième ville"
              />
            </v-flex>
            <v-flex xs6>
              <v-text-field
                label="Enveloppe 3ème ville"
                v-model="budgetCity3"
                v-currency
                reverse
              />
            </v-flex>
            <v-flex xs6>
              <v-text-field label="Population" v-model="item.Population" :rules="[nullUintRule]"/>
            </v-flex>
            <v-flex xs6>
              <v-select
                label="Indice composite"
                v-model="item.CompositeIndex"
                :items="compositeIndexes"
                item-text="Name"
                item-value="Value"
              />
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" small text @click="$emit('input', false)"
          >Annuler</v-btn
        >
        <v-btn
          color="primary"
          small
          text
          @click="confirm"
          :disabled="disabled"
          >{{ button }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { currencyFormat, nullUintRule } from './mixins'
const renewProjectRefCheck = r =>
  /^PR[RN](75|77|78|91|92|93|94|95)\d{2}$/.test(r)
export default {
  name: 'RenewProjectDlg',
  mixins: [currencyFormat, nullUintRule],
  props: {
    value: { type: Boolean, default: false },
    button: { type: String, default: 'Créer' },
    title: { type: String, default: 'Créer un projet de renouvellement' },
    item: { type: Object, default: v => {} }
  },
  data () {
    return {
      budget: '',
      budgetCity1: '',
      budgetCity2: '',
      budgetCity3: '',
      compositeIndexes: [
        { Name: '', Value: null },
        { Name: '1', Value: 1 },
        { Name: '2', Value: 2 },
        { Name: '3', Value: 3 },
        { Name: '4', Value: 4 }
      ]
    }
  },
  computed: {
    cityItems () {
      return [
        { Name: '<Aucun>', InseeCode: null },
        ...this.$store.state.cities.citiesList
      ]
    },
    disabled () {
      return (
        !renewProjectRefCheck(this.item.Reference) ||
        this.item.Name === '' ||
        this.item.CityCode1 === null ||
        !this.nullUintCheck(this.item.Population)
      )
    },
    loading () {
      return this.$store.getters.loading
    }
  },
  methods: {
    refRule (x) {
      return renewProjectRefCheck(x) || 'La référence doit être du type PRN9304'
    },
    notEmpty (x) {
      return x.length > 0 || 'Le nom doit être renseigné'
    },
    notNull (x) {
      return x !== null || 'Une ville doit être choisie'
    },
    confirm () {
      if (!this.disabled) {
        this.item.Budget = this.parseCurrency(this.budget)
        const population = this.item.Population
          ? parseInt(this.item.Population)
          : null
        this.item.BudgetCity1 = this.parseCurrency(this.budgetCity1)
        this.item.BudgetCity2 = this.parseCurrency(this.budgetCity2)
        this.item.BudgetCity3 = this.parseCurrency(this.budgetCity3)
        this.item.Population = population
        this.$emit('confirm', this.item)
        this.$emit('input', false)
      }
    }
  },
  watch: {
    value () {
      this.budget = this.currencyFormat(this.item.Budget)
      this.budgetCity1 = this.currencyFormat(this.item.BudgetCity1)
      this.budgetCity2 = this.currencyFormat(this.item.BudgetCity2)
      this.budgetCity3 = this.currencyFormat(this.item.BudgetCity3)
    }
  }
}
</script>

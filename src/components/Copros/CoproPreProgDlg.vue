<template>
  <v-dialog
    :value="value"
    @input="this.$emit('input', $event.target.value)"
    persistent
    :overlay="false"
    max-width="500px"
  >
    <v-card>
      <v-card-title class="primary white--text">{{ title }}</v-card-title>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12>Année de préprogrammation : {{ preProgYear }}</v-flex>
          <v-flex xs12>
            <v-autocomplete
              :items="commissions"
              item-text="Name"
              item-value="ID"
              v-model="item.CommissionID"
              label="Commission"
            />
          </v-flex>
          <v-flex xs12>
            <v-autocomplete
              :items="copros"
              item-text="FullName"
              item-value="ID"
              v-model="item.KindID"
              label="Opération"
            />
          </v-flex>
          <v-flex xs12>
            <v-autocomplete
              :items="budgetActions"
              item-text="Name"
              item-value="ID"
              v-model="item.ActionID"
              label="Action budgétaire"
            />
          </v-flex>
          <v-flex xs12>
            <v-text-field label="Montant" v-model="val" v-currency reverse />
          </v-flex>
          <v-flex xs12>
            <v-text-field label="Projet" v-model="item.PreProgProject" />
          </v-flex>
          <v-flex xs12>
            <v-textarea label="Commentaire" v-model="item.PreProgComment" />
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
import { currencyFormat } from '@/components/mixins'
export default {
  name: 'CoproPreProgDlg',
  mixins: [currencyFormat],
  props: {
    value: { type: Boolean, default: false },
    action: {
      type: String,
      default: 'create',
      validator: v => ['create', 'modify'].indexOf(v) !== -1,
    },
    item: { type: Object, default: v => {} },
    preProgYear: { type: Number, default: new Date().getFullYear() },
  },
  data () {
    return {
      val: '',
    }
  },
  computed: {
    title () {
      return this.action === 'create' ? 'Ajouter une nouvelle ligne' : 'Modifier la ligne'
    },
    button () {
      return this.action === 'create' ? 'Créer' : 'Modifier'
    },
    commissions () {
      return this.$store.state.settings.commissionsList.filter(c =>
        new Date(c.Date).getFullYear() === this.preProgYear)
    },
    budgetActions () {
      return this.$store.state.settings.budgetActionsList
    },
    copros () {
      return this.$store.state.copros.coprosList.map(
        ({ CityName, Name, ID }) => ({
          ID,
          Name,
          FullName: `[${CityName}] ${Name}`,
        })
      )
    },
    disabled () {
      return (
        this.item.CommissionID === null ||
        this.item.ActionID === null ||
        this.item.KindID === null ||
        this.val === ''
      )
    },
  },
  methods: {
    confirm () {
      if (!this.disabled) {
        this.$emit('input', false)
        this.item.PreProgValue = this.parseCurrency(this.val)
        const action = this.budgetActions.find(b => b.ID === this.item.ActionID)
        this.item.ActionName = action.Name
        this.item.ActionCode = action.Code
        const com = this.commissions.find(c => c.ID === this.item.CommissionID)
        this.item.CommissionDate = com.Date
        this.item.CommissionName = com.Name
        const copro = this.copros.find(c => c.ID === this.item.KindID)
        this.item.KindName = copro.Name
        this.$emit('confirm', this.item)
      }
    },
  },
  watch: {
    value () {
      this.val = this.currencyFormat(this.item.PreProgValue)
    },
  },
}
</script>

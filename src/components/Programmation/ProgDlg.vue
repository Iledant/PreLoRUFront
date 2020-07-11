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
          <v-flex xs12>Année de programmation : {{ progYear }}</v-flex>
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
            <v-select
              :items="kinds"
              item-text="Explicit"
              item-value="Kind"
              v-model="kind"
              label="Type"
            />
          </v-flex>
          <v-flex xs12>
            <v-autocomplete
              :items="items"
              item-text="Name"
              item-value="ID"
              v-model="item.KindID"
              label="Opération"
              :disabled="kindDisabled"
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
import { currencyFormat } from '@/components/mixins'
import { explicitKind } from '@/store/types'
export default {
  name: 'ProgDlg',
  mixins: [currencyFormat],
  props: {
    value: { type: Boolean, default: false },
    action: {
      type: String,
      default: 'create',
      validator: v => ['create', 'modify'].indexOf(v) !== -1,
    },
    item: { type: Object, default: v => {} },
    progYear: { type: Number, default: new Date().getFullYear() },
  },
  data () {
    return {
      val: '',
      kinds: explicitKind.map((k, i) => ({ Kind: i, Explicit: k })),
      kindDisabled: true,
      items: [],
      kind: 'Housing',
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
        new Date(c.Date).getFullYear() === this.progYear)
    },
    budgetActions () {
      return this.$store.state.settings.budgetActionsList
    },
    renewProjects () {
      return this.$store.state.renewProjects.renewProjectsList
    },
    copros () {
      return this.$store.state.copros.coprosList
    },
    disabled () {
      return (
        this.item.CommissionID === null ||
        this.item.ActionID === null ||
        (this.kind !== 0 && this.item.KindID === null) ||
        this.val === ''
      )
    },
  },
  methods: {
    confirm () {
      if (!this.disabled) {
        this.$emit('input', false)
        this.item.Value = this.parseCurrency(this.val)
        const action = this.budgetActions.find(
          b => b.ID === this.item.ActionID
        )
        this.item.ActionName = action.Name
        this.item.ActionCode = action.Code
        const com = this.commissions.find(c => c.ID === this.item.CommissionID)
        this.item.CommissionDate = com.Date
        this.item.CommissionName = com.Name
        this.item.Kind = this.kind + 1
        this.item.ExplicitKind = explicitKind[this.kind]
        switch (this.kind) {
          case 1:
            this.item.KindName = this.copros.find(c => c.ID === this.item.KindID).Name
            break
          case 2:
            this.item.KindName = this.renewProjects.find(r => r.ID === this.item.KindID).Name
            break
        }
        this.$emit('confirm', this.item)
      }
    },
  },
  watch: {
    value () {
      this.val = this.currencyFormat(this.item.Value)
      this.kind = this.item.Kind ? this.item.Kind - 1 : null
    },
    kind (k) {
      switch (k) {
        case 0:
          this.item.KindID = null
          this.item.KindName = null
          this.kindDisabled = true
          break
        case 1:
          this.items = [...this.copros]
          this.kindDisabled = false
          break
        case 2:
          this.items = [...this.renewProjects]
          this.kindDisabled = false
          break
      }
    },
  },
}
</script>

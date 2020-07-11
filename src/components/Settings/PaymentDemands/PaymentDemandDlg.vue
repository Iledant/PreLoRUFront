<template>
  <v-dialog :value="value" max-width="600px" persistent>
    <v-card>
      <v-card-title class="primary white--text">
        Modifier l'exclusion de la demande de paiement
      </v-card-title>
      <v-container grid-list-md fluid>
        <v-layout row wrap>
          <v-flex xs12>
            <strong>Bénéficiaire </strong>{{ paymentDemand.Beneficiary }}<br />
            <strong>Demande du </strong>{{ paymentDemand.DemandDate | date }}<br />
            <strong>Montant </strong>{{ paymentDemand.DemandValue | currency }}<br />
          </v-flex>
          <v-flex xs12>
            <v-checkbox label="Exclus ?" v-model="paymentDemand.Excluded" />
          </v-flex>
          <v-flex xs12>
            <v-textarea
              label="Commentaire pour l'exclusion"
              v-model="paymentDemand.ExcludedComment"
            />
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions class="tertiary">
        <v-spacer />
        <v-btn color="primary" text @click="$emit('input', false)">Annuler</v-btn>
        <v-btn color="primary" text @click="onSave">
          Modifier
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'PaymentDemandDlg',
  props: {
    paymentDemand: { type: Object, default: b => ({ Excluded: false, ExcludedComment: null }) },
    value: { type: Boolean, default: false },
  },
  methods: {
    onSave () {
      const normalized = { ...this.paymentDemand }
      normalized.ExcludedComment = this.paymentDemand.ExcludedComment || null
      this.$emit('input', false)
      this.$emit('save', normalized)
    },
  },
}
</script>

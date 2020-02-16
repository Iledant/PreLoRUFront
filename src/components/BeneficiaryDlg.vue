<template>
  <v-dialog :value="value" persistent :overlay="false" max-width="500px">
    <v-card>
      <v-card-title class="primary white--text headline">{{ title }}</v-card-title>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12>
            <v-text-field
              label="Code"
              v-model="item.Code"
              :rules="[intRule]"
              @keyup.esc="$emit('input', false)"
              @keyup.enter="confirm"
              />
          </v-flex>
          <v-flex xs12>
            <v-text-field
              label="Nom"
              v-model="item.Name"
              :rules="[notNull]"
              @keyup.esc="$emit('input', false)"
              @keyup.enter="confirm"
            />
          </v-flex>
          <v-flex xs12 v-if="action === 'modify'" class="body-2 font-italic">
            La modification du code d'un bénéficiaire importé de CORIOLIS peut
            provoquer des erreurs dans le fonctionnement des requêtes de PreLoRU.
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions class="tertiary">
        <v-spacer />
        <v-btn color="primary" text @click="$emit('input', false)">
          Annuler
        </v-btn>
        <v-btn color="primary" text @click="confirm" :disabled="disabled">
          {{ button }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { intRule } from './mixins'
export default {
  name: 'BeneficiaryDlg',
  mixins: [intRule],
  props: {
    value: { type: Boolean, default: false },
    action: {
      type: String,
      default: 'create',
      validator: v => ['create', 'modify'].indexOf(v) !== -1
    },
    item: { type: Object, default: v => {} }
  },
  computed: {
    disabled () { return !this.item.Name || !this.intCheck(this.item.Code) },
    title () {
      return this.action === 'create'
        ? 'Ajouter un nouveau bénéficiaire'
        : 'Modifier le bénéficiaire'
    },
    button () { return this.action === 'create' ? 'Créer' : 'Modifier' }
  },
  methods: {
    confirm () {
      if (!this.disabled) {
        const item = {
          ID: this.item.ID,
          Name: String(this.item.Name),
          Code: parseInt(this.item.Code)
        }
        this.$emit('confirm', item)
        this.$emit('input', false)
      }
    },
    notNull (text) { return !!text || 'Le nom ne peut pas être vide' }
  }
}
</script>

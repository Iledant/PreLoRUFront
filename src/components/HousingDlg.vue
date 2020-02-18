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
          <v-flex xs12>
            <v-text-field label="Référence" v-model="item.Reference" />
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
            <v-text-field label="Adresse" v-model="item.Address" />
          </v-flex>
          <v-flex xs6>
            <v-text-field label="PLAI" v-model="item.PLAI" :rules="[uintRule]"/>
          </v-flex>
          <v-flex xs6>
            <v-text-field label="PLUS" v-model="item.PLUS" :rules="[uintRule]"/>
          </v-flex>
          <v-flex xs6>
            <v-text-field label="PLS" v-model="item.PLS" :rules="[uintRule]"/>
          </v-flex>
          <v-flex xs6>
            <v-checkbox label="ANRU" v-model="item.ANRU" />
          </v-flex>
          <v-flex xs6>
            <v-select
              :items="housingTypes"
              v-model="item.HousingTypeID"
              item-text="LongName"
              item-value="ID"
              label="Type de programme"
            />
          </v-flex>
        </v-layout>
      </v-container>

      <v-card-actions class="tertiary">
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
import { uintRule } from './mixins'
import { mapState } from 'vuex'
export default {
  name: 'HousingDlg',
  mixins: [uintRule],
  props: {
    value: { type: Boolean, default: false },
    title: { type: String, default: 'Créer un logement' },
    button: { type: String, default: 'Créer' },
    item: { type: Object, default: v => {} },
    cities: { type: Array, default: v => [] }
  },
  computed: {
    disabled () {
      return (
        this.item.Reference === '' ||
        !this.uintCheck(this.item.PLAI) ||
        !this.uintCheck(this.item.PLUS) ||
        !this.uintCheck(this.item.PLS)
      )
    },
    ...mapState({
      housingTypes: state => [
        { ID: null, LongName: '<Non connu>' },
        ...state.housingTypes.housingTypesList
      ]
    })
  },
  methods: {
    confirm () {
      if (!this.disabled) {
        this.$emit('input', false)
        const item = {
          ZipCode: this.item.ZipCode ? parseInt(this.item.ZipCode) : null,
          PLAI: parseInt(this.item.PLAI),
          PLUS: parseInt(this.item.PLUS),
          PLS: parseInt(this.item.PLS),
          ANRU: this.item.ANRU,
          Address: this.item.Address,
          Reference: this.item.Reference,
          HousingTypeID: this.item.HousingTypeID,
          ID: this.item.ID
        }
        this.$emit('confirm', item)
      }
    }
  }
}
</script>

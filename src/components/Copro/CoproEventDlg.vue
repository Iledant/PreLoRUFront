<template>
  <v-dialog
    :value="value"
    @input="$emit('input', false)"
    persistent
    :overlay="false"
    max-width="500px"
  >
    <v-card>
      <v-card-title class="primary white--text text-h5">{{ title }}</v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="item.Date"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template #activator="{ on }">
                  <v-text-field
                    v-model="formattedDate"
                    label="Date de l'événement"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="item.Date" no-title scrollable locale="fr-FR">
                  <v-spacer />
                  <v-btn text color="primary" @click="menu = false">Annuler</v-btn>
                  <v-btn text color="primary" @click="$refs.menu.save(item.Date)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs12>
              <v-autocomplete
                v-model="item.CoproEventTypeID"
                :items="eventTypes"
                :loading="loading"
                hide-no-data
                hide-selected
                item-text="Name"
                item-value="ID"
                label="Type d'événement"
                required
                :rules="[notNull]"
              />
            </v-flex>
            <v-flex xs12>
              <v-textarea label="Commentaire" v-model="item.Comment" />
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" small text @click="$emit('input', false)">Annuler</v-btn>
        <v-btn color="primary" small text @click="confirm" :disabled="disabled">{{ button }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { formatNullDate } from '@/date.js'
export default {
  name: 'CoproEventDlg',
  props: {
    value: { type: Boolean, default: false },
    action: {
      type: String,
      default: 'create',
      validator: v => ['create', 'modify'].indexOf(v) !== -1
    },
    item: { type: Object, default: v => {} }
  },
  data () {
    return {
      menu: null
    }
  },
  computed: {
    disabled () {
      return this.item.CoproEventTypeID === null || this.item.Date === null
    },
    title () {
      return this.action === 'create' ? 'Ajouter un nouvel événement' : 'Modifier l\'événement'
    },
    button () {
      return this.action === 'create' ? 'Créer' : 'Modifier'
    },
    formattedDate () {
      return formatNullDate(this.item.Date)
    },
    eventTypes () {
      return this.$store.state.coproEventTypes.coproEventTypeList
    },
    loading () {
      return this.$store.state.loading.loading !== 0
    }
  },
  methods: {
    notNull (x) {
      return x !== null || 'Une date doit être choisie'
    },
    confirm () {
      if (!this.disabled) {
        const d = new Date(this.item.Date).toISOString()
        this.item.Date = d
        this.$emit('confirm', this.item)
        this.$emit('input', false)
      }
    }
  }
}
</script>

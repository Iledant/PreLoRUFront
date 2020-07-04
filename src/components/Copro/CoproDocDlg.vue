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
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12>
            <v-text-field label="Nom" v-model="item.Name" />
          </v-flex>
          <v-flex xs12>
            <v-text-field label="Lien" v-model="item.Link" />
          </v-flex>
          <v-flex xs12 class="text-caption">
            Il faut coller l'adresser directement dans le champ lien.
            Pour des raisons de sécurité, il n'est pas possible dans Chrome
            de récupérer autrement l'adresse d'un fichier.
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
export default {
  name: 'CoproDocDlg',
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
      return this.item.Name === null ||
        this.item.Name === '' ||
        this.item.Link === '' ||
        this.item.Link === null
    },
    title () {
      return this.action === 'create'
        ? 'Ajouter un nouvel événement'
        : 'Modifier l\'événement'
    },
    button () {
      return this.action === 'create' ? 'Créer' : 'Modifier'
    },
    loading () {
      return this.$store.state.loading.loading !== 0
    }
  },
  methods: {
    confirm () {
      if (!this.disabled) {
        this.$emit('confirm', this.item)
        this.$emit('input', false)
      }
    }
  }
}
</script>

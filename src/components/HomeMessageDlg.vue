<template>
  <v-dialog
    :value="value"
    @input="this.$emit('input', $event.target.value)"
    persistent
    :overlay="false"
    max-width="500px"
  >
    <v-card>
      <v-card-title class="primary white--text">Message d'accueil</v-card-title>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12>
            <v-text-field label="Titre" v-model="val.Title" />
          </v-flex>
          <v-flex xs12>
            <v-textarea label="Corps" v-model="val.Body" />
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions class="tertiary">
        <v-spacer />
        <v-btn color="primary" small text @click="$emit('input', false)">Annuler</v-btn>
        <v-btn color="primary" small text @click="confirm" :disabled="disabled">Sauver</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'HomeMessageDlg',
  props: {
    value: { type: Boolean, default: false },
    msg: { type: Object, default: v => {} }
  },
  data () {
    return {
      val: { Title: '', Body: '' }
    }
  },
  computed: {
    disabled () {
      return (
        this.val.Title === null ||
        this.val.Title === '' ||
        this.val.Body === null ||
        this.val.Body === ''
      )
    }
  },
  methods: {
    confirm () {
      if (!this.disabled) {
        this.$emit('input', false)
        this.$emit('confirm', this.val)
      }
    }
  },
  watch: {
    value () {
      if (this.msg) {
        this.val = { ...this.msg }
      }
    }
  }
}
</script>

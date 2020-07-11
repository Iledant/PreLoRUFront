<template>
  <v-dialog
    :value="value"
    @input="$emit('input', false)"
    persistent
    max-width="500px"
  >
    <v-card @keyup.esc="$emit('input', false)">
      <v-card-title class="title primary white--text"
        >Changement de mot de passe</v-card-title
      >
      <v-card-text>
        <v-layout wrap>
          <v-flex xs12>
            <v-text-field
              v-model="oldPwd"
              label="Ancien mot de passe"
              required
              :append-icon="oldPwdShow ? 'visibility' : 'visibility_off'"
              :type="oldPwdShow ? 'text' : 'password'"
              @click:append="oldPwdShow = !oldPwdShow"
              :rules="[notEmpty]"
            />
          </v-flex>
          <v-flex xs12>
            <v-text-field
              v-model="newPwd"
              label="Nouveau mot de passe"
              required
              :append-icon="newPwdShow ? 'visibility' : 'visibility_off'"
              :type="newPwdShow ? 'text' : 'password'"
              @click:append="newPwdShow = !newPwdShow"
              :rules="[notEmpty]"
            />
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" text @click="$emit('input', false)"
          >Annuler</v-btn
        >
        <v-btn color="primary" text @click="confirm" :disabled="disabled"
          >Changer</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import * as types from '@/store/types'
export default {
  name: 'ChangePwdDlg',
  props: {
    value: { Type: Boolean, default: false },
  },
  data () {
    return {
      oldPwd: '',
      newPwd: '',
      oldPwdShow: false,
      newPwdShow: false,
    }
  },
  computed: {
    disabled () {
      return this.oldPwd === '' || this.newPwd === ''
    },
  },
  methods: {
    confirm () {
      this.$store.dispatch(types.CHANGE_PWD, {
        CurrentPassword: this.oldPwd,
        NewPassword: this.newPwd,
      })
      this.$emit('input', false)
    },
    notEmpty (v) {
      return (v !== null && v !== '') || 'Mot de passe à renseigner'
    },
  },
}
</script>

<template>
  <v-dialog
    :value="value"
    @input="$emit('input', false)"
    class="title primary white--text"
    max-width="500px"
  >
    <v-card>
      <v-card-title class="title primary white--text">{{ title }}</v-card-title>
      <v-card-text>
        <v-layout wrap>
          <v-flex xs12>
            <v-text-field v-model="usr.Name" label="Nom" required :rules="[notEmpty]" />
          </v-flex>
          <v-flex xs12>
            <v-text-field v-model="usr.Email" label="Email" required :rules="[notEmpty]" />
          </v-flex>
          <v-flex xs12>
            <v-text-field v-model="usr.Password" label="Mot de passe" :rules="[notEmpty]" />
          </v-flex>
          <v-flex xs6>
            <v-checkbox
              :input-value="usr.isActive"
              label="Actif"
              @change="change('isActive')"
              primary
              hide-details
            />
          </v-flex>
          <v-flex xs6>
            <v-checkbox
              :input-value="usr.isAdmin"
              label="Administrateur"
              @change="change('isAdmin')"
              primary
              hide-details
            />
          </v-flex>
          <v-flex xs6>
            <v-checkbox
              :input-value="usr.isCopro"
              label="Droits copro"
              @change="change('isCopro')"
              primary
              hide-details
            />
          </v-flex>
          <v-flex xs6>
            <v-checkbox
              :input-value="usr.isRenewProject"
              label="Droits (N)PNRU"
              @change="change('isRenewProject')"
              primary
              hide-details
            />
          </v-flex>
          <v-flex xs6>
            <v-checkbox
              :input-value="usr.isHousing"
              label="Droits LLS"
              @change="change('isHousing')"
              primary
              hide-details
            />
          </v-flex>
          <v-flex xs6>
            <v-checkbox
              :input-value="usr.isPreProg"
              label="Droits préprogrammation"
              @change="change('isPreProg')"
              primary
              hide-details
            />
          </v-flex>
          <v-flex xs6>
            <v-checkbox
              :input-value="usr.isObserver"
              label="Observateur"
              @change="change('isObserver')"
              primary
              hide-details
            />
          </v-flex>
          <v-flex xs6>
            <v-checkbox
              :input-value="usr.isReservationFee"
              label="Droits réservation"
              @change="change('isReservationFee')"
              primary
              hide-details
            />
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions class="tertiary">
        <v-spacer />
        <v-btn color="primary" text @click="$emit('input', false)">Annuler</v-btn>
        <v-btn color="primary" text @click="confirm" :disabled="disabled">{{ button }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'UserDlg',
  props: {
    value: { type: Boolean, default: false },
    user: Object,
    action: {
      type: String,
      default: 'create',
      validator: v => ['create', 'modify'].indexOf(v) !== -1,
    },
  },
  data () {
    return {
      usr: {
        Name: '',
        Email: '',
        Password: '',
        isActive: false,
        isAdmin: false,
        isCopro: false,
        isRenewProject: false,
        isObserver: false,
        isHousing: false,
        isPreProg: false,
        isReservationFee: false,
      },
    }
  },
  methods: {
    notEmpty (text) {
      return text ? text.length > 0 || 'À remplir' : 'À remplir'
    },
    change (field) {
      this.usr[field] = !this.usr[field]
    },
    confirm () {
      this.usr.Rights =
        (this.usr.isActive ? 1 : 0) +
        (this.usr.isAdmin ? 4 : 0) +
        (this.usr.isCopro ? 8 : 0) +
        (this.usr.isRenewProject ? 16 : 0) +
        (this.usr.isObserver ? 32 : 0) +
        (this.usr.isHousing ? 64 : 0) +
        (this.usr.isPreProg ? 128 : 0) +
        (this.usr.isReservationFee ? 256 : 0)
      this.$emit('confirm', this.usr)
      this.$emit('input', false)
    },
  },
  computed: {
    title () {
      return this.action === 'create'
        ? 'Créer un utilisateur'
        : 'Modifier l\'utilisateur'
    },
    button () {
      return this.action === 'create' ? 'Créer' : 'Modifier'
    },
    disabled () {
      return (
        this.usr.Name === '' ||
        this.usr.Email === '' ||
        this.usr.Password === ''
      )
    },
  },
  watch: {
    value (newVal) {
      if (newVal) {
        this.usr = { ...this.user }
      }
    },
  },
}
</script>

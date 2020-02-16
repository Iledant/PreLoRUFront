<template>
  <v-app>
    <v-snackbar bottom color="error" v-model="showErrorMsg">{{ errorMsg }}</v-snackbar>

    <v-navigation-drawer fixed v-model="drawer" app v-if="user">
      <v-list nav dense class="py-0">
        <v-list-item v-for="item in menuItems" :key="item.id" :to="item.routerLink" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-group prepend-icon="settings" v-if="isAdmin">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Administration</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item v-for="subItem in settingsItems" :key="subItem.id" :to="subItem.routerLink">
            <v-list-item-icon>
              <v-icon>{{ subItem.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ subItem.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="primary" dark fixed app v-if="user">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>
        PreLoRU
        <span class="caption">{{ appVersion }}, {{ userName }}</span>
      </v-toolbar-title>
      <v-spacer />
      <v-menu bottom left>
        <template v-slot:activator="{ on }">
          <v-btn dark icon v-on="on">
            <v-icon>more_vert</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="chgPwdDlg = true">
            <v-list-item-title>Changer de mot de passe</v-list-item-title>
          </v-list-item>
          <v-list-item @click="onLogout()">
            <v-list-item-title>Se déconnecter</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <v-layout align-center wrap>
          <v-flex xs12 v-if="loading">
            <v-progress-circular indeterminate class="primary--text" />
          </v-flex>
          <v-flex xs12 v-if="user">
            <router-view />
          </v-flex>
          <v-dialog v-model="dialog" width="500" persistent>
            <v-card>
              <v-card-title class="title primary white--text">PreLoRU - Connexion</v-card-title>
              <v-card-text>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field v-model="email" label="Email" required :rules="[notEmpty]" />
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      v-model="password"
                      label="Mot de passe"
                      :append-icon="pwdShow ? 'visibility' : 'visibility_off'"
                      :type="pwdShow ? 'text' : 'password'"
                      @click:append="pwdShow = !pwdShow"
                      @keyup.enter="onConnectDlg"
                      required
                      :rules="[notEmpty]"
                    />
                  </v-flex>
                </v-layout>
              </v-card-text>
              <v-card-actions class="tertiary">
                <v-spacer />
                <v-btn color="primary" text @click="onConnectDlg" :disabled="disabled">Connexion</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-layout>
      </v-container>
    </v-content>

    <change-pwd-dlg v-model="chgPwdDlg" />
  </v-app>
</template>

<script>
import * as types from './store/types.js'
import ChangePwdDlg from './components/ChangePwdDlg'
export default {
  name: 'App',
  components: { ChangePwdDlg },
  data: () => ({
    drawer: false,
    showErrorMsg: false,
    email: '',
    password: '',
    dialog: true,
    pwdShow: false,
    chgPwdDlg: false,
    appVersion: process.env.VUE_APP_VERSION
  }),
  computed: {
    user () {
      return this.$store.state.token.user
    },
    isAdmin () {
      return this.$store.getters.isAdmin
    },
    userName () {
      const prepend = this.isAdmin ? '[adm]' : ''
      return this.user ? this.user.Name + prepend : ''
    },
    loading () {
      return this.$store.getters.loading
    },
    menuItems () {
      return this.$store.getters.menuItems
    },
    settingsItems () {
      return this.$store.state.token.settingsMenuItems
    },
    errorMsg () {
      return this.$store.state.loading.errorMsg
    },
    disabled () {
      return this.email === '' || this.password === ''
    }
  },
  created () {
    this.$store.commit(types.RETRIEVE_TOKEN)
  },
  methods: {
    async onConnectDlg () {
      if (!this.disabled) {
        await this.$store.dispatch(types.LOG_IN, {
          email: this.email,
          password: this.password
        })
      }
    },
    async onLogout () {
      await this.$store.dispatch(types.LOG_OUT)
      this.email = ''
      this.password = ''
    },
    notEmpty (text) {
      return text.length > 0 || 'À remplir'
    }
  },
  watch: {
    errorMsg (msg) {
      if (msg) this.showErrorMsg = true
    },
    user () {
      this.dialog = this.user === null
    }
  }
}
</script>

<style>
.table-link {
  text-decoration-line: none;
  cursor: pointer;
}
.table-link:hover {
  text-decoration-line: underline;
  color: #4a148c;
}
</style>

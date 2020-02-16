<template>
  <v-card>
    <v-card-title class="white--text primary">Utilisateurs</v-card-title>
    <v-container fluid grid-list-md>
      <v-layout wrap>
        <v-flex xs12>
          <v-data-table
            :headers="headers"
            :items="items"
            class="elevation-1"
            item-key="ID"
            loading="true"
            :search="search"
            dense
          >
            <template v-slot:item="{ item }">
              <tr>
                <td class="text-left">{{ item.Name }}</td>
                <td class="text-center">
                  <v-icon>{{ item.isActive | displayBool }}</v-icon>
                </td>
                <td class="text-center">
                  <v-icon>{{ item.isAdmin | displayBool }}</v-icon>
                </td>
                <td class="text-center">
                  <v-icon>{{ item.isCopro | displayBool }}</v-icon>
                </td>
                <td class="text-center">
                  <v-icon>{{ item.isRenewProject | displayBool }}</v-icon>
                </td>
                <td class="text-center">
                  <v-icon>{{ item.isHousing | displayBool }}</v-icon>
                </td>
                <td class="text-center">
                  <v-icon>{{ item.isObserver | displayBool }}</v-icon>
                </td>
                <td class="text-center">
                  <v-icon>{{ item.isPreProg | displayBool }}</v-icon>
                </td>
                <td class="text-center">
                  <v-icon>{{ item.isReservationFee | displayBool }}</v-icon>
                </td>
                <td class="px-0">
                  <v-tooltip left color="primary">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        color="primary"
                        small
                        text
                        icon
                        class="pa-0"
                        @click="showModifyDlg(item)"
                        v-on="on"
                      >
                        <v-icon>create</v-icon>
                      </v-btn>
                    </template>
                    Modifier
                  </v-tooltip>
                </td>
                <td class="px-0">
                  <v-tooltip left color="primary">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        color="primary"
                        small
                        icon
                        text
                        class="pa-0"
                        v-on="on"
                        @click="showDelDlg(item)"
                      >
                        <v-icon>delete</v-icon>
                      </v-btn>
                    </template>
                    Supprimer
                  </v-tooltip>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
        <v-flex xs12 class="text-right">
          <v-tooltip left color="primary">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" fab dark x-small @click="showCreateDlg" v-on="on">
                <v-icon>add</v-icon>
              </v-btn>
            </template>
            <span>Ajouter une nouvel utilisateur</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
    </v-container>

    <user-dlg v-model="usrDialog" :user="modifiedItem" :action="action" @confirm="save" />

    <delete-dialog
      :sentence="
        `Supprimer définitivement l'utilisateur ${modifiedItem.Name} ?`
      "
      v-model="delDialog"
      @confirm="delConfirm"
    />
  </v-card>
</template>

<script>
import * as types from '../store/types.js'
import DeleteDialog from './DeleteDialog'
import UserDlg from './UserDlg'
const nullUser = {
  Name: '',
  Email: '',
  Password: '',
  isActive: false,
  isAdmin: false,
  isCopro: false,
  isRenewProject: false,
  isPreProg: false
}
export default {
  name: 'Users',
  components: { DeleteDialog, UserDlg },
  data () {
    return {
      search: '',
      headers: [
        { text: 'Nom', value: 'Name', align: 'center' },
        { text: 'Actif', value: 'isActive', align: 'center' },
        { text: 'Admin', value: 'isAdmin', align: 'center' },
        { text: 'Copro', value: 'isCopro', align: 'center' },
        { text: 'RU', value: 'isRenewProject', align: 'center' },
        { text: 'LLS', value: 'isHousing', align: 'center' },
        { text: 'Observ.', value: 'isObserver', align: 'center' },
        { text: 'Preprog.', value: 'isPreProg', align: 'center' },
        { text: 'Réserv.', value: 'isReservationFee', align: 'center' },
        { text: '', value: '', sortable: false, width: '1%' },
        { text: '', value: '', sortable: false, width: '1%' }
      ],
      items: [],
      usrDialog: false,
      delDialog: false,
      modifiedItem: { ...nullUser },
      action: 'create'
    }
  },
  computed: {
    usersList () {
      return this.$store.state.users.usersList
    }
  },
  methods: {
    showModifyDlg (item) {
      this.modifiedItem = { ...item }
      this.modifiedItem.Password = ''
      this.action = 'modify'
      this.usrDialog = true
    },
    showCreateDlg (item) {
      this.modifiedItem = { ...nullUser }
      this.action = 'create'
      this.usrDialog = true
    },
    showDelDlg (item) {
      this.modifiedItem = { ...item }
      this.delDialog = true
    },
    async save (u) {
      const act =
        this.action === 'modify' ? types.UPDATE_USER : types.CREATE_USER
      await this.$store.dispatch(act, u)
    },
    async delConfirm () {
      await this.$store.dispatch(types.DEL_USER, this.modifiedItem.ID)
    }
  },
  watch: {
    usersList (newList) {
      this.items = newList.map((u, i) => ({
        ID: u.ID,
        Name: u.Name,
        Email: u.Email,
        Updated: false,
        isActive: u.Rights & 1,
        isAdmin: u.Rights & 4,
        isCopro: u.Rights & 8,
        isRenewProject: u.Rights & 16,
        isObserver: u.Rights & 32,
        isHousing: u.Rights & 64,
        isPreProg: u.Rights & 1 << 7,
        isReservationFee: u.Rights & 1 << 8
      }))
      this.modified = false
    }
  },
  mounted () {
    this.$store.dispatch(types.GET_USERS)
  }
}
</script>

<template>
  <v-card>
    <v-card-text>
      <v-layout wrap>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field label="Rechercher" v-model="search" prepend-icon="search"/>
        </v-flex>
        <v-flex xs12>
          <v-data-table
            :headers="headers"
            :items="items"
            class="elevation-1"
            item-key="ID"
            :loading="loading"
            :search="search"
          >
            <template #item="{ item }">
              <tr>
                <td class="text-left">{{ item.Date | date }}</td>
                <td class="text-left">{{ item.Name }}</td>
                <td class="text-right">{{ item.Comment }}</td>
                <td class="text-center px-0">
                  <v-btn
                    text
                    icon
                    class="pa-0"
                    color="primary"
                    @click="edit(item)"
                    v-if="hasRenewProjectRight"
                  >
                    <v-icon>create</v-icon>
                  </v-btn>
                </td>
                <td class="text-center px-0">
                  <v-btn
                    text
                    icon
                    class="pa-0"
                    color="primary"
                    @click="remove(item)"
                    v-if="hasRenewProjectRight"
                  >
                    <v-icon>delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-btn color="primary" text @click="addEvent" v-if="hasRenewProjectRight">Ajouter</v-btn>
    </v-card-actions>

    <renew-project-event-dlg
      v-model="dialog"
      :title="dlgTitle"
      :button="dlgBtn"
      :item="item"
      @confirm="save"
    />

    <delete-dialog
      v-model="delDlg"
      sentence="Supprimer l'événement définitivement ?"
      @confirm="delConfirm"
    />
  </v-card>
</template>

<script>
import DeleteDialog from '@/components/DeleteDialog.vue'
import RenewProjectEventDlg from './RenewProjectEventDlg'
import * as types from '@/store/types'
export default {
  name: 'RenewProjectEvents',
  components: { DeleteDialog, RenewProjectEventDlg },
  data () {
    return {
      search: '',
      headers: [
        { text: 'Date', value: 'Date', align: 'center', sortable: true },
        { text: 'Nom', value: 'Name', align: 'center', sortable: true },
        {
          text: 'Commentaire',
          value: 'Comment',
          align: 'center',
          sortable: true,
        },
        { text: '', value: '', align: 'center', sortable: false, width: '1%' },
        { text: '', value: '', align: 'center', sortable: false, width: '1%' },
      ],
      item: {
        ID: 0,
        RenewProjectID: this.project ? this.project.ID : 0,
        RPEventTypeID: null,
        Date: null,
        Comment: '',
      },
      delDlg: false,
      delID: null,
      dialog: false,
      dlgTitle: 'Créer un nouvel événement',
      dlgBtn: 'Créer',
    }
  },
  computed: {
    items () {
      return this.$store.state.renewProject.rpEvents
    },
    loading () {
      return this.$store.state.loading.loading !== 0
    },
    hasRenewProjectRight () {
      return this.$store.getters.hasRenewProjectRight
    },
    project () {
      return this.$store.state.renewProject.renewProject
    },
  },
  methods: {
    remove (item) {
      this.delID = item.ID
      this.delDlg = true
    },
    delConfirm () {
      this.$store.dispatch(types.DELETE_RENEW_PROJECT_EVENT, this.delID)
    },
    addEvent () {
      this.item = {
        ID: 0,
        RenewProjectID: this.project ? this.project.ID : 0,
        RPEventTypeID: null,
        Date: null,
        Comment: '',
      }
      this.dlgTitle = 'Créer un nouvel événement'
      this.dlgBtn = 'Créer'
      this.dialog = true
    },
    edit (item) {
      this.item = { ...item }
      this.item.RenewProjectID = this.project.ID
      this.dlgTitle = 'Modifier l\'événement'
      this.dlgBtn = 'Modifier'
      this.dialog = true
    },
    save (r) {
      const action =
        this.dlgBtn === 'Créer'
          ? types.CREATE_RENEW_PROJECT_EVENT
          : types.UPDATE_RENEW_PROJECT_EVENT
      this.$store.dispatch(action, r)
    },
  },
}
</script>

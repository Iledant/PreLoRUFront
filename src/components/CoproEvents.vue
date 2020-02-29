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
            <template v-slot:item="{ item }">
              <tr>
                <td class="text-left">{{ item.Date | date }}</td>
                <td class="text-left">{{ item.Name }}</td>
                <td class="text-left">{{ item.Comment }}</td>
                <td class="text-center px-0">
                  <v-btn
                    text
                    icon
                    class="pa-0"
                    color="primary"
                    @click="edit(item)"
                    v-if="hasCoproRight"
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
                    v-if="hasCoproRight"
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
      <v-btn color="primary" text @click="addEvent" v-if="hasCoproRight">Ajouter</v-btn>
    </v-card-actions>

    <copro-event-dlg v-model="dialog" :action="action" :item="item" @confirm="save" />

    <delete-dialog
      v-model="delDlg"
      sentence="Supprimer l'événement définitivement ?"
      @confirm="delConfirm"
    />
  </v-card>
</template>

<script>
import DeleteDialog from './DeleteDialog'
import CoproEventDlg from './CoproEventDlg'
import * as types from '../store/types'
export default {
  name: 'CoproEvents',
  components: { DeleteDialog, CoproEventDlg },
  props: {
    project: { type: Object, default: v => ({}) }
  },
  data () {
    return {
      search: '',
      headers: [
        { text: 'Date', value: 'Date', sortable: true },
        { text: 'Nom', value: 'Name', sortable: true },
        { text: 'Commentaire', value: 'Comment', sortable: true },
        { text: '', value: '', sortable: false, width: '1%' },
        { text: '', value: '', sortable: false, width: '1%' }
      ],
      nullItem: {
        ID: 0,
        CoproID: this.project ? this.project.ID : 0,
        CoproEventTypeID: null,
        Date: null,
        Comment: ''
      },
      item: { ...this.nullItem },
      delDlg: false,
      delID: null,
      dialog: false,
      action: 'create'
    }
  },
  computed: {
    items () {
      return this.$store.state.copro.coproEvents
    },
    loading () {
      return this.$store.state.loading.loading !== 0
    },
    hasCoproRight () {
      return this.$store.getters.hasCoproRight
    }
  },
  methods: {
    remove (item) {
      this.delID = item.ID
      this.delDlg = true
    },
    delConfirm () {
      this.$store.dispatch(types.DELETE_COPRO_EVENT, this.delID)
    },
    addEvent () {
      this.item = { ...this.nullItem }
      this.item.CoproID = this.project.ID
      this.action = 'create'
      this.dialog = true
    },
    edit (item) {
      this.item = { ...item }
      this.item.CoproID = this.project.ID
      this.action = 'modify'
      this.dialog = true
    },
    save (r) {
      const action =
        this.action === 'create'
          ? types.CREATE_COPRO_EVENT
          : types.UPDATE_COPRO_EVENT
      this.$store.dispatch(action, r)
    }
  }
}
</script>

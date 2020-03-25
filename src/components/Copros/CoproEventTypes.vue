<template>
  <v-card>
    <v-container grid-list-md fluid>
      <v-layout wrap>
        <v-flex xs12 md6 offset-md3>
          <v-text-field label="Rechercher" v-model="search" prepend-icon="search"/>
        </v-flex>
        <v-flex xs12>
          <v-data-table
            :headers="headers"
            :items="items"
            item-key="ID"
            :loading="loading"
            :search="search"
            class="elevation-1"
          >
            <template #item="{ item }">
              <tr>
                <td class="text-left">{{ item.Name }}</td>
                <td class="px-0">
                  <v-tooltip left color="primary" v-if="hasCoproRight">
                    <template #activator="{ on }">
                      <v-btn
                        color="primary"
                        small
                        text
                        icon
                        class="pa-0"
                        @click="modify(item)"
                        v-on="on"
                      >
                        <v-icon>create</v-icon>
                      </v-btn>
                    </template>
                    Modifier
                  </v-tooltip>
                </td>
                <td class="px-0">
                  <v-tooltip left color="primary" v-if="hasCoproRight">
                    <template #activator="{ on }">
                      <v-btn
                        color="primary"
                        small
                        icon
                        text
                        class="pa-0"
                        v-on="on"
                        @click="remove(item)"
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
        <v-flex xs12 class="text-right" v-if="hasCoproRight">
          <v-tooltip left color="primary">
            <template #activator="{ on }">
              <v-btn color="primary" fab dark x-small @click="add" v-on="on">
                <v-icon>add</v-icon>
              </v-btn>
            </template>
            <span>Créer un nouvel événement type</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
    </v-container>

    <copro-event-type-dlg :item="item" :action="action" v-model="dialog" @confirm="save" />

    <delete-dialog
      v-model="delDlg"
      sentence="Supprimer le type d'événement définitivement ?"
      @confirm="delConfirm"
    />
  </v-card>
</template>

<script>
import DeleteDialog from '@/components/DeleteDialog'
import * as types from '@/store/types'
import CoproEventTypeDlg from './CoproEventTypeDlg.vue'
export default {
  name: 'CoproEventTypes',
  components: { DeleteDialog, CoproEventTypeDlg },
  data () {
    return {
      action: 'create',
      item: { ID: 0, Name: '' },
      dialog: false,
      delDlg: false,
      search: '',
      headers: [
        { text: 'Nom', value: 'Name' },
        { text: '', value: '', sortable: false, width: '1%' },
        { text: '', value: '', sortable: false, width: '1%' }
      ]
    }
  },
  methods: {
    remove (item) {
      this.item.ID = item.ID
      this.delDlg = true
    },
    async delConfirm () {
      await this.$store.dispatch(types.DELETE_COPRO_EVENT_TYPE, this.item.ID)
    },
    modify (item) {
      this.item = { ...item }
      this.action = 'modify'
      this.dialog = true
    },
    add (item) {
      this.item.ID = 0
      this.item.Name = ''
      this.action = 'create'
      this.dialog = true
    },
    async save (r) {
      const dispatch =
        this.action === 'create'
          ? types.CREATE_COPRO_EVENT_TYPE
          : types.UPDATE_COPRO_EVENT_TYPE
      await this.$store.dispatch(dispatch, r)
    }
  },
  computed: {
    items () {
      return this.$store.state.coproEventTypes.coproEventTypeList
    },
    loading () {
      return this.$store.state.loading.loading !== 0
    },
    hasCoproRight () {
      return this.$store.getters.hasCoproRight
    }
  }
}
</script>

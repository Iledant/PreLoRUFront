<template>
  <v-card>
    <v-card-title class="white--text primary text-h5">Commissions</v-card-title>
    <v-container fluid grid-list-md>
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
            dense
          >
            <template #item="{ item }">
              <tr>
                <td>{{ item.Name }}</td>
                <td>{{ item.Date | date }}</td>
                <td class="px-0">
                  <v-tooltip left color="primary">
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
                  <v-tooltip left color="primary">
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
        <v-flex xs12 class="text-right">
          <v-tooltip left color="primary">
            <template #activator="{ on }">
              <v-btn color="primary" fab dark x-small @click="add" v-on="on">
                <v-icon>add</v-icon>
              </v-btn>
            </template>
            <span>Ajouter une nouvelle commission</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
    </v-container>

    <v-dialog v-model="dialog" persistent :overlay="false" max-width="500px">
      <v-card>
        <v-card-title class="primary white--text text-h5">{{ dlgTitle }}</v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  label="Nom"
                  v-model="item.Name"
                  @keyup.esc="dialog = false"
                  @keyup.enter="save"
                  :rules="[t => !!t || 'Nom obligatoire']"
                />
              </v-flex>
              <v-flex xs12>
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template #activator="{ on }">
                    <v-text-field
                      v-model="formattedDate"
                      label="Date de la commission"
                      prepend-icon="event"
                      readonly
                      v-on="on"
                      :rules="[d => !!d || 'Date obligatoire']"
                    />
                  </template>
                  <v-date-picker
                    v-model="item.Date"
                    no-title
                    scrollable
                    locale="fr-FR"
                    @input="menu = false"
                  />
                </v-menu>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions class="tertiary">
          <v-spacer />
          <v-btn color="primary" small text @click="dialog = false">Annuler</v-btn>
          <v-btn color="primary" small text @click="save" :disabled="disabled">{{ dlgBtn }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <delete-dialog
      v-model="delDlg"
      sentence="Supprimer la commission définitivement ?"
      @confirm="delConfirm"
    />
  </v-card>
</template>

<script>
import * as types from '@/store/types.js'
import { formatNullDate } from '@/date.js'
import DeleteDialog from '@/components/DeleteDialog.vue'
const nullCommission = { ID: null, Name: '', Date: null }
export default {
  name: 'Commission',
  components: { DeleteDialog },
  data () {
    return {
      search: '',
      headers: [
        { text: 'Nom', value: 'Name' },
        { text: 'Date', value: 'Date' },
        { text: '', value: '', sortable: false, width: '1%' },
        { text: '', value: '', sortable: false, width: '1%' }
      ],
      dialog: false,
      delDlg: false,
      item: { ...nullCommission },
      dlgTitle: 'Nouvelle commission',
      dlgBtn: 'Créer',
      menu: false
    }
  },
  methods: {
    remove (item) {
      this.item.ID = item.ID
      this.delDlg = true
    },
    modify (item) {
      this.item = { ...item }
      this.dlgTitle = 'Modifier la commission'
      this.dlgBtn = 'Modifier'
      this.dialog = true
    },
    add (item) {
      this.item = { ...nullCommission }
      this.dlgTitle = 'Nouvelle commission'
      this.dlgBtn = 'Créer'
      this.dialog = true
    },
    async save () {
      if (!this.disabled) {
        const dispatch = this.dlgBtn === 'Créer'
          ? types.CREATE_COMMISSION
          : types.UPDATE_COMMISSION
        await this.$store.dispatch(dispatch, {
          ID: this.item.ID,
          Name: this.item.Name,
          Date: new Date(this.item.Date).toISOString()
        })
        this.dialog = false
      }
    },
    async delConfirm () {
      await this.$store.dispatch(types.DEL_COMMISSION, this.item.ID)
    }
  },
  computed: {
    items () {
      return this.$store.state.settings.commissionsList
    },
    loading () {
      return this.$store.state.loading.loading !== 0
    },
    disabled () {
      return !this.item.Name || !this.item.Date
    },
    formattedDate () {
      return formatNullDate(this.item.Date)
    }
  },
  created () {
    this.$store.dispatch(types.GET_COMMISSIONS)
  }
}
</script>

<template>
  <v-card>
    <v-container grid-list-md fluid>
      <v-layout wrap>
        <v-flex xs12 md6 offset-md3>
          <v-text-field label="Rechercher" v-model="search" />
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
            <template v-slot:item="{ item }">
              <tr>
                <td class="text-left">{{ item.Name }}</td>
                <td class="px-0">
                  <v-tooltip left color="primary">
                    <template v-slot:activator="{ on }">
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
                    <template v-slot:activator="{ on }">
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
            <template v-slot:activator="{ on }">
              <v-btn color="primary" fab dark x-small @click="add" v-on="on">
                <v-icon>add</v-icon>
              </v-btn>
            </template>
            <span>Créer une nouvelle typologie</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
    </v-container>

    <v-dialog persistent :overlay="false" v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="primary white--text">{{title}}</v-card-title>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field label="Nom" v-model="item.Name" :rules="[notNull]" />
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions class="tertiary">
          <v-spacer />
          <v-btn color="primary" small text @click="dialog=false">Annuler</v-btn>
          <v-btn color="primary" small text @click="confirm" :disabled="!item.Name">{{ button }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <delete-dialog
      v-model="delDlg"
      sentence="Supprimer la typologie définitivement ?"
      @confirm="delConfirm"
    />
  </v-card>
</template>

<script>
import DeleteDialog from './DeleteDialog'
import * as types from '../store/types'
export default {
  name: 'HousingTypologies',
  components: { DeleteDialog },
  data () {
    return {
      title: 'Créer une nouvelle typologie',
      button: 'Créer',
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
      await this.$store.dispatch(types.DELETE_HOUSING_TYPOLOGY, this.item.ID)
    },
    modify (item) {
      this.item = { ...item }
      this.dlgTitle = 'Modifier la typologie'
      this.dlgBtn = 'Modifier'
      this.dialog = true
    },
    add (item) {
      this.item.ID = 0
      this.item.Name = ''
      this.dlgTitle = 'Créer une nouvelle typologie'
      this.dlgBtn = 'Créer'
      this.dialog = true
    },
    async confirm (r) {
      const dispatch =
        this.dlgBtn === 'Créer'
          ? types.CREATE_HOUSING_TYPOLOGY
          : types.UPDATE_HOUSING_TYPOLOGY
      await this.$store.dispatch(dispatch, this.item)
      this.dialog = false
    },
    notNull (text) {
      return text !== null || text !== '' || 'Le nom ne peut pas être vide'
    }
  },
  computed: {
    items () {
      return this.$store.state.reservationFees.housingTypologiesList
    },
    loading () {
      return this.$store.state.loading.loading !== 0
    }
  }
}
</script>

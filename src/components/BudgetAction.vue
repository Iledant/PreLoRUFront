<template>
  <v-card>
    <v-card-title class="white--text primary headline">Actions budgétaires</v-card-title>
    <v-container fluid grid-list-md>
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
                <td class="text-left">{{ item.Code }}</td>
                <td class="text-left">{{ item.Name }}</td>
                <td class="text-left">{{ item.Sector }}</td>
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
            <span>Ajouter une nouvelle action</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
    </v-container>

    <v-dialog v-model="dialog" persistent :overlay="false" max-width="500px">
      <v-card>
        <v-card-title class="primary white--text headline">{{ dlgTitle }}</v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  label="Code de l'action budgétaire"
                  v-model="item.Code"
                  @keyup.esc="dialog = false"
                  @keyup.enter="save"
                />
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  label="Nom complet"
                  v-model="item.Name"
                  @keyup.esc="dialog = false"
                  @keyup.enter="save"
                />
              </v-flex>
              <v-flex xs12>
                <v-select
                  :items="budgetSectors"
                  v-model="item.SectorID"
                  item-text="Name"
                  item-value="ID"
                  label="Secteur budgétaire"
                ></v-select>
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
      sentence="Supprimer l'action budgétaire définitivement ?"
      @confirm="delConfirm"
    />
  </v-card>
</template>

<script>
import * as types from '../store/types.js'
import DeleteDialog from './DeleteDialog'
import { nullable } from '../filters'
export default {
  name: 'BudgetAction',
  components: { DeleteDialog },
  data () {
    return {
      search: '',
      headers: [
        { text: 'Code', value: 'Name' },
        { text: 'Nom complet', value: 'FullName' },
        { text: 'Secteur', value: 'Sector' },
        { text: '', value: '', sortable: false, width: '1%' },
        { text: '', value: '', sortable: false, width: '1%' }
      ],
      dialog: false,
      delDlg: false,
      item: { Code: '', Name: null, SectorID: null },
      dlgTitle: 'Nouvelle action budgétaire',
      dlgBtn: 'Créer'
    }
  },
  methods: {
    remove (item) {
      this.item.ID = item.ID
      this.delDlg = true
    },
    modify (item) {
      this.item = { ...item }
      this.dlgTitle = 'Modifier l\'action budgétaire'
      this.dlgBtn = 'Modifier'
      this.dialog = true
    },
    add (item) {
      this.item.ID = null
      this.item.Code = ''
      this.item.Name = null
      this.item.SectorID = null
      this.dlgTitle = 'Nouvelle action budgétaire'
      this.dlgBtn = 'Créer'
      this.dialog = true
    },
    async save () {
      if (!this.disabled) {
        const dispatch =
          this.dlgBtn === 'Créer' ? types.CREATE_ACTION : types.UPDATE_ACTION
        await this.$store.dispatch(dispatch, {
          ID: this.item.ID,
          Code: parseInt(this.item.Code),
          Name: this.item.Name,
          SectorID: this.item.SectorID
        })
        this.dialog = false
      }
    },
    async delConfirm () {
      await this.$store.dispatch(types.DEL_ACTION, this.item.ID)
    }
  },
  computed: {
    items () {
      return this.$store.state.settings.budgetActionsList.map(i => {
        const sector = this.budgetSectors.find(s => s.ID === i.SectorID)
        return {
          ID: i.ID,
          Code: i.Code,
          Name: i.Name,
          Sector: sector.Name + ' (' + nullable(sector.FullName) + ')',
          SectorID: i.SectorID
        }
      })
    },
    budgetSectors () {
      return this.$store.state.settings.budgetSectorsList
    },
    loading () {
      return this.$store.state.loading.loading !== 0
    },
    disabled () {
      return (
        this.item.Code === null ||
        this.item.Code === '' ||
        !/^\d+$/.test(this.item.Code) ||
        this.item.SectorID === null
      )
    }
  },
  created () {
    this.$store.dispatch(types.GET_ACTIONS)
  }
}
</script>

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
            dense
          >
            <template #item="{ item }">
              <tr>
                <td
                  class="text-left table-link text-no-wrap"
                  @click="selectItem(item.ID)"
                >{{ item.Reference }}</td>
                <td class="text-center">
                  <v-icon>{{ item.PRIN | displayBool }}</v-icon>
                </td>
                <td class="text-left table-link" @click="selectItem(item.ID)">{{ item.Cities }}</td>
                <td class="text-left table-link" @click="selectItem(item.ID)">{{ item.Name }}</td>
                <td class="text-right text-no-wrap">{{ item.Budget | currency }}</td>
                <td class="text-right text-no-wrap">{{ item.Population | number }}</td>
                <td class="text-right">{{ item.CompositeIndex | nullable }}</td>
                <td class="px-0">
                  <v-tooltip left v-if="hasRenewProjectRight" color="primary">
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
                  <v-tooltip left v-if="hasRenewProjectRight" color="primary">
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
        <v-flex xs12 class="text-right" v-if="hasRenewProjectRight">
          <v-tooltip left color="primary">
            <template #activator="{ on }">
              <v-btn color="primary" fab dark x-small @click="add" v-on="on">
                <v-icon>add</v-icon>
              </v-btn>
            </template>
            <span>Créer une nouvelle opération</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-btn color="primary" small text @click="download">Télécharger le rapport</v-btn>
    </v-card-actions>

    <renew-project-dlg
      v-model="dialog"
      :title="dlgTitle"
      :button="dlgBtn"
      :item="item"
      @confirm="save"
    />

    <delete-dialog
      v-model="delDlg"
      sentence="Supprimer le projet définitivement ?"
      @confirm="delConfirm"
    />
  </v-card>
</template>

<script>
import * as types from '@/store/types.js'
import RenewProjectDlg from './RenewProjectDlg'
import { chkAndUpload } from '@/components/mixins'
import DeleteDialog from '@/components/DeleteDialog'
export default {
  name: 'RenewProjectsCard',
  mixins: [chkAndUpload],
  components: { DeleteDialog, RenewProjectDlg },
  data () {
    return {
      search: '',
      headers: [
        { text: 'Référence', value: 'Reference' },
        { text: 'PRIN', value: 'PRIN' },
        { text: 'Communes', value: 'Cities' },
        { text: 'Nom', value: 'Name' },
        { text: 'Budget', value: 'Budget' },
        { text: 'Pop.', value: 'Population' },
        { text: 'Cat.', value: 'CompositeIndex' },
        { text: '', value: '', sortable: false, width: '1%' },
        { text: '', value: '', sortable: false, width: '1%' }
      ],
      dialog: false,
      item: {
        ID: null,
        Reference: '',
        Name: '',
        PRIN: false,
        CityCode1: null,
        CityCode2: null,
        CityCode3: null,
        Budget: null,
        Population: null,
        CompositeIndex: null,
        BudgetCity1: null,
        BudgetCity2: null,
        BudgetCity3: null
      },
      dlgTitle: 'Créer un projet de renouvellement',
      dlgBtn: 'Créer',
      delDlg: false,
      active: null
    }
  },
  computed: {
    items () {
      return this.$store.state.renewProjects.renewProjectsList.map(
        ({ CityName1, CityName2, CityName3, ...others }) => ({
          Cities:
            CityName1 +
            (CityName2 ? ', ' + CityName2 : '') +
            (CityName3 ? ', ' + CityName3 : ''),
          ...others
        })
      )
    },
    loading () {
      return this.$store.getters.loading
    },
    hasRenewProjectRight () {
      return this.$store.getters.hasRenewProjectRight
    }
  },
  methods: {
    add () {
      this.item = {
        ID: null,
        Reference: '',
        Name: '',
        PRIN: false,
        CityCode1: null,
        CityCode2: null,
        CityCode3: null,
        Budget: null,
        Population: null,
        CompositeIndex: null,
        BudgetCity1: null,
        BudgetCity2: null,
        BudgetCity3: null
      }
      this.dlgTitle = 'Créer un projet de renouvellement'
      this.dlgBtn = 'Créer'
      this.dialog = true
    },
    modify (item) {
      const {
        Budget,
        BudgetCity1,
        BudgetCity2,
        BudgetCity3,
        ...others
      } = this.items.find(i => i.ID === item.ID)
      this.item = {
        Budget: Budget / 100,
        BudgetCity1: BudgetCity1 / 100,
        BudgetCity2: BudgetCity2 / 100,
        BudgetCity3: BudgetCity3 / 100,
        ...others
      }
      this.dlgTitle = 'Modifier un projet de renouvellement'
      this.dlgBtn = 'Modifier'
      this.dialog = true
    },
    remove (item) {
      this.item.ID = item.ID
      this.delDlg = true
    },
    selectItem (ID) {
      this.$router.push({ name: 'RenewProject', params: { ID } })
    },
    async delConfirm () {
      await this.$store.dispatch(types.DEL_RENEW_PROJECT, this.item.ID)
    },
    async save (r) {
      const dispatch =
        this.dlgBtn === 'Créer'
          ? types.CREATE_RENEW_PROJECT
          : types.UPDATE_RENEW_PROJECT
      this.$store.dispatch(dispatch, r)
    },
    download () {
      this.$store.dispatch(types.DOWNLOAD_RP_REPORT)
    }
  }
}
</script>

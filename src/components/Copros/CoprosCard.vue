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
            :items="copros"
            item-key="ID"
            :loading="loading"
            :search="search"
            class="elevation-1"
            dense
          >
            <template #item="{ item }">
              <tr>
                <td class="text-no-wrap table-link" @click="goTo(item.ID)">
                  {{ item.Reference }}
                </td>
                <td class="table-link" @click="goTo(item.ID)">{{ item.Name }}</td>
                <td class="table-link" @click="goTo(item.ID)">{{ item.FullAddress }}</td>
                <td class="text-no-wrap text-right">{{ item.LabelDate | date }}</td>
                <td class="text-right">{{ item.Budget | currency }}</td>
                <td class="px-0">
                  <v-tooltip left v-if="hasCoproRight" color="primary">
                    <template #activator="{ on }">
                      <v-btn color="primary" icon small text class="pa-0" @click="modify(item)">
                        <v-icon class="pa-0" v-on="on">create</v-icon>
                      </v-btn>
                    </template>
                    <span>Modifier</span>
                  </v-tooltip>
                </td>
                <td class="px-0">
                  <v-tooltip left v-if="hasCoproRight" color="primary">
                    <template #activator="{ on }">
                      <v-btn
                        color="primary"
                        icon
                        small
                        text
                        class="pa-0"
                        @click="remove(item)"
                        v-on="on"
                      >
                        <v-icon class="pa-0" v-on="on">delete</v-icon>
                      </v-btn>
                    </template>
                    <span>Supprimer</span>
                  </v-tooltip>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
        <v-flex xs12 class="text-right">
          <v-tooltip left color="primary" v-if="hasCoproRight">
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

    <delete-dialog
      v-model="delDlg"
      sentence="Supprimer la copropriété définitivement ?"
      @confirm="delConfirm"
    />
    <copro-dlg v-model="dialog" :item="item" :button="dlgBtn" :title="dlgTitle" @confirm="save" />
  </v-card>
</template>

<script>
import * as types from '@/store/types.js'
import DeleteDialog from '@/components/DeleteDialog'
import CoproDlg from './CoproDlg'
import { chkAndUpload } from '@/components/mixins'
const nullCopro = {
  ID: null,
  Reference: '',
  Name: '',
  Address: '',
  ZipCode: null,
  LabelDate: null,
  Budget: null,
}
export default {
  name: 'CoprosCard',
  components: { DeleteDialog, CoproDlg },
  mixins: [chkAndUpload],
  data () {
    return {
      search: '',
      headers: [
        { text: 'Référence', value: 'Reference' },
        { text: 'Nom', value: 'Name' },
        { text: 'Adresse', value: 'FullAddress' },
        { text: 'Date label', align: 'right', value: 'LabelDate' },
        { text: 'Budget', align: 'right', value: 'Budget' },
        { text: '', value: '', sortable: false, width: '1%' },
        { text: '', value: '', sortable: false, width: '1%' },
      ],
      dialog: false,
      item: { ...nullCopro },
      dlgTitle: 'Créer une copropriété',
      dlgBtn: 'Créer',
      delDlg: false,
    }
  },
  computed: {
    copros () {
      return this.$store.state.copros.coprosList.map(c => ({
        ID: c.ID,
        FullAddress: (c.CityName ? '[' + c.CityName + '] ' : '') + (c.Address || '-'),
        Address: c.Address,
        Budget: c.Budget,
        LabelDate: c.LabelDate,
        Name: c.Name,
        Reference: c.Reference,
        ZipCode: c.ZipCode,
      }))
    },
    cities () {
      return this.$store.state.cities.citiesList
    },
    loading () {
      return this.$store.state.loading.loading !== 0
    },
    hasCoproRight () {
      return this.$store.getters.hasCoproRight
    },
  },
  methods: {
    add () {
      this.item = { ...nullCopro }
      this.dlgTitle = 'Créer une copropriété'
      this.dlgBtn = 'Créer'
      this.dialog = true
    },
    modify (item) {
      const i = this.copros.find(i => i.ID === item.ID)
      this.item = {
        ID: i.ID,
        Reference: i.Reference,
        Name: i.Name,
        Address: i.Address,
        ZipCode: i.ZipCode,
        LabelDate: i.LabelDate,
        Budget: i.Budget ? i.Budget / 100 : null,
      }
      this.dlgTitle = 'Modifier une copropriété'
      this.dlgBtn = 'Modifier'
      this.dialog = true
    },
    remove (item) {
      this.item.ID = item.ID
      this.delDlg = true
    },
    async delConfirm () {
      await this.$store.dispatch(types.DEL_COPRO, this.item.ID)
    },
    async save (c) {
      const dispatch =
        this.dlgBtn === 'Créer' ? types.CREATE_COPRO : types.UPDATE_COPRO
      this.$store.dispatch(dispatch, c)
      this.dialog = false
    },
    goTo (ID) {
      this.$router.push({ name: 'Copro', params: { ID } })
    },
  },
}
</script>

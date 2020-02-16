<template>
  <v-card>
    <v-card-title class="primary white--text">RPLS</v-card-title>
    <v-container grid-list-md fluid>
      <v-layout row>
        <v-flex xs12 md6 offset-md3>
          <v-text-field label="Recherche" v-model="search" />
        </v-flex>
        <v-flex md3 />
        <v-flex xs12>
          <v-data-table
            :headers="headers"
            :items="rpls"
            item-key="ID"
            :loading="loading"
            :search="search"
            class="elevation-1"
            dense
          >
            <template v-slot:item="{ item }">
              <tr>
                <td>{{ item.InseeCode }}</td>
                <td>{{ item.CityName }}</td>
                <td>{{ item.Year }}</td>
                <td class="text-right">{{ item.Ratio | percentage }}</td>
                <td class="px-0">
                  <v-tooltip left color="primary">
                    <template v-slot:activator="{ on }">
                      <v-btn color="primary" icon small text class="pa-0" @click="modify(item)">
                        <v-icon class="pa-0" v-on="on">create</v-icon>
                      </v-btn>
                    </template>
                    <span>Modifier</span>
                  </v-tooltip>
                </td>
                <td class="px-0">
                  <v-tooltip left color="primary">
                    <template v-slot:activator="{ on }">
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
          <v-tooltip left color="primary">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" fab dark x-small @click="add" v-on="on">
                <v-icon>add</v-icon>
              </v-btn>
            </template>
            <span>Nouveau RPLS</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-file-input
        accept="*.xlsx"
        label="Importer des RPLS"
        :loading="loading"
        show-size
        @change="chkAndUpload($event,upload)"
      />
    </v-card-actions>
    <rpls-dlg v-model="dlg" :title="title" :button="button" :item="item" @confirm="confirm" />
    <delete-dialog
      v-model="delDlg"
      sentence="Supprimer la ligne RPLS définitivement ?"
      @confirm="delConfirm"
    />
  </v-card>
</template>

<script>
import * as types from '../store/types.js'
import DeleteDialog from './DeleteDialog'
import { chkAndUpload } from './mixins'
import RPLSDlg from './RPLSDlg.vue'
const nullItem = { ID: null, Year: null, InseeCode: null }
export default {
  name: 'RPLS',
  mixins: [chkAndUpload],
  components: { DeleteDialog, 'rpls-dlg': RPLSDlg },
  data () {
    return {
      search: '',
      delDlg: false,
      dlg: false,
      title: 'Nouveau RPLS',
      button: 'Créer',
      item: { ...nullItem },
      headers: [
        { text: 'Code INSEE', value: 'InseeCode' },
        { text: 'Commune', value: 'CityName' },
        { text: 'Année', value: 'Year' },
        { text: 'Taux', value: 'Ratio', align: 'right' },
        { text: '', value: '', sortable: false, width: '1%' },
        { text: '', value: '', sortable: false, width: '1%' }
      ]
    }
  },
  methods: {
    async upload (file) {
      await this.$store.dispatch(types.UPLOAD_RPLS, file)
      this.$store.dispatch(types.GET_RPLS)
    },
    async delConfirm () {
      await this.$store.dispatch(types.DEL_RPLS, this.item.ID)
    },
    modify (item) {
      this.item = { ...item }
      this.title = 'Modifier le RPLS'
      this.button = 'Modifier'
      this.dlg = true
    },
    add () {
      this.item = { ...nullItem }
      this.title = 'Nouveau RPLS'
      this.button = 'Créer'
      this.dlg = true
    },
    remove (item) {
      this.item = { ...item }
      this.delDlg = true
    },
    confirm () {
      const action = this.button === 'Créer' ? types.CREATE_RPLS : types.UPDATE_RPLS
      this.$store.dispatch(action, this.item)
    }
  },
  computed: {
    rpls () {
      return this.$store.state.rpls.rplsList
    },
    loading () {
      return this.$store.getters.loading
    }
  },
  created () {
    this.$store.dispatch(types.GET_RPLS_DATAS)
  }
}
</script>

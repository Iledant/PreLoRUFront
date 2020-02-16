<template>
  <v-card>
    <v-card-title class="primary white--text">Programmation</v-card-title>
    <v-container grid-list-md fluid>
      <v-layout wrap>
        <v-flex xs12 md6 offset-md3>
          <v-text-field
            label="Année de préprogrammation"
            v-model="yearText"
            :rules="[yearRule]"
            v-debounce:500ms="changeYear"
            :disabled="modified"
          />
        </v-flex>
        <v-flex md3 />
        <v-flex xs12 md6 offset-md3>
          <v-text-field label="Recherche dans la programmation" v-model="search" />
        </v-flex>
        <v-flex md3 />
        <v-flex xs12>
          <v-data-table
            :headers="headers"
            :items="items"
            item-key="i"
            :loading="loading"
            :search="search"
            class="elevation-1"
            dense
          >
            <template v-slot:body.prepend="">
              <tr class="font-weight-medium">
                <td colspan="5" class="text-center">Total</td>
                <td class="text-no-wrap text-right">{{ sumForecast | currency }}</td>
                <td class="text-no-wrap text-right">{{ sumPreProg | currency }}</td>
                <td />
                <td class="text-no-wrap text-right">{{ sumProg | currency }}</td>
                <td />
                <td />
              </tr>
            </template>
            <template v-slot:item="{ item }">
              <tr>
                <td class="text-no-wrap">{{ item.CommissionDate | shortDate }}</td>
                <td>{{ item.CommissionName }}</td>
                <td>{{ item.ActionName }}</td>
                <td>{{ item.ExplicitKind }}</td>
                <td>{{ item.KindName | trim50 }}</td>
                <td class="text-right text-no-wrap">
                  <v-tooltip left color="primary">
                    <template v-slot:activator="{ on }">
                      <div v-on="on">{{ item.ForecastValue | currency }}</div>
                    </template>
                    <span>Commentaire : {{item.ForecastComment}}</span>
                  </v-tooltip>
                </td>
                <td class="text-right text-no-wrap">
                  <v-tooltip left color="primary">
                    <template v-slot:activator="{ on }">
                      <div v-on="on">{{ item.PreProgValue | currency }}</div>
                    </template>
                    <span>Commentaire : {{item.PreProgComment}}</span>
                  </v-tooltip>
                </td>
                <td class="px-0">
                  <v-tooltip left v-if="isAdmin" color="primary">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        color="primary"
                        icon
                        small
                        text
                        class="pa-0"
                        @click="prePrgCopy(item)"
                        :disabled="item.PreProgValue === null"
                      >
                        <v-icon class="pa-0" v-on="on">chevron_right</v-icon>
                      </v-btn>
                    </template>
                    <span>Recopier la préprogrammation</span>
                  </v-tooltip>
                </td>
                <td class="text-right text-no-wrap">
                  <v-tooltip left color="primary">
                    <template v-slot:activator="{ on }">
                      <div v-on="on">{{ item.Value | currency }}</div>
                    </template>
                    <span>Commentaire : {{item.Comment}}</span>
                  </v-tooltip>
                </td>
                <td class="px-0">
                  <v-tooltip left v-if="isAdmin" color="primary">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        color="primary"
                        icon
                        small
                        text
                        class="pa-0"
                        @click="progModify(item)"
                        :disabled="item.Value === null"
                      >
                        <v-icon class="pa-0" v-on="on">create</v-icon>
                      </v-btn>
                    </template>
                    <span>Modifier</span>
                  </v-tooltip>
                </td>
                <td class="px-0">
                  <v-tooltip left v-if="isAdmin" color="primary">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        color="primary"
                        icon
                        small
                        text
                        class="pa-0"
                        @click="progRemove(item)"
                        v-on="on"
                        :disabled="item.Value === null"
                      >
                        <v-icon class="pa-0" v-on="on">delete</v-icon>
                      </v-btn>
                    </template>
                    <span>Supprimer</span>
                  </v-tooltip>
                </td>
              </tr>
            </template>
            <template v-slot:body.append="">
              <tr class="font-weight-medium">
                <td colspan="5" class="text-center">Total</td>
                <td class="text-no-wrap text-right">{{ sumForecast | currency }}</td>
                <td class="text-no-wrap text-right">{{ sumPreProg | currency }}</td>
                <td />
                <td class="text-no-wrap text-right">{{ sumProg | currency }}</td>
                <td />
                <td />
              </tr>
            </template>
          </v-data-table>
        </v-flex>
        <v-flex xs12 class="text-right">
          <v-btn small text @click="download" color="primary">Exporter en Excel</v-btn>
          <v-tooltip left color="primary" v-if="isAdmin">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" fab dark x-small @click="progAdd" v-on="on">
                <v-icon>add</v-icon>
              </v-btn>
            </template>
            <span>Ajouter une nouvelle ligne</span>
          </v-tooltip>
        </v-flex>
        <v-flex xs12 class="caption">
          Nota : pour mettre en regard les besoins, la préprogrammation et la programmation,
          Preloru vérifie que la commission, l'action budgétaire et le montant sont identiques.
          Si ce n'est pas le cas, des lignes distinctes sont créées dans cette synthèse :
          l'une pour le besoin, l'autre pour la pré programmation voire une troisième
          pour la programmation. Le plus simple est d'utiliser une rechercher sur l'opération
          pour filtrer ces lignes et permettre une comparaison rapide.
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-btn color="primary" text @click="progCancel" :disabled="!modified">Annuler</v-btn>
      <v-btn color="primary" text @click="progSave" :disabled="!modified">Sauver</v-btn>
    </v-card-actions>

    <prog-dlg
      v-model="opDlg"
      :action="dlgAction"
      :item="item"
      :progYear="year"
      @confirm="progAddConfirm"
    />

    <delete-dialog
      v-model="delDlg"
      sentence="Supprimer la ligne définitivement ?"
      @confirm="progRemoveConfirm"
    />
  </v-card>
</template>

<script>
import * as types from '../store/types.js'
import DeleteDialog from './DeleteDialog.vue'
import ProgDlg from './ProgDlg.vue'
import { yearRule } from './mixins'
import { excelExport } from '../excel'
export default {
  name: 'Programmation',
  mixins: [yearRule],
  data () {
    return {
      year: new Date().getFullYear(),
      yearText: String(new Date().getFullYear()),
      search: '',
      headers: [
        { text: 'Date', value: 'CommissionDate', sortable: true },
        { text: 'Commission', value: 'CommissionName', sortable: true },
        { text: 'Action bud.', value: 'ActionName', sortable: true },
        { text: 'Type', value: 'ExplicitKind', sortable: true },
        { text: 'Opération', value: 'KindName', sortable: true },
        { text: 'Besoin', value: 'ForecastValue', sortable: true, align: 'right' },
        { text: 'Préprog.', value: 'PreProgValue', sortable: true, align: 'right' },
        { text: '', value: '', sortable: false },
        { text: 'Programmé', value: 'Value', sortable: true, align: 'right' },
        { text: '', value: '', sortable: false, width: '1%' },
        { text: '', value: '', sortable: false, width: '1%' }
      ],
      items: [],
      nullItem: {
        ID: null,
        CommissionID: null,
        CommissionDate: null,
        CommissionName: '',
        ForecastValue: null,
        ForecastComment: null,
        PreProgValue: null,
        PreProgComment: null,
        Value: 0,
        Kind: '',
        Comment: null,
        ActionID: null,
        ActionCode: null,
        ActionName: ''
      },
      item: { ...this.nullItem },
      opDlg: false,
      dlgAction: 'create',
      delDlg: false,
      modified: false,
      maxI: 0
    }
  },
  components: { DeleteDialog, ProgDlg },
  computed: {
    loading () {
      return this.$store.state.loading.loading !== 0
    },
    isAdmin () {
      return this.$store.getters.isAdmin
    },
    prog () {
      return this.$store.state.prog.progList
    },
    sumForecast () {
      return this.items.reduce((a, c) => a + (c.ForecastValue ? c.ForecastValue : 0), 0)
    },
    sumPreProg () {
      return this.items.reduce((a, c) => a + (c.PreProgValue ? c.PreProgValue : 0), 0)
    },
    sumProg () {
      return this.items.reduce((a, c) => a + (c.Value ? c.Value : 0), 0)
    }
  },
  methods: {
    progAdd () {
      this.item = { ...this.nullItem }
      this.item.i = ++this.maxI
      this.dlgAction = 'create'
      this.opDlg = true
    },
    progModify (item) {
      const i = this.items.find(i => i.i === item.i)
      this.item = { ...i }
      this.item.Value = i.Value / 100
      this.dlgAction = 'modify'
      this.opDlg = true
    },
    prePrgCopy (item) {
      const i = this.items.find(i => i.i === item.i)
      this.item = { ...i }
      this.item.Value = i.PreProgValue / 100
      this.dlgAction = 'modify'
      this.opDlg = true
    },
    progRemove (item) {
      this.item = { ...item }
      this.delDlg = true
    },
    progRemoveConfirm () {
      const idx = this.items.findIndex(i => i.i === this.item.i)
      if (this.item.PreProgValue === null && this.item.ForecastValue === null) {
        this.items.splice(idx, 1)
      } else {
        this.item.Value = null
        this.items.splice(idx, 1, this.item)
      }
      this.modified = true
    },
    progAddConfirm () {
      if (this.dlgAction === 'create') {
        this.items.push(this.item)
      } else {
        const idx = this.items.findIndex(i => i.i === this.item.i)
        this.items.splice(idx, 1, this.item)
      }
      this.modified = true
    },
    async progSave () {
      const Prog = this.items.filter(l => l.Value !== null)
      await this.$store.dispatch(types.SET_PROG, { Prog, Year: this.year })
      this.modified = false
    },
    async progCancel () {
      await this.getProg()
      this.modified = false
    },
    async getProg () {
      return this.$store.dispatch(types.GET_PROG, { Year: this.year })
    },
    changeYear (y) {
      this.yearText = y
      if (this.yearCheck(y)) {
        this.year = parseInt(this.yearText)
        this.getProg()
      }
    },
    download () {
      if (this.items.length === 0) {
        return
      }
      const formattedProg = this.items.map(
        ({ CommissionDate, ForecastValue, PreProgValue, Value, ...others }) =>
          ({
            CommissionDate: new Date(CommissionDate),
            ForecastValue: ForecastValue ? ForecastValue * 0.01 : null,
            PreProgValue: PreProgValue ? PreProgValue * 0.01 : null,
            Value: Value ? Value * 0.01 : null,
            ...others
          }))
      const columns = [
        {
          header: 'Date com',
          key: 'CommissionDate',
          width: 10,
          style: { numberFormat: 'dd/mm/yy' }
        },
        { header: 'Commission', key: 'CommissionName', width: 10 },
        { header: 'Code action', key: 'ActionCode', width: 10 },
        { header: 'Nom action', key: 'ActionName', width: 20 },
        { header: 'Type', key: 'ExplicitKind', width: 10 },
        { header: 'Opération', key: 'KindName', width: 30 },
        {
          header: 'Besoin',
          key: 'ForecastValue',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true
        },
        { header: 'Commentaire', key: 'ForecastComment', width: 30 },
        {
          header: 'Préprog.',
          key: 'PreProgValue',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true
        },
        { header: 'Commentaire', key: 'PreProgComment', width: 30 },
        {
          header: 'Prog.',
          key: 'Value',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true
        },
        { header: 'Commentaire', key: 'Comment', width: 30 }
      ]
      excelExport(formattedProg, columns, 'Programmation')
    }
  },
  watch: {
    prog: {
      handler (list) {
        this.items = list.map((l, i) =>
          ({ i, ExplicitKind: types.explicitKind[l.Kind - 1], ...l })
        )
        this.maxI = this.items.length
      },
      immediate: true
    }
  },
  created () {
    this.$store.dispatch(types.GET_PROG_AND_DATAS, { Year: this.year })
  }
}
</script>

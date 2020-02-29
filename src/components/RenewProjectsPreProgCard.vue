<template>
  <v-card>
    <v-container grid-list-md fluid>
      <v-layout wrap>
        <v-flex xs12 md6 offset-md3>
          <v-text-field
            label="Année de préprogrammation"
            v-model="yearText"
            :rules="[yearRule]"
            v-debounce:500ms="changeYear"
            :disabled="modified"
            prepend-icon="calendar_today"
          />
        </v-flex>
        <v-flex xs12 md6 offset-md3>
          <v-text-field
            label="Recherche dans la préprogrammation"
            v-model="search"
            prepend-icon="search"
          />
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
            <template #body.prepend="">
              <tr class="font-weight-medium grey-lighten-4">
                <td colspan="2" class="text-center">Total</td>
                <td class="text-right text-no-wrap">{{ sumForecast | currency }}</td>
                <td />
                <td />
                <td class="text-right">{{ sumPreProg | currency }}</td>
                <td />
                <td />
                <td />
              </tr>
            </template>
            <template #item="{ item }">
              <tr>
                <td class="text-left">
                  <v-tooltip right color="primary">
                    <template #activator="{ on }">
                      <span v-on="on">{{ item.CommissionName }}</span>
                    </template>
                    <span>Action budgétaire : {{ item.ActionName }}</span>
                  </v-tooltip>
                </td>
                <td class="text-left">{{ item.KindName }}</td>
                <td class="text-right text-no-wrap">
                  <v-tooltip left color="primary">
                    <template #activator="{ on }">
                      <span v-on="on">{{ item.ForecastValue | currency }}</span>
                    </template>
                    <span>Commentaire : {{ item.ForecastComment }}</span>
                  </v-tooltip>
                </td>
                <td>{{ item.ForecastProject }}</td>
                <td class="px-0">
                  <v-tooltip left v-if="hasRenewProjectPreProgRight" color="primary">
                    <template #activator="{ on }">
                      <v-btn
                        color="primary"
                        icon
                        small
                        text
                        class="pa-0"
                        @click="forecastCopy(item)"
                        :disabled="item.ForecastValue === null"
                      >
                        <v-icon class="pa-0" v-on="on">chevron_right</v-icon>
                      </v-btn>
                    </template>
                    <span>Recopier le besoin</span>
                  </v-tooltip>
                </td>
                <td class="text-right text-no-wrap">
                  <v-tooltip left color="primary">
                    <template #activator="{ on }">
                      <span v-on="on">{{ item.PreProgValue | currency }}</span>
                    </template>
                    <span>Commentaire : {{ item.PreProgComment }}</span>
                  </v-tooltip>
                </td>
                <td>{{ item.PreProgProject }}</td>
                <td class="px-0">
                  <v-tooltip left v-if="hasRenewProjectPreProgRight" color="primary">
                    <template #activator="{ on }">
                      <v-btn
                        color="primary"
                        icon
                        small
                        text
                        class="pa-0"
                        @click="preProgModify(item)"
                      >
                        <v-icon class="pa-0" v-on="on">create</v-icon>
                      </v-btn>
                    </template>
                    <span>Modifier</span>
                  </v-tooltip>
                </td>
                <td class="px-0">
                  <v-tooltip left v-if="hasRenewProjectPreProgRight" color="primary">
                    <template #activator="{ on }">
                      <v-btn
                        color="primary"
                        icon
                        small
                        text
                        class="pa-0"
                        @click="preProgRemove(item)"
                        v-on="on"
                        :disabled="item.PreProgValue === null"
                      >
                        <v-icon class="pa-0" v-on="on">delete</v-icon>
                      </v-btn>
                    </template>
                    <span>Supprimer</span>
                  </v-tooltip>
                </td>
              </tr>
            </template>
            <template #body.append="">
              <tr class="grey lighten-4 font-weight-medium">
                <td colspan="2" class="text-center">Total</td>
                <td class="text-right text-no-wrap">{{ sumForecast | currency }}</td>
                <td />
                <td />
                <td class="text-right">{{ sumPreProg | currency }}</td>
                <td />
                <td />
                <td />
              </tr>
            </template>
          </v-data-table>
        </v-flex>
        <v-flex xs12 class="text-right">
          <v-btn small text color="primary" @click="download">Exporter en Excel</v-btn>
          <v-tooltip left color="primary" v-if="hasRenewProjectRight">
            <template #activator="{ on }">
              <v-btn color="primary" fab dark x-small @click="preProgAdd" v-on="on">
                <v-icon>add</v-icon>
              </v-btn>
            </template>
            <span>Ajouter une nouvelle ligne</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-btn color="primary" text @click="preProgCancel" :disabled="!modified">Annuler</v-btn>
      <v-btn color="primary" text @click="preProgSave" :disabled="!modified">Sauver</v-btn>
    </v-card-actions>
    <renew-projects-pre-prog-dlg
      v-model="opDlg"
      :action="dlgAction"
      :item="item"
      :preProgYear="year"
      @confirm="preProgAddConfirm"
    />

    <delete-dialog
      v-model="delDlg"
      sentence="Supprimer la prévision définitivement ?"
      @confirm="preProgRemoveConfirm"
    />
  </v-card>
</template>

<script>
import RenewProjectsPreProgDlg from './RenewProjectsPreProgDlg'
import DeleteDialog from './DeleteDialog'
import * as types from '../store/types.js'
import { yearRule, preProgMethods } from './mixins'
import { excelExport } from '../excel'
export default {
  name: 'RenewProjectsPreProgCard',
  components: { RenewProjectsPreProgDlg, DeleteDialog },
  mixins: [yearRule, preProgMethods],
  data () {
    return {
      search: '',
      headers: [
        { text: 'Commission', value: 'CommissionName', sortable: true },
        { text: 'Projet RU', value: 'KindName', sortable: true },
        { text: 'Besoin', value: 'ForecastValue', align: 'right', sortable: true },
        { text: 'Projet', value: 'ForecastProject', sortable: true },
        { text: '', value: '', sortable: false, width: '1%' },
        { text: 'Preprog.', value: 'PreProgValue', align: 'right', sortable: true },
        { text: 'Projet', value: 'PreProgProject', sortable: true },
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
        ForecastProject: null,
        ForecastComment: null,
        PreProgValue: 0,
        PreProgProject: null,
        PreProgComment: null,
        ActionID: null,
        ActionCode: null,
        ActionName: '',
        KindID: null,
        KindName: ''
      },
      item: { ...this.nullItem },
      opDlg: false,
      dlgAction: 'create',
      delDlg: false,
      modified: false,
      maxID: 0,
      year: new Date().getFullYear(),
      yearText: String(new Date().getFullYear())
    }
  },
  computed: {
    loading () {
      return this.$store.state.loading.loading !== 0
    },
    hasRenewProjectPreProgRight () {
      return this.$store.getters.hasRenewProjectPreProgRight
    },
    commissions () {
      return this.$store.state.settings.commissionsList
    },
    budgetActions () {
      return this.$store.state.settings.budgetActionsList
    },
    renewProjectPreProg () {
      return this.$store.state.preProg.preProgList
    },
    sumForecast () {
      return this.items.reduce((a, c) => a + c.ForecastValue, 0)
    },
    sumPreProg () {
      return this.items.reduce((a, c) => a + c.PreProgValue, 0)
    },
    hasRenewProjectRight () {
      return this.$store.getters.hasRenewProjectRight
    }
  },
  methods: {
    async preProgSave () {
      const PreProg = this.items.filter(i =>
        i.PreProgValue !== null && i.PreProgValue !== 0)
        .map(i => ({
          CommissionID: i.CommissionID,
          Year: this.year,
          Value: i.PreProgValue,
          KindID: i.KindID,
          Project: i.PreProgProject,
          Comment: i.PreProgComment,
          ActionID: i.ActionID
        }))
      await this.$store.dispatch(types.SET_PRE_PROG,
        { PreProg, Kind: 'renew_project', Year: this.year })
      this.modified = false
    },
    async getPreProg () {
      return this.$store.dispatch(types.GET_KIND_PRE_PROG, {
        Year: this.year,
        Kind: 'renew_project'
      })
    },
    download () {
      if (this.items.length === 0) {
        return
      }
      const formattedProg = this.items.map(
        ({ CommissionDate, PreProgValue, ForecastValue, ...others }) =>
          ({
            CommissionDate: new Date(CommissionDate),
            PreProgValue: PreProgValue ? PreProgValue * 0.01 : null,
            ForecastValue: ForecastValue ? ForecastValue * 0.01 : null,
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
        { header: 'Opération', key: 'KindName', width: 30 },
        {
          header: 'Besoin',
          key: 'ForecastValue',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true
        },
        { header: 'Projet', key: 'ForecastProject', width: 30 },
        { header: 'Commentaire', key: 'ForecastComment', width: 30 },
        {
          header: 'Préprog.',
          key: 'PreProgValue',
          width: 14,
          style: { numberFormat: '#,##0.00' },
          addTotal: true
        },
        { header: 'Projet', key: 'PreProgProject', width: 30 },
        { header: 'Commentaire', key: 'PreProgComment', width: 30 }
      ]
      excelExport(formattedProg, columns, 'Preprog RU')
    }
  },
  watch: {
    renewProjectPreProg: {
      handler (list) {
        this.items = list.map((i, ID) => ({ ID, ...i }))
        this.maxID = this.items.length
      },
      immediate: true
    }
  }
}
</script>

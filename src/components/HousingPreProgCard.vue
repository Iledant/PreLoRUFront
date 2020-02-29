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
            prepend-icon="search"
          />
        </v-flex>
        <v-flex md3 />
        <v-flex xs12 md6 offset-md3>
          <v-text-field
            label="Recherche dans la préprogrammation"
            v-model="search"
            prepend-icon="search"
          />
        </v-flex>
        <v-flex md3 />
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
              <tr class="grey lighten-4 font-weight-medium">
                <td colspan="3" class="text-center">Total</td>
                <td class="text-right text-no-wrap">{{ sumForecast | currency }}</td>
                <td />
                <td class="text-right text-no-wrap">{{ sumPreProg | currency }}</td>
                <td />
                <td />
              </tr>
            </template>
            <template #item="{ item }">
              <tr>
                <td class="text-left text-no-wrap">{{ item.CommissionDate | date }}</td>
                <td class="text-left">{{ item.CommissionName }}</td>
                <td class="text-left">{{ item.ActionName }}</td>
                <td class="text-right text-no-wrap">
                  <v-tooltip left color="primary">
                    <template #activator="{on}"><span v-on="on" >{{ item.ForecastValue | currency }}</span></template>
                    <span>{{ item.ForecastComment }}</span>
                  </v-tooltip>
                </td>
                <td class="px-0">
                  <v-tooltip left v-if="hasHousingPreProgRight" color="primary">
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
                    <template #activator="{ on }"><span v-on="on">{{ item.PreProgValue | currency }}</span></template>
                    <span>{{ item.PreProgComment }}</span>
                  </v-tooltip>
                </td>
                <td class="px-0">
                  <v-tooltip left v-if="hasHousingPreProgRight" color="primary">
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
                  <v-tooltip left v-if="hasHousingPreProgRight" color="primary">
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
                <td colspan="3" class="text-center">Total</td>
                <td class="text-right text-no-wrap">{{ sumForecast | currency }}</td>
                <td />
                <td class="text-right text-no-wrap">{{ sumPreProg | currency }}</td>
                <td />
                <td />
              </tr>
            </template>
          </v-data-table>
        </v-flex>
        <v-flex xs12 class="text-right">
          <v-btn small text color="primary" @click="download">Exporter en Excel</v-btn>
          <v-tooltip left color="primary" v-if="hasHousingPreProgRight" >
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
    <housing-pre-prog-dlg
      v-model="opDlg"
      :action="dlgAction"
      :item="item"
      @confirm="preProgAddConfirm"
    />

    <delete-dialog
      v-model="delDlg"
      sentence="Supprimer la ligne définitivement ?"
      @confirm="preProgRemoveConfirm"
    />
  </v-card>
</template>

<script>
import HousingPreProgDlg from './HousingPreProgDlg'
import DeleteDialog from './DeleteDialog'
import * as types from '../store/types.js'
import { yearRule, preProgMethods } from './mixins'
import { excelExport } from '../excel'
export default {
  name: 'HousingPreProgCard',
  components: { HousingPreProgDlg, DeleteDialog },
  mixins: [yearRule, preProgMethods],
  data () {
    return {
      search: '',
      headers: [
        { text: 'Date', value: 'CommissionDate' },
        { text: 'Commission', value: 'CommissionName' },
        { text: 'Action budgétaire', value: 'ActionName' },
        { text: 'Besoin', value: 'ForecastValue' },
        { text: '', value: '', sortable: false, width: '1%' },
        { text: 'Préprog.', value: 'PreProgValue' },
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
        PreProgValue: 0,
        PreProgComment: null,
        ActionID: null,
        ActionCode: null,
        ActionName: ''
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
    hasHousingPreProgRight () {
      return this.$store.getters.hasHousingPreProgRight
    },
    housingPreProg () {
      return this.$store.state.preProg.preProgList
    },
    sumForecast () {
      return this.items.reduce((a, c) => a + c.ForecastValue, 0)
    },
    sumPreProg () {
      return this.items.reduce((a, c) => a + c.PreProgValue, 0)
    }
  },
  methods: {
    async preProgSave () {
      const PreProg = this.items.filter(i =>
        i.PreProgValue !== null && i.PreProgValue !== 0)
        .map(i =>
          ({
            CommissionID: i.CommissionID,
            Year: this.year,
            Value: i.PreProgValue,
            KindID: null,
            Comment: i.PreProgComment,
            ActionID: i.ActionID
          }))
      await this.$store.dispatch(types.SET_PRE_PROG,
        { PreProg, Kind: 'housing', Year: this.year })
      this.modified = false
    },
    async getPreProg () {
      return this.$store.dispatch(types.GET_KIND_PRE_PROG, {
        Year: this.year,
        Kind: 'housing'
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
          })
      )
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
        { header: 'Commentaire', key: 'Comment', width: 30 }
      ]
      excelExport(formattedProg, columns, 'PreProg LLS')
    }
  },
  watch: {
    housingPreProg: {
      handler (list) {
        this.items = list.map((i, ID) => ({ ID, ...i }))
        this.maxID = this.items.length
      },
      immediate: true
    }
  }
}
</script>

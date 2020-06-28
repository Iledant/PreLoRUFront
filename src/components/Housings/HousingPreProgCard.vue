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
            prepend-icon="calendar_today"
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
                <td colspan="2">
                  <v-tooltip left color="primary" v-if="hasHousingPreProgRight" >
                    <template #activator="{ on }">
                      <v-btn color="primary" small icon text @click="preProgAdd" v-on="on">
                        <v-icon>add_circle</v-icon>
                      </v-btn>
                    </template>
                    <span>Ajouter une nouvelle ligne</span>
                  </v-tooltip>
                </td>
              </tr>
            </template>
            <template #item="{ item }">
              <tr>
                <td class="text-left text-no-wrap">{{ item.CommissionDate | date }}</td>
                <td class="text-left">{{ item.CommissionName }}</td>
                <td class="text-left">{{ item.ActionName }}</td>
                <td class="text-right text-no-wrap">
                  <v-tooltip left color="primary">
                    <template #activator="{on}">
                      <span v-on="on" >{{ item.ForecastValue | currency }}</span>
                    </template>
                    <span>{{ item.ForecastComment ||'-' }}</span>
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
                    <template #activator="{ on }">
                      <span v-on="on">{{ item.PreProgValue | currency }}</span>
                      </template>
                    <span>{{ item.PreProgComment || '-' }}</span>
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
                <td colspan="2">
                  <v-tooltip left color="primary" v-if="hasHousingPreProgRight" >
                    <template #activator="{ on }">
                      <v-btn color="primary" small icon text @click="preProgAdd" v-on="on">
                        <v-icon>add_circle</v-icon>
                      </v-btn>
                    </template>
                    <span>Ajouter une nouvelle ligne</span>
                  </v-tooltip>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
        <v-flex xs1>
            <v-tooltip right color="primary" v-if="hasHousingPreProgRight" >
              <template #activator="{ on }">
                <v-btn @click="info = !info" color="primary" small icon text v-on="on">
                  <v-icon>info</v-icon>
                </v-btn>
              </template>
              <span>Information sur la préprogrammation</span>
            </v-tooltip>
          </v-flex>
          <v-flex xs11>
            <div v-show="info" class="text-body-2">
                La préprogrammation repose sur une analyse des besoins. Elle permet
                de proposer à la programmation des opérations en tenant compte des
                contraintes du budget, des priorités ainsi que de l'analyse des
                prévisions des années précédentes.<p />

                La préprogrammation n'est accessible qu'aux administrateurs
                ou aux utilisateurs qui ont le droit de préprogrammation du
                secteur concerné. Les autres utilisateurs peuvent la consulter
                mais pas la modifier.
            </div>
          </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-spacer />
          <v-btn small text color="primary" @click="download">Exporter en Excel</v-btn>
    </v-card-actions>
    <housing-pre-prog-dlg
      v-model="opDlg"
      :action="dlgAction"
      :item="item"
      :year="year"
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
import DeleteDialog from '@/components/DeleteDialog'
import * as types from '@/store/types.js'
import { yearRule, preProgMethods } from '@/components/mixins'
import { excelExport, dateStyle, valStyle } from '@/excel'
import { mapGetters } from 'vuex'

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
      maxID: 0,
      year: new Date().getFullYear(),
      yearText: String(new Date().getFullYear()),
      info: false
    }
  },
  computed: {
    ...mapGetters(['loading', 'hasHousingPreProgRight']),
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
    },
    async getPreProg () {
      return this.$store.dispatch(types.GET_KIND_PRE_PROG,
        { Year: this.year, Kind: 'housing' })
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
        { header: 'Date com', key: 'CommissionDate', ...dateStyle },
        { header: 'Commission', key: 'CommissionName', width: 10 },
        { header: 'Code action', key: 'ActionCode', width: 10 },
        { header: 'Nom action', key: 'ActionName', width: 20 },
        { header: 'Besoin', key: 'ForecastValue', ...valStyle },
        { header: 'Commentaire', key: 'ForecastComment', width: 30 },
        { header: 'Préprog.', key: 'PreProgValue', ...valStyle },
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

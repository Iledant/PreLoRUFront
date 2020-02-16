<template>
  <v-card>
    <v-container grid-list-md>
      <v-layout wrap>
        <v-flex xs12 md6 offset-md3>
          <v-text-field label="Recherche" v-model="search" />
        </v-flex>
        <v-flex xs12>
          <v-data-table
            :headers="headers"
            :items="housingForecasts"
            item-key="ID"
            :loading="loading"
            :search="search"
            class="elevation-1"
            dense
          >
            <template v-slot:item="{ item }">
              <tr>
                <td class="text-left">{{ item.CommissionDate | date }}</td>
                <td class="text-left">{{ item.CommissionName }}</td>
                <td class="text-left">{{ item.ActionName }}</td>
                <td class="text-right">{{ item.Value | currency }}</td>
                <td class="px-0">
                  <v-tooltip left v-if="hasHousingRight" color="primary">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        color="primary"
                        icon
                        small
                        text
                        class="pa-0"
                        @click="forecastModify(item)"
                      >
                        <v-icon class="pa-0" v-on="on">create</v-icon>
                      </v-btn>
                    </template>
                    <span>Modifier</span>
                  </v-tooltip>
                </td>
                <td class="px-0">
                  <v-tooltip left v-if="hasHousingRight" color="primary">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        color="primary"
                        icon
                        small
                        text
                        class="pa-0"
                        @click="forecastRemove(item)"
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
          <v-tooltip left color="primary" v-if="hasHousingRight">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" fab dark x-small @click="forecastAdd" v-on="on">
                <v-icon>add</v-icon>
              </v-btn>
            </template>
            <span>Ajouter une nouvelle ligne</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
    </v-container>

    <housing-forecast-dlg
      v-model="opDlg"
      :title="dlgTitle"
      :button="dlgBtn"
      :item="item"
      :commissions="commissions"
      :budgetActions="budgetActions"
      @confirm="forecastSave"
    />

    <delete-dialog
      v-model="delDlg"
      sentence="Supprimer la prévision définitivement ?"
      @confirm="forecastDelConfirm"
    />
  </v-card>
</template>

<script>
import HousingForecastDlg from './HousingForecastDlg.vue'
import DeleteDialog from './DeleteDialog'
import * as types from '../store/types.js'
export default {
  name: 'HousingForecastCard',
  components: { HousingForecastDlg, DeleteDialog },
  data () {
    return {
      search: '',
      headers: [
        { text: 'Date', value: 'CommissionDate', sortable: true },
        { text: 'Commission', value: 'CommissionName', sortable: true },
        { text: 'Action budgétaire', value: 'ActionName', sortable: true },
        { text: 'Montant', value: 'Value', sortable: true },
        { text: '', value: '', sortable: false, width: '1%' },
        { text: '', value: '', sortable: false, width: '1%' }
      ],
      item: {
        ID: null,
        CommissionID: null,
        CommissionDate: null,
        CommissionName: '',
        Value: 0,
        Comment: null,
        ActionID: null,
        ActionName: ''
      },
      opDlg: false,
      dlgTitle: 'Créer une prévision',
      dlgBtn: 'Créer',
      delDlg: false
    }
  },
  computed: {
    loading () {
      return this.$store.state.loading.loading !== 0
    },
    hasHousingRight () {
      return this.$store.getters.hasHousingRight
    },
    commissions () {
      return this.$store.state.settings.commissionsList
    },
    budgetActions () {
      return this.$store.state.settings.budgetActionsList
    },
    housingForecasts () {
      return this.$store.state.housings.housingForecastsList
    }
  },
  methods: {
    forecastAdd () {
      this.item = {
        ID: null,
        CommissionID: null,
        CommissionDate: null,
        CommissionName: '',
        Value: 0,
        Comment: null,
        ActionID: null,
        ActionName: ''
      }
      this.dlgTitle = 'Créer une prévision'
      this.dlgBtn = 'Créer'
      this.opDlg = true
    },
    forecastModify (item) {
      const i = this.housingForecasts.find(i => i.ID === item.ID)
      this.item = { ...i }
      this.item.Value = i.Value / 100
      this.dlgTitle = 'Modifier une prévision'
      this.dlgBtn = 'Modifier'
      this.opDlg = true
    },
    forecastRemove (item) {
      this.item = { ...item }
      this.delDlg = true
    },
    async forecastDelConfirm () {
      await this.$store.dispatch(types.DELETE_HOUSING_FORECAST, this.item)
    },
    async forecastSave (f) {
      const dispatch =
        this.dlgBtn === 'Créer'
          ? types.CREATE_HOUSING_FORECAST
          : types.UPDATE_HOUSING_FORECAST
      this.$store.dispatch(dispatch, f)
    }
  }
}
</script>

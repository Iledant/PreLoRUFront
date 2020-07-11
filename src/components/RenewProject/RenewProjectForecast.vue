<template>
  <v-card>
    <v-container fluid grid-list-md>
      <v-layout wrap>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field label="Rechercher" v-model="search" prepend-icon="search"/>
        </v-flex>
        <v-flex xs12>
          <v-data-table
            :headers="headers"
            :items="forecasts"
            class="elevation-1"
            item-key="ID"
            :loading="loading"
            :search="search"
          >
            <template #item="{ item }">
              <tr>
                <td class="text-left">{{ item.CommissionName }}</td>
                <td class="text-left">{{ item.ActionName }}</td>
                <td class="text-right">{{ item.Value | currency }}</td>
                <td class="text-left">{{ item.Project }}</td>
                <td class="text-left">
                  <v-tooltip left color="secondary">
                    <template #activator="{ on }">
                      <div v-on="on">{{ item.Comment | trim(50) }}</div>
                    </template>
                    <span> {{ item.Comment }}</span>
                  </v-tooltip>
                </td>
                <td class="text-center px-0">
                  <v-btn
                    text
                    icon
                    color="primary"
                    class="pa-0"
                    @click="edit(item)"
                    v-if="hasRenewProjectRight"
                  >
                    <v-icon>create</v-icon>
                  </v-btn>
                </td>
                <td class="text-center px-0">
                  <v-btn
                    text
                    icon
                    color="primary"
                    @click="remove(item)"
                    class="pa-0"
                    v-if="hasRenewProjectRight"
                  >
                    <v-icon>delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
        <v-flex xs12 class="text-right" v-if="hasRenewProjectRight">
          <v-tooltip left color="primary">
            <template #activator="{ on }">
              <v-btn color="primary" fab dark x-small @click="addForecast" v-on="on">
                <v-icon>add</v-icon>
              </v-btn>
            </template>
            <span>Ajouter une nouvelle ligne</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
    </v-container>

    <renew-project-forecast-dlg
      v-model="dialog"
      :title="dlgTitle"
      :button="dlgBtn"
      :forecast="forecast"
      @confirm="save"
    />

    <delete-dialog
      v-model="delDlg"
      sentence="Supprimer la prévision définitivement ?"
      @confirm="delConfirm"
    />
  </v-card>
</template>

<script>
import * as types from '@/store/types'
import RenewProjectForecastDlg from './RenewProjectForecastDlg.vue'
import DeleteDialog from '@/components/DeleteDialog.vue'
export default {
  name: 'RenewProjectForecast',
  components: { DeleteDialog, RenewProjectForecastDlg },
  data () {
    return {
      headers: [
        { text: 'Commission', value: 'CommissionName', sortable: true },
        { text: 'Action budgétaire', value: 'ActionName', sortable: true },
        { text: 'Montant', value: 'Value', align: 'right', sortable: true },
        { text: 'Projet', value: 'Project', sortable: true },
        { text: 'Commentaire', value: 'Comment', sortable: true },
        { text: '', value: '', align: 'center', sortable: false, width: '1%' },
        { text: '', value: '', align: 'center', sortable: false, width: '1%' },
      ],
      forecast: {
        ID: 0,
        CommissionID: null,
        Value: null,
        Project: null,
        Comment: null,
        RenewProjectID: this.project ? this.project.ID : 0,
        ActionID: null,
      },
      dialog: false,
      dlgTitle: 'Créer une nouvelle prévision',
      dlgBtn: 'Créer',
      delDlg: false,
      delID: null,
      search: null,
    }
  },
  computed: {
    loading () {
      return this.$store.state.loading.loading !== 0
    },
    forecasts () {
      return this.$store.state.renewProject.rpForecasts
    },
    hasRenewProjectRight () {
      return this.$store.getters.hasRenewProjectRight
    },
    project () {
      return this.$store.state.renewProject.renewProject
    },
  },
  methods: {
    edit (item) {
      this.forecast = { ...item }
      this.forecast.Value *= 0.01
      this.dlgTitle = 'Modifier la prévision'
      this.dlgBtn = 'Modifier'
      this.dialog = true
    },
    remove (item) {
      this.delID = item.ID
      this.delDlg = true
    },
    save (r) {
      const action =
        this.dlgBtn === 'Créer'
          ? types.CREATE_RENEW_PROJECT_FORECAST
          : types.UPDATE_RENEW_PROJECT_FORECAST
      this.$store.dispatch(action, { RenewProjectForecast: r })
    },
    addForecast () {
      this.forecast = {
        ID: 0,
        CommissionID: null,
        Value: null,
        Project: null,
        Comment: null,
        RenewProjectID: this.project.ID,
        ActionID: null,
      }
      this.dlgTitle = 'Créer une nouvelle prévision'
      this.dlgBtn = 'Créer'
      this.dialog = true
    },
    delConfirm () {
      this.$store.dispatch(types.DELETE_RENEW_PROJECT_FORECAST, this.delID)
    },
  },
}
</script>

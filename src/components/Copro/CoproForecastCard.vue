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
            dense
          >
            <template #item="{ item }">
              <tr>
                <td class="text-left">{{ item.CommissionDate | date }}</td>
                <td class="text-left">{{ item.CommissionName }}</td>
                <td class="text-left">{{ item.ActionName }}</td>
                <td class="text-right text-no-wrap">{{ item.Value | currency }}</td>
                <td class="text-left">
                  <v-tooltip left color="secondary">
                    <template #activator="{ on }">
                      <div v-on="on">{{ item.Comment | trim50 }}</div>
                    </template>
                    <span>{{ item.Comment }}</span>
                  </v-tooltip>
                </td>
                <td class="text-center px-0">
                  <v-btn
                    text
                    icon
                    color="primary"
                    class="pa-0"
                    @click="edit(item)"
                    v-if="hasCoproRight"
                  >
                    <v-icon>create</v-icon>
                  </v-btn>
                </td>
                <td class="text-center px-0">
                  <v-btn
                    text
                    icon
                    color="primary"
                    class="pa-0"
                    @click="remove(item)"
                    v-if="hasCoproRight"
                  >
                    <v-icon>delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
        <v-flex xs12 class="text-right" v-if="hasCoproRight">
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
    <delete-dialog
      v-model="delDlg"
      sentence="Supprimer la prévision définitivement ?"
      @confirm="delConfirm"
    />
    <copro-forecast-dlg
      :forecast="forecast"
      v-model="dialog"
      :loading="loading"
      :title="dlgTitle"
      :button="dlgBtn"
      @confirm="save"
    />
  </v-card>
</template>

<script>
import DeleteDialog from '@/components/DeleteDialog.vue'
import CoproForecastDlg from './CoproForecastDlg.vue'
import * as types from '@/store/types'
const nullForecast = {
  ID: 0,
  CommissionID: null,
  Value: null,
  Comment: null,
  ActionID: null
}
export default {
  name: 'CoproForecastCard',
  components: { DeleteDialog, CoproForecastDlg },
  props: {
    project: { type: Object, default: v => {} }
  },
  data () {
    return {
      headers: [
        { text: 'Date', value: 'CommissionDate', sortable: false },
        { text: 'Commission', value: 'CommissionName', sortable: false },
        { text: 'Action budgétaire', value: 'ActionName', sortable: false },
        { text: 'Montant', value: 'Value', align: 'right', sortable: false },
        { text: 'Commentaire', value: 'Comment', sortable: false },
        { text: '', value: '', align: 'center', sortable: false, width: '1%' },
        { text: '', value: '', align: 'center', sortable: false, width: '1%' }
      ],
      search: '',
      forecast: { ...nullForecast },
      dialog: false,
      dlgTitle: 'Créer une nouvelle prévision',
      dlgBtn: 'Créer',
      delDlg: false,
      delID: null
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    forecasts () {
      return this.$store.state.copro.coproForecasts
    },
    hasCoproRight () {
      return this.$store.getters.hasCoproRight
    }
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
    delConfirm () {
      this.$store.dispatch(types.DELETE_COPRO_FORECAST, this.delID)
    },
    save (f) {
      const action =
        this.dlgBtn === 'Créer'
          ? types.CREATE_COPRO_FORECAST
          : types.UPDATE_COPRO_FORECAST
      const item = { CoproForecast: { ...f, CoproID: this.project.ID } }
      this.$store.dispatch(action, item)
      this.dialog = false
    },
    addForecast () {
      this.forecast = { ...nullForecast }
      this.forecast.CoproID = this.project.ID
      this.dlgTitle = 'Créer une nouvelle prévision'
      this.dlgBtn = 'Créer'
      this.dialog = true
    }
  }
}
</script>

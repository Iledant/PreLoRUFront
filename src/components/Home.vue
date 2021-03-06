<template>
  <v-card>
    <v-card-title class="white--text primary text-h5">Accueil</v-card-title>
    <v-container grid-list-md fluid>
      <v-layout wrap>
        <v-flex xs12>
          <v-card>
            <v-card-title class="tertiary">
              {{ homeMsg ? homeMsg.Title : "" }}
              <v-spacer v-if="isAdmin" />
              <v-tooltip v-if="isAdmin" left color="primary">
                <template #activator="{ on }">
                  <v-btn
                    color="primary"
                    icon
                    small
                    text
                    @click="dlg = true"
                    v-on="on"
                  >
                    <v-icon v-on="on">create</v-icon>
                  </v-btn>
                </template>
                <span>Changer le message d'accueil</span>
              </v-tooltip>
            </v-card-title>
            <v-card-text>
              <div
                class="text-body-2 pt-3"
                v-show="homeMsg"
                v-html="homeMsg ? homeMsg.Html : ''"
              />
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 md6>
          <v-card>
            <v-card-title class="tertiary">Paiements</v-card-title>
            <pmt-chart :height="400" class="pt-1" />
            <div class="text-caption text-right">
              Dernier import : {{ pmtImportDate | date }}
            </div>
          </v-card>
        </v-flex>
        <v-flex xs12 md6>
          <v-card>
            <v-card-title class="tertiary">Engagements</v-card-title>
            <cmt-chart :height="400" class="pt-1" />
            <div class="text-caption text-right">
              Dernier import : {{ cmtImportDate | date }}
            </div>
          </v-card>
        </v-flex>
        <!-- <v-flex xs12 md6>
          <v-card>
            <v-card-title class="tertiary align-start">
              Délai moyen de mandatement
              <v-tooltip bottom color="primary">
                <template #activator="{ on }">
                  <v-icon small v-on="on" class="pl-1">info</v-icon>
                </template>
                <span>
                  Ce graphique représente la moyenne mobile sur les 12 derniers mois
                  du délai entre
                  <ul>
                    <li>
                      les dates inscrites dans CORIOLIS de réception des
                      factures
                    </li>
                    <li>les dates inscrites dans CORIOLIS de proposition de mandatement</li>
                  </ul>
                </span>
              </v-tooltip>
            </v-card-title>
            <avg-pmt-time-chart :height="400" class="pt-1" />
          </v-card>
        </v-flex>
        <v-flex xs12 md6>
          <v-card>
            <v-card-title class="tertiary align-start">
              Stock de DVS
              <v-tooltip bottom color="primary">
                <template #activator="{ on }">
                  <v-icon small v-on="on" class="pl-1">info</v-icon>
                </template>
                <span>
                  Ce graphique représente l'évolution quotidienne sur les
                  <br />30
                  derniers jours du stock de DVS arrivés à la région.
                  <br />Il mesure le nombre de DVS qui n'ont pas reçu de CSF de la direction
                  <br />et le nombre de DVS non encore mandatés ou rejetés par la direction
                  de la comptabilité.
                  <br />Seules les DVS non exclues sont prises en compte.
                </span>
              </v-tooltip>
            </v-card-title>
            <payment-demands-stock-chart :height="400" class="pt-1" />
          </v-card>
        </v-flex> -->
        <v-flex xs4>
          <trend-card
            :figure="csfFigure"
            icon="receipt"
            :trend="csfTrend"
            caption="Stock de  CSF"
            :inverse="true"
          />
        </v-flex>
        <v-flex xs4>
          <trend-card
            :figure="delayFigure"
            :trend="delayTrend"
            icon="update"
            caption="Délai moyen de mandatement"
            :inverse="true"
            :digits="1"
            unit=" j"
            :onClick="isAdmin"
            @click="flowStockExport()"
          />
        </v-flex>
        <v-flex xs4>
          <trend-card
            :figure="paymentRateFigure"
            :trend="paymentRateTrend"
            icon="show_chart"
            caption="Taux d'exécution des CP disponibles"
            unit=" %"
          />
        </v-flex>
        <!-- <v-flex xs12 class="text-right" v-if="isAdmin">
          <v-btn @click="flowStockExport()" color="primary" text
            >Export délais</v-btn
          >
        </v-flex> -->
      </v-layout>
    </v-container>
    <home-message-dlg v-model="dlg" :msg="homeMsg" @confirm="confirm" />
  </v-card>
</template>

<script>
import * as types from '@/store/types.js'
import PmtChart from './Home/PmtChart'
import CmtChart from './Home/CmtChart'
import HomeMessageDlg from './Home/HomeMessageDlg.vue'
import TrendCard from './Home/TrendCard.vue'
import { mapGetters, mapState } from 'vuex'
import { excelExport } from '../excel'

const formatter = s => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(s)

export default {
  name: 'Home',
  components: {
    PmtChart,
    CmtChart,
    HomeMessageDlg,
    TrendCard,
  },
  data () {
    return {
      dlg: false,
      cmtImportDate: '',
      pmtImportDate: '',
    }
  },
  computed: {
    ...mapGetters(['isAdmin']),
    ...mapState({
      homeMsg: state => state.home.homeMessage,
      importLogs: state => state.home.importLogs,
      csfWeekTrend: state => state.home.csfWeekTrend,
      flowStockDelays: state => state.home.flowStockDelays,
      paymentRate: state => state.home.paymentRate,
    }),
    csfFigure () {
      return this.csfWeekTrend ? this.csfWeekTrend.ThisWeekCount : 0
    },
    csfTrend () {
      return this.csfWeekTrend ? this.csfWeekTrend.ThisWeekCount - this.csfWeekTrend.LastWeekCount : 0
    },
    delayFigure () {
      if (!this.flowStockDelays) {
        return 0
      }
      const fsd = this.flowStockDelays
      const delay = (fsd.ActualStockCount * fsd.ActualStockAverageDelay +
        fsd.ActualFlowCount * fsd.ActualFlowAverageDelay) / (fsd.ActualStockCount + fsd.ActualFlowCount)
      return delay
    },
    paymentRateFigure () {
      return this.paymentRate ? this.paymentRate.ActualRate * 100 : 0
    },
    paymentRateTrend () {
      return this.paymentRate ? (this.paymentRate.ActualRate - this.paymentRate.PastRate) * 100 : 0
    },
    delayTrend () {
      if (!this.flowStockDelays) {
        return 0
      }
      const fsd = this.flowStockDelays
      const formerDelay = (fsd.FormerStockCount * fsd.FormerStockAverageDelay +
        fsd.FormerFlowCount * fsd.FormerFlowAverageDelay) / (fsd.FormerStockCount + fsd.FormerFlowCount)
      return this.delayFigure - formerDelay
    },
    formattedDelayTrend () {
      return this.delayTrend ? formatter(this.delayTrend) : '-'
    },
  },
  methods: {
    confirm (msg) {
      this.$store.dispatch(types.SET_HOME_MESSAGE, msg)
    },
    flowStockExport () {
      const fsd = this.flowStockDelays
      const lines = [{
        flowAverageDelay: fsd.ActualFlowAverageDelay,
        flowCount: fsd.ActualFlowCount,
        stockAverageDelay: fsd.ActualStockAverageDelay,
        stockCount: fsd.ActualStockCount,
      }]
      const columns = [
        { header: 'Flux durée (j)', key: 'flowAverageDelay', width: 20 },
        { header: 'Flux nombre', key: 'flowCount', width: 20 },
        { header: 'Stock durée (j)', key: 'stockAverageDelay', width: 20 },
        { header: 'Stock nombre', key: 'stockCount', width: 20 },
      ]
      excelExport(lines, columns, 'Flux Stock')
    },
  },
  watch: {
    importLogs (list) {
      if (this.importLogs.length === 0) {
        this.cmtImportDate = ''
        this.pmtImportDate = ''
        return
      }
      const cmt = this.importLogs.filter(i => parseInt(i.Kind) === 1)
      const pmt = this.importLogs.filter(i => parseInt(i.Kind) === 2)
      this.cmtImportDate = cmt.length > 0 ? new Date(cmt[0].Date) : ''
      this.pmtImportDate = pmt.length > 0 ? new Date(pmt[0].Date) : ''
    },
  },
  created () {
    this.$store.dispatch(types.GET_HOME_DATAS)
  },
}
</script>

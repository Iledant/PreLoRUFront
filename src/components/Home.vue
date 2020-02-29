<template>
  <v-card>
    <v-card-title class="white--text primary headline">Accueil</v-card-title>
    <v-container grid-list-md fluid>
      <v-layout wrap>
        <v-flex xs12 md6>
          <div class="subtitle-1 font-weight-medium text-center">Engagements</div>
          <cmt-chart
            :height="400"
            :currentValues="curCmts"
            :previousValues="prevCmts"
            :programmation="prog"
          />
          <div class="caption text-right">Dernier import : {{ cmtImportDate | date }}</div>
        </v-flex>
        <v-flex xs12 md6>
          <div class="subtitle-1 font-weight-medium text-center">Paiements</div>
          <pmt-chart
            :height="400"
            :currentLOValues="curLOPmts"
            :previousLOValues="prevLOPmts"
            :currentPVValues="curPVPmts"
            :previousPVValues="prevPVPmts"
            :availableValues="available"
          />
          <div class="caption text-right">Dernier import : {{ pmtImportDate | date }}</div>
        </v-flex>
        <v-flex xs12>
          <v-card>
            <v-card-title class='tertiary subtitle-1 font-weight-medium'>
              {{ homeMsg ? homeMsg.Title : ''}}
            </v-card-title>
            <v-card-text>
              <div class="body-2 pt-3" v-show="homeMsg" v-html="homeMsg ? homeMsg.Html : ''"/>
            </v-card-text>
            <v-card-actions v-if="isAdmin">
              <v-spacer />
              <v-tooltip left color="primary">
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
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <home-message-dlg v-model="dlg" :msg="homeMsg" @confirm="confirm" />
  </v-card>
</template>

<script>
import * as types from '../store/types.js'
import PmtChart from './PmtChart'
import CmtChart from './CmtChart'
import HomeMessageDlg from './HomeMessageDlg.vue'
export default {
  name: 'Home',
  components: { PmtChart, CmtChart, HomeMessageDlg },
  data () {
    return {
      dlg: false
    }
  },
  computed: {
    curCmts () {
      return this.$store.state.home.currentYearCommitments
    },
    prevCmts () {
      return this.$store.state.home.previousYearCommitments
    },
    curLOPmts () {
      return this.$store.state.home.currentYearLOPayments
    },
    curPVPmts () {
      return this.$store.state.home.currentYearPVPayments
    },
    prevLOPmts () {
      return this.$store.state.home.previousYearLOPayments
    },
    prevPVPmts () {
      return this.$store.state.home.previousYearPVPayments
    },
    available () {
      return new Array(12).fill(this.$store.state.home.paymentCreditSum)
    },
    prog () {
      return this.$store.state.home.currentProgrammation
    },
    homeMsg () {
      return this.$store.state.home.homeMessage
    },
    importLogs () {
      return this.$store.state.home.importLogs
    },
    isAdmin () {
      return this.$store.getters.isAdmin
    },
    cmtImportDate () {
      if (this.importLogs.length === 0) {
        return ''
      }
      const i = this.importLogs.filter(i => parseInt(i.Kind) === 1)
      if (i.length === 0) {
        return ''
      }
      return new Date(i[0].Date)
    },
    pmtImportDate () {
      if (this.importLogs.length === 0) {
        return ''
      }
      const i = this.importLogs.filter(i => parseInt(i.Kind) === 2)
      if (i.length === 0) {
        return ''
      }
      return new Date(i[0].Date)
    }
  },
  methods: {
    confirm (msg) {
      this.$store.dispatch(types.SET_HOME_MESSAGE, msg)
    }
  },
  created () {
    this.$store.dispatch(types.GET_HOME_DATAS)
  }
}
</script>

<template>
  <v-card>
    <v-card-title class="white--text primary headline">Accueil</v-card-title>
    <v-container grid-list-md fluid>
      <v-layout wrap>
        <v-flex xs12 md6>
          <v-card>
            <v-card-title class='tertiary'>
              Paiements
            </v-card-title>
            <pmt-chart :height="400" class="pt-1" />
            <div class="caption text-right">
              Dernier import : {{ pmtImportDate | date }}
            </div>
          </v-card>
        </v-flex>
        <v-flex xs12 md6>
          <v-card>
            <v-card-title class='tertiary'>
              Engagements
            </v-card-title>
          <cmt-chart :height="400" class="pt-1" />
          <div class="caption text-right">
            Dernier import : {{ cmtImportDate | date }}
          </div>
          </v-card>
        </v-flex>
        <v-flex xs12>
          <v-card>
            <v-card-title class='tertiary'>
              {{ homeMsg ? homeMsg.Title : ''}}
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
                class="body-2 pt-3"
                v-show="homeMsg" v-html="homeMsg ? homeMsg.Html : ''"
              />
            </v-card-text>
          </v-card>
        </v-flex>
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
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'Home',
  components: { PmtChart, CmtChart, HomeMessageDlg },
  data () {
    return {
      dlg: false,
      cmtImportDate: '',
      pmtImportDate: ''
    }
  },
  computed: {
    ...mapGetters(['isAdmin']),
    ...mapState({
      homeMsg: state => state.home.homeMessage,
      importLogs: state => state.home.importLogs
    })
  },
  methods: {
    confirm (msg) {
      this.$store.dispatch(types.SET_HOME_MESSAGE, msg)
    }
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
    }
  },
  created () {
    this.$store.dispatch(types.GET_HOME_DATAS)
  }
}
</script>

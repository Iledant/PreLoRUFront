<template>
  <v-dialog :value="value" persistent :overlay="false" max-width="600px">
    <v-card>
      <v-card-title class="primary white--text">{{ title }}</v-card-title>
      <v-container grid-list-md fluid>
        <v-layout wrap>
          <v-flex xs6>
            <v-text-field
              v-model="item.SourceIRISCode"
              label="Code IRIS d'origine"
              :rules="[notNull]"
            />
          </v-flex>
          <v-flex xs6>
            <v-autocomplete
              :items="beneficiaries"
              v-model="item.BeneficiaryID"
              item-text="Name"
              item-value="ID"
              label="Bailleur"
              :rules="[notNull]"
            />
          </v-flex>
          <v-flex xs6>
            <v-text-field v-model="item.Area" label="Surface" :rules="[floatRule]" suffix="m²" />
          </v-flex>
          <v-flex xs6>
            <v-menu
              ref="dateMenu"
              v-model="dateMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="item.DestDate"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template #activator="{ on }">
                <v-text-field
                  v-model="formattedDestDate"
                  label="Date de décision du report"
                  prepend-icon="event"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="item.DestDate" no-title scrollable locale="fr-FR">
                <v-spacer />
                <v-btn text color="primary" @click="dateMenu = false">Annuler</v-btn>
                <v-btn text color="primary" @click="$refs.dateMenu.save(item.DestDate)">OK</v-btn>
              </v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs6>
            <v-text-field v-model="item.DestIRISCode" label="Code IRIS du report" />
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions class="tertiary">
        <v-spacer />
        <v-btn color="primary" small text @click="$emit('input', false)">Annuler</v-btn>
        <v-btn color="primary" small text @click="confirm" :disabled="disabled">{{ button }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { formatNullDate } from '@/date.js'
import { mapState } from 'vuex'
export default {
  name: 'ReservationReportDlg',
  props: {
    value: { type: Boolean, default: false },
    action: {
      type: String,
      default: 'create',
      validator: v => ['create', 'modify'].indexOf(v) !== -1,
    },
    item: { type: Object, default: v => {} },
  },
  data () {
    return {
      dateMenu: false,
    }
  },
  computed: {
    ...mapState({
      beneficiaries: state => state.beneficiaries.beneficiariesList,
    }),
    title () {
      return this.action === 'create'
        ? 'Ajouter un nouveau report'
        : 'Modifier le report'
    },
    button () {
      return this.action === 'create' ? 'Créer' : 'Modifier'
    },
    disabled () {
      return (
        this.item.BeneficiaryID === null ||
        this.item.SourceIRISCode === '' ||
        this.floatRule(this.item.Area) === 'Nombre positif attendu'
      )
    },
    formattedDestDate () {
      return formatNullDate(this.item.DestDate)
    },
  },
  methods: {
    confirm () {
      if (this.disabled) return
      this.$emit('input', false)
      const beneficiary = this.beneficiaries.find(b => b.ID === this.item.BeneficiaryID)
      const ReservationReport = {
        ID: this.item.ID,
        BeneficiaryID: this.item.BeneficiaryID,
        BeneficiaryName: beneficiary.Name,
        SourceIRISCode: this.item.SourceIRISCode,
        Area: parseFloat(String(this.item.Area).replace(',', '.')),
        DestIRISCode: this.item.DestIRISCode,
        DestDate: this.item.DestDate ? new Date(this.item.DestDate) : null,
      }
      this.$emit('confirm', ReservationReport)
    },
    notNull (item) {
      return !!item || 'Le code IRIS doit être renseigné'
    },
    floatRule (item) {
      return /^\d+([,.]\d+)?$/.test(item) || 'Nombre positif attendu'
    },
  },
}
</script>

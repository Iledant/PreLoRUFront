<template>
  <v-dialog
    :value="value"
    @input="this.$emit('input', $event.target.value)"
    persistent
    :overlay="false"
    max-width="600px"
  >
    <v-card>
      <v-card-title class="primary white--text">{{ title }}</v-card-title>
      <v-container grid-list-md fluid>
        <v-layout wrap>
          <v-flex xs6>
            <v-autocomplete
              :items="beneficiaries"
              v-model="item.CurrentBeneficiaryID"
              item-text="Name"
              item-value="ID"
              label="Bailleur actuel"
              :rules="[notNull]"
            />
          </v-flex>
          <v-flex xs6>
            <v-autocomplete
              :items="nullBeneficiaries"
              v-model="item.FirstBeneficiaryID"
              item-text="Name"
              item-value="ID"
              label="Bailleur initial"
            />
          </v-flex>
          <v-flex xs6>
            <v-autocomplete
              :items="cities"
              v-model="item.CityCode"
              item-text="Name"
              item-value="InseeCode"
              label="Ville"
              :rules="[notNull]"
            />
          </v-flex>
          <v-flex xs3>
            <v-autocomplete
              :items="conventionTypes"
              v-model="item.ConventionTypeID"
              item-text="Name"
              item-value="ID"
              label="Type de LLS"
              :rules="[notNull]"
            />
          </v-flex>
          <v-flex xs3>
            <v-autocomplete
              :items="typologies"
              v-model="item.TypologyID"
              item-text="Name"
              item-value="ID"
              label="Type"
            />
          </v-flex>
          <v-flex xs4>
            <v-text-field v-model="item.AddressNumber" label="Numéro" :rules="[notNull]" />
          </v-flex>
          <v-flex xs8>
            <v-text-field v-model="item.AddressStreet" label="Rue" :rules="[notNull]" />
          </v-flex>
          <v-flex xs6>
            <v-text-field v-model="item.RPLS" label="RPLS" />
          </v-flex>
          <v-flex xs6>
            <v-text-field v-model="item.Convention" label="Convention de financement" />
          </v-flex>
          <v-flex xs6>
            <v-menu
              ref="conventionMenu"
              v-model="conventionMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="item.ConventionDate"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template #activator="{ on }">
                <v-text-field
                  v-model="formattedConventionDate"
                  label="Date de réception de la convention"
                  prepend-icon="event"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="item.ConventionDate" no-title scrollable locale="fr-FR">
                <v-spacer />
                <v-btn text color="primary" @click="conventionMenu = false">Annuler</v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.conventionMenu.save(item.ConventionDate)"
                >OK</v-btn>
              </v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs6>
            <v-text-field v-model="item.EliseRef" label="Numéro ELISE convention" />
          </v-flex>
          <v-flex xs6>
            <v-menu
              ref="transferMenu"
              v-model="transferMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="item.TransferDate"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template #activator="{ on }">
                <v-text-field
                  v-model="formattedTransferDate"
                  label="Date de la dernière cession"
                  prepend-icon="event"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="item.TransferDate" no-title scrollable locale="fr-FR">
                <v-spacer />
                <v-btn text color="primary" @click="transferMenu = false">Annuler</v-btn>
                <v-btn text color="primary" @click="$refs.transferMenu.save(item.TransferDate)">OK</v-btn>
              </v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs6>
            <v-autocomplete
              :items="transfers"
              v-model="item.TransferID"
              item-text="Name"
              item-value="ID"
              label="Cession vers"
            />
          </v-flex>
          <v-flex xs4>
            <v-text-field
              v-model="item.EndYear"
              label="Année de commercialisation"
              :rules="[emptyOrYearRule]"
            />
          </v-flex>
          <v-flex xs8>
            <v-autocomplete
              :items="comments"
              v-model="item.CommentID"
              item-text="Name"
              item-value="ID"
              label="Commentaire sur la cession"
            />
          </v-flex>
          <v-flex xs3>
            <v-text-field v-model="item.Area" label="Surface" :rules="[nullOrFloat]" suffix="m²" />
          </v-flex>
          <v-flex xs3>
            <v-text-field v-model="item.Loan" label="Loyer" :rules="[nullOrFloat]" suffix="€" />
          </v-flex>
          <v-flex xs3>
            <v-text-field v-model="item.Charges" label="Charges" :rules="[nullOrFloat]" suffix="€" />
          </v-flex>
          <v-flex xs3>
            <v-checkbox v-model="item.PMR" label="PMR" />
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
import { formatNullDate } from '../date.js'
import { yearRule, nullUintRule } from './mixins'
import { mapState } from 'vuex'
export default {
  name: 'ReservationFeeDlg',
  mixins: [yearRule, nullUintRule],
  props: {
    value: { type: Boolean, default: false },
    action: {
      type: String,
      default: 'create',
      validator: v => ['create', 'modify'].indexOf(v) !== -1
    },
    item: { type: Object, default: v => {} }
  },
  data () {
    return {
      transferMenu: null,
      conventionMenu: null
    }
  },
  computed: {
    ...mapState({
      cities: state => state.cities.citiesList,
      typologies: state => state.reservationFees.housingTypologiesList,
      beneficiaries: state => state.beneficiaries.beneficiariesList,
      comments: state => state.reservationFees.housingCommentsList,
      transfers: state => state.reservationFees.housingTransfersList,
      conventionTypes: state => state.reservationFees.conventionTypesList
    }),
    title () {
      return this.action === 'create'
        ? 'Ajouter une nouvelle réservation'
        : 'Modifier la réservation'
    },
    button () {
      return this.action === 'create' ? 'Créer' : 'Modifier'
    },
    nullBeneficiaries () {
      return [{ ID: null, Name: '<Identique>' }, ...this.beneficiaries]
    },
    disabled () {
      return (
        this.item.CurrentBeneficiaryID === null ||
        this.item.AddressNumber === '' ||
        this.item.AddressStreet === '' ||
        this.item.CityCode === null ||
        this.emptyOrYearRule(this.item.EndYear) !== true ||
        this.nullOrFloat(this.item.Area) !== true ||
        this.nullOrFloat(this.item.Loan) !== true ||
        this.nullOrFloat(this.item.Charges) !== true
      )
    },
    formattedTransferDate () {
      return formatNullDate(this.item.TransferDate)
    },
    formattedConventionDate () {
      return formatNullDate(this.item.ConventionDate)
    }
  },
  methods: {
    confirm () {
      if (!this.disabled) {
        this.$emit('input', false)
        const ReservationFee = {
          ID: this.item.ID,
          CurrentBeneficiaryID: this.item.CurrentBeneficiaryID,
          FirstBeneficiaryID: this.item.FirstBeneficiaryID,
          CityCode: this.item.CityCode,
          AddressNumber: this.item.AddressNumber,
          AddressStreet: this.item.AddressStreet,
          RPLS: this.item.RPLS,
          Convention: this.item.Convention,
          ConventionTypeID: this.item.ConventionTypeID,
          Count: this.item.Count ? parseInt(this.item.Count) : null,
          TransferDate: this.item.TransferDate ? new Date(this.item.TransferDate) : null,
          CommentID: this.item.CommentID,
          TransferID: this.item.TransferID,
          PMR: this.item.PMR,
          ConventionDate: this.item.ConventionDate ? new Date(this.item.ConventionDate) : null,
          EliseRef: this.item.EliseRef,
          Area: this.item.Area ? parseFloat(String(this.item.Area).replace(',', '.')) : null,
          EndYear: this.item.EndYear ? parseInt(this.item.EndYear) : null,
          Loan: this.item.Loan ? parseFloat(String(this.item.Loan).replace(',', '.')) : null,
          Charges: this.item.Charges ? parseFloat(String(this.item.Charges).replace(',', '.')) : null,
          TypologyID: this.item.TypologyID
        }
        this.$emit('confirm', ReservationFee)
      }
    },
    notNull (item) {
      return !!item || 'Ne doit pas être vide'
    },
    nullOrFloat (item) {
      return item === null || /^\d+([,.]\d+)?$/.test(item) || 'Vide ou nombre positif'
    }
  }
}
</script>

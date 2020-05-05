<template>
  <v-layout row wrap>
    <v-flex xs12 sm6>
      <v-file-input
        label="Tester le fichier"
        @change="checkFile($event,testUpload)"
        :loading="loading"
      />
      <v-file-input
        label="Télécharger"
        @change="checkFile($event,upload)"
        :loading="loading"
      />
    </v-flex>
    <v-flex xs12 sm6 class="body-2">
      Import d'un fichier Excel (.xlsx) pour mettre à jour ou pour compléter la
      base de données des réservations de la Région dans PreLoRU.<br />
      Pour vérifier que l'ensemble des bénéficiaires et des noms de communes
      sont bien connues de PreLoRU et permettre un import correct, il faut
      utiliser la partie "Tester le fichier". Il retourne le nombre de lignes
      qui ont pu être décodées ainsi que la liste des villes non reconnues et la
      liste des bénéficiaires non reconnus.<br />
      Le fichier importé doit avoir le format du fichier historique de gestion
      du contingent régional.
    </v-flex>
    <v-flex xs12 v-if="test">
      Nombre de lignes : {{ test.batchSize }}<br />
      Communes non reconnues : {{ test.missingCities.join(', ') }}<br />
      Bénéficiaires non reconnus : {{ test.missingBeneficiaries.join(', ') }}<br />
    </v-flex>
  </v-layout>
</template>

<script>
import { excelReadFile } from '@/excel'
import checkFile from './checkFile'
import * as types from '@/store/types'
const requiredColumns = [
  'CurrentBeneficiary',
  'FirstBeneficiary',
  'City',
  'AddressNumber',
  'AddressStreet',
  'RPLS',
  'Convention',
  'Typology',
  'ConventionType',
  'Count',
  'Transfer',
  'TransferDate',
  'PMR',
  'Comment',
  'ConventionDate',
  'Area',
  'EndYear',
  'Loan',
  'Charges'
]
export default {
  name: 'ReservationFeeUpload',
  mixins: [checkFile],
  data () {
    return {
      loading: false,
      test: null
    }
  },
  methods: {
    parse ({
      CurrentBeneficiary,
      CityCode,
      Count,
      TransferDate,
      ConventionDate,
      Convention,
      Area,
      EndYear,
      Loan,
      Charges,
      PMR,
      RPLS,
      AddressNumber,
      ...others
    }) {
      return {
        CurrentBeneficiary: CurrentBeneficiary.trim(),
        CityCode: CityCode ? parseInt(CityCode) : null,
        Count: Count ? parseInt(Count) : null,
        TransferDate: TransferDate ? parseInt(TransferDate) : null,
        ConventionDate: ConventionDate ? parseInt(ConventionDate) : null,
        Area: Area ? parseFloat(Area) : null,
        Loan: Loan ? parseFloat(Loan) : null,
        Charges: Charges ? parseFloat(Charges) : null,
        EndYear: EndYear ? parseInt(EndYear) : null,
        PMR: !!PMR,
        Convention: Convention ? String(Convention) : null,
        RPLS: RPLS ? String(RPLS) : null,
        AddressNumber: AddressNumber ? String(AddressNumber) : null,
        ...others
      }
    },
    async upload (file) {
      const save = o => {
        this.$store.dispatch(types.UPLOAD_RESERVATION_FEES, { ReservationFee: o })
      }
      this.loading = true
      await excelReadFile(file, requiredColumns, save, this.fileError, this.parse)
      this.loading = false
    },
    async testUpload (file) {
      const save = o => this.$store.dispatch(types.TEST_UPLOAD_RESERVATION_FEES,
        { ReservationFee: o })
      this.loading = true
      const body = await excelReadFile(file, requiredColumns, save, this.fileError, this.parse)
      this.loading = false
      console.log(body)
      if (body) {
        this.test = {
          batchSize: body.BatchSize,
          missingCities: [...body.MissingCities],
          missingBeneficiaries: [...body.MissingBeneficiaries]
        }
      }
    }
  }
}
</script>

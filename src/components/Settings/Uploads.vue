<template>
  <v-card>
    <v-card-title class="white--text primary text-h5">
      Imports de fichiers
    </v-card-title>
    <v-container grid-list-md fluid>
      <v-layout row wrap align-baseline>
        <v-flex xs12 md6 offset-md3>
          <v-autocomplete
            :items="items"
            label="Sélectionner le type de données à importer"
            v-model="selected" />
        </v-flex>
        <v-flex xs12>
          <component v-if="selected" :is="selected" />
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import PmtDemandUpload from './Uploads/PmtDemandUpload.vue'
import PlacementUpload from './Uploads/PlacementUpload.vue'
import CoproUpload from './Uploads/CoproUpload.vue'
import CoproCommitmentLinkUpload from './Uploads/CoproCommitmentLinkUpload.vue'
import HousingUpload from './Uploads/HousingUpload.vue'
import HousingCommitmentLinkUpload from './Uploads/HousingCommitmentLinkUpload.vue'
import HousingSummaryUpload from './Uploads/HousingSummaryUpload.vue'
import PaymentCreditUpload from './Uploads/PaymentCreditUpload.vue'
import PaymentCreditJournalUpload from './Uploads/PaymentCreditJournalUpload.vue'
import RenewProjectUpload from './Uploads/RenewProjectUpload.vue'
import CityUpload from './Uploads/CityUpload.vue'
import CommitmentUpload from './Uploads/CommitmentUpload.vue'
import CommunityUpload from './Uploads/CommunityUpload.vue'
import IRISHousingTypesUpload from './Uploads/IRISHousingTypesUpload.vue'
import PaymentUpload from './Uploads/PaymentUpload.vue'
import RPLSUpload from './Uploads/RPLSUpload.vue'
import ReservationFeeUpload from './Uploads/ReservationFeeUpload.vue'

export default {
  name: 'Uploads',
  data () {
    return {
      selected: null,
      items: [
        { text: 'Paiements', value: PaymentUpload },
        { text: 'Engagements', value: CommitmentUpload },
        { text: 'Demandes de paiement (DVS)', value: PmtDemandUpload },
        { text: 'Stagiaires', value: PlacementUpload },
        { text: 'Copropriétés', value: CoproUpload },
        { text: 'Projet de renouvellement urbain', value: RenewProjectUpload },
        { text: 'Logements sociaux', value: HousingUpload },
        { text: 'Recensement RPLS', value: RPLSUpload },
        { text: 'Droits de réservation', value: ReservationFeeUpload },
        { text: 'Villes', value: CityUpload },
        { text: 'Intercommunalités', value: CommunityUpload },
        { text: 'Tableau bilan des logements sociaux', value: HousingSummaryUpload },
        { text: 'Mise à jour des types de logements sociaux', value: IRISHousingTypesUpload },
        { text: 'Situation des crédits de paiement', value: PaymentCreditUpload },
        { text: 'Mouvements des crédits de paiement', value: PaymentCreditJournalUpload },
        { text: 'Liens engagements / copropriétés', value: CoproCommitmentLinkUpload },
        { text: 'Liens engagements / logement social', value: HousingCommitmentLinkUpload },
      ],
    }
  },
}
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="auto">
        <v-list dense>
          <v-list-item-group>
            <v-list-item
              dense
              v-for="(item, i) in tableOfContents"
              :key="i"
              :href="'#' + item.link"
            >{{item.title}}</v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
      <v-col>
        <v-sheet max-width="800" class="overflow-y-auto text-justify">
          <intro />
          <principles />
          <housing />
          <copro />
          <renew-project />
          <beneficiary />
          <beneficiary-group />
          <placement />
          <reservation-fee />
          <programmation />
          <prevision />
          <summaries />
          <payment-delays />
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Intro from './Help/Intro.md'
import Principles from './Help/Principles.md'
import Housing from './Help/Housing.md'
import Copro from './Help/Copro.md'
import RenewProject from './Help/RenewProject.md'
import Beneficiary from './Help/Beneficiary.md'
import BeneficiaryGroup from './Help/BeneficiaryGroup.md'
import ReservationFee from './Help/ReservationFee.md'
import Programmation from './Help/Programmation.md'
import Prevision from './Help/Prevision.md'
import Placement from './Help/Placement.md'
import Summaries from './Help/Summaries.md'
import PaymentDelays from './Help/PaymentDelays.md'
export default {
  name: 'Help',
  components: {
    Intro,
    Principles,
    Housing,
    Copro,
    RenewProject,
    Beneficiary,
    BeneficiaryGroup,
    ReservationFee,
    Programmation,
    Prevision,
    Placement,
    Summaries,
    PaymentDelays,
  },
  data () {
    return {
      tableOfContents: [
        { title: 'Introduction', link: 'intro' },
        { title: 'Principes généraux', link: 'principles' },
        { title: 'Logement social', link: 'housing' },
        { title: 'Copropriétés', link: 'copro' },
        { title: 'Renouvellement urbain', link: 'renew_project' },
        { title: 'Bénéficiaires', link: 'beneficiary' },
        { title: 'Groupes de bénéficiaires', link: 'beneficiary_group' },
        { title: 'Stagiaires', link: 'placement' },
        { title: 'Droits de réservation', link: 'reservation_fee' },
        { title: 'Programmation', link: 'programmation' },
        { title: 'Prévisions', link: 'prevision' },
        { title: 'Synthèses territoriales', link: 'summaries' },
        { title: 'Délais de paiement', link: 'payment_delays' },
      ],
    }
  },
}
</script>

<style scoped>
.v-sheet {
  height: calc(100vh - 136px);
}
</style>

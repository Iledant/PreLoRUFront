<template>
  <v-dialog :value="value" persistent max-width="500px">
    <v-card>
      <v-card-title class="primary white--text">
        <v-icon color="white" class="pr-2">info</v-icon>La préprogrammation
      </v-card-title>
      <v-card-text class="pt-2">
        La
        <i>préprogrammation</i> repose sur une analyse des besoins. Elle permet
        de proposer à la
        <i>programmation</i> des opérations en tenant compte des
        contraintes du budget, des priorités ainsi que de l'analyse des
        prévisions des années précédentes.
        <p />La
        <i>préprogrammation</i> n'est accessible qu'aux administrateurs
        ou aux utilisateurs qui ont le droit sur la préprogrammation du
        secteur concerné (généralement le chef de service). Les autres
        utilisateurs peuvent la consulter mais ne peuvent pas la modifier.
      </v-card-text>
      <v-card-actions class="tertiary">
        <v-spacer />
        <v-btn @click.stop="$emit('input', false)" text small color="primary">Ok</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'PreProg',
  props: {
    value: { type: Boolean, default: false }
  }
}
</script>

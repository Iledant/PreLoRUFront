<template>
  <v-card>
    <v-card-title class="white--text primary headline">Groupe de bénéficiaires «{{ name }}»</v-card-title>
    <v-tabs background-color="primary" slider-color="tertiary" v-model="tab" centered dark>
      <v-tab>Liste des bénéficiaires</v-tab>
      <v-tab-item>
        <v-container grid-list-md fluid>
          <v-layout wrap>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field label="Rechercher (code, nom)" v-model="search" prepend-icon="search" />
            </v-flex>
            <v-flex sm3 />
            <v-flex xs12>
              <v-data-table
                :headers="headers"
                :items="items"
                item-key="ID"
                :loading="loading"
                dense
                class="elevation-1"
                no-data-text="Aucun bénéficiaire trouvé"
                no-results-text="Recherche infructueuse"
              >
                <template v-slot:item="{ item }">
                  <tr>
                    <td>{{ item.Code }}</td>
                    <td>{{ item.Name }}</td>
                    <td class="px-0">
                      <v-tooltip left color="primary" v-if="isAdmin">
                        <template #activator="{ on }">
                          <v-btn
                            color="primary"
                            small
                            icon
                            text
                            class="pa-0"
                            v-on="on"
                            @click="remove(item)"
                          >
                            <v-icon>delete</v-icon>
                          </v-btn>
                        </template>
                        Supprimer
                      </v-tooltip>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-flex>
            <v-flex xs8 class="text-right" v-if="isAdmin">
              <v-autocomplete
                :items="beneficiaries"
                v-model="beneficiaryID"
                item-text="Name"
                item-value="ID"
                label="Bénéficiaire"
              />
            </v-flex>
            <v-flex xs4 v-if="isAdmin">
              <v-tooltip left color="primary" v-show="beneficiaryID">
                <template #activator="{ on }">
                  <v-btn
                    color="primary"
                    fab
                    dark
                    x-small
                    @click="add"
                    v-on="on"
                    v-show="beneficiaryID"
                  >
                    <v-icon>add</v-icon>
                  </v-btn>
                </template>
                <span>Ajouter le bénéficiaire</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
        </v-container>
      </v-tab-item>
      <v-tab>Engagements</v-tab>
      <v-tab-item>
        <beneficiary-group-commitments />
      </v-tab-item>
      <v-tab>Stagiaires</v-tab>
      <v-tab-item>
        <beneficiary-group-placements />
      </v-tab-item>
    </v-tabs>
    <delete-dialog
      v-model="delDlg"
      sentence="Enlever le bénéficiaire définitivement ?"
      @confirm="delConfirm"
    />
  </v-card>
</template>

<script>
import * as types from '../store/types.js'
import DeleteDialog from './DeleteDialog.vue'
import { mapGetters, mapState } from 'vuex'
import BeneficiaryGroupPlacements from './BeneficiaryGroupPlacements.vue'
import BeneficiaryGroupCommitments from './BeneficiaryGroupCommitments.vue'
export default {
  name: 'BeneficiaryGroup',
  components: {
    DeleteDialog,
    BeneficiaryGroupPlacements,
    BeneficiaryGroupCommitments
  },
  data () {
    return {
      search: '',
      tab: null,
      headers: [
        { text: 'Code', value: 'Code', sortable: false },
        { text: 'Nom', value: 'Name', sortable: false },
        { text: '', value: '', sortable: false, width: '1%' }
      ],
      item: {},
      delDlg: false,
      beneficiaryID: null
    }
  },
  methods: {
    remove (item) {
      this.item = { ...item }
      this.delDlg = true
    },
    async delConfirm () {
      const BeneficiaryIDs = this.items.filter(b => b.ID !== this.item.ID).map(b => b.ID)
      await this.$store.dispatch(types.SET_BENEFICIARY_GROUP_ITEMS,
        { ID: this.ID, BeneficiaryIDs })
    },
    async add () {
      const BeneficiaryIDs = [...this.items.map(p => p.ID), this.beneficiaryID]
      await this.$store.dispatch(types.SET_BENEFICIARY_GROUP_ITEMS,
        { ID: this.ID, BeneficiaryIDs })
    }
  },
  created () {
    this.$store.dispatch(types.GET_BENEFICIARY_GROUP_ITEMS, this.ID)
    this.$store.dispatch(types.GET_BENEFICIARY_GROUP_PLACEMENTS, this.ID)
    this.$store.dispatch(types.GET_ALL_BENEFICIARIES)
  },
  computed: {
    ...mapGetters(['isAdmin', 'loading']),
    ...mapState({
      items: state => state.beneficiaryGroup.beneficiariesGroupItems,
      beneficiaries: state => state.beneficiaries.beneficiariesList
    }),
    ID () { return this.$route.params.ID },
    name () { return this.$route.params.Name }
  }
}
</script>

<template>
  <v-card>
    <v-card-title class="white--text primary text-h5">Groupes de bénéficiaires</v-card-title>
    <v-container grid-list-md fluid>
      <v-layout wrap>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field
            label="Rechercher (code, nom)"
            v-model="search"
            prepend-icon="search"
          />
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
            no-data-text="Aucun groupe de bénéficiaires trouvé"
            no-results-text="Recherche infructueuse"
          >
            <template #item="{ item }">
              <tr>
                <td class="table-link" @click="details(item)">{{ item.Name }}</td>
                <td class="px-0">
                  <v-tooltip left color="primary" v-if="isAdmin">
                    <template #activator="{ on }">
                      <v-btn
                        color="primary"
                        small
                        text
                        icon
                        class="pa-0"
                        @click="modify(item)"
                        v-on="on"
                      >
                        <v-icon>create</v-icon>
                      </v-btn>
                    </template>
                    Modifier
                  </v-tooltip>
                </td>
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
        <v-flex xs12 class="text-right" v-if="isAdmin">
          <v-tooltip left color="primary">
            <template #activator="{ on }">
              <v-btn color="primary" fab dark x-small @click="add" v-on="on">
                <v-icon>add</v-icon>
              </v-btn>
            </template>
            <span>Ajouter une nouvelle ligne</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
    </v-container>

    <v-dialog v-model="dialog" persistent :overlay="false" max-width="500px">
      <v-card>
        <v-card-title class="primary white--text text-h5">{{ dlgTitle }}</v-card-title>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field
                label="Nom du groupe"
                v-model="item.Name"
                @keyup.esc="dialog = false"
                @keyup.enter="save"
              />
            </v-flex>
          </v-layout>
        </v-container>

        <v-card-actions class="tertiary">
          <v-spacer />
          <v-btn color="primary" small text @click="dialog = false">Annuler</v-btn>
          <v-btn color="primary" small text @click="save" :disabled="disabled">{{ dlgBtn }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <delete-dialog
      v-model="delDlg"
      sentence="Supprimer le groupe de bénéficiaires définitivement ?"
      @confirm="delConfirm"
    />
  </v-card>
</template>

<script>
import * as types from '@/store/types.js'
import DeleteDialog from '@/components/DeleteDialog'
export default {
  name: 'BeneficiaryGroups',
  components: { DeleteDialog },
  data () {
    return {
      search: '',
      headers: [
        { text: 'Nom', value: 'Name', sortable: false },
        { text: '', value: '', sortable: false, width: '1%' },
        { text: '', value: '', sortable: false, width: '1%' },
      ],
      item: {},
      dialog: false,
      delDlg: false,
      dlgTitle: 'Nouveau groupe de bénéficiaire',
      dlgBtn: 'Créer',
    }
  },
  methods: {
    remove (item) {
      this.item = { ...item }
      this.delDlg = true
    },
    async delConfirm () {
      await this.$store.dispatch(types.DELETE_BENEFICIARY_GROUP, this.item.ID)
    },
    modify (item) {
      this.item = { ...item }
      this.dlgTitle = 'Modifier le groupe de bénéficiaires'
      this.dlgBtn = 'Modifier'
      this.dialog = true
    },
    add (item) {
      this.item.Name = null
      this.item.ID = -1
      this.dlgTitle = 'Nouveau groupe de bénéficiaires'
      this.dlgBtn = 'Créer'
      this.dialog = true
    },
    async save () {
      if (!this.disabled) {
        const dispatch =
          this.dlgBtn === 'Créer' ? types.CREATE_BENEFICIARY_GROUP : types.UPDATE_BENEFICIARY_GROUP
        await this.$store.dispatch(dispatch, { BeneficiaryGroup: { ...this.item } })
        this.dialog = false
      }
    },
    details ({ Name, ID }) {
      this.$router.push({ name: 'BeneficiaryGroup', params: { ID, Name } })
    },
  },
  created () {
    this.$store.dispatch(types.GET_BENEFICIARY_GROUPS)
  },
  computed: {
    isAdmin () {
      return this.$store.getters.isAdmin
    },
    items () {
      return this.$store.state.beneficiaryGroup.beneficiariesGroupList
    },
    loading () {
      return this.$store.state.loading.loading !== 0
    },
    disabled () {
      return this.item.Name === null || this.item.Name === ''
    },
  },
}
</script>

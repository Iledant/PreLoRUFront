<template>
  <v-card>
    <v-card-title class="white--text primary headline">Intercommunalités</v-card-title>
    <v-container fluid grid-list-md>
      <v-layout wrap>
        <v-flex xs12 md6 offset-md3>
          <v-text-field label="Rechercher" v-model="search" prepend-icon="search" />
        </v-flex>
        <v-flex xs12>
          <v-data-table
            :headers="headers"
            :items="items"
            item-key="ID"
            :loading="loading"
            :search="search"
            class="elevation-1"
            dense
          >
            <template #item="{ item }">
              <tr>
                <td class="text-left">{{ item.Code }}</td>
                <td class="text-left">{{ item.Name }}</td>
                <td class="px-0">
                  <v-tooltip left color="primary">
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
                  <v-tooltip left color="primary">
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
        <v-flex xs12 class="text-right">
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
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-file-input
        accept="*.xlsx"
        label="Importer des intercos"
        :loading="loading"
        show-size
        @change="chkAndUpload($event,upload)"
      />
    </v-card-actions>

    <v-dialog v-model="dialog" persistent :overlay="false" max-width="500px">
      <v-card>
        <v-card-title class="primary white--text">{{ dlgTitle }}</v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  label="Code (INSEE)"
                  v-model="item.Code"
                  @keyup.esc="dialog = false"
                  @keyup.enter="save"
                  :rules="[checkCommunityCode]"
                />
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  label="Nom"
                  v-model="item.Name"
                  @keyup.esc="dialog = false"
                  @keyup.enter="save"
                />
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions class="tertiary">
          <v-spacer />
          <v-btn color="primary" small text @click="dialog = false">Annuler</v-btn>
          <v-btn color="primary" small text @click="save" :disabled="disabled">{{ dlgBtn }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <delete-dialog
      v-model="delDlg"
      sentence="Supprimer l'intercommunalité définitivement ?"
      @confirm="delConfirm"
    />
  </v-card>
</template>

<script>
import * as types from '@/store/types.js'
import { chkAndUpload } from '@/components/mixins'
import DeleteDialog from '@/components/DeleteDialog.vue'
const communityCodeTest = v => /^\d{9}(\.\d{2})?$/.test(v)
export default {
  name: 'Communities',
  mixins: [chkAndUpload],
  components: { DeleteDialog },
  data () {
    return {
      search: '',
      headers: [
        { text: 'Code', value: 'Code' },
        { text: 'Nom', value: 'Name' },
        { text: '', value: '', sortable: false, width: '1%' },
        { text: '', value: '', sortable: false, width: '1%' }
      ],
      dialog: false,
      delDlg: false,
      item: { Code: null, Name: null },
      dlgTitle: 'Nouvelle intercommunalité',
      dlgBtn: 'Créer',
      menu: null
    }
  },
  methods: {
    remove (item) {
      this.item.ID = item.ID
      this.delDlg = true
    },
    modify (item) {
      this.item = { ...item }
      this.dlgTitle = 'Modifier l\'intercommunalité'
      this.dlgBtn = 'Modifier'
      this.dialog = true
    },
    add (item) {
      this.item.ID = null
      this.item.Name = null
      this.item.Code = null
      this.dlgTitle = 'Nouvelle intercommunalité'
      this.dlgBtn = 'Créer'
      this.dialog = true
    },
    async save () {
      if (!this.disabled) {
        const dispatch =
          this.dlgBtn === 'Créer'
            ? types.CREATE_COMMUNITY
            : types.UPDATE_COMMUNITY
        await this.$store.dispatch(dispatch, this.item)
        this.dialog = false
      }
    },
    async delConfirm () {
      await this.$store.dispatch(types.DEL_COMMUNITY, this.item.ID)
    },
    upload (file) {
      this.$store.dispatch(types.UPLOAD_COMMUNITIES, file)
    },
    checkCommunityCode (c) {
      return communityCodeTest(c) || 'Code INSEE attendu'
    }
  },
  computed: {
    items () {
      return this.$store.state.communities.communitiesList
    },
    loading () {
      return this.$store.state.loading.loading !== 0
    },
    disabled () {
      return (
        this.item.Name === null ||
        this.item.Name === '' ||
        !communityCodeTest(this.item.Code)
      )
    }
  },
  created () {
    this.$store.dispatch(types.GET_COMMUNITIES)
  }
}
</script>

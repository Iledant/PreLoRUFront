<template>
  <v-card>
    <v-card-title class="white--text primary text-h5">Stagiaires</v-card-title>
    <v-container fluid grid-list-md>
      <v-layout wrap>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field label="Recherche" v-model="search" prepend-icon="search"/>
        </v-flex>
        <v-flex xs12>
          <v-data-table
            :headers="headers"
            :items="items"
            item-key="ID"
            :loading="loading"
            :search="search"
            dense
            class="elevation-1"
            no-data-text="Aucun engagement stagiaire trouvé"
            no-results-text="Recherche infructueuse"
          >
            <template #item="{ item }">
              <tr>
                <td class="text-right">{{ item.CreationDate | date }}</td>
                <td>{{ item.IrisCode }}</td>
                <td>{{ item.BeneficiaryName }}</td>
                <td class="text-right">{{ item.Count }}</td>
                <td class="text-right">{{ item.ContractYear | nullable }}</td>
                <td>{{ item.Comment }}</td>
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
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions class="tertiary">
      <v-spacer v-if="isAdmin" />
      <v-btn color="primary" small text @click="download">Export Excel</v-btn>
    </v-card-actions>

    <v-dialog v-model="dialog" persistent :overlay="false" max-width="500px">
      <v-card>
        <v-card-title class="primary white--text text-h5">
          Modifier le commentaire
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <span class="font-weight-medium">Code IRIS :</span>
                {{ item.IrisCode }}
              </v-flex>
              <v-flex xs12>
                <span class="font-weight-medium">Date :</span>
                {{ item.CreationDate | date }}
              </v-flex>
              <v-flex xs12>
                <span class="font-weight-medium">Montant de la subvention :</span>
                {{ item.CommitmentValue | currency }}
              </v-flex>
              <v-flex xs12>
                <span class="font-weight-medium">Nombre :</span>
                {{ item.Count }}
              </v-flex>
              <v-flex xs12>
                <span class="font-weight-medium">Convention grand compte :</span>
                {{ item.ContractYear | nullable }}
              </v-flex>
              <v-flex xs12>
                <v-textarea label="Commentaire" v-model="item.Comment" />
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>

        <v-card-actions class="tertiary">
          <v-spacer />
          <v-btn color="primary" small text @click="dialog = false">Annuler</v-btn>
          <v-btn color="primary" small text @click="save">Modifier</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import * as types from '@/store/types.js'
import { chkAndUpload } from '@/components/mixins'
import { excelExport, dateStyle, valStyle } from '@/excel'
export default {
  name: 'Placement',
  mixins: [chkAndUpload],
  data () {
    return {
      search: '',
      headers: [
        { text: 'Date engt', value: 'CreationDate', align: 'right' },
        { text: 'IRIS', value: 'IrisCode' },
        { text: 'Bénéficiaire', value: 'BeneficiaryName' },
        { text: 'Nombre', value: 'Count', align: 'right' },
        { text: 'Grand compte', value: 'ContractYear', align: 'right' },
        { text: 'Commentaire', value: 'Comment' },
        { text: '', value: '', sortable: false, width: '1%' }
      ],
      dialog: false,
      delDlg: false,
      item: {}
    }
  },
  methods: {
    modify (item) {
      this.item = { ...item }
      this.dialog = true
    },
    async save () {
      await this.$store.dispatch(types.UPDATE_PLACEMENT,
        { ID: this.item.ID, Comment: this.item.Comment })
      this.dialog = false
    },
    download () {
      if (this.items.length === 0) {
        return
      }
      const filtered = this.items.filter(item => {
        const search = this.search.toString().toLocaleUpperCase()
        for (const key in item) {
          if (item[key] &&
          item[key].toString().toLocaleUpperCase().indexOf(search) !== -1) return true
        }
        return false
      })
      const columns = [
        { header: 'Date CP', key: 'CreationDate', ...dateStyle },
        { header: 'Code IRIS', key: 'IrisCode', width: 14 },
        { header: 'Secteur', key: 'Sector', width: 10 },
        { header: 'Code action', key: 'ActionCode', width: 12 },
        { header: 'Nom action', key: 'ActionName', width: 30 },
        { header: 'Montant', key: 'CommitmentValue', ...valStyle },
        { header: 'Bénéficiaire', key: 'BeneficiaryName', width: 20 },
        { header: 'Nombre', key: 'Count', width: 10, addTotal: true },
        { header: 'Année convention', key: 'ContractYear', width: 14 },
        { header: 'Commentaire', key: 'Comment', width: 50 }
      ]
      const formatted = filtered.map(({ CreationDate, CommitmentValue, ...others }) => {
        return {
          CreationDate: new Date(CreationDate),
          CommitmentValue: CommitmentValue ? CommitmentValue * 0.01 : 0,
          ...others
        }
      })
      excelExport(formatted, columns, 'Stagiaires ')
    }
  },
  computed: {
    isAdmin () {
      return this.$store.getters.isAdmin
    },
    items () {
      return this.$store.state.placement.placementList
    },
    loading () {
      return this.$store.state.loading.loading !== 0
    }
  },
  created () {
    this.$store.dispatch(types.GET_PLACEMENTS)
  }
}
</script>

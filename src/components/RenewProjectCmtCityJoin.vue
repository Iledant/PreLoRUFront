<template>
  <v-card>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="items"
        class="elevation-1"
        item-key="ID"
        :loading="loading"
      >
        <template #item="{ item }">
          <tr>
            <td>{{ item.CreationDate | date }}</td>
            <td>{{ item.Name }}</td>
            <td>{{ item.CityCode | nullable }}</td>
            <td>{{ item.CityName | nullable }}</td>
            <td class="pl-0 pr-0">
              <v-tooltip left v-if="hasRenewProjectRight" color="primary">
                <template #activator="{ on }">
                  <v-btn small text icon color="primary" class="pa-0" @click="link(item)">
                    <v-icon v-on="on">link</v-icon>
                  </v-btn>
                </template>
                <span>Lier à une ville</span>
              </v-tooltip>
            </td>
            <td class="pl-0 pr-0">
              <v-tooltip left v-if="hasRenewProjectRight" color="primary">
                <template #activator="{ on }">
                  <v-btn small text icon color="primary" class="pa-0" @click="remove(item)">
                    <v-icon v-on="on">delete</v-icon>
                  </v-btn>
                </template>
                <span>Supprimer le lien</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
    <renew-project-cmt-city-join-dlg
      v-model="dialog"
      :item="item"
      :cities="cities"
      @confirm="save"
    />
    <delete-dialog
      v-model="delDlg"
      sentence="Supprimer le lien définitivement ?"
      @confirm="delConfirm"
    />
  </v-card>
</template>

<script>
import RenewProjectCmtCityJoinDlg from './RenewProjectCmtCityJoinDlg'
import DeleteDialog from './DeleteDialog'
import * as types from '../store/types'
export default {
  name: 'RenewProjectCmtCityJoin',
  components: { RenewProjectCmtCityJoinDlg, DeleteDialog },
  data () {
    return {
      headers: [
        {
          text: 'Date',
          value: 'CommitmentDate',
          align: 'center'
        },
        {
          text: 'Libellé',
          value: 'CommitmentName',
          align: 'center'
        },
        {
          text: 'Code INSEE',
          value: 'CityCode',
          align: 'center'
        },
        {
          text: 'Nom de ville',
          value: 'CityName',
          align: 'center'
        },
        { text: '', value: '', sortable: false, width: '1%' }
      ],
      dialog: false,
      delDlg: false,
      item: {
        ID: null,
        CityCode: null,
        CityName: null
      }
    }
  },
  computed: {
    loading () {
      return this.$store.state.loading.loading !== 0
    },
    cities () {
      const project = this.$store.state.renewProject.renewProject
      if (project) {
        const cities = [{ Code: project.CityCode1, Name: project.CityName1 }]
        if (project.CityName2) {
          cities.push({ Code: project.CityCode2, Name: project.CityName2 })
        }
        if (project.CityName3) {
          cities.push({ Code: project.CityCode3, Name: project.CityName3 })
        }
        return cities
      }
      return []
    },
    commitments () {
      return this.$store.state.renewProject.rpCommitments
    },
    joins () {
      return this.$store.state.renewProject.rpCmtCityJoins
    },
    items () {
      return this.commitments.map(c => {
        const join = this.joins.find(j => j.commitment_id === c.id)
        let city = null
        if (join) city = this.cities.find(c => c.Code === join.CityCode)
        return {
          ...c,
          CityCode: city ? city.Code : null,
          CityName: city ? city.Name : null,
          JoinID: join ? join.ID : null
        }
      })
    },
    hasRenewProjectRight () {
      return this.$store.getters.hasRenewProjectRight
    }
  },
  methods: {
    link (item) {
      this.item = { ...item }
      this.dialog = true
    },
    save (item) {
      const action = item.JoinID
        ? types.UPDATE_CMT_CITY_JOIN
        : types.CREATE_CMT_CITY_JOIN
      this.$store.dispatch(action, {
        ID: item.JoinID,
        CommitmentID: item.ID,
        CityCode: item.CityCode
      })
    },
    remove (item) {
      this.item = { ...item }
      this.delDlg = true
    },
    delConfirm () {
      this.$store.dispatch(types.DEL_CMT_CITY_JOIN, this.item.JoinID)
    }
  }
}
</script>

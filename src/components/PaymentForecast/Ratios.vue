<template>
  <v-card>
    <v-card-text>
      <v-layout wrap>
        <v-flex xs12 pa-2 sm6 offset-sm3>
          <v-text-field
            label="Année"
            v-debounce:500ms="yearChanged"
            :rules="[yearRule]"
            prepend-icon="calendar_today"
          />
        </v-flex>
        <v-flex xs12 pr-2 pl-2>
          <v-data-table
            :headers="headers"
            :items="items"
            class="elevation-1"
            item-key="ID"
            :loading="loading"
            dense
          >
            <template #item="{ item }">
              <tr>
                <td class="text-right">{{ item.Index }}</td>
                <td class="text-right">{{ item.SectorName }}</td>
                <td class="text-right">{{ item.Ratio | percentage }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-actions class="tertiary">
      <v-spacer />
      <v-btn text small color="primary" :disabled="disabled" @click="save" v-if="isAdmin">Sauver</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import * as types from '@/store/types'
import { yearRule } from '@/components/mixins'
export default {
  name: 'Ratios',
  mixins: [yearRule],
  data () {
    return {
      headers: [
        { text: 'Année n+', value: 'Index', align: 'center' },
        { text: 'Secteur', value: 'SectorName', align: 'center' },
        { text: 'Taux', value: 'Ratio', align: 'center' },
      ],
      disabled: true,
      year: 0,
    }
  },
  methods: {
    yearChanged (y) {
      if (this.yearCheck(y)) {
        this.year = parseInt(y)
        this.$store.dispatch(types.GET_YEAR_RATIOS, { Year: this.year })
        this.disabled = false
      }
    },
    save () {
      this.$store.dispatch(types.SAVE_YEAR_RATIOS, {
        Year: this.year,
        Ratios: this.items,
      })
    },
  },
  computed: {
    items () {
      return this.$store.state.ratios.ratiosList.map((r, i) => ({
        ...r,
        ID: i,
      }))
    },
    loading () {
      return this.$store.state.loading.loading !== 0
    },
    isAdmin () {
      return this.$store.getters.isAdmin
    },
  },
}
</script>

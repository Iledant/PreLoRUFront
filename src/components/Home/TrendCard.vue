<template>
  <v-card :color="colors[colorIndex]">
    <v-container>
      <v-layout>
        <v-col cols="auto" v-show="icon !== ''">
          <v-icon x-large>{{ icon }}</v-icon>
        </v-col>
        <v-col>
          <div class="caption">{{ caption }}</div>
          <div class="text-right text-h4">{{ format(figure) }}</div>
          <div class="caption text-right">
            <v-icon small>{{ icons[iconIndex] }}</v-icon>
            {{ format(trend) }}
          </div>
        </v-col>
      </v-layout>
    </v-container>
    <v-btn
      small
      fab
      absolute
      bottom
      left
      color="secondary"
      v-if="onClick"
      @click="$emit('click')"
      ><v-icon>cloud_download</v-icon>
    </v-btn>
  </v-card>
</template>

<script>
export default {
  name: 'TrendCard',
  props: {
    caption: { type: String, default: '' },
    figure: { type: Number, default: 0 },
    trend: { type: Number, default: 0 },
    unit: { type: String, default: '' },
    digits: { type: Number, default: 0 },
    inverse: { type: Boolean, default: false },
    icon: { type: String, default: '' },
    onClick: { type: Boolean, default: false },
  },
  data () {
    return {
      icons: ['north_east', 'east', 'south_east'],
      colors: ['green lighten-4', 'yellow lighten-4', 'red lighten-4'],
    }
  },
  methods: {
    format (s) {
      return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: this.digits }).format(s) + this.unit
    },
  },
  computed: {
    iconIndex () {
      return this.trend === 0 ? 1 : this.trend > 0 ? 0 : 2
    },
    colorIndex () {
      return this.inverse ? 2 - this.iconIndex : this.iconIndex
    },
  },
}
</script>

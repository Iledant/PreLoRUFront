import { Line } from 'vue-chartjs'
import * as types from '@/store/types'

export default {
  extends: Line,
  data: () => ({
    currentYear: new Date().getFullYear(),
    pmtDatas: {
      labels: [
        'jan',
        'fév',
        'mar',
        'avr',
        'mai',
        'jun',
        'jul',
        'aoû',
        'sep',
        'oct',
        'nov',
        'déc',
      ],
    },
  }),
  props: {
    beneficiaryId: { type: Number, default: null },
  },
  methods: {
    normalizeChronicles (list) {
      let currentValues = []
      let cumulated = 0
      let month = 1
      let currentYear = list ? list[0].Year : null
      const dataset = []
      list.forEach(l => {
        if (l.Year !== currentYear) {
          while (month < 13) {
            currentValues.push(cumulated)
            month++
          }
          dataset.push({
            borderColor: '#CE93D8',
            pointBackgroundColor: '#CE93D8',
            borderWidth: 1,
            fill: false,
            data: currentValues,
            cubicInterpolationMode: 'monotone',
            label: currentYear,
          })
          currentValues = []
          month = 1
          currentYear = l.Year
          cumulated = 0
        }
        while (month < l.Month) {
          currentValues.push(cumulated)
          month++
        }
        cumulated += l.Value * 0.000001
        currentValues.push(cumulated)
        month++
      })
      dataset.splice(0, 0, {
        borderColor: '#4A148C',
        pointBackgroundColor: '#4A148C',
        fill: false,
        data: currentValues,
        cubicInterpolationMode: 'monotone',
        label: currentYear,
      })
      return dataset
    },
  },
  computed: {
    chronicles () {
      return this.$store.state.beneficiary.beneficiaryPayments
    },
  },
  watch: {
    beneficiaryId: {
      handler: function (newID) {
        return this.$store.dispatch(types.GET_BENEFICIARY_PAYMENTS, newID)
      },
      immediate: true,
    },
    chronicles (list) {
      this.pmtDatas.datasets = this.normalizeChronicles(list)
      this.renderChart(this.pmtDatas, {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        scales: {
          yAxes: [{
            ticks: {
              fontFamily: 'Roboto',
              callback: (val, idx, vals) => `${val} M€`,
            },
          }],
          xAxes: [{ ticks: { fontFamily: 'Roboto' } }],
        },
        tooltips: {
          titleFontFamily: 'Roboto',
          bodyFontFamily: 'Roboto',
          backgroundColor: 'rgba(74,20,140,0.8)',
          callbacks: {
            label: function (t, d) {
              return (
                ` ${d.datasets[t.datasetIndex].label} : ${t.yLabel.toFixed(2)} M€`
              )
            },
          },
        },
      })
    },
  },
}

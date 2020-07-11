import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  data: () => ({
    datas: {
      datasets: [
        {
          borderColor: '#4527A0',
          pointBackgroundColor: '#4527A0',
          fill: false,
          borderWidth: 2,
          cubicInterpolationMode: 'monotone',
          label: ' DVS sans CSF',
          data: [],
        },
        {
          borderColor: '#0D47A1',
          pointBackgroundColor: '#0D47A1',
          fill: false,
          borderWidth: 2,
          cubicInterpolationMode: 'monotone',
          label: ' DVS non traités DC',
          data: [],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: { display: false },
      scales: {
        yAxes: [{ ticks: { fontFamily: 'Roboto' } }],
        xAxes: [{ ticks: { fontFamily: 'Roboto' } }],
      },
      tooltips: {
        titleFontFamily: 'Roboto',
        bodyFontFamily: 'Roboto',
        backgroundColor: '#3F51B5CC',
        callbacks: {
          label: (i, d) =>
            `${d.datasets[i.datasetIndex].label} : ${i.yLabel.toFixed(0)}`,
        },
      },
    },
  }),
  computed: {
    paymentDemandsStock () {
      return this.$store.state.paymentDemands.paymentDemandsStock
    },
  },
  watch: {
    paymentDemandsStock (list) {
      this.datas.datasets[0].data = list.map(a => a.Csf)
      this.datas.datasets[1].data = list.map(a => a.Dc)
      this.options.scales.yAxes[0].ticks.min = 0
      this.datas.labels = list.map(a =>
        new Date(a.Day).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }))
      this.renderChart(this.datas, this.options)
    },
  },
}

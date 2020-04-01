import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  data: () => ({
    datas: {
      datasets: [
        {
          borderColor: '#3F51B5',
          pointBackgroundColor: '#3F51B5',
          fill: false,
          borderWidth: 2,
          cubicInterpolationMode: 'monotone',
          label: ' Évolution des CSF',
          data: []
        },
        {
          borderColor: '#4A148C',
          pointBackgroundColor: '#4A148C',
          fill: false,
          borderWidth: 2,
          cubicInterpolationMode: 'monotone',
          label: ' Évolution des traitements DC',
          data: []
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: { display: false },
      scales: {
        yAxes: [{ ticks: { fontFamily: 'Roboto' } }],
        xAxes: [{ ticks: { fontFamily: 'Roboto' } }]
      },
      tooltips: {
        titleFontFamily: 'Roboto',
        bodyFontFamily: 'Roboto',
        backgroundColor: '#4A148CCC',
        callbacks: {
          label: (i, d) =>
            `${d.datasets[i.datasetIndex].label} : ${i.yLabel.toFixed(0)}`
        }
      }
    }
  }),
  computed: {
    paymentDemandCount () {
      return this.$store.state.paymentDemands.paymentDemandCount
    }
  },
  watch: {
    paymentDemandCount (list) {
      this.datas.datasets[0].data = list.map(a => -a.Uncontrolled)
      this.datas.datasets[1].data = list.map(a => -a.Unprocessed)
      this.datas.labels = list.map(a =>
        new Date(a.Date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }))
      this.renderChart(this.datas, this.options)
    }
  }
}

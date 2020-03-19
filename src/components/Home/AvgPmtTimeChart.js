import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  data: () => ({
    datas: {
      datasets: [
        {
          borderColor: '#4A148C',
          fill: false,
          pointBackgroundColor: '#4A148C',
          borderWidth: 3,
          cubicInterpolationMode: 'monotone',
          label: 'Délai moyen',
          data: [],
          yAxisID: 'time-axis'
        },
        {
          borderColor: '#3F51B5',
          pointBackgroundColor: '#3F51B5',
          borderDash: [3, 3],
          label: 'Écart type',
          fill: false,
          cubicInterpolationMode: 'monotone',
          data: [],
          yAxisID: 'deviation-axis'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: { display: false },
      scales: {
        yAxes: [
          {
            id: 'time-axis',
            type: 'linear',
            ticks: {
              fontFamily: 'Roboto',
              min: 0,
              callback: (val, idx, vals) => `${val} j`
            }
          },
          {
            id: 'deviation-axis',
            type: 'linear',
            display: false,
            position: 'right',
            ticks: {
              fontFamily: 'Roboto',
              min: 0,
              callback: (val, idx, vals) => `${val} j`
            },
            min: 0
          }
        ],
        xAxes: [{ ticks: { fontFamily: 'Roboto' } }]
      },
      tooltips: {
        titleFontFamily: 'Roboto',
        bodyFontFamily: 'Roboto',
        backgroundColor: '#4A148CCC',
        callbacks: {
          label: (i, d) =>
            `${d.datasets[i.datasetIndex].label} : ${i.yLabel.toFixed(1)} j`
        }
      }
    }
  }),
  computed: {
    avgPmtTime () {
      return this.$store.state.home.averagePaymentTime
    }
  },
  watch: {
    avgPmtTime (list) {
      this.datas.datasets[0].data = this.avgPmtTime.map(a => a.AverageTime)
      this.datas.datasets[1].data = this.avgPmtTime.map(a => a.StandardDeviation)
      this.datas.labels = this.avgPmtTime.map(a =>
        new Date(a.Month).toLocaleDateString('fr-FR', { month: '2-digit', year: '2-digit' }))
      this.renderChart(this.datas, this.options)
    }
  }
}

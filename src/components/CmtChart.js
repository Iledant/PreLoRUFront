import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  props: {
    currentValues: { type: Array, default: _ => [] },
    previousValues: { type: Array, default: _ => [] },
    programmation: { type: Array, default: _ => [] }
  },
  data: () => ({
    currentYear: new Date().getFullYear(),
    cmtDatas: {
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
        'déc'
      ],
      datasets: [
        {
          borderColor: '#9C27B0',
          pointBackgroundColor: '#9C27B0',
          fill: false,
          borderWidth: 2,
          cubicInterpolationMode: 'monotone',
          data: []
        },
        {
          borderColor: '#4A148C',
          pointBackgroundColor: '#4A148C',
          fill: false,
          borderWidth: 2,
          cubicInterpolationMode: 'monotone',
          borderDash: [6, 2],
          data: []
        },
        {
          backgroundColor: '#CE93D8',
          borderColor: '#4A148C',
          pointBackgroundColor: '#4A148C',
          cubicInterpolationMode: 'monotone',
          data: []
        }
      ]
    }
  }),
  watch: {
    previousValues () {
      this.cmtDatas.datasets[2].data = this.currentValues
      this.cmtDatas.datasets[2].label = this.currentYear
      this.cmtDatas.datasets[1].data = this.programmation
      this.cmtDatas.datasets[1].label = 'Prog'
      this.cmtDatas.datasets[0].data = this.previousValues
      this.cmtDatas.datasets[0].label = this.currentYear - 1
      this.renderChart(this.cmtDatas, {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        scales: {
          yAxes: [
            {
              ticks: {
                fontFamily: 'Roboto',
                callback: (val, idx, vals) => `${val} M€`
              }
            }
          ],
          xAxes: [{ ticks: { fontFamily: 'Roboto' } }]
        },
        tooltips: {
          titleFontFamily: 'Roboto',
          bodyFontFamily: 'Roboto',
          backgroundColor: 'rgba(74,20,140,0.8)',
          callbacks: {
            label: (item, data) =>
              ` ${data.datasets[item.datasetIndex].label} : ${item.yLabel.toFixed(
                2
              )} M€`
          }
        }
      })
    }
  }
}

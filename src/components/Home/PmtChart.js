import { Line } from 'vue-chartjs'
import { mapState } from 'vuex'

const currentYear = new Date().getFullYear()
export default {
  extends: Line,
  computed: {
    ...mapState({
      currentLOValues: state => state.home.currentYearLOPayments,
      currentPVValues: state => state.home.currentYearPVPayments,
      previousLOValues: state => state.home.previousYearLOPayments,
      previousPVValues: state => state.home.previousYearPVPayments,
      availableValues: state => new Array(12).fill(state.home.paymentCreditSum)
    })
  },
  data: () => ({
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
          borderWidth: 1,
          borderDash: [5, 5],
          cubicInterpolationMode: 'monotone'
        },
        {
          borderColor: '#9C27B0',
          pointBackgroundColor: '#9C27B0',
          fill: false,
          borderWidth: 1,
          cubicInterpolationMode: 'monotone'
        },
        {
          backgroundColor: '#CE93D8',
          borderColor: '#4A148C',
          pointBackgroundColor: '#4A148C',
          borderDash: [5, 5],
          cubicInterpolationMode: 'monotone'
        },
        {
          backgroundColor: '#CE93D8',
          borderColor: '#4A148C',
          pointBackgroundColor: '#4A148C',
          cubicInterpolationMode: 'monotone'
        },
        {
          backgroundColor: '#F3E5F5',
          borderColor: '#E1BEE7',
          pointBackgroundColor: '#E1BEE7',
          cubicInterpolationMode: 'monotone',
          pointRadius: 0,
          label: 'Disponible'
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
          label: (i, d) =>
            ` ${d.datasets[i.datasetIndex].label} : ${i.yLabel.toFixed(2)} M€`
        }
      }
    }
  }),
  watch: {
    previousPVValues () {
      this.cmtDatas.datasets[4].data = this.availableValues
      this.cmtDatas.datasets[3].data = this.currentLOValues.map((v, i) => v + this.currentPVValues[i])
      this.cmtDatas.datasets[3].label = 'PV + LO ' + String(currentYear)
      this.cmtDatas.datasets[2].data = this.currentPVValues
      this.cmtDatas.datasets[2].label = 'PV ' + String(currentYear)
      this.cmtDatas.datasets[1].data = this.previousLOValues.map((v, i) => v + this.previousPVValues[i])
      this.cmtDatas.datasets[1].label = 'PV + LO ' + String(currentYear - 1)
      this.cmtDatas.datasets[0].data = this.previousPVValues
      this.cmtDatas.datasets[0].label = 'PV ' + String(currentYear - 1)
      this.renderChart(this.cmtDatas, this.options)
    }
  }
}

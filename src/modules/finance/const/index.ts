import { formatCurrency } from '@/utils'
import Highcharts from 'highcharts'
;(function (H) {
  H.addEvent(H.Axis, 'afterInit', function (this: any) {
    const logarithmic = this.logarithmic
    if (logarithmic && this.options.custom.allowNegativeLog) {
      this.positiveValuesOnly = false
      logarithmic.log2lin = (num: any) => {
        const isNegative = num < 0

        let adjustedNum = Math.abs(num)

        if (adjustedNum < 10) {
          adjustedNum += (10 - adjustedNum) / 10
        }

        const result = Math.log(adjustedNum) / Math.LN10
        return isNegative ? -result : result
      }

      logarithmic.lin2log = (num: any) => {
        const isNegative = num < 0

        let result = Math.pow(10, Math.abs(num))
        if (result < 10) {
          result = (10 * (result - 1)) / (10 - 1)
        }
        return isNegative ? -result : result
      }
    }
  })
})(Highcharts)

export const CONTRACT_HEADCOUNT_TYPE = 1
export const optionFinanceConfig = {
  chart: {
    type: 'column',
  },
  title: {
    text: '',
  },
  xAxis: {
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
  },
  plotOptions: {
    series: {
      pointPadding: 0,
      borderWidth: 0,
      shadow: false,
    },
    column: {
      grouping: true,
      shadow: false,
    },
  },
  legend: {
    enabled: true,
    verticalAlign: 'top',
    align: 'right',
    itemWidth: 120,
    itemMarginTop: 10,
    y: 0,
    x: 0,
  },
  yAxis: {
    with: '100%',
    startOnTick: false,
    title: {
      text: '',
    },
    plotBands: [
      {
        color: 'black', // Color value
        from: 0,
        to: 0,
      },
    ],
    type: 'logarithmic',
    custom: {
      allowNegativeLog: true,
    },
    allowDecimals: true,
    labels: {
      formatter(this: any) {
        if (this.value === 0) {
          return (
            '<span style="fill: #000;font-weight:bold;font-size: 15px">' +
            this.value +
            '</span>'
          )
        } else {
          return this.axis.defaultLabelFormatter.call(this)
        }
      },
    },
    useHTML: true,
  },
  credits: {
    enabled: false,
  },
  tooltip: {
    formatter(this: any) {
      const x = this.x
      const points = this.points
      let s = `<span style="font-size:14px">${x}</span><table>`
      points.forEach((point: any) => {
        s += '<br>'
        s +=
          '<span style="color:' +
          point.color +
          '">\u25CF</span> ' +
          point.series.name +
          ': <b> ' +
          formatCurrency(point.y) +
          '</b><br/>'
      })
      return s
    },
    shared: true,
    useHTML: true,
  },
  accessibility: {
    enabled: false,
    announceNewData: {
      enabled: true,
    },
    point: {
      valueSuffix: '%',
    },
  },
  series: [],
  responsive: {
    rules: [
      {
        condition: {
          maxWidth: 500,
        },
      },
    ],
  },
}

export const listModule = [
  {
    id: '1',
    value: '1',
    name: 'Finance',
    label: 'Finance',
  },
]

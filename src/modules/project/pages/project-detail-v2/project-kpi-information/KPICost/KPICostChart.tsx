import LoadingSkeleton from '@/components/loading/LoadingSkeleton'
import { LangConstant } from '@/const'
import { ACCUMULATED } from '@/modules/project/const'
import { createPlotLine } from '@/modules/project/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { KpiCostApi } from './KPICost'

interface KPICostChartProps {
  dataCost: KpiCostApi[]
  loading: boolean
  valueType: string
}

const KPICostChart = ({ dataCost, loading, valueType }: KPICostChartProps) => {
  const classes = useStyles()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)

  const chartOptions = useMemo(() => {
    const categories = [...dataCost]
      .slice(0, 12)
      .reverse()
      .map(item => item.month)
    const eeActualData = [...dataCost]
      .slice(0, 12)
      .reverse()
      .map(item => item.eeActual)
    const eeForecastData = [...dataCost]
      .slice(0, 12)
      .reverse()
      .map(item => item.eeForecast)
    const options = {
      chart: {
        type: 'column',
      },
      title: {
        text:
          valueType === ACCUMULATED
            ? i18Project('TXT_ACCUMULATED_EFFORT_EFFICIENCY')
            : i18Project('TXT_SEPARATE_EFFORT_EFICIENCY'),
        style: {
          fontWeight: '700',
        },
      },
      xAxis: {
        categories,
      },
      yAxis: [
        {
          title: {
            text: '',
            style: {
              fontWeight: '700',
              fontSize: '14px',
            },
          },
          tickInterval: 10,
          min: 0,
          max: 170,
          labels: {
            formatter: function (this: { value: number }) {
              let color = '#666'
              if (this.value % 20 !== 0 && this.value !== 90) {
                return ''
              } else if (this.value === 80 || this.value === 100) {
                color = '#EA4224'
              } else if (this.value === 90) {
                color = '#34A853'
              }
              return `<span style="color: ${color};fontWeight:500">${this.value}</span>`
            },
          },
          plotLines: [
            createPlotLine(80, '#EA4224', 2, 'label_1', 'LSL'),
            createPlotLine(90, '#34A853', 2, 'label_2', 'Norm'),
            createPlotLine(100, '#EA4224', 2, 'label_3', 'USL'),
          ],
        },
        {
          title: {
            text: '',
            style: {
              fontWeight: '700',
              fontSize: '14px',
            },
          },
          opposite: true,
        },
      ],
      plotOptions: {
        column: {
          pointPadding: 0,
        },
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: 'EE Actual',
          type: 'line',
          data: eeActualData,
          yAxis: 0,
          color: '#17469F',
        },
        {
          name: 'EE Forecast',
          type: 'line',
          data: eeForecastData,
          color: '#FBBC05',
          yAxis: 0,
        },
      ],
    }
    return options as Highcharts.Options
  }, [dataCost])

  return (
    <Box className={classes.RootKPICostChart}>
      <Box>
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <HighchartsReact options={chartOptions} highcharts={Highcharts} />
        )}
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootKPICostChart: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  noData: {
    border: `1px solid ${theme.color.grey.secondary}`,
    borderRadius: '4px',
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    textAlign: 'center',
    padding: theme.spacing(3),
  },
}))

export default KPICostChart

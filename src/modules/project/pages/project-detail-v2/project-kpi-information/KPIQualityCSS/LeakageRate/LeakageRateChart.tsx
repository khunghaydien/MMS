import LoadingSkeleton from '@/components/loading/LoadingSkeleton'
import { NS_PROJECT } from '@/const/lang.const'
import { ACCUMULATED } from '@/modules/project/const'
import { createPlotLine } from '@/modules/project/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { QualityRateItem } from '../BugRate/BugRate'

interface LeakageRateChartProps {
  loading: boolean
  valueType: string
  dataLeakage: QualityRateItem[]
}

const LeakageRateChart = ({
  loading,
  valueType,
  dataLeakage,
}: LeakageRateChartProps) => {
  const classes = useStyles()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const chartOptions = useMemo(() => {
    const categories = [...dataLeakage]
      .slice(0, 12)
      .reverse()
      .map(item => item.month)
    const leakageRate = [...dataLeakage]
      .slice(0, 12)
      .reverse()
      .map(item => item.bugRate)

    const maxTickPositions =
      Math.max(Math.max(...leakageRate.map(bug => bug || 0))) + 2

    const options = {
      accessibility: {
        enabled: true,
      },
      chart: {
        type: 'column',
      },
      title: {
        text:
          valueType === ACCUMULATED
            ? i18Project('TXT_ACCUMULATED_LEAKAGE_RATE')
            : i18Project('TXT_SEPARATE_LEAKAGE_RATE'),
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
          tickPositions: Array.from(
            { length: maxTickPositions + 1 },
            (_, index) => index
          ),
          labels: {
            formatter: function (this: { value: number }) {
              let color = '#666'
              if (this.value === 0 || this.value === 2) {
                color = '#EA4224'
              } else if (this.value === 1) {
                color = '#34A853'
              }
              return `<span style="color: ${color};fontWeight:500;">${this.value}</span>`
            },
          },
          plotLines: [
            createPlotLine(0, '#EA4224', 2, 'label_4', 'USL'),
            createPlotLine(1, '#34A853', 2, 'label_5', 'Norm'),
            createPlotLine(2, '#EA4224', 2, 'label_6', 'LSL'),
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
          name: i18Project('TXT_LEAKAGE_RATE'),
          type: 'line',
          data: leakageRate,
          yAxis: 0,
          color: '#17469F',
          dataLabels: {
            // enabled: true,
            verticalAlign: 'top',
            align: 'left',
            borderWidth: 1,
          },
        },
      ],
    }
    return options as Highcharts.Options
  }, [i18Project, valueType, dataLeakage])

  return (
    <Box className={classes.RootLeakageChart}>
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
  RootLeakageChart: {
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

export default LeakageRateChart

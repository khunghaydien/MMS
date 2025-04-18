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
import { QualityRateItem } from './BugRate'

interface BugRateChartProps {
  loading: boolean
  valueType: string
  dataBug: QualityRateItem[]
}

const BugRateChart = ({ loading, valueType, dataBug }: BugRateChartProps) => {
  const classes = useStyles()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const chartOptions = useMemo(() => {
    const categories = [...dataBug]
      .slice(0, 12)
      .reverse()
      .map(item => item.month)
    const bugRate = [...dataBug]
      .slice(0, 12)
      .reverse()
      .map(item => item.bugRate)
    const maxTickPositions = Math.max(...bugRate.map(bug => bug || 0)) + 30
    const options = {
      accessibility: {
        enabled: true,
      },
      chart: {
        type: 'column',
        height: Math.max(...bugRate.map(bug => bug || 0))
          ? maxTickPositions * 5 + 100
          : 400,
      },
      title: {
        text:
          valueType === ACCUMULATED
            ? i18Project('TXT_ACCUMULATED_BUG_RATE')
            : i18Project('TXT_SEPARATE_BUG_RATE'),
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
          min: 0,
          tickPositions: Array.from(
            { length: maxTickPositions + 1 },
            (_, index) => index
          ),
          labels: {
            formatter: function (this: { value: number }) {
              const bugRateInt = dataBug
                // @ts-ignore
                .map(item => +parseInt(item.bugRate))
                .concat([6, 13, 20])

              let color = '#666'
              if (
                // @ts-ignore
                !bugRateInt.includes(+parseInt(+this.value)) ||
                (+this.value < 6 && maxTickPositions > 80 && +this.value !== 0)
              )
                return ''
              if (this.value === 6 || this.value === 20) {
                color = '#EA4224'
              } else if (this.value === 13) {
                color = '#34A853'
              }
              return `<span style="color: ${color};fontWeight:500">${this.value}</span>`
            },
          },
          plotLines: [
            createPlotLine(6, '#EA4224', 2, 'label_1', 'USL'),
            createPlotLine(13, '#34A853', 2, 'label_2', 'Norm'),
            createPlotLine(20, '#EA4224', 2, 'label_3', 'LSL'),
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
          name: i18Project('TXT_BUG_RATE'),
          type: 'line',
          data: bugRate,
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
  }, [i18Project, valueType, dataBug])

  return (
    <Box className={classes.RootBugRateChart}>
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
  RootBugRateChart: {
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

export default BugRateChart

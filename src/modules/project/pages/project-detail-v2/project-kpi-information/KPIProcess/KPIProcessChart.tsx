import InputWeekPicker from '@/components/Datepicker/InputWeekPicker'
import LoadingSkeleton from '@/components/loading/LoadingSkeleton'
import { NS_PROJECT } from '@/const/lang.const'
import { projectSelector } from '@/modules/project/reducer/project'
import { IProcessQueriesState, ProjectState } from '@/modules/project/types'
import { createPlotLine } from '@/modules/project/utils'
import { WeekPayload } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { Dispatch, SetStateAction, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

interface IKPIProcessChart {
  loading: boolean
  processQueries: IProcessQueriesState
  setProcessQueries: Dispatch<SetStateAction<IProcessQueriesState>>
}

export const formatterWeek = (week: number) => {
  if (week < 10) return `0${week}`
  else return `${week}`
}

const KPIProcessChart = ({
  loading,
  processQueries,
  setProcessQueries,
}: IKPIProcessChart) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const { processGraph }: ProjectState = useSelector(projectSelector)

  const chartOptions = useMemo(() => {
    const maxTickPositions =
      Math.max(
        ...(processGraph?.processComplianceRate?.map(
          (item: any) => item.value
        ) || []),
        ...(processGraph?.monitoring?.map((item: any) => item.value) || []),
        ...(processGraph?.planning?.map((item: any) => item.value) || []),
        ...(processGraph?.closing?.map((item: any) => item.value) || [])
      ) + 2

    const options = {
      chart: {
        type: 'column',
      },
      title: {
        text: i18Project('TXT_AVERAGE_PROCESS_COMPLIANCE_VERIFICATION'),
        style: {
          fontWeight: '700',
        },
      },
      xAxis: {
        categories: processGraph?.closing
          ?.map((item: any) => `W${item.week}`)
          ?.reverse(),
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
          tickPositions: [
            ...Array.from(
              { length: maxTickPositions + 10 },
              (_, index) => index
            ).filter(value => value % 20 === 0 || value === 95),
            parseInt(maxTickPositions.toString()) + 10,
          ],
          min: 0,
          labels: {
            formatter: function (this: { value: number }) {
              let color = '#666'
              if (this.value === 80 || this.value === 100) {
                color = '#EA4224'
              } else if (this.value === 95) {
                color = '#34A853'
              }
              return `<span style="color: ${color};fontWeight:500">${this.value}</span>`
            },
          },
          plotLines: [
            createPlotLine(80, '#EA4224', 2, 'label_1', 'LSL'),
            createPlotLine(95, '#34A853', 2, 'label_2', 'Norm'),
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
          name: 'PC Rate',
          type: 'line',
          data: processGraph?.processComplianceRate
            .map((item: any) => item.value)
            ?.reverse(),
          yAxis: 0,
          color: '#17469F',
        },
        {
          name: 'Monitoring',
          type: 'line',
          data: processGraph?.monitoring
            .map((item: any) => item.value)
            ?.reverse(),
          color: '#9747FF',
          yAxis: 0,
        },
        {
          name: 'Planning',
          type: 'line',
          data: processGraph?.planning
            .map((item: any) => item.value)
            ?.reverse(),
          color: '#FBBC05',
          yAxis: 0,
        },
        {
          name: 'Closing',
          type: 'line',
          data: processGraph?.closing.map((item: any) => item.value)?.reverse(),
          color: '#45B6FE',
          yAxis: 0,
        },
      ],
    }
    return options as Highcharts.Options
  }, [processGraph])

  const onChangeStartWeek = (value: WeekPayload) => {
    const newProcessQueryParameters = {
      ...processQueries,
      startWeek: value.week,
      startYear: value.year,
    }
    setProcessQueries(newProcessQueryParameters)
  }
  const onChangeEndWeek = (value: WeekPayload) => {
    const newProcessQueryParameters = {
      ...processQueries,
      endWeek: value.week,
      endYear: value.year,
    }
    setProcessQueries(newProcessQueryParameters)
  }

  return (
    <Box className={classes.RootKPIProcessChart}>
      <Box className={classes.filters}>
        <InputWeekPicker
          flexDirectionRow
          label={i18('LB_FROM_WEEK') as string}
          maxWeek={{
            year: processQueries.endYear || 0,
            week: processQueries.endWeek || 0,
          }}
          value={{
            year: processQueries.startYear || 0,
            week: processQueries.startWeek || 0,
          }}
          onChange={({ value }: { value: WeekPayload }) =>
            onChangeStartWeek(value)
          }
        />
        <InputWeekPicker
          flexDirectionRow
          label={i18('LB_TO_WEEK') as string}
          minWeek={{
            year: processQueries.startYear || 0,
            week: processQueries.startWeek || 0,
          }}
          value={{
            year: processQueries.endYear || 0,
            week: processQueries.endWeek || 0,
          }}
          onChange={({ value }: { value: WeekPayload }) =>
            onChangeEndWeek(value)
          }
        />
      </Box>
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
  RootKPIProcessChart: {
    paddingRight: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  filters: {
    display: 'flex',
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

export default KPIProcessChart

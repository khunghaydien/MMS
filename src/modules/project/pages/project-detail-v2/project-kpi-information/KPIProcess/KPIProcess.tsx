import CardFormToggleBody from '@/components/Form/CardFormToggleBody'
import { IStatusType } from '@/components/common/StatusItem'
import { NS_PROJECT } from '@/const/lang.const'
import { LIMIT_DEFAULT, PAGE_CURRENT_DEFAULT } from '@/const/table.const'
import {
  STATUS_PROCESS_LABELS,
  STATUS_PROCESS_VALUES,
} from '@/modules/project/const'
import { projectSelector } from '@/modules/project/reducer/project'
import {
  getProcessAveragePoints,
  getProcessGraph,
  getProcessList,
} from '@/modules/project/reducer/thunk'
import { IProcessQueriesState, ProjectState } from '@/modules/project/types'
import { AppDispatch } from '@/store'
import { getYearWeekObject } from '@/utils/date'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import KPIMetricsTooltip from '../../project-dashboard-detail/KPIMetricsTooltip'
import KPIProcessChart, { formatterWeek } from './KPIProcessChart'
import KPIProcessTable from './KPIProcessTable'

export const getProcessStatus = (status: number) => {
  let result: IStatusType = {
    color: '',
    label: '',
  }
  switch (status) {
    case STATUS_PROCESS_VALUES.N_A:
      result = {
        color: 'grey',
        label: STATUS_PROCESS_LABELS[STATUS_PROCESS_VALUES.N_A],
      }
      break
    case STATUS_PROCESS_VALUES.NOT_GOOD:
      result = {
        color: 'red',
        label: STATUS_PROCESS_LABELS[STATUS_PROCESS_VALUES.NOT_GOOD],
      }
      break
    case STATUS_PROCESS_VALUES.CONCERNING:
      result = {
        color: 'orange',
        label: STATUS_PROCESS_LABELS[STATUS_PROCESS_VALUES.CONCERNING],
      }
      break
    case STATUS_PROCESS_VALUES.ACCEPTABLE:
      result = {
        color: 'blue',
        label: STATUS_PROCESS_LABELS[STATUS_PROCESS_VALUES.ACCEPTABLE],
      }
      break
    case STATUS_PROCESS_VALUES.GOOD:
      result = {
        color: 'green',
        label: STATUS_PROCESS_LABELS[STATUS_PROCESS_VALUES.GOOD],
      }
      break
    case STATUS_PROCESS_VALUES.ABNORMAL:
      result = {
        color: 'earthy',
        label: STATUS_PROCESS_LABELS[STATUS_PROCESS_VALUES.ABNORMAL],
      }
      break
    default:
      result = {
        color: 'grey',
        label: STATUS_PROCESS_LABELS[STATUS_PROCESS_VALUES.N_A],
      }
  }
  return result
}
const KPIProcess = () => {
  const { projectId } = useParams()
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18Project } = useTranslation(NS_PROJECT)
  const { generalInfo, kpiRangeDateFilter }: ProjectState =
    useSelector(projectSelector)

  const [processStatus, setProcessStatus] = useState<number>(
    STATUS_PROCESS_VALUES.N_A
  )
  const [overallStatus, setOverallStatus] = useState<number>(
    STATUS_PROCESS_VALUES.N_A
  )
  const [loadingTable, setLoadingTable] = useState(false)
  const [loadingChart, setLoadingChart] = useState(false)

  const [processQueries, setProcessQueries] = useState<IProcessQueriesState>(
    () => {
      const newProcessQueryParameters: IProcessQueriesState = {
        orderBy: 'desc',
        sortBy: 'yearWeek',
        pageSize: LIMIT_DEFAULT,
        pageNum: PAGE_CURRENT_DEFAULT,
        startYear: getYearWeekObject(
          (kpiRangeDateFilter.startDate || generalInfo.startDate) as Date
        ).year,
        startWeek: getYearWeekObject(
          (kpiRangeDateFilter.startDate || generalInfo.startDate) as Date
        ).week,
        endYear: getYearWeekObject(
          (kpiRangeDateFilter.endDate || generalInfo.endDate) as Date
        ).year,
        endWeek: getYearWeekObject(
          (kpiRangeDateFilter.endDate || generalInfo.endDate) as Date
        ).week,
      }
      return newProcessQueryParameters
    }
  )

  const getProcessTable = async (queries: IProcessQueriesState) => {
    const payload = {
      projectId: projectId as string,
      params: {
        orderBy: queries.orderBy,
        pageNum: queries.pageNum,
        pageSize: queries.pageSize,
        sortBy: queries.sortBy,
        startWeek: `${formatterWeek(queries.startWeek)}/${queries.startYear}`,
        endWeek: `${formatterWeek(queries.endWeek)}/${queries.endYear}`,
      },
    }
    setTimeout(() => {
      setLoadingTable(true)
    })
    try {
      const [_, averagePoints] = await Promise.all([
        dispatch(getProcessList(payload)),
        dispatch(getProcessAveragePoints(payload)),
      ])
      setProcessStatus(averagePoints?.payload?.data?.averagePointStatus)
      setOverallStatus(averagePoints?.payload?.data?.overallStatus)
    } finally {
      setLoadingTable(false)
    }
  }

  const getProcessChart = (queries: IProcessQueriesState) => {
    const payload = {
      projectId: projectId as string,
      params: {
        startWeek: `${formatterWeek(queries.startWeek)}/${queries.startYear}`,
        endWeek: `${formatterWeek(queries.endWeek)}/${queries.endYear}`,
        sortBy: 'week',
        orderBy: 'desc',
      },
    }
    setTimeout(() => {
      setLoadingChart(true)
    })
    dispatch(getProcessGraph(payload))
      .unwrap()
      .finally(() => {
        setLoadingChart(false)
      })
  }

  useEffect(() => {
    getProcessTable(processQueries)
  }, [processQueries])

  useEffect(() => {
    getProcessChart(processQueries)
  }, [
    processQueries.startWeek,
    processQueries.endWeek,
    processQueries.startYear,
    processQueries.endYear,
  ])

  return (
    <CardFormToggleBody
      title={i18Project('TXT_PROCESS_COMPLIANCE_VERIFICATION')}
      status={getProcessStatus(overallStatus)}
      TooltipContent={<KPIMetricsTooltip section="pcv" />}
    >
      <Box className={classes.contentBody}>
        <Box className={classes.contentItem}>
          <KPIProcessChart
            loading={loadingChart}
            processQueries={processQueries}
            setProcessQueries={setProcessQueries}
          />
        </Box>
        <Box className={classes.contentItem}>
          <KPIProcessTable
            processQueries={processQueries}
            setProcessQueries={setProcessQueries}
            processStatus={processStatus}
            loading={loadingTable}
            onReload={() => {
              getProcessTable(processQueries)
              getProcessChart(processQueries)
            }}
          />
        </Box>
      </Box>
    </CardFormToggleBody>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  contentBody: {
    display: 'flex',
    gap: theme.spacing(3),
  },
  contentItem: {
    width: 'calc((100% - 24px) / 2)',
    '&:nth-child(2)': {
      marginTop: '63px',
    },
  },
}))

export default KPIProcess

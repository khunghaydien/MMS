import CardFormToggleBody from '@/components/Form/CardFormToggleBody'
import { IStatusType } from '@/components/common/StatusItem'
import SwitchToggle from '@/components/common/SwitchToggle'
import { NS_PROJECT } from '@/const/lang.const'
import { LIMIT_DEFAULT, PAGE_CURRENT_DEFAULT } from '@/const/table.const'
import {
  TIMELINESS_STATUS_LABELS,
  TIMELINESS_STATUS_VALUES,
} from '@/modules/project/const'
import { projectSelector } from '@/modules/project/reducer/project'
import { getListProjectsMilestone } from '@/modules/project/reducer/thunk'
import { ProjectService } from '@/modules/project/services'
import { AppDispatch } from '@/store'
import { Pagination } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import KPIMetricsTooltip from '../../project-dashboard-detail/KPIMetricsTooltip'
import DeliveryActivityLog from './DeliveryActivityLog'
import DeliveryMilestone from './DeliveryMilestone'

export interface MilestoneItemApi {
  actualDeliveryDate: number | null
  addedDate: number | null
  commitmentDeliveryDate: number | null
  deliver: 1 | 2
  description: string
  id: number
  name: string
  status: number | null
  limitation?: string
  milestoneDecision?: boolean
}

export interface MilestoneListQueryState extends Pagination {
  orderBy: string
  sortBy: string
  startDate: Date | null | number
  endDate: Date | null | number
}

export const getTimelinessStatus = (statusValue: number) => {
  let status: IStatusType = {
    label: '',
    color: '',
  }
  switch (statusValue) {
    case TIMELINESS_STATUS_VALUES.ABNORMAL:
      status = {
        label: TIMELINESS_STATUS_LABELS[TIMELINESS_STATUS_VALUES.ABNORMAL],
        color: 'earthy',
      }
      break
    case TIMELINESS_STATUS_VALUES.GOOD:
      status = {
        label: TIMELINESS_STATUS_LABELS[TIMELINESS_STATUS_VALUES.GOOD],
        color: 'green',
      }
      break
    case TIMELINESS_STATUS_VALUES.ACCEPTABLE:
      status = {
        label: TIMELINESS_STATUS_LABELS[TIMELINESS_STATUS_VALUES.ACCEPTABLE],
        color: 'blue',
      }
      break
    case TIMELINESS_STATUS_VALUES.CONCERNING:
      status = {
        label: TIMELINESS_STATUS_LABELS[TIMELINESS_STATUS_VALUES.CONCERNING],
        color: 'orange',
      }
      break
    case TIMELINESS_STATUS_VALUES.NOT_GOOD:
      status = {
        label: TIMELINESS_STATUS_LABELS[TIMELINESS_STATUS_VALUES.NOT_GOOD],
        color: 'red',
      }
      break
    default:
      status = {
        label: 'N/A',
        color: 'grey',
      }
  }
  return status
}

const KPIDelivery = () => {
  const classes = useStyles()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const { generalInfo, permissionProjectKPI, kpiRangeDateFilter } =
    useSelector(projectSelector)

  const [queries, setQueries] = useState<MilestoneListQueryState>({
    pageSize: LIMIT_DEFAULT,
    pageNum: PAGE_CURRENT_DEFAULT,
    orderBy: 'asc',
    sortBy: 'milestone',
    startDate: kpiRangeDateFilter.startDate || generalInfo.startDate,
    endDate: kpiRangeDateFilter.endDate || generalInfo.endDate,
  })
  const [overallStatus, setOverallStatus] = useState<IStatusType>({
    label: '',
    color: '',
  })
  const [totalValues, setTotalValues] = useState({
    totalMilestone: 0,
    totalDeliveredMilestone: 0,
    totalOnTimeDelivery: 0,
    timeliness: 0,
  })

  const [milestoneTotalElements, setMilestoneTotalElements] = useState(0)
  const [milestoneList, setMilestoneList] = useState<MilestoneItemApi[]>([])
  const [loadingMilestone, setLoadingMilestone] = useState(false)
  const [countReloadApi, setCountReloadApi] = useState(0)
  const [useActivityLog, setUseActivityLog] = useState(false)

  const fillOverallDelivery = (res: AxiosResponse) => {
    const { data } = res
    setOverallStatus(getTimelinessStatus(data.overallStatus))
    setTotalValues({
      totalMilestone: data.totalMilestone || 0,
      totalDeliveredMilestone: data.totalDeliveredMilestone || 0,
      totalOnTimeDelivery: data.totalOnTimeMilestone || 0,
      timeliness: data.timelinessValue || 0,
    })
  }

  const getOverallDelivery = () => {
    const startDate = queries.startDate as Date
    const endDate = queries.endDate as Date
    const payload = {
      projectId: params.projectId as string,
      queryParameters: {
        pageNum: queries.pageNum,
        pageSize: queries.pageSize,
        startMonth: startDate?.getMonth() + 1,
        endMonth: endDate?.getMonth() + 1,
        startYear: startDate?.getFullYear(),
        endYear: endDate?.getFullYear(),
      },
    }
    ProjectService.getOverallDelivery(payload).then(fillOverallDelivery)
  }

  const fillDataMilestoneList = ({ data }: AxiosResponse) => {
    const { content, totalElements } = data
    setMilestoneList(content)
    setMilestoneTotalElements(totalElements)
  }

  const getListProjectsMilestoneApi = () => {
    setTimeout(() => {
      setLoadingMilestone(true)
    })
    const startDate = queries.startDate as Date
    const endDate = queries.endDate as Date
    const queryParameters = {
      orderBy: queries.orderBy,
      sortBy: queries.sortBy,
      pageNum: queries.pageNum,
      pageSize: queries.pageSize,
      startMonth: startDate?.getMonth() + 1,
      endMonth: endDate?.getMonth() + 1,
      startYear: startDate?.getFullYear(),
      endYear: endDate?.getFullYear(),
    }
    dispatch(
      getListProjectsMilestone({
        projectId: params.projectId as string,
        queryParameters,
      })
    )
      .unwrap()
      .then(fillDataMilestoneList)
      .finally(() => {
        setLoadingMilestone(false)
      })
  }

  useEffect(() => {
    if (generalInfo.startDate) {
      getListProjectsMilestoneApi()
      getOverallDelivery()
    }
  }, [queries, generalInfo])

  return (
    <CardFormToggleBody
      title={i18Project('TXT_TIMELINESS')}
      TooltipContent={<KPIMetricsTooltip section="timeliness" />}
      status={overallStatus}
    >
      <Box className={classes.contentBody}>
        {!!permissionProjectKPI.deliveryViewTimeliness && (
          <DeliveryMilestone
            loading={loadingMilestone}
            milestoneList={milestoneList}
            totalElements={milestoneTotalElements}
            queries={queries}
            setQueries={setQueries}
            totalValues={totalValues}
            reloadApi={() => {
              getListProjectsMilestoneApi()
              getOverallDelivery()
              setCountReloadApi(countReloadApi + 1)
            }}
          />
        )}
        <Box className={classes.containerToggleActivityLog}>
          <SwitchToggle
            label={i18Project('TXT_VIEW_ACTIVITY_LOG') as string}
            checked={useActivityLog}
            onChange={(value: boolean) => setUseActivityLog(value)}
          />
        </Box>
        {!!permissionProjectKPI.deliveryViewActivityLog && useActivityLog && (
          <DeliveryActivityLog countReloadApi={countReloadApi} />
        )}
      </Box>
    </CardFormToggleBody>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootKPIDelivery: {},
  contentBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  containerToggleActivityLog: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}))

export default KPIDelivery

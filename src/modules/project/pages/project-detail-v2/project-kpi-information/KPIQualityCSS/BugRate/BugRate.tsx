import RangeMonthPicker from '@/components/Datepicker/RangeMonthPicker'
import CardFormToggleBody from '@/components/Form/CardFormToggleBody'
import { IStatusType } from '@/components/common/StatusItem'
import { NS_PROJECT } from '@/const/lang.const'
import {
  QUALITY_RATE_STATUS_LABELS,
  QUALITY_RATE_STATUS_VALUES,
  SEPARATE,
} from '@/modules/project/const'
import { projectSelector } from '@/modules/project/reducer/project'
import { ProjectService } from '@/modules/project/services'
import { RangeDate } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import KPIMetricsTooltip from '../../../project-dashboard-detail/KPIMetricsTooltip'
import BugRateChart from './BugRateChart'
import BugRateTable from './BugRateTable'

export const getQualityRateStatus = (statusValue: number) => {
  let status: IStatusType = {
    label: '',
    color: '',
  }
  switch (statusValue) {
    case QUALITY_RATE_STATUS_VALUES.ABNORMAL:
      status = {
        label: QUALITY_RATE_STATUS_LABELS[QUALITY_RATE_STATUS_VALUES.ABNORMAL],
        color: 'earthy',
      }
      break
    case QUALITY_RATE_STATUS_VALUES.GOOD:
      status = {
        label: QUALITY_RATE_STATUS_LABELS[QUALITY_RATE_STATUS_VALUES.GOOD],
        color: 'green',
      }
      break
    case QUALITY_RATE_STATUS_VALUES.ACCEPTABLE:
      status = {
        label:
          QUALITY_RATE_STATUS_LABELS[QUALITY_RATE_STATUS_VALUES.ACCEPTABLE],
        color: 'blue',
      }
      break
    case QUALITY_RATE_STATUS_VALUES.CONCERNING:
      status = {
        label:
          QUALITY_RATE_STATUS_LABELS[QUALITY_RATE_STATUS_VALUES.CONCERNING],
        color: 'orange',
      }
      break
    case QUALITY_RATE_STATUS_VALUES.NOT_GOOD:
      status = {
        label: QUALITY_RATE_STATUS_LABELS[QUALITY_RATE_STATUS_VALUES.NOT_GOOD],
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

export interface QualityRateItem {
  billableEffort: number
  bugRate: number | null
  critical: number
  major: number
  minor: number
  month: string
  status: number
  totalW: number
}

const BugRate = () => {
  const classes = useStyles()
  const params = useParams()

  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const { generalInfo, kpiRangeDateFilter } = useSelector(projectSelector)

  const [dataBug, setDataBug] = useState<QualityRateItem[]>([])
  const [loading, setLoading] = useState(false)
  const [rangeMonth, setRangeMonth] = useState<RangeDate>({
    startDate: kpiRangeDateFilter.startDate || generalInfo.startDate,
    endDate: kpiRangeDateFilter.endDate || generalInfo.endDate,
  })
  const [valueType, setValueType] = useState(SEPARATE)
  const [status, setStatus] = useState<IStatusType>({
    label: '',
    color: '',
  })

  const onRangeMonthPickerChange = (payload: RangeDate) => {
    setRangeMonth(payload)
  }

  const fillDataApi = ({ data }: AxiosResponse) => {
    setDataBug(data.content)
  }

  const getBugRate = () => {
    setTimeout(() => {
      setLoading(true)
    })
    const startDate = rangeMonth.startDate as Date
    const endDate = rangeMonth.endDate as Date
    const payload = {
      projectId: params.projectId as string,
      queryParameters: {
        valueType,
        categoryRate: 1, // 1 === bug rate
        startMonth: startDate.getMonth() + 1,
        endMonth: endDate.getMonth() + 1,
        startYear: startDate.getFullYear(),
        endYear: endDate.getFullYear(),
      },
    }
    ProjectService.getQualityRate(payload)
      .then(fillDataApi)
      .finally(() => {
        setLoading(false)
      })
  }

  const getQualityOverall = () => {
    ProjectService.getQualityOverall(params.projectId as string, 1).then(
      ({ data }: AxiosResponse) => {
        setStatus(getQualityRateStatus(data.status))
      }
    )
  }

  useEffect(() => {
    getBugRate()
  }, [rangeMonth, valueType])

  useEffect(() => {
    getQualityOverall()
  }, [])

  return (
    <CardFormToggleBody
      title={i18Project('TXT_BUG_RATE')}
      status={status}
      TooltipContent={<KPIMetricsTooltip section="bugRate" />}
    >
      <RangeMonthPicker
        title={{
          from: i18('LB_FROM_MONTH'),
          to: i18('LB_TO_V2'),
        }}
        startDate={rangeMonth.startDate}
        endDate={rangeMonth.endDate}
        onChange={onRangeMonthPickerChange}
      />
      <Box className={classes.contentBody}>
        <Box className={classes.contentItem}>
          <BugRateChart
            loading={loading}
            valueType={valueType}
            dataBug={dataBug}
          />
        </Box>
        <Box className={classes.contentItem}>
          <BugRateTable
            dataBug={dataBug}
            loading={loading}
            valueType={valueType}
            setValueType={setValueType}
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
    marginTop: theme.spacing(3),
    alignItems: 'flex-start',
  },
  contentItem: {
    width: 'calc((100% - 250px) / 2)',
    '&:nth-child(2)': {
      flex: 1,
    },
  },
}))

export default BugRate

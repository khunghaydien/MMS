import RangeMonthPicker from '@/components/Datepicker/RangeMonthPicker'
import CardFormToggleBody from '@/components/Form/CardFormToggleBody'
import { IStatusType } from '@/components/common/StatusItem'
import { LangConstant } from '@/const'
import {
  COST_STATUS_LABELS,
  COST_STATUS_VALUES,
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
import KPIMetricsTooltip from '../../project-dashboard-detail/KPIMetricsTooltip'
import KPICostChart from './KPICostChart'
import KPICostTable from './KPICostTable'

export const getCostStatus = (statusValue: number) => {
  let status: IStatusType = {
    label: '',
    color: '',
  }
  switch (statusValue) {
    case COST_STATUS_VALUES.ABNORMAL:
      status = {
        label: COST_STATUS_LABELS[COST_STATUS_VALUES.ABNORMAL],
        color: 'earthy',
      }
      break
    case COST_STATUS_VALUES.GOOD:
      status = {
        label: COST_STATUS_LABELS[COST_STATUS_VALUES.GOOD],
        color: 'green',
      }
      break
    case COST_STATUS_VALUES.ACCEPTABLE:
      status = {
        label: COST_STATUS_LABELS[COST_STATUS_VALUES.ACCEPTABLE],
        color: 'blue',
      }
      break
    case COST_STATUS_VALUES.CONCERNING:
      status = {
        label: COST_STATUS_LABELS[COST_STATUS_VALUES.CONCERNING],
        color: 'orange',
      }
      break
    case COST_STATUS_VALUES.NOT_GOOD:
      status = {
        label: COST_STATUS_LABELS[COST_STATUS_VALUES.NOT_GOOD],
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

export interface KpiCostApi {
  actualEffort: number | null
  assignEffort: number | null
  billableEffort: number | null
  eeActual: number | null
  eeForecast: number | null
  gap: number | null
  month: string
  status: number
}

const KPICost = () => {
  const classes = useStyles()
  const params = useParams()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)

  const { generalInfo, kpiRangeDateFilter } = useSelector(projectSelector)

  const [loading, setLoading] = useState(false)
  const [valueType, setValueType] = useState(SEPARATE)
  const [rangeMonth, setRangeMonth] = useState<RangeDate>({
    startDate: kpiRangeDateFilter.startDate || generalInfo.startDate,
    endDate: kpiRangeDateFilter.endDate || generalInfo.endDate,
  })
  const [status, setStatus] = useState<IStatusType>({
    label: '',
    color: '',
  })
  const [dataCost, setDataCost] = useState<KpiCostApi[]>([])

  const onRangeMonthPickerChange = (payload: RangeDate) => {
    setRangeMonth(payload)
  }

  const fillDataApi = ({ data }: AxiosResponse) => {
    setDataCost(data.content)
  }

  const getEffortEfficiency = () => {
    setLoading(true)
    const startDate = rangeMonth.startDate as Date
    const endDate = rangeMonth.endDate as Date
    const payload = {
      projectId: params.projectId as string,
      queryParameters: {
        valueType,
        startMonth: startDate?.getMonth() + 1,
        endMonth: endDate?.getMonth() + 1,
        startYear: startDate?.getFullYear(),
        endYear: endDate?.getFullYear(),
      },
    }
    ProjectService.getEffortEfficiency(payload)
      .then(fillDataApi)
      .finally(() => {
        setLoading(false)
      })
  }

  const getOverallEffortEfficiency = () => {
    ProjectService.getOverallEffortEfficiency(params.projectId as string).then(
      ({ data }: AxiosResponse) => {
        setStatus(getCostStatus(data.status))
      }
    )
  }

  useEffect(() => {
    if (generalInfo.startDate) {
      getEffortEfficiency()
    }
  }, [rangeMonth, valueType, generalInfo.startDate])

  useEffect(() => {
    getOverallEffortEfficiency()
  }, [])

  return (
    <CardFormToggleBody
      title={i18Project('TXT_EFFORT_EFFICIENCY')}
      TooltipContent={<KPIMetricsTooltip section="effortEfficiency" />}
      status={status}
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
          <KPICostChart
            valueType={valueType}
            loading={loading}
            dataCost={dataCost}
          />
        </Box>
        <Box className={classes.contentItem}>
          <KPICostTable
            loading={loading}
            valueType={valueType}
            setValueType={setValueType}
            dataCost={dataCost}
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

export default KPICost

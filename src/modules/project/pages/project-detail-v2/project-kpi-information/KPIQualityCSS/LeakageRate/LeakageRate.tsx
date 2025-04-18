import RangeMonthPicker from '@/components/Datepicker/RangeMonthPicker'
import CardFormToggleBody from '@/components/Form/CardFormToggleBody'
import { IStatusType } from '@/components/common/StatusItem'
import { NS_PROJECT } from '@/const/lang.const'
import { SEPARATE } from '@/modules/project/const'
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
import { QualityRateItem, getQualityRateStatus } from '../BugRate/BugRate'
import LeakageRateChart from './LeakageRateChart'
import LeakageRateTable from './LeakageRateTable'

const LeakageRate = () => {
  const classes = useStyles()
  const params = useParams()

  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const { generalInfo, kpiRangeDateFilter } = useSelector(projectSelector)

  const [dataLeakage, setDataLeakage] = useState<QualityRateItem[]>([])
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
    setDataLeakage(data.content)
  }

  const getLeakageRate = () => {
    setTimeout(() => {
      setLoading(true)
    })
    const startDate = rangeMonth.startDate as Date
    const endDate = rangeMonth.endDate as Date
    const payload = {
      projectId: params.projectId as string,
      queryParameters: {
        valueType,
        categoryRate: 2, // 2 === leakage
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
    ProjectService.getQualityOverall(params.projectId as string, 2).then(
      ({ data }: AxiosResponse) => {
        setStatus(getQualityRateStatus(data.status))
      }
    )
  }

  useEffect(() => {
    getLeakageRate()
  }, [rangeMonth, valueType])

  useEffect(() => {
    getQualityOverall()
  }, [])

  return (
    <CardFormToggleBody
      title={i18Project('TXT_LEAKAGE_RATE')}
      status={status}
      TooltipContent={<KPIMetricsTooltip section="leakageRate" />}
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
          <LeakageRateChart
            loading={loading}
            valueType={valueType}
            dataLeakage={dataLeakage}
          />
        </Box>
        <Box className={classes.contentItem}>
          <LeakageRateTable
            loading={loading}
            valueType={valueType}
            setValueType={setValueType}
            dataLeakage={dataLeakage}
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

export default LeakageRate

import CommonButton from '@/components/buttons/CommonButton'
import CardFormSeeMore from '@/components/Form/CardFormSeeMore'
import { NS_DASHBOARD } from '@/const/lang.const'
import { dashboardSelector } from '@/modules/dashboard/reducer/dashboard'
import ProjectAllocationService from '@/modules/dashboard/services/projectAllocation.service'
import { alertError, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { downloadFileFromByteArr } from '@/utils'
import { CloudDownload } from '@mui/icons-material'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import KPIMetricSummaryTable from './KPIMetricSummaryTable'

const KPIMetricSummary = ({}) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Dashboard } = useTranslation(NS_DASHBOARD)

  const { dataKPIMetricSummary, kpiMetricQueries } =
    useSelector(dashboardSelector)

  const exportKPIMetric = () => {
    dispatch(updateLoading(true))
    const startDate = kpiMetricQueries.startDate || {
      getMonth: () => 0,
      getFullYear: () => 0,
    }
    const endDate = kpiMetricQueries.endDate || {
      getMonth: () => 0,
      getFullYear: () => 0,
    }
    const queries = {
      branchId: kpiMetricQueries.branchId,
      startMonth: startDate.getMonth() + 1,
      endMonth: endDate.getMonth() + 1,
      startYear: startDate.getFullYear(),
      endYear: endDate.getFullYear(),
    }
    ProjectAllocationService.exportKPIMetricSummary(queries)
      .then((res: AxiosResponse) => {
        downloadFileFromByteArr(res.data)
      })
      .catch(() => {
        dispatch(
          alertError({
            message: i18('MSG_COMMON_ERROR_ALERT'),
          })
        )
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  return (
    <CardFormSeeMore
      hideSeeMore
      className={classes.RootBusyRate}
      title={i18Dashboard('TXT_SUMMARY')}
      CustomButton={
        <Box className={classes.customButton}>
          <CommonButton
            lowercase
            variant="outlined"
            disabled={dataKPIMetricSummary.loading}
            startIcon={<CloudDownload />}
            onClick={exportKPIMetric}
          >
            {i18('TXT_EXPORT')}
          </CommonButton>
        </Box>
      }
    >
      <Box className={classes.body}>
        <KPIMetricSummaryTable />
      </Box>
    </CardFormSeeMore>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootBusyRate: {
    marginTop: theme.spacing(3),
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  customButton: {
    display: 'flex',
    gap: theme.spacing(3),
  },
}))

export default KPIMetricSummary

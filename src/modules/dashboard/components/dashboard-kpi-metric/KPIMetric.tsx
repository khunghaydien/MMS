import InputFilterRangeDatepicker from '@/components/inputs/InputFilterRangeDatepicker'
import InputFilterToggleSingle from '@/components/inputs/InputFilterToggleSingle'
import {
  dashboardSelector,
  getKPIMetricSummary,
  setKPIMetricQueries,
} from '@/modules/dashboard/reducer/dashboard'
import { selectAuth } from '@/reducer/auth'
import { commonSelector } from '@/reducer/common'
import { AppDispatch } from '@/store'
import { DateRange } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import KPIMetricSummary from './KPIMetricSummary'

const KPIMetric = () => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { staff } = useSelector(selectAuth)

  const { kpiMetricQueries } = useSelector(dashboardSelector)
  const { listDashboardBranches } = useSelector(commonSelector)

  const onBranchIdActivatedChange = (payload: { value: string | number }) => {
    dispatch(
      setKPIMetricQueries({
        branchId: payload.value,
      })
    )
  }

  const onDateChange = (dateRange: DateRange) => {
    dispatch(setKPIMetricQueries(dateRange))
  }

  useEffect(() => {
    if (kpiMetricQueries.branchId) {
      dispatch(getKPIMetricSummary(kpiMetricQueries))
    }
  }, [kpiMetricQueries])

  useEffect(() => {
    dispatch(
      setKPIMetricQueries({
        branchId: staff?.branch?.id || 'BRA-001',
      })
    )
  }, [])

  return (
    <Box className={classes.RootStaffAllocation}>
      <Box className={classes.header}>
        <Box className={classes.filters}>
          <InputFilterToggleSingle
            hideFooter
            useUpdateLabel
            unToggle
            listOptions={
              listDashboardBranches.length === 1
                ? listDashboardBranches
                : listDashboardBranches.slice(1)
            }
            label={i18('LB_BRANCH')}
            onChange={onBranchIdActivatedChange}
            value={kpiMetricQueries.branchId || ''}
          />
          <InputFilterRangeDatepicker
            hideFooter
            useUpdateLabel
            readOnly
            inputFormat="MM/YYYY"
            openTo="month"
            views={['year', 'month']}
            label={i18('TXT_RANGE_DATE')}
            values={{
              startDate: kpiMetricQueries.startDate || null,
              endDate: kpiMetricQueries.endDate || null,
            }}
            onChange={onDateChange}
          />
        </Box>
      </Box>
      <KPIMetricSummary />
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootStaffAllocation: {},
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  filters: {
    display: 'flex',
    gap: theme.spacing(1),
  },
}))

export default KPIMetric

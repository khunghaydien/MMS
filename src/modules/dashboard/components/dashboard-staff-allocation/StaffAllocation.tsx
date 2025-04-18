import InputFilterRangeDatepicker from '@/components/inputs/InputFilterRangeDatepicker'
import InputFilterToggleMultiple from '@/components/inputs/InputFilterToggleMultiple'
import { DIVISION_DIRECTOR_ROLE } from '@/const/app.const'
import {
  dashboardSelector,
  getStaffAssignAllocation,
  getStaffBusyRate,
  setStaffAllocationQueries,
} from '@/modules/dashboard/reducer/dashboard'
import { selectAuth } from '@/reducer/auth'
import { commonSelector } from '@/reducer/common'
import { AppDispatch } from '@/store'
import { DateRange, OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import BusyRate from './BusyRate'
import { NS_STAFF } from '@/const/lang.const'
import { jobType } from '@/modules/staff/const'

const StaffAllocation = () => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Staff } = useTranslation(NS_STAFF)
  const { staffAllocationQueries } = useSelector(dashboardSelector)
  const { systemDashboardDivisions } = useSelector(commonSelector)
  const { staff, role } = useSelector(selectAuth)

  const [isAccountDivisionDirector, setIsAccountDivisionDirector] =
    useState(false)

  const onDivisionIdsActivatedChange = (payload: {
    listIdActivated: string[] | number[]
    option: OptionItem
  }) => {
    dispatch(
      setStaffAllocationQueries({
        divisionIds: payload.listIdActivated,
      })
    )
  }
  const onJobTypeActivatedChange = (payload: {
    listIdActivated: string[] | number[]
    option: OptionItem
  }) => {
    dispatch(
      setStaffAllocationQueries({
        jobType: payload.listIdActivated,
      })
    )
  }

  const onDateChange = (dateRange: DateRange) => {
    dispatch(setStaffAllocationQueries(dateRange))
  }

  useEffect(() => {
    const autoFillDivisionRoles = [DIVISION_DIRECTOR_ROLE]
    role.some((roleItem: { name: string }) => {
      if (autoFillDivisionRoles.includes(roleItem?.name)) {
        setIsAccountDivisionDirector(true)
        dispatch(
          setStaffAllocationQueries({
            divisionIds: [staff?.division?.id],
          })
        )
      }
    })
    return () => {
      setIsAccountDivisionDirector(false)
    }
  }, [staff?.id])

  useEffect(() => {
    dispatch(getStaffBusyRate(staffAllocationQueries))
    dispatch(getStaffAssignAllocation(staffAllocationQueries))
  }, [staffAllocationQueries])

  return (
    <Box className={classes.RootStaffAllocation}>
      <Box className={classes.header}>
        <Box className={classes.filters}>
          <InputFilterToggleMultiple
            hideFooter
            useUpdateLabel
            listOptions={systemDashboardDivisions}
            disabled={isAccountDivisionDirector}
            label={i18('LB_DIVISION')}
            listIdActivated={staffAllocationQueries.divisionIds || []}
            onChange={onDivisionIdsActivatedChange}
          />
          <InputFilterToggleMultiple
            hideFooter
            useUpdateLabel
            listOptions={jobType}
            disabled={isAccountDivisionDirector}
            label={i18Staff('LB_JOB_TYPE')}
            listIdActivated={staffAllocationQueries.jobType || []}
            onChange={onJobTypeActivatedChange}
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
              startDate: staffAllocationQueries.startDate || null,
              endDate: staffAllocationQueries.endDate || null,
            }}
            onChange={onDateChange}
          />
        </Box>
      </Box>
      <BusyRate />
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

export default StaffAllocation

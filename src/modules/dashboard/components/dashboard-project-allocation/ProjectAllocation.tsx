import InputFilterRangeDatepicker from '@/components/inputs/InputFilterRangeDatepicker'
import InputFilterToggleMultiple from '@/components/inputs/InputFilterToggleMultiple'
import { DIVISION_DIRECTOR_ROLE } from '@/const/app.const'
import { NS_PROJECT } from '@/const/lang.const'
import {
  dashboardSelector,
  getProjectAllocationStaff,
  getProjectAllocationSummary,
  setProjectAllocationQueries,
} from '@/modules/dashboard/reducer/dashboard'
import { projectStatus } from '@/modules/project/pages/project-list/instance'
import { selectAuth } from '@/reducer/auth'
import { commonSelector } from '@/reducer/common'
import { AppDispatch } from '@/store'
import { DateRange, OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import ProjectAllocationSummary from './ProjectAllocationSummary'

const ProjectAllocation = () => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const { projectAllocationQueries } = useSelector(dashboardSelector)
  const { systemDashboardDivisions } = useSelector(commonSelector)
  const { staff, role } = useSelector(selectAuth)

  const [isAccountDivisionDirector, setIsAccountDivisionDirector] =
    useState(false)

  const onDivisionIdsActivatedChange = (payload: {
    listIdActivated: string[] | number[]
    option: OptionItem
  }) => {
    dispatch(
      setProjectAllocationQueries({
        divisionIds: payload.listIdActivated,
      })
    )
  }

  const onStatusChange = (payload: {
    listIdActivated: string[] | number[]
    option: OptionItem
  }) => {
    dispatch(
      setProjectAllocationQueries({
        status: payload.listIdActivated,
      })
    )
  }

  const onDateChange = (dateRange: DateRange) => {
    dispatch(setProjectAllocationQueries(dateRange))
  }

  useEffect(() => {
    const autoFillDivisionRoles = [DIVISION_DIRECTOR_ROLE]
    role.some((roleItem: { name: string }) => {
      if (autoFillDivisionRoles.includes(roleItem?.name)) {
        setIsAccountDivisionDirector(true)
        dispatch(
          setProjectAllocationQueries({
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
    dispatch(getProjectAllocationSummary(projectAllocationQueries))
    dispatch(getProjectAllocationStaff(projectAllocationQueries))
  }, [projectAllocationQueries])

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
            listIdActivated={projectAllocationQueries.divisionIds || []}
            onChange={onDivisionIdsActivatedChange}
          />
          <InputFilterToggleMultiple
            hideFooter
            useUpdateLabel
            listOptions={projectStatus}
            label={i18Project('LB_PROJECT_STATUS')}
            listIdActivated={projectAllocationQueries.status || []}
            onChange={onStatusChange}
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
              startDate: projectAllocationQueries.startDate || null,
              endDate: projectAllocationQueries.endDate || null,
            }}
            onChange={onDateChange}
          />
        </Box>
      </Box>
      <ProjectAllocationSummary />
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

export default ProjectAllocation

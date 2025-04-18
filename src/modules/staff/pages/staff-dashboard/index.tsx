import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import { LangConstant } from '@/const'
import { BRANCH_ID_ALL } from '@/const/app.const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { AppDispatch } from '@/store'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getDashboardStaff } from '../../reducer/thunk'
import { StaffFilterDashboard, StaffQueriesDashboard } from '../../types'
import StaffActionBar from './StaffActionBar'
import StaffComparison from './StaffComparison'
import StaffIdealStats from './StaffIdealStats'
import StaffOnBoardStatistic from './StaffOnBoardStatistic'
import StaffStatistic from './StaffStatistic'
import StaffTurnoverRate from './StaffTurnoverRate'

const formatQueries = (
  queries: StaffFilterDashboard
): StaffQueriesDashboard => {
  return {
    branchId: queries.branchId,
    startDate: queries.startDate?.valueOf(),
    endDate: queries.endDate?.valueOf(),
    divisionId: queries.divisionId,
  }
}

const StaffDashboard = () => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18Staff } = useTranslation(LangConstant.NS_STAFF)

  const { staff }: AuthState = useSelector(selectAuth)

  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1),
    endDate: new Date(new Date().getFullYear(), 11, 31),
    branchId: staff?.branch?.id || BRANCH_ID_ALL,
    divisionId: staff?.division?.id || '',
  })

  useEffect(() => {
    setIsLoading(true)
    dispatch(getDashboardStaff(formatQueries(filter)))
      .unwrap()
      .finally(() => {
        setIsLoading(false)
      })
  }, [filter])

  return (
    <CommonScreenLayout title={i18Staff('TXT_STAFF_DASHBOARD')}>
      <Box className={classes.rootStaffDashboard}>
        <Box className="staff-search-bar">
          <StaffActionBar filter={filter} setFilter={setFilter} />
        </Box>
        <Box className="staff-dashboard-item">
          <StaffStatistic isLoading={isLoading} />
        </Box>
        <Box className="staff-dashboard-item">
          <StaffComparison isLoading={isLoading} filter={filter} />
        </Box>
      </Box>
      <Box className={classes.rootStaffDashboard}>
        <Box className="staff-dashboard-item height-300">
          <StaffOnBoardStatistic isLoading={isLoading} />
        </Box>
        <Box className="staff-dashboard-item height-300">
          <StaffTurnoverRate isLoading={isLoading} />
        </Box>
        <Box className="staff-dashboard-ideal-stats">
          <StaffIdealStats isLoading={isLoading} />
        </Box>
      </Box>
    </CommonScreenLayout>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootStaffDashboard: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '20px',
    '& .staff-search-bar': {
      width: '100%',
    },
    '& .staff-dashboard-item': {
      minHeight: '367px',
      width: 'calc(50% - 10px)',
      minWidth: '520px',
      flex: 1,
    },
    '& .height-300': {
      height: '300px',
      minHeight: '300px',
    },
    '& .staff-dashboard-ideal-stats': {
      minHeight: '367px',
      width: '100%',
    },
  },
}))
export default StaffDashboard

import { PathConstant } from '@/const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

const ModuleStaff = () => {
  const location = useLocation()
  const { permissions }: AuthState = useSelector(selectAuth)
  const { useStaffDashboard } = permissions
  return (
    <Navigate
      to={
        useStaffDashboard
          ? PathConstant.STAFF_DASHBOARD
          : PathConstant.STAFF_LIST
      }
      state={{ from: location }}
      replace
    />
  )
}

export default ModuleStaff

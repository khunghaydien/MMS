import { PathConstant } from '@/const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

const ModuleFinance = () => {
  const location = useLocation()
  const { permissions }: AuthState = useSelector(selectAuth)
  const { useFinanceDashboard } = permissions
  return (
    <Navigate
      to={useFinanceDashboard ? PathConstant.FINANCE_DASHBOARD : '/'}
      state={{ from: location }}
      replace
    />
  )
}

export default ModuleFinance

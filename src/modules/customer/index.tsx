import { PathConstant } from '@/const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

const ModuleCustomer = () => {
  const location = useLocation()
  const { permissions }: AuthState = useSelector(selectAuth)
  const { useCustomerAndPartnerDashboard, useCustomerList } = permissions

  return (
    <Navigate
      to={
        useCustomerAndPartnerDashboard
          ? PathConstant.CUSTOMER_DASHBOARD
          : useCustomerList
          ? PathConstant.CUSTOMER_LIST
          : PathConstant.CUSTOMER_PARTNER_LIST
      }
      state={{ from: location }}
      replace
    />
  )
}

export default ModuleCustomer

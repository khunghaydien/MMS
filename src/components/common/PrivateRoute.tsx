import { PathConstant } from '@/const'
import { Fragment, ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

interface PrivateRouteProps {
  isAuth: boolean | undefined
  redirectPath?: string
  children: ReactNode
}

const PrivateRoute = ({
  isAuth,
  redirectPath,
  children,
}: PrivateRouteProps) => {
  const location = useLocation()
  if (!isAuth) {
    return (
      <Navigate
        to={redirectPath || PathConstant.PAGE_403}
        state={{ from: location }}
        replace
      />
    )
  }
  return <Fragment>{children}</Fragment>
}

export default PrivateRoute

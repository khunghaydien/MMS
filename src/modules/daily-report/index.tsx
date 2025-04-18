import { PathConstant } from '@/const'
import { Navigate, useLocation } from 'react-router-dom'

const ModuleDailyReport = () => {
  const location = useLocation()
  return (
    <Navigate
      to={PathConstant.DAILY_REPORT}
      state={{ from: location }}
      replace
    />
  )
}

export default ModuleDailyReport

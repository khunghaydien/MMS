import { PathConstant } from '@/const'
import { Navigate, useLocation } from 'react-router-dom'

const ModuleContract = () => {
  const location = useLocation()
  return (
    <Navigate
      to={PathConstant.CONTRACT_LIST}
      state={{ from: location }}
      replace
    />
  )
}

export default ModuleContract

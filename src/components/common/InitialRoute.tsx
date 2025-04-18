import { DAILY_REPORT } from '@/const/path.const'
import modules from '@/modules/routes'
import { AuthState, selectAuth } from '@/reducer/auth'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const InitialRoute = () => {
  const { permissions }: AuthState = useSelector(selectAuth)

  const firstModuleHaveAccessRights = modules.find(module => {
    return module.roles.some(role => permissions[role])
  })

  return (
    <Navigate to={firstModuleHaveAccessRights?.pathNavigate || DAILY_REPORT} />
  )
}

export default InitialRoute

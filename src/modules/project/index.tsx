import { PathConstant } from '@/const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

const ModuleProject = () => {
  const location = useLocation()
  const { permissions }: AuthState = useSelector(selectAuth)
  const { useProjectList } = permissions
  return (
    <Navigate
      to={
        useProjectList
          ? PathConstant.PROJECT_LIST
          : PathConstant.PROJECT_LIST_REQUEST_OT
      }
      state={{ from: location }}
      replace
    />
  )
}

export default ModuleProject

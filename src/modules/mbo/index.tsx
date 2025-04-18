import { PathConstant } from '@/const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

const ModuleMBO = () => {
  const location = useLocation()
  const { permissions }: AuthState = useSelector(selectAuth)
  const { useMBOCycleGeneral, useMBOCriteriaGeneral, useMBOEvaluation } =
    permissions

  const pathRedirect = useMemo(() => {
    if (useMBOCriteriaGeneral) {
      return PathConstant.MBO_CRITERIA_LIST
    }
    if (useMBOCycleGeneral) {
      return PathConstant.MBO_CYCLE_LIST
    }
    if (useMBOEvaluation) {
      return PathConstant.MBO_EVALUATION_PROCESS
    }
    return ''
  }, [])

  return <Navigate to={pathRedirect} state={{ from: location }} replace />
}

export default ModuleMBO

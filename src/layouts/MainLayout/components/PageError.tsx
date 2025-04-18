import '@/components/ErrorBoundary/ErrorBoundary.scss'
import ErrorLayout from '@/components/common/ErrorLayout'
import { PathConstant } from '@/const'
import { selectAuth } from '@/reducer/auth'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

interface PageErrorProps {
  errorMessage?: string
}

const PageError = ({ errorMessage }: PageErrorProps) => {
  const location = useLocation()
  const { email, permissions } = useSelector(selectAuth)

  const roles = !!Object.keys(permissions).length

  if (!email) {
    window.location.href = PathConstant.LOGIN
  }

  if (!roles) {
    return (
      <Navigate to={PathConstant.MAIN} state={{ from: location }} replace />
    )
  }

  return <ErrorLayout errorMessage={errorMessage} />
}

export default PageError

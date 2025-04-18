import { Component, ErrorInfo, ReactNode } from 'react'

import i18next from 'i18next'
import ErrorLayout from '../common/ErrorLayout'
import './ErrorBoundary.scss'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorLayout
          errorMessage={i18next.t('common:MSG_ERROR_BOUNDARY') as string}
        />
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

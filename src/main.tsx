import App from '@/App'
import { store } from '@/store'
import { theme } from '@/ui/mui/v5'
import { ThemeProvider } from '@mui/material'
import ReactDOM from 'react-dom/client'
import { Provider as StoreProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import '@/languages'
import '@/ui/styles'
import '@/utils/yup'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'

const rootContainerEl = document.getElementById('root') as HTMLElement
const ReactDOMRoot = ReactDOM.createRoot(rootContainerEl)

const RootComponent = () => {
  return (
    <StoreProvider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </BrowserRouter>
      </ThemeProvider>
    </StoreProvider>
  )
}

ReactDOMRoot.render(<RootComponent />)

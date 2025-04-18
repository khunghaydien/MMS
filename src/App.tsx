import { PathConstant } from '@/const'
import LoginLayout from '@/layouts/LoginLayout'
import MainLayout from '@/layouts/MainLayout'
import { Fragment } from 'react'
import { Route, Routes } from 'react-router-dom'
import ScreenAlert from './components/alerts/ScreenAlert'
import CustomerSurveyLayout from './layouts/CustomerSurveyLayout'
import Page403Forbidden from './layouts/MainLayout/components/Page403Forbidden'
import Page404NotFound from './layouts/MainLayout/components/Page404NotFound'

const App = () => {
  return (
    <Fragment>
      <ScreenAlert />
      <Routes>
        <Route
          path={PathConstant.LOGIN}
          element={<LoginLayout isForgot={false} />}
        />
        <Route
          path={PathConstant.FORGOT_PASSWORD}
          element={<LoginLayout isForgot />}
        />
        <Route
          path={PathConstant.CUSTOMER_SURVEY}
          element={<CustomerSurveyLayout />}
        />
        <Route path={PathConstant.MAIN + '*'} element={<MainLayout />} />
        <Route path={PathConstant.PAGE_404} element={<Page404NotFound />} />
        <Route path={PathConstant.PAGE_403} element={<Page403Forbidden />} />
      </Routes>
    </Fragment>
  )
}

export default App

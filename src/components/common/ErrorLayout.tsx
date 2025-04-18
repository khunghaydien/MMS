import { PathConstant } from '@/const'
import logo from '@/ui/images/logo-mor.png'
import { Box } from '@mui/material'
import i18next from 'i18next'

interface IProps {
  errorMessage?: string
}

const ErrorLayout = ({ errorMessage }: IProps) => {
  const handleGoDailyReport = () => {
    window.location.href = PathConstant.DAILY_REPORT
  }
  return (
    <Box className={'boundary__wrapper'}>
      <Box className={'content'}>
        <Box className={'formContent'}>
          <img src={logo} alt="logo" className={'logo'} />
          <h1 className={'title'}>{errorMessage || ''}</h1>
          <Box className={'link'} onClick={handleGoDailyReport}>
            {i18next.t('common:LB_GO_DAILY_REPORT') as string}
          </Box>
        </Box>
      </Box>
      <footer className={'footer'}>
        {i18next.t('common:TXT_APP_NAME')} &#169; {new Date().getFullYear()}
      </footer>
    </Box>
  )
}

export default ErrorLayout

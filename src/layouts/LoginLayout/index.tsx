import LogoCompany from '@/components/common/LogoCompany'
import Processing from '@/components/common/Processing'
import { ApiConstant, LangConstant, PathConstant } from '@/const'
import { EMAIL } from '@/const/api.const'
import { INPUT_TIME_DELAY, RESET_EMAIL_INTERNAL } from '@/const/app.const'
import {
  comfirmResetPassword,
  forgotPassword,
  getSelfInfo,
  loggedInAnotherDevice,
  login,
  selectAuth,
} from '@/reducer/auth'
import { notification } from '@/reducer/common'
import { alertSuccess } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { ComfirmResetPassword, LoginFormControls } from '@/types'
import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import Cookies from 'js-cookie'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ForgotPasswordForm from './components/ForgotPasswordForm'
import LoginForm, { EmailForgotPasswordProps } from './components/LoginForm'
import LoginTheme from './components/LoginTheme'

interface LoginLayoutProps {
  isForgot: boolean
}

const LoginLayout = ({ isForgot }: LoginLayoutProps) => {
  const classes = useStyles()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18Login } = useTranslation(LangConstant.NS_LOGIN)

  const emailInterval = useRef<NodeJS.Timeout | null>(null)

  const { email, permissions } = useSelector(selectAuth)

  const roles = !!Object.keys(permissions).length

  const [hasLogin, setHasLogin] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [useForgetPassword, setUseForgetPassword] = useState(false)
  const handleNotification = (token: string) => {
    const payload = {
      token: token,
      type: 'MMS',
    }

    dispatch(notification(payload))
      .unwrap()
      .then((res: any) => {})
      .finally()
  }
  const requestLogin = (_payloadLogin: LoginFormControls) => {
    dispatch(login(_payloadLogin))
      .unwrap()
      .then(() => {
        dispatch(
          alertSuccess({
            message: i18Login('MSG_LOGIN_SUCCESS'),
          })
        )
        var deviceToken = Cookies.get('deviceToken')
        if (deviceToken) {
          handleNotification(deviceToken)
        }
        navigateToHomePage()
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  const navigateToHomePage = () => {
    navigate(PathConstant.DAILY_REPORT, { replace: true })
  }

  const handleLogin = ({ email, password }: LoginFormControls) => {
    setIsSubmitting(true)
    dispatch(loggedInAnotherDevice({ email, password }))
      .unwrap()
      .then(() => {
        requestLogin({ email, password })
      })
      .catch(err => {
        setIsSubmitting(false)
      })
  }

  const handleResetPassword = ({
    newPassword,
    confirmNewPassword,
    token,
  }: ComfirmResetPassword) => {
    setIsSubmitting(true)
    dispatch(
      comfirmResetPassword({
        newPassword: newPassword,
        confirmNewPassword: confirmNewPassword,
        token: token,
      })
    )
      .unwrap()
      .then(() => {
        navigate(PathConstant.LOGIN)
      })
      .finally(() => {
        setTimeout(() => {
          setIsSubmitting(false)
        }, INPUT_TIME_DELAY)
      })
  }

  const handleSendEmail = (payload: EmailForgotPasswordProps) => {
    setIsSubmitting(true)
    dispatch(forgotPassword(payload))
      .unwrap()
      .then(() => {
        setUseForgetPassword(false)
      })
      .finally(() => {
        setTimeout(() => {
          setIsSubmitting(false)
        }, INPUT_TIME_DELAY)
      })
  }

  useEffect(() => {
    if (!email) {
      setHasLogin(true)
      return
    }
    if (roles) {
      navigate(PathConstant.DAILY_REPORT)
      return
    }
    dispatch(getSelfInfo())
      .unwrap()
      .finally(() => {
        setHasLogin(true)
      })
  }, [roles])

  useEffect(() => {
    localStorage.removeItem(ApiConstant.SESSION_INVALID)
  }, [])

  useEffect(() => {
    if (emailInterval.current) {
      clearInterval(emailInterval.current)
    }
    emailInterval.current = setInterval(() => {
      const newEmail = localStorage.getItem(EMAIL) || ''
      if (newEmail) {
        window.location.href = PathConstant.MAIN
        return
      }
    }, RESET_EMAIL_INTERNAL)
    return () => {
      !!emailInterval.current && clearInterval(emailInterval.current)
    }
  }, [])

  return !hasLogin ? (
    <Processing open />
  ) : (
    <Fragment>
      <LoginTheme className="display-flex">
        <Box className={classes.width50}>
          <LogoCompany />
        </Box>
        <Box className={clsx(classes.width50, 'center-root')}>
          {isForgot ? (
            <ForgotPasswordForm
              onSubmit={handleResetPassword}
              isSubmitting={isSubmitting}
            />
          ) : (
            <LoginForm
              onSubmit={handleLogin}
              isSubmitting={isSubmitting}
              useForgetPassword={useForgetPassword}
              setUseForgetPassword={setUseForgetPassword}
              onSendEmail={handleSendEmail}
            />
          )}
        </Box>
      </LoginTheme>
    </Fragment>
  )
}
const useStyles = makeStyles(() => ({
  width50: {
    width: '50%',
  },
}))
export default LoginLayout

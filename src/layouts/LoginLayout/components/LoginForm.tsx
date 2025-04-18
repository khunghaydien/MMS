import ConditionalRender from '@/components/ConditionalRender'
import CommonButton from '@/components/buttons/CommonButton'
import Typography from '@/components/common/Typography'
import InputCheckbox from '@/components/inputs/InputCheckbox'
import LoginInputField from '@/components/login/LoginInputField'
import { LangConstant } from '@/const'
import { LoginFormControls } from '@/types'
import { replaceWithBr } from '@/utils'
import { passwordRegex } from '@/utils/yup'
import { Login } from '@mui/icons-material'
import { Box, LinearProgress, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useFormik } from 'formik'
import { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

interface LoginFormProps {
  onSubmit: (loginFormControls: LoginFormControls) => void
  isSubmitting: boolean
  useForgetPassword: boolean
  setUseForgetPassword: Dispatch<SetStateAction<boolean>>
  onSendEmail: (values: EmailForgotPasswordProps) => void
}

export interface EmailForgotPasswordProps {
  email: string
}

const LoginForm = ({
  onSubmit,
  isSubmitting,
  useForgetPassword,
  setUseForgetPassword,
  onSendEmail,
}: LoginFormProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Login } = useTranslation(LangConstant.NS_LOGIN)

  const loginFormik = useFormik({
    initialValues: {
      email: '',
      password: '',
      showPassword: false,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .trim()
        .required(
          i18('MSG_INPUT_REQUIRE', {
            name: i18Login('PLH_EMAIL'),
          }) as string
        ),
      password: Yup.string()
        .trim()
        .required(
          i18('MSG_INPUT_REQUIRE', {
            name: i18Login('PLH_PASSWORD'),
          }) as string
        )
        .matches(passwordRegex, i18Login('MSG_PASSWORD_INVALID') as string),
    }),
    onSubmit: values => {
      onSubmit({
        email: values.email.trim(),
        password: values.password,
      })
    },
  })

  const emailForgotPasswordFormik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .trim()
        .required(
          i18('MSG_INPUT_REQUIRE', {
            name: i18Login('PLH_EMAIL'),
          }) as string
        ),
    }),
    onSubmit: values => {
      handleSendEmail(values)
    },
  })

  const handleSendEmail = (values: EmailForgotPasswordProps) => {
    onSendEmail(values)
  }

  const handleTogglePassword = () => {
    loginFormik.setFieldValue('showPassword', !loginFormik.values.showPassword)
  }

  const handleEmailChange = (newEmail: string) => {
    loginFormik.setFieldValue('email', newEmail)
  }

  const handlePasswordChange = (newPassword: string) => {
    loginFormik.setFieldValue('password', newPassword)
  }

  const handleEmailForgotPasswordChange = (newEmail: string) => {
    emailForgotPasswordFormik.setFieldValue('email', newEmail)
  }

  return (
    <form onSubmit={loginFormik.handleSubmit}>
      <Box className={classes.rootLoginForm}>
        {isSubmitting && <LinearProgress className={classes.linearProgress} />}
        {useForgetPassword ? (
          <Box>
            <Typography className={classes.titleForgotPassword}>
              {i18Login('TXT_FORGOT_PASSWORD')}
            </Typography>
            <Box
              className={classes.description}
              dangerouslySetInnerHTML={{
                __html: replaceWithBr(
                  i18Login('TXT_FORGOT_PASSWORD_DESCRIPTION')
                ),
              }}
            />
          </Box>
        ) : (
          <Typography className={classes.title}>
            {i18Login('TXT_LOGIN_FORM_TITLE')}
          </Typography>
        )}
        <Box className={classes.formControls}>
          <ConditionalRender conditional={useForgetPassword}>
            <LoginInputField
              placeholder={i18Login('PLH_EMAIL')}
              error={
                !!emailForgotPasswordFormik.errors.email &&
                !!emailForgotPasswordFormik.touched.email
              }
              errorMessage={emailForgotPasswordFormik.errors.email as string}
              value={emailForgotPasswordFormik.values.email}
              onChange={handleEmailForgotPasswordChange}
            />
          </ConditionalRender>
          <ConditionalRender conditional={!useForgetPassword}>
            <LoginInputField
              placeholder={i18Login('PLH_EMAIL')}
              error={!!loginFormik.errors.email && !!loginFormik.touched.email}
              errorMessage={loginFormik.errors.email as string}
              value={loginFormik.values.email}
              onChange={handleEmailChange}
            />
            <LoginInputField
              type={loginFormik.values.showPassword ? 'text' : 'password'}
              placeholder={i18Login('PLH_PASSWORD')}
              error={
                !!loginFormik.errors.password && !!loginFormik.touched.password
              }
              errorMessage={loginFormik.errors.password as string}
              value={loginFormik.values.password}
              onChange={handlePasswordChange}
            />
          </ConditionalRender>
          <ConditionalRender conditional={!useForgetPassword}>
            <Box className={classes.toggleActions}>
              <InputCheckbox
                className="checkbox"
                label={i18Login('LB_SHOW_PASSWORD')}
                checked={loginFormik.values.showPassword}
                onClick={handleTogglePassword}
              />
              <Box
                className={classes.forgetPassword}
                onClick={() => setUseForgetPassword(true)}
              >
                {i18Login('TXT_FORGOTTEN_PASSWORD')}
              </Box>
            </Box>
          </ConditionalRender>
          {useForgetPassword ? (
            <Box>
              <CommonButton
                disabled={isSubmitting}
                height={48}
                width={'100%'}
                type="submit"
                onClick={emailForgotPasswordFormik.handleSubmit}
              >
                <Box className={classes.buttonSubmitChildren}>
                  {i18Login('LB_RESET_PASSWORD')}
                </Box>
              </CommonButton>
              <Box
                className={classes.orLogin}
                onClick={() => setUseForgetPassword(false)}
              >
                {i18('TXT_OR')}{' '}
                <Box component="span">{i18Login('LB_LOGIN')}</Box>
              </Box>
            </Box>
          ) : (
            <CommonButton
              disabled={isSubmitting}
              height={48}
              width={'100%'}
              type="submit"
              onClick={loginFormik.handleSubmit}
            >
              <Box className={classes.buttonSubmitChildren}>
                <Login />
                {i18Login('LB_LOGIN')}
              </Box>
            </CommonButton>
          )}
        </Box>
      </Box>
    </form>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootLoginForm: {
    background: theme.color.white,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(3, 5),
    boxShadow: '0px 6px 1px rgba(63, 48, 37, 0.25)',
  },
  title: {
    color: theme.color.black.primary,
    fontSize: 24,
    fontWeight: 700,
    textAlign: 'center',
  },
  titleForgotPassword: {
    color: theme.color.black.primary,
    fontSize: 24,
    fontWeight: 700,
    marginTop: theme.spacing(1),
  },
  formControls: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    marginTop: theme.spacing(3),
  },
  linearProgress: {
    marginBottom: theme.spacing(3),
  },
  buttonSubmitChildren: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  toggleActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& .checkbox': {
      width: 'unset',
    },
  },
  forgetPassword: {
    color: theme.color.blue.primary,
    fontSize: 16,
    cursor: 'pointer',
  },
  orLogin: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
    gap: theme.spacing(1),
    '& span': {
      color: theme.color.blue.primary,
      textDecoration: 'underline',
      cursor: 'pointer',
      fontWeight: 700,
    },
  },
  description: {
    marginTop: theme.spacing(2),
    fontSize: 14,
  },
}))

export default LoginForm

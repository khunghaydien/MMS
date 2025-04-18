import ConditionalRender from '@/components/ConditionalRender'
import CommonButton from '@/components/buttons/CommonButton'
import Typography from '@/components/common/Typography'
import InputCheckbox from '@/components/inputs/InputCheckbox'
import LoadingSkeleton from '@/components/loading/LoadingSkeleton'
import LoginInputField from '@/components/login/LoginInputField'
import { LangConstant, PathConstant } from '@/const'
import { useQuery } from '@/hooks/useQuery'
import { checkToken } from '@/reducer/auth'
import { AppDispatch } from '@/store'
import { ComfirmResetPassword } from '@/types'
import { parseJwt } from '@/utils'
import { passwordRegex } from '@/utils/yup'
import { Box, LinearProgress, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import { useFormik } from 'formik'
import { useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

interface ForgotPasswordFormProps {
  onSubmit: (loginFormControls: ComfirmResetPassword) => void
  isSubmitting: boolean
}

const ForgotPassworForm = ({
  onSubmit,
  isSubmitting,
}: ForgotPasswordFormProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Login } = useTranslation(LangConstant.NS_LOGIN)
  const dispatch = useDispatch<AppDispatch>()
  const queryParams = useQuery()
  const navigate = useNavigate()
  const token = queryParams.get('token') || ''
  const { sub } = parseJwt(token)

  const [useForgotPasswordForm, setUseForgetPasswordForm] = useState(false)

  useLayoutEffect(() => {
    const checkTokenValidity = () => {
      dispatch(checkToken(token))
        .unwrap()
        .then((res: AxiosResponse) => {
          if (!res.data) {
            navigate(PathConstant.LOGIN)
          } else {
            setUseForgetPasswordForm(true)
          }
        })
    }
    checkTokenValidity()
  }, [])

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      comfirmPassword: '',
      token: '',
      showPassword: false,
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .trim()
        .required(
          i18('MSG_INPUT_REQUIRE', {
            name: i18('LB_NEW_PASSWORD'),
          }) as string
        ),
      comfirmPassword: Yup.string()
        .oneOf(
          [Yup.ref('newPassword'), null],
          i18Login('MSG_PASSWORD_NOT_MATCH') as string
        )
        .trim()
        .required(
          i18('MSG_INPUT_REQUIRE', {
            name: i18('LB_RETYPE_NEW_PASSWORD'),
          }) as string
        )
        .matches(passwordRegex, i18Login('MSG_PASSWORD_INVALID') as string),
    }),
    onSubmit: values => {
      onSubmit({
        newPassword: values.newPassword.trim(),
        confirmNewPassword: values.comfirmPassword.trim(),
        token,
      })
    },
  })

  const handleNewPassword = (newPassword: string) => {
    formik.setFieldValue('newPassword', newPassword)
  }

  const handleComfirmPassword = (comfirmPassword: string) => {
    formik.setFieldValue('comfirmPassword', comfirmPassword)
  }

  const handleTogglePassword = () => {
    formik.setFieldValue('showPassword', !formik.values.showPassword)
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box className={classes.rootForgotPasswordForm}>
        {isSubmitting && <LinearProgress className={classes.linearProgress} />}
        <ConditionalRender
          conditional={useForgotPasswordForm}
          fallback={<LoadingSkeleton height="100%" />}
        >
          <Typography className={classes.title}>
            {i18Login('TXT_CHOOSE_PASSWORD')}
          </Typography>
          <Typography className={classes.userEmail}>{sub}</Typography>
          <Box className={classes.formControls}>
            <LoginInputField
              type={formik.values.showPassword ? 'text' : 'password'}
              placeholder={i18Login('PLH_NEW_PASSWORD')}
              error={
                !!formik.errors.newPassword && !!formik.touched.newPassword
              }
              errorMessage={formik.errors.newPassword as string}
              value={formik.values.newPassword}
              onChange={handleNewPassword}
            />
            <LoginInputField
              type={formik.values.showPassword ? 'text' : 'password'}
              placeholder={i18('LB_RETYPE_NEW_PASSWORD') as string}
              error={
                !!formik.errors.comfirmPassword &&
                !!formik.touched.comfirmPassword
              }
              errorMessage={formik.errors.comfirmPassword as string}
              value={formik.values.comfirmPassword}
              onChange={handleComfirmPassword}
            />
            <Box>
              <Box className={classes.toggleActions}>
                <InputCheckbox
                  className="checkbox"
                  label={i18Login('LB_SHOW_PASSWORD')}
                  checked={formik.values.showPassword}
                  onClick={handleTogglePassword}
                />
              </Box>
              <CommonButton
                disabled={isSubmitting}
                height={48}
                width={'100%'}
                type="submit"
                onClick={formik.handleSubmit}
              >
                <Box className={classes.buttonSubmitChildren}>
                  {i18('LB_SUBMIT')}
                </Box>
              </CommonButton>
            </Box>
          </Box>
        </ConditionalRender>
      </Box>
    </form>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootForgotPasswordForm: {
    background: theme.color.white,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(3, 5),
    boxShadow: '0px 6px 1px rgba(63, 48, 37, 0.25)',
    minWidth: 464,
    height: 350,
  },
  title: {
    color: theme.color.black.primary,
    fontSize: theme.spacing(3),
    fontWeight: 700,
    textAlign: 'center',
  },
  formControls: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    marginTop: theme.spacing(3),
  },
  buttonSubmitChildren: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  toggleActions: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    justifyContent: 'space-between',
    '& .checkbox': {
      width: 'unset',
    },
  },
  userEmail: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: theme.spacing(2),
  },
  linearProgress: {
    marginBottom: theme.spacing(3),
  },
}))
export default ForgotPassworForm

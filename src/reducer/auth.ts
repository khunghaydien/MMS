import { HttpStatusCode } from '@/api/types'
import { ApiConstant } from '@/const'
import { EMAIL, ENVIRONMENT } from '@/const/api.const'
import AuthService from '@/services/auth.service'
import { RootState } from '@/store'
import {
  ChangePasswordPayload,
  ComfirmResetPassword,
  ForgotPassword,
  IStaffInfo,
  IUserInfo,
  LoginFormControls,
  UserPermission,
} from '@/types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import i18next from 'i18next'
import { alertError, alertSuccess } from './screen'

export interface AuthState {
  email: string
  isLoginFetching: boolean
  permissions: UserPermission | any
  staff: IStaffInfo | null
  role: any
  user: IUserInfo | null
}
const initialState: AuthState = {
  email: localStorage.getItem(ApiConstant.EMAIL) || '',
  isLoginFetching: false,
  permissions: {},
  staff: null,
  role: null,
  user: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async (requestBody: LoginFormControls, { rejectWithValue, dispatch }) => {
    try {
      const res = await AuthService.login(requestBody)
      return res
    } catch (err: any) {
      if (err.status === HttpStatusCode.BAD_REQUEST) {
        dispatch(
          alertError({ message: i18next.t('login:MSG_LOGIN_400') || '' })
        )
      } else {
        dispatch(
          alertError({
            message: err?.message || '',
          })
        )
      }
      return rejectWithValue(err)
    }
  }
)

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (requestBody: ForgotPassword, { rejectWithValue, dispatch }) => {
    try {
      const res = await AuthService.forgotPassword(requestBody)
      dispatch(
        alertSuccess({
          message: i18next.t('login:MSG_FORGOT_PASSWORD_SUCCESS'),
        })
      )
      return res
    } catch (err: any) {
      dispatch(
        alertError({ message: i18next.t('login:MSG_SEND_EMAIL_ERROR' || '') })
      )
      return rejectWithValue(err)
    }
  }
)

export const comfirmResetPassword = createAsyncThunk(
  'auth/comfirmResetPassword',
  async (requestBody: ComfirmResetPassword, { rejectWithValue, dispatch }) => {
    try {
      const res = await AuthService.comfirmResetPassword(requestBody)
      dispatch(
        alertSuccess({
          message: i18next.t('login:MSG_COMFIRM_NEW_PASSWORD'),
        })
      )
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const checkToken = createAsyncThunk(
  'auth/checkToken',
  async (token: string, { rejectWithValue }) => {
    try {
      const res = await AuthService.checkToken(token)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getSelfInfo = createAsyncThunk(
  'auth/getSelfInfo',
  async (_, { rejectWithValue }) => {
    try {
      const res = await AuthService.getSelfInfo()
      return res
    } catch (err: any) {
      localStorage.removeItem(EMAIL)
      return rejectWithValue(err)
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const res = await AuthService.logout()
      if (res && res.status === HttpStatusCode.OK) {
        localStorage.removeItem(ApiConstant.ACCESS_TOKEN)
        localStorage.removeItem(ApiConstant.EMAIL)
      }
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const loggedInAnotherDevice = createAsyncThunk(
  'auth/loggedInAnotherDevice',
  async (requestBody: LoginFormControls, { rejectWithValue, dispatch }) => {
    try {
      const res = await AuthService.loggedInAnotherDevice(requestBody)
      return res
    } catch (err: any) {
      if (err.status === HttpStatusCode.BAD_REQUEST) {
        dispatch(
          alertError({ message: i18next.t('login:MSG_LOGIN_400') || '' })
        )
      } else {
        dispatch(
          alertError({
            message: err?.message || '',
          })
        )
      }
      return rejectWithValue(err)
    }
  }
)

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (payload: ChangePasswordPayload, { rejectWithValue, dispatch }) => {
    try {
      const res = await AuthService.changePassword(payload)
      return res
    } catch (err: any) {
      if (err[0]?.field === 'currentPassword') {
        dispatch(
          alertError({
            message: 'The password is incorrect. Try again',
          })
        )
      }
      return rejectWithValue(err)
    }
  }
)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(login.pending, state => {
      state.isLoginFetching = true
    }),
      builder.addCase(login.fulfilled, (state, { payload }) => {
        const { accessToken, email } = payload.data
        state.isLoginFetching = false
        state.email = email
        localStorage.setItem(ApiConstant.EMAIL, email)
        if (ENVIRONMENT === 'development') {
          localStorage.setItem(ApiConstant.ACCESS_TOKEN, accessToken)
        }
      }),
      builder.addCase(login.rejected, state => {
        state.isLoginFetching = false
      })
    builder.addCase(getSelfInfo.fulfilled, (state, { payload }) => {
      const selfInfo = payload.data
      state.permissions = {
        ...selfInfo.permission,
        useMBOEvaluationProcess: true,
      }
      state.user = {
        id: selfInfo.id,
        email: selfInfo.email,
        name: selfInfo.name,
      }
      state.role = selfInfo.roles
      state.staff = selfInfo.staff
    })
  },
})

export const selectAuth = (state: RootState) => state['auth']

export default authSlice.reducer

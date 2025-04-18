import ApiClientWithToken, { LoginClient } from '@/api/api'
import { TYPE_WEBSITE_DEFAULT } from '@/const/app.const'
import {
  ChangePasswordPayload,
  ComfirmResetPassword,
  ForgotPassword,
  LoginApiResponse,
  LoginFormControls,
} from '@/types'

export default {
  login(requestBody: LoginFormControls): Promise<LoginApiResponse> {
    const url = '/login'
    return LoginClient.post(url, { ...requestBody, type: TYPE_WEBSITE_DEFAULT })
  },
  getSelfInfo() {
    return ApiClientWithToken.get('/info')
  },
  logout() {
    return ApiClientWithToken.post(`/logout?type=${TYPE_WEBSITE_DEFAULT}`)
  },
  loggedInAnotherDevice(requestBody: LoginFormControls) {
    return LoginClient.post('/logged-in-another-device', {
      ...requestBody,
      type: TYPE_WEBSITE_DEFAULT,
    })
  },
  changePassword(payload: ChangePasswordPayload) {
    return ApiClientWithToken.post('/info/change-password', {
      ...payload,
      type: TYPE_WEBSITE_DEFAULT,
    })
  },
  forgotPassword(payload: ForgotPassword) {
    return ApiClientWithToken.post('/forgot-password', {
      ...payload,
      type: TYPE_WEBSITE_DEFAULT,
    })
  },
  comfirmResetPassword(payload: ComfirmResetPassword) {
    return ApiClientWithToken.post('/forgot-password/confirm-reset', {
      ...payload,
      type: TYPE_WEBSITE_DEFAULT,
    })
  },
  checkToken(token: string) {
    return ApiClientWithToken.get('/forgot-password/check-token', {
      params: { token },
    })
  },
}

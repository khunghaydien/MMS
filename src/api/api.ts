import { BASE_URL, HEADER_DATA_FORM_FILE } from '@/const/api.const'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ApiConstant } from '../const'
import { HttpStatusCode } from './types'

class HttpService {
  axios: any
  getCredential: any
  constructor(axios: any, getCredential: any) {
    this.axios = axios
    this.getCredential = getCredential
  }
  request(config?: AxiosRequestConfig) {
    config = this.getCredential(config)
    return this.axios.request(config)
  }
  get(url: string, config?: AxiosRequestConfig) {
    config = this.getCredential(config)
    return this.axios.get(url, config)
  }
  post(url: string, data?: any, config?: AxiosRequestConfig) {
    config = this.getCredential(config)
    return this.axios.post(url, data, config)
  }
  put(url: string, data?: any, config?: AxiosRequestConfig) {
    config = this.getCredential(config)
    return this.axios.put(url, data, config)
  }
  patch(url: string, data?: any, config?: AxiosRequestConfig) {
    config = this.getCredential(config)
    return this.axios.patch(url, data, config)
  }
  delete(url: string, config?: AxiosRequestConfig) {
    config = this.getCredential(config)
    return this.axios.delete(url, config)
  }
}

const defaultConfig = (headers: any) => ({
  baseURL: BASE_URL,
  headers: { ...headers },
  timeout: ApiConstant.TIMEOUT,
})

const getCredentialWithAccessToken = (config: any = {}) => {
  let accessToken: string = ''
  if (ApiConstant.ENVIRONMENT === 'development') {
    accessToken = localStorage.getItem(ApiConstant.ACCESS_TOKEN) || ''
  }
  if (!accessToken) return config
  return {
    ...config,
    headers: {
      ...(config.headers || {}),
      Authorization: 'Bearer ' + accessToken,
    },
  }
}

const configInterceptors = (axiosClient: any) => {
  axiosClient.interceptors.response.use(
    (res: AxiosResponse) => res.data,
    (res: any) => {
      const status = res?.response?.status
      if (status === HttpStatusCode.UNAUTHORIZED) {
        localStorage.removeItem(ApiConstant.ACCESS_TOKEN)
        localStorage.removeItem(ApiConstant.EMAIL)
        // window.location.href = PathConstant.LOGIN
      } else {
        return Promise.reject(
          res?.response?.data?.errors || { status: status || 0 }
        )
      }
    }
  )
  return axiosClient
}

const axiosClient = configInterceptors(
  axios.create(defaultConfig(ApiConstant.HEADER_DEFAULT))
)
const axiosClientFormFile = configInterceptors(
  axios.create(defaultConfig(HEADER_DATA_FORM_FILE))
)

const ApiClientWithToken = new HttpService(
  axiosClient,
  getCredentialWithAccessToken
)

export const ApiClientFormFile = new HttpService(
  axiosClientFormFile,
  getCredentialWithAccessToken
)

const loginConfigInterceptors = (axiosClient: any) => {
  axiosClient.interceptors.response.use(
    (res: AxiosResponse) => res.data,
    (res: any) => Promise.reject(res.response?.data)
  )
  return axiosClient
}

export const LoginClient = loginConfigInterceptors(
  axios.create(defaultConfig(ApiConstant.HEADER_DEFAULT))
)

export default ApiClientWithToken

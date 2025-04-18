import ApiClientWithToken from '@/api/api'
import { cleanObject } from '@/utils'
import { AxiosRequestConfig } from 'axios'
import {
  IPayloadCreateCycle,
  IPayloadCycleQueryString,
  IPayloadUpdateCycle,
} from '../models'

export default {
  getCycleList(
    queryParameters: IPayloadCycleQueryString,
    config: AxiosRequestConfig
  ) {
    return ApiClientWithToken.get('/evaluation-cycle', {
      ...config,
      params: cleanObject(queryParameters),
    })
  },
  getCycleDetail(id: string, config: AxiosRequestConfig) {
    return ApiClientWithToken.get(`/evaluation-cycle/${id}`, {
      ...config,
    })
  },
  getCycleListUpcomingTemplate(config: AxiosRequestConfig) {
    return ApiClientWithToken.get('/evaluation-cycle/template/present-future', {
      ...config,
    })
  },
  createCycle(payload: IPayloadCreateCycle) {
    return ApiClientWithToken.post(`/evaluation-cycle`, payload)
  },
  deleteEvaluationCycle(id: string, config: AxiosRequestConfig) {
    return ApiClientWithToken.delete(`/evaluation-cycle/${id}`, {
      ...config,
    })
  },
  updateEvaluationCycle(payload: IPayloadUpdateCycle) {
    return ApiClientWithToken.put(
      `/evaluation-cycle/${payload.cycleId}`,
      payload.requestBody
    )
  },
}

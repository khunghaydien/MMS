import ApiClientWithToken from '@/api/api'
import { cleanObject } from '@/utils'
import { AxiosRequestConfig } from 'axios'
import {
  CriteriaQueryString,
  CriteriaRequest,
  ICriteriaGroupDataForm,
  ICriteriaGroupInformation,
} from '../models'

export default {
  getCriteriaList(
    queryParameters: CriteriaQueryString,
    config: AxiosRequestConfig
  ) {
    return ApiClientWithToken.get('/criteria-group', {
      ...config,
      params: cleanObject(queryParameters),
    })
  },
  createCriteriaGroup(requestBody: ICriteriaGroupDataForm) {
    return ApiClientWithToken.post('/criteria-group', requestBody)
  },
  deleteCriteriaGroup(criteriaGroupId: string | undefined) {
    const url = `/criteria-group/${criteriaGroupId}`
    return ApiClientWithToken.delete(url)
  },
  getCriteriaGroupDetail(criteriaGroupId: string | number | undefined) {
    return ApiClientWithToken.get(`/criteria-group/${criteriaGroupId}`)
  },
  updateCriteriaGroup({
    criteriaGroupId,
    requestBody,
  }: {
    criteriaGroupId: string | number | undefined
    requestBody: ICriteriaGroupInformation
  }) {
    return ApiClientWithToken.put(
      `/criteria-group/${criteriaGroupId}`,
      requestBody
    )
  },
  updateHashCriteria(payload: {
    criteriaGroupId: string | number | undefined
    hashCriteriaId: string | number
    requestBody: CriteriaRequest
  }) {
    return ApiClientWithToken.put(
      `/criteria-group/${payload.criteriaGroupId}/criteria/${payload.hashCriteriaId}`,
      payload.requestBody
    )
  },
  deleteHashCriteria(payload: {
    criteriaGroupId: string | number | undefined
    hashCriteriaId: string | number
  }) {
    return ApiClientWithToken.delete(
      `/criteria-group/${payload.criteriaGroupId}/criteria/${payload.hashCriteriaId}`
    )
  },
  createHashCriteria(payload: {
    criteriaGroupId: string | undefined
    requestBody: CriteriaRequest
  }) {
    return ApiClientWithToken.post(
      `/criteria-group/${payload.criteriaGroupId}/criteria`,
      payload.requestBody
    )
  },
}

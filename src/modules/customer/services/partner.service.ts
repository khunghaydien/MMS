import ApiClientWithToken from '@/api/api'
import { IExportListToExcelBody, PayloadUpdate } from '@/types'
import { cleanObject } from '@/utils'
import { AxiosRequestConfig } from 'axios'
import QueryString from 'query-string'
import {
  IContractDetailPayload,
  ICreateContractPayload,
  ListPartnersParams,
} from '../types'

export default {
  getListPartners(params: ListPartnersParams, config: AxiosRequestConfig) {
    const queryString = QueryString.stringify(cleanObject(params))
    const url = `/partners${queryString ? `?${queryString}` : ''}`
    return ApiClientWithToken.get(url, config)
  },
  createPartner(requestBody: any) {
    return ApiClientWithToken.post('/partners', requestBody)
  },
  deletePartner(id: string) {
    return ApiClientWithToken.delete(`/partners/${id}`)
  },
  getPartner(id: string) {
    return ApiClientWithToken.get(`/partners/${id}`)
  },
  updatePartner({ id, requestBody }: PayloadUpdate) {
    return ApiClientWithToken.put(`/partners/${id}`, requestBody)
  },

  getContractsByPartnerId(id: string) {
    return ApiClientWithToken.get(`/partners/${id}/contracts`)
  },

  createPartnerContract({ id, data }: ICreateContractPayload) {
    return ApiClientWithToken.post(`/partners/${id}/contracts`, data)
  },

  updatePartnerContract({ id, contractId, data }: IContractDetailPayload) {
    return ApiClientWithToken.put(
      `/partners/${id}/contracts/${contractId}`,
      data
    )
  },

  deletePartnerContract({ id, contractId }: IContractDetailPayload) {
    return ApiClientWithToken.delete(`/partners/${id}/contracts/${contractId}`)
  },

  getListIds(queryParameters: ListPartnersParams) {
    return ApiClientWithToken.get('/partners/id', {
      params: cleanObject(queryParameters),
    })
  },

  exportListToExcel(requestBody: IExportListToExcelBody) {
    return ApiClientWithToken.post('/partners/export', requestBody)
  },
}

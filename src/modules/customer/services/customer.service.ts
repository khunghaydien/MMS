import ApiClientWithToken from '@/api/api'
import { IExportListToExcelBody } from '@/types'
import { cleanObject } from '@/utils'
import { AxiosRequestConfig } from 'axios'
import QueryString from 'query-string'
import {
  IContractDetailPayload,
  ICreateContractPayload,
  ICustomer,
  IListCustomersParams,
  Optional,
} from '../types'

export default {
  getListCustomers(params: IListCustomersParams, config: AxiosRequestConfig) {
    const queryString = QueryString.stringify(cleanObject(params))
    const url = `/customers${queryString ? `?${queryString}` : ''}`
    return ApiClientWithToken.get(url, config)
  },
  deleteCustomers(id: string) {
    return ApiClientWithToken.delete(`/customers/${id}`)
  },
  getCustomerDetail(customerId: string) {
    return ApiClientWithToken.get(`/customers/${customerId}`)
  },
  createCustomer(payload: Optional<ICustomer>) {
    return ApiClientWithToken.post(`/customers`, payload)
  },

  updateCustomer(payload: { customerId: string; data: Optional<ICustomer> }) {
    return ApiClientWithToken.put(
      `/customers/${payload.customerId}`,
      payload.data
    )
  },

  getStatisticCustomerAndPartner(queryParams: string) {
    return ApiClientWithToken.get(
      `/dashboards/customer-and-partner${queryParams}`
    )
  },

  getContractsByCustomerId(customerId: string) {
    return ApiClientWithToken.get(`/customers/${customerId}/contracts`)
  },

  createCustomerContract({ id, data }: ICreateContractPayload) {
    return ApiClientWithToken.post(`/customers/${id}/contracts`, data)
  },

  updateCustomerContract({ id, contractId, data }: IContractDetailPayload) {
    return ApiClientWithToken.put(
      `/customers/${id}/contracts/${contractId}`,
      data
    )
  },

  deleteCustomerContract({ id, contractId }: IContractDetailPayload) {
    return ApiClientWithToken.delete(`/customers/${id}/contracts/${contractId}`)
  },

  getListIds(queryParameters: IListCustomersParams) {
    return ApiClientWithToken.get('/customers/id', {
      params: cleanObject(queryParameters),
    })
  },

  exportListToExcel(requestBody: IExportListToExcelBody) {
    return ApiClientWithToken.post('/customers/export', requestBody)
  },
}

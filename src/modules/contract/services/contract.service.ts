import ApiClientWithToken, { ApiClientFormFile } from '@/api/api'
import { Pagination } from '@/types'
import { cleanObject } from '@/utils'
import { AxiosRequestConfig } from 'axios'
import {
  ContractStaffInformationRequest,
  IListContractsParams,
  PayloadContractGeneral,
} from '../models'

export default {
  getListContracts(params: IListContractsParams, config: AxiosRequestConfig) {
    const url = `/contracts`
    return ApiClientWithToken.get(url, {
      ...config,
      params: cleanObject(params),
    })
  },

  createContract(formData: any) {
    const url = '/contracts'
    return ApiClientFormFile.post(url, formData)
  },

  getContractGeneralInformation(contractId: string) {
    const url = `/contracts/${contractId}`
    return ApiClientWithToken.get(url)
  },

  getContractStaffInformation(contractId: string) {
    const url = `/contracts/${contractId}/staff`
    return ApiClientWithToken.get(url)
  },

  getContractUploadDocuments(contractId: string, params: Pagination) {
    const url = `/contracts/${contractId}/upload-documents`
    return ApiClientWithToken.get(url, {
      params,
    })
  },

  deleteContractStaff(contractId: string, staffId: string) {
    const url = `/contracts/${contractId}/staff/${staffId}`
    return ApiClientWithToken.delete(url)
  },

  updateContractStaff(payload: {
    contractId: string
    staffId: string
    requestBody: ContractStaffInformationRequest
  }) {
    const url = `/contracts/${payload.contractId}/staff/${payload.staffId}`
    return ApiClientWithToken.put(url, payload.requestBody)
  },

  createContractStaff(payload: {
    contractId: string
    requestBody: ContractStaffInformationRequest
  }) {
    const url = `/contracts/${payload.contractId}/staff`
    return ApiClientWithToken.post(url, payload.requestBody)
  },

  createContractDocuments(payload: { contractId: string; formData: any }) {
    const url = `/contracts/${payload.contractId}/upload-documents`
    return ApiClientFormFile.post(url, payload.formData)
  },

  updateContractGeneralInformation({ id, data }: PayloadContractGeneral) {
    const url = `/contracts/${id}`
    return ApiClientWithToken.put(url, data)
  },

  deleteContract(contractId: string) {
    return ApiClientWithToken.delete(`/contracts/${contractId}`)
  },

  getHistory(contractId: string, historyType: string | number) {
    return ApiClientWithToken.get(`/contracts/${contractId}/history`, {
      params: {
        historyType,
      },
    })
  },

  deleteDocument(contractId: string, fileId: string | number) {
    return ApiClientWithToken.delete(
      `/contracts/${contractId}/delete-documents/${fileId}`
    )
  },
  getCreatePerson() {
    return ApiClientWithToken.get('master/filter-create-person-contract')
  },
}

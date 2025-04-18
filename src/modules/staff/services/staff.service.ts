import ApiClientWithToken, { ApiClientFormFile } from '@/api/api'
import { IExportListToExcelBody } from '@/types'
import { cleanObject, queryStringParam } from '@/utils'
import { AxiosRequestConfig } from 'axios'
import QueryString from 'query-string'
import { StaffQueriesDashboard, UpdateSkillSetStaffDetail } from '../types'
import { ListStaffParams } from '../types/staff-list'

export default {
  getListStaff(params: ListStaffParams, config: AxiosRequestConfig) {
    const queryString = queryStringParam(params)
    const url = `/staffs${queryString ? `?${queryString}` : ''}`
    return ApiClientWithToken.get(url, config)
  },
  getListStaffOutsource(params: ListStaffParams, config: AxiosRequestConfig) {
    const queryString = queryStringParam(params)
    const url = `/staff-outsource${queryString ? `?${queryString}` : ''}`
    return ApiClientWithToken.get(url, config)
  },
  getSkillSets(payload: any) {
    const queryString = queryStringParam(payload.params)
    const url = `/staffs/${payload.staffId}/skillset${
      queryString ? `?${queryString}` : ''
    }`
    return ApiClientWithToken.get(url)
  },
  getContracts(payload: any) {
    const queryString = queryStringParam(payload.queries)
    const url = `/staffs/${payload.staffId}/contract${
      queryString ? `?${queryString}` : ''
    }`
    return ApiClientWithToken.get(url)
  },
  getCertificates(payload: any) {
    const queryString = queryStringParam(payload.queries)
    const url = `/staffs/${payload.staffId}/certificate${
      queryString ? `?${queryString}` : ''
    }`
    return ApiClientWithToken.get(url)
  },
  getCVs(payload: any) {
    const queryString = queryStringParam(payload.queries)
    const url = `/staff-outsource/${payload.staffId}/cv${
      queryString ? `?${queryString}` : ''
    }`
    return ApiClientWithToken.get(url)
  },
  getSkillSet(payload: any) {
    const url = `/staffs/${payload.staffId}/skillset/${payload.skillId}`
    return ApiClientWithToken.get(url)
  },
  createNewStaff(payload: any) {
    return ApiClientFormFile.post(`/staffs`, payload)
  },
  createNewHrOutsourcing(payload: any) {
    return ApiClientFormFile.post(`/staff-outsource`, payload)
  },
  createSkillSet(payload: any) {
    return ApiClientWithToken.post(
      `/staffs/${payload.staffId}/skillset`,
      payload.data
    )
  },

  createContract(payload: any) {
    return ApiClientFormFile.post(
      `/staffs/${payload.staffId}/contract`,
      payload.data
    )
  },
  createCertificate(payload: any) {
    return ApiClientFormFile.post(
      `/staffs/${payload.staffId}/certificate`,
      payload.data
    )
  },
  createCV(payload: any) {
    return ApiClientFormFile.post(
      `/staff-outsource/${payload.staffId}/cv`,
      payload.data
    )
  },
  updateSkillSet(payload: any) {
    return ApiClientWithToken.put(
      `/staffs/${payload.staffId}/skillset/${payload.skillId}`,
      payload.data
    )
  },
  deleteSkillSet(payload: any) {
    return ApiClientWithToken.delete(
      `/staffs/${payload.staffId}/skillset/${payload.skillId}`
    )
  },

  updateStaffGeneralInfo(payload: any) {
    return ApiClientWithToken.put(`/staffs/${payload.id}`, payload.data)
  },

  updateStaffOutsourceInfo(payload: any) {
    return ApiClientWithToken.put(
      `/staff-outsource/${payload.id}`,
      payload.data
    )
  },
  updateChangeStatus({
    id,
    requestBody,
  }: {
    id: string
    requestBody: {
      endDate: any
      note: string
      startDate: any
      status: any
      estimateTo?: any
    }
  }) {
    return ApiClientWithToken.put(`staffs/${id}/change-status`, requestBody)
  },
  getDetailStaff(id: string) {
    return ApiClientWithToken.get(`/staffs/${id}`)
  },
  getDetailStaffOutsource(id: string) {
    return ApiClientWithToken.get(`/staff-outsource/${id}`)
  },
  deleteStaff(id: string) {
    return ApiClientWithToken.delete(`/staffs/${id}`)
  },
  deleteStaffOutsource(id: string) {
    return ApiClientWithToken.delete(`/staff-outsource/${id}`)
  },
  getStaffProject(payload: {
    staffId: string
    pageNum: number
    pageSize: number
  }) {
    const queryString = QueryString.stringify(cleanObject(payload))
    const url = `/staffs/${payload.staffId}/project${
      queryString ? `?${queryString}` : ''
    }`
    return ApiClientWithToken.get(url)
  },
  getDashboardStaff(queries: StaffQueriesDashboard) {
    const queryString = queryStringParam(queries)
    const url = `/dashboards/staff${queryString ? `?${queryString}` : ''}`
    return ApiClientWithToken.get(url)
  },
  exportStaffSkillSet({
    staffId,
    requestBody,
  }: {
    staffId: string
    requestBody: any
  }) {
    return ApiClientWithToken.post(`/staffs/${staffId}/export`, requestBody)
  },
  updateSkillSetStaffDetail({
    staffId,
    requestBody,
  }: {
    staffId: string
    requestBody: UpdateSkillSetStaffDetail[]
  }) {
    return ApiClientWithToken.put(`/staffs/${staffId}/skillset`, requestBody)
  },

  downloadImage(payload: any) {
    const queryString = queryStringParam(payload)
    const url = `/support/download${queryString ? `?${queryString}` : ''}`
    return ApiClientWithToken.get(url)
  },

  getListIds(queryParameters: ListStaffParams) {
    return ApiClientWithToken.get('/staffs/id', {
      params: cleanObject(queryParameters),
    })
  },

  getListHROutsourceIds(queryParameters: ListStaffParams) {
    return ApiClientWithToken.get('/staff-outsource/id', {
      params: cleanObject(queryParameters),
    })
  },

  exportListToExcel(requestBody: IExportListToExcelBody) {
    return ApiClientWithToken.post('/staffs/export', requestBody)
  },

  exportListHROutsourceToExcel(requestBody: IExportListToExcelBody) {
    return ApiClientWithToken.post('/staff-outsource/export', requestBody)
  },
}

export type StaffHeadcountUsedType = {
  staffId: string
  year: string
}

import ApiClientWithToken from '@/api/api'
import { cleanObject } from '@/utils'
import { AxiosRequestConfig } from 'axios'
import {
  AddDailyReportRequestBody,
  IGetDailyReportParams,
  IReportDetailParams,
  IReportRequest,
} from '../types'

export default {
  getDailyReports(params: IGetDailyReportParams, config: AxiosRequestConfig) {
    return ApiClientWithToken.get('/daily', {
      ...config,
      params: cleanObject(params),
    })
  },

  getDailyReportDetail({ staffId, date }: IReportDetailParams) {
    return ApiClientWithToken.get(`/daily/${staffId}/${date}`)
  },

  createDailyReport(payload: IReportRequest) {
    return ApiClientWithToken.post(`/daily`, payload)
  },

  updateDailyReport(payload: { reportId: string; data: IReportRequest }) {
    return ApiClientWithToken.put(`/daily/${payload.reportId}`, payload.data)
  },

  deleteDailyReport(reportId: string) {
    return ApiClientWithToken.delete(`/daily/${reportId}`)
  },

  addDailyReport(requestBody: AddDailyReportRequestBody) {
    return ApiClientWithToken.post(`/daily`, requestBody)
  },

  deleteWorkingHours(payload: { dailyReportId: number; workingId: number }) {
    return ApiClientWithToken.delete(
      `/daily/${payload.dailyReportId}/detail/${payload.workingId}`
    )
  },

  createDailyReportDetail(payload: {
    dailyReportId: number
    requestBody: {
      dailyDetailId: number
      improvement: string
      projectId: number
      suggestionForImprovement: string
      workType: number
      workingDescription: string
      workingHours: number
    }
  }) {
    return ApiClientWithToken.post(
      `/daily/${payload.dailyReportId}/detail`,
      payload.requestBody
    )
  },

  updateDailyReportDetail(payload: {
    dailyReportId: number
    requestBody: {
      dailyDetailId: number
      improvement: string
      projectId: number
      suggestionForImprovement: string
      workType: number
      workingDescription: string
      workingHours: number
    }
  }) {
    return ApiClientWithToken.put(
      `/daily/${payload.dailyReportId}/detail/${payload.requestBody.dailyDetailId}`,
      payload.requestBody
    )
  },

  getProjectListDailyReportManagement(queryParamters: {
    month: number
    year: number
  }) {
    return ApiClientWithToken.get('/daily-report-management', {
      params: cleanObject(queryParamters),
    })
  },

  getStaffListDailyReportManagement(
    queryParamters: {
      keyword: string
      pageSize: number
      pageNum: number
      projectId: string | number
      month: number
      year: number
    },
    config: AxiosRequestConfig
  ) {
    return ApiClientWithToken.get('/daily-report-management/project-members', {
      ...config,
      params: cleanObject(queryParamters),
    })
  },

  getStaffListDrmIds(queryParamters: {
    keyword: string
    pageSize: number
    pageNum: number
    projectId: string | number
    month: number
    year: number
  }) {
    return ApiClientWithToken.get(
      '/daily-report-management/project-members-ids',
      {
        params: cleanObject(queryParamters),
      }
    )
  },

  getDailyReportListFromMember(queryParamters: {
    staffId: string | number
    projectId: string | number
    month: number
    year: number
  }) {
    return ApiClientWithToken.get(
      '/daily-report-management/project-members-daily',
      {
        params: cleanObject(queryParamters),
      }
    )
  },

  updateStatusDailyReportFromMembers(payload: {
    month: number
    noteStatus: string
    projectId: number
    staffIds: number[] | string[]
    status: number
    year: number
  }) {
    return ApiClientWithToken.post(
      `/daily-report-management/approve-all-project-members`,
      payload
    )
  },

  updateStatusDailyReportFromMember(payload: {
    dailyReportDetailIds: number[]
    month: number
    noteStatus: string
    projectId: number | string
    staffId: number | string
    status: number
    year: number
  }) {
    return ApiClientWithToken.post(
      `/daily-report-management/project-members-daily-status`,
      payload
    )
  },
}

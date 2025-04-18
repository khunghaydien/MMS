import ApiClientWithToken, { ApiClientFormFile } from '@/api/api'
import { ActualEffortQueryRA } from '@/modules/project/pages/project-detail-v2/project-resource-allocation/AllocationDetails'
import { IExportListToExcelBody, Pagination } from '@/types'
import { cleanObject, queryStringParam } from '@/utils'
import { AxiosRequestConfig } from 'axios'
import { ProjectGeneralPayload } from '../pages/project-create/ProjectCreate'
import {
  CreateShareEffortRequestBodyItem,
  HeadcountOfYear,
  ICustomerSatisfactionParams,
  IListProjectsParams,
  IListRequestParams,
  IProcessQueryApi,
  IReportOTTimesheetParams,
} from '../types'

export default {
  getListProjects(params: IListProjectsParams, config: AxiosRequestConfig) {
    const formatData = {
      ...params,
    }
    return ApiClientWithToken.get(`/projects`, {
      params: cleanObject(formatData),
      ...config,
    })
  },

  getListRequestOT(params: IListRequestParams, config: AxiosRequestConfig) {
    return ApiClientWithToken.get(`/ot-request`, {
      params: cleanObject(params),
      ...config,
    })
  },
  getListReportOT(params: IListRequestParams, config: AxiosRequestConfig) {
    return ApiClientWithToken.get(`/ot-report/my-report`, {
      params: cleanObject(params),
      ...config,
    })
  },

  getReportOTDetail({ otReportId }: { otReportId: number }) {
    const url = `/ot-report/${otReportId}`
    return ApiClientWithToken.get(url)
  },

  getListProjectReportOT(payload: { params: any; config: AxiosRequestConfig }) {
    return ApiClientWithToken.get(`/master/project/ot-report`, {
      ...payload.config,
      params: cleanObject(payload.params),
    })
  },
  getTotalReportOT(params: IListRequestParams, config: AxiosRequestConfig) {
    return ApiClientWithToken.get(`/ot-report/total-report`, {
      params: cleanObject(params),
      ...config,
    })
  },
  getListApprovalOT(params: IListRequestParams, config: AxiosRequestConfig) {
    return ApiClientWithToken.get(`/ot-report/approval-report`, {
      params: cleanObject(params),
      ...config,
    })
  },
  getListCustomerSatisfaction(
    params: ICustomerSatisfactionParams,
    config: AxiosRequestConfig
  ) {
    return ApiClientWithToken.get(`/test/test/test`, {
      params: cleanObject(params),
      ...config,
    })
  },
  deleteProject(id: string) {
    return ApiClientWithToken.delete(`/projects/${id}`)
  },

  deleteReportOT(id: string[]) {
    return ApiClientWithToken.delete(`/ot-report/${id}`)
  },

  createNewProject(payload: any) {
    return ApiClientWithToken.post(`/projects`, payload)
  },
  projectGeneralValidate(payload: any) {
    return ApiClientWithToken.post(`/projects/validate-field`, payload)
  },

  getProjectCosts({ projectId, params }: any) {
    const queryString = queryStringParam(params)
    const url = `/projects/${projectId}/cost${
      queryString ? `?${queryString}` : ''
    }`
    return ApiClientWithToken.get(url)
  },

  createProjectCost({
    projectId,
    formData,
  }: {
    projectId: string
    formData: FormData
  }) {
    return ApiClientFormFile.post(`/projects/${projectId}/cost`, formData)
  },

  getProjectCostDetail({
    projectId,
    costId,
  }: {
    projectId: string
    costId: string
  }) {
    return ApiClientWithToken.get(`/projects/${projectId}/cost/${costId}`)
  },

  getListOTReportProject() {
    return ApiClientWithToken.get(`/ot-report/approval-report/projects`)
  },

  updateProjectCost({ projectId, id, data }: ProjectPayload) {
    return ApiClientWithToken.put(`/projects/${projectId}/cost/${id}`, data)
  },
  updateReportOT({ id, data }: IUpdateReportOT) {
    return ApiClientWithToken.put(`/ot-report/${id}`, data)
  },
  uploadFileProjectCost({
    projectId,
    costId,
    formData,
  }: {
    projectId: string
    costId: string
    formData: FormData
  }) {
    return ApiClientFormFile.put(
      `/projects/${projectId}/cost/${costId}/uploadFile`,
      formData
    )
  },

  deleteProjectCost({ projectId, ids }: any) {
    return ApiClientWithToken.delete(`/projects/${projectId}/cost/${ids}`)
  },

  getProjectGeneral(projectId: string) {
    return ApiClientWithToken.get(`/projects/${projectId}/general`)
  },

  updateProjectGeneral({
    projectId,
    data,
  }: {
    projectId: string
    data: ProjectGeneralPayload
  }) {
    return ApiClientWithToken.put(`/projects/${projectId}/general`, data)
  },

  updateProjectHeadcount({ projectId, requestBody }: PayloadProjectHeadcount) {
    return ApiClientWithToken.put(
      `/projects/${projectId}/headcount`,
      requestBody
    )
  },

  deleteProjectHeadcount({ projectId, id, data }: ProjectPayload) {
    return ApiClientWithToken.delete(
      `/projects/${projectId}/headcount/${id}`,
      data
    )
  },

  getListProjectRevenue({ projectId, params }: any) {
    const queryString = queryStringParam(params)
    const url = `/projects/${projectId}/revenue${
      queryString ? `?${queryString}` : ''
    }`
    return ApiClientWithToken.get(url)
  },
  getProjectResourceAllocation(
    projectId: string,
    params: {
      startMonth: string
      startYear: string
      endMonth: string
      endYear: string
    },
    config: AxiosRequestConfig
  ) {
    const queryString = queryStringParam(params)
    return ApiClientWithToken.get(
      `/projects/${projectId}/resource-allocation/summary${
        queryString ? `?${queryString}` : ''
      }`,
      {
        ...config,
      }
    )
  },
  createProjectRevenue({
    projectId,
    formData,
  }: {
    projectId: string
    formData: any
  }) {
    return ApiClientFormFile.post(`/projects/${projectId}/revenue`, formData)
  },

  projectRevenueUpdateFile({
    projectId,
    revenueId,
    formData,
  }: {
    projectId: string
    revenueId: string
    formData: any
  }) {
    return ApiClientFormFile.put(
      `/projects/${projectId}/revenue/${revenueId}/uploadFile`,
      formData
    )
  },

  getProjectRevenueById({
    projectId,
    revenueId,
  }: {
    projectId: string
    revenueId: string
  }) {
    return ApiClientWithToken.get(`/projects/${projectId}/revenue/${revenueId}`)
  },

  updateProjectRevenue({ projectId, id, data }: ProjectPayload) {
    return ApiClientWithToken.put(`/projects/${projectId}/revenue/${id}`, data)
  },

  deleteProjectRevenue({ projectId, ids }: any) {
    return ApiClientWithToken.delete(`/projects/${projectId}/revenue/${ids}`)
  },

  getProjectHeadcount(projectId: string) {
    return ApiClientWithToken.get(`/projects/${projectId}/headcount`)
  },

  getProjectAssignment({ projectId, params = {} }: PayloadListProject) {
    const queryString = queryStringParam(params)
    return ApiClientWithToken.get(
      `/projects/${projectId}/assignment?` + queryString
    )
  },

  getProjectStatistics(queryString: string) {
    return ApiClientWithToken.get(`/dashboards/project` + queryString)
  },

  getProjectListActualEffort(projectId: string, params: ActualEffortQuery) {
    return ApiClientWithToken.get(
      `/projects/${projectId}/headcount/actual-effort`,
      {
        params: cleanObject(params),
      }
    )
  },

  getProjectResourceAllocationActualEffort(
    projectId: string,
    params: ActualEffortQueryRA
  ) {
    return ApiClientWithToken.get(
      `/projects/${projectId}/resource-allocation/actual-effort`,
      {
        params: cleanObject(params),
      }
    )
  },

  getTimesheet(
    projectId: string,
    params: {
      year: string
      month: string
    },
    config: AxiosRequestConfig
  ) {
    const queryString = queryStringParam(params)
    return ApiClientWithToken.get(
      `/projects/${projectId}/timesheet-ot${
        queryString ? `?${queryString}` : ''
      }`,
      {
        ...config,
      }
    )
  },

  getProjectTime(projectId: string) {
    return ApiClientWithToken.get(`/projects/${projectId}/time`)
  },

  getListIds(queryParameters: IListProjectsParams) {
    return ApiClientWithToken.get('/projects/id', {
      params: cleanObject(queryParameters),
    })
  },
  getListReportIds(queryParameters: IReportOTTimesheetParams) {
    return ApiClientWithToken.get('ot-report/ids', {
      params: cleanObject(queryParameters),
    })
  },
  getListReportApprovalIds(queryParameters: IReportOTTimesheetParams) {
    return ApiClientWithToken.get('ot-report/ids', {
      params: cleanObject(queryParameters),
    })
  },
  getProjectManaged() {
    return ApiClientWithToken.get('/projects/managed')
  },

  getProjectDivisionStaff(divisionId: string) {
    return ApiClientWithToken.get(`/staffs/division/${divisionId}`)
  },

  getRequestOT(id: string) {
    return ApiClientWithToken.get(`/ot-request/${id}`)
  },

  getProjectStaff(params: any) {
    const queryString = queryStringParam(params)
    return ApiClientWithToken.get(
      `/projects/${params.projectId}/project-member${
        queryString ? `?${queryString}` : ''
      }`
    )
  },
  createOTRequest(data: OTRequest) {
    return ApiClientWithToken.post(`/ot-request`, data)
  },
  createOTReport(data: OTReport) {
    return ApiClientWithToken.post(`/ot-report`, data)
  },
  updateOTRequest(id: number, data: OTRequest) {
    return ApiClientWithToken.put(`/ot-request/${id}`, data)
  },
  updateOTRequestStatus({
    id,
    reasonReject,
    status,
  }: {
    id: number
    reasonReject?: string
    status: number
  }) {
    return ApiClientWithToken.put(`/ot-request/${id}/status`, {
      reasonReject,
      status,
    })
  },
  updateOTReportStatus({
    ids,
    reasonReject,
    status,
  }: {
    ids: string[]
    reasonReject?: string
    status: number
  }) {
    return ApiClientWithToken.put(`/ot-report/status`, {
      ids,
      reasonReject,
      status,
    })
  },

  exportListToExcel(requestBody: IExportListToExcelBody) {
    return ApiClientWithToken.post('/projects/export', requestBody)
  },
  exportListTimeSheetToExcel(payload: any) {
    const projectId: any = payload.projectId
    const month: any = payload.month
    const year: any = payload.year
    return ApiClientWithToken.get(
      `/projects/${projectId}/time-sheet/download?month=${month}&year=${year}`
    )
  },

  createShareEffort(payload: {
    projectId: string
    requestBody: CreateShareEffortRequestBodyItem[]
  }) {
    return ApiClientWithToken.post(
      `/projects/${payload.projectId}/resource-allocation/shareEffort`,
      payload.requestBody
    )
  },

  getShareEffortList(payload: { projectId: string }) {
    return ApiClientWithToken.get(
      `/projects/${payload.projectId}/resource-allocation/shareEffort`
    )
  },

  deleteShareEffort(payload: { projectId: string; shareEffortId: number }) {
    return ApiClientWithToken.delete(
      `/projects/${payload.projectId}/resource-allocation/shareEffort/${payload.shareEffortId}`
    )
  },

  getDetailShareMonthList(payload: {
    projectId: string
    shareEffortId: number
  }) {
    return ApiClientWithToken.get(
      `/projects/${payload.projectId}/resource-allocation/shareEffort/${payload.shareEffortId}`
    )
  },

  updateDetailShareMonthList(payload: {
    projectId: string
    shareEffortId: number
    requestBody: { month: number; year: number; shareBMM: number }[]
  }) {
    return ApiClientWithToken.put(
      `/projects/${payload.projectId}/resource-allocation/shareEffort/${payload.shareEffortId}`,
      payload.requestBody
    )
  },

  assignNewStaff(payload: {
    projectId: string
    requestBody: {
      staffId: number
      assignment: {
        endDate: number
        headcount: number
        note: string
        role: string
        startDate: number
      }[]
    }[]
  }) {
    return ApiClientWithToken.post(
      `/projects/${payload.projectId}/assignment`,
      payload.requestBody
    )
  },

  getStaffAssignmentDetails(payload: {
    projectId: string
    projectStaffId: number
  }) {
    return ApiClientWithToken.get(
      `/projects/${payload.projectId}/assignment/${payload.projectStaffId}`
    )
  },

  updateAssignment(payload: {
    projectId: string
    projectStaffHeadcountId: number
    projectStaffId: number
    requestBody: {
      endDate: number
      headcount: number
      note: string
      role: string
      startDate: number
    }
  }) {
    return ApiClientWithToken.put(
      `/projects/${payload.projectId}/assignment/${payload.projectStaffId}/detail/${payload.projectStaffHeadcountId}`,
      payload.requestBody
    )
  },

  deleteStaffAssignment(payload: {
    projectId: string
    projectStaffId: number
  }) {
    return ApiClientWithToken.delete(
      `/projects/${payload.projectId}/assignment/${payload.projectStaffId}`
    )
  },

  deleteAssignmentHeadcount(payload: {
    projectId: string
    projectStaffHeadcountId: number
    projectStaffId: number
  }) {
    return ApiClientWithToken.delete(
      `/projects/${payload.projectId}/assignment/${payload.projectStaffId}/detail/${payload.projectStaffHeadcountId}`
    )
  },

  getHistoryStaffAssignment(payload: {
    projectId: string
    queryParameters: Pagination
  }) {
    return ApiClientWithToken.get(
      `/projects/${payload.projectId}/assignment/history`,
      {
        params: cleanObject(payload.queryParameters),
      }
    )
  },

  getPermissionResourceAllocation(payload: { projectId: string }) {
    return ApiClientWithToken.get(
      `/projects/permission-resource-allocation/${payload.projectId}`
    )
  },

  getProcessGraph(
    projectId: string,
    params: IProcessQueryApi,
    config: AxiosRequestConfig
  ) {
    const queryString = queryStringParam(params)
    return ApiClientWithToken.get(
      `projects/${projectId}/process/graph${
        queryString ? `?${queryString}` : ''
      }`,
      {
        ...config,
      }
    )
  },
  getProcessList(
    projectId: string,
    params: IProcessQueryApi,
    config: AxiosRequestConfig
  ) {
    const queryString = queryStringParam(params)
    return ApiClientWithToken.get(
      `projects/${projectId}/process/list${
        queryString ? `?${queryString}` : ''
      }`,
      {
        ...config,
      }
    )
  },
  getProcessAveragePoints(
    projectId: string,
    params: IProcessQueryApi,
    config: AxiosRequestConfig
  ) {
    const queryString = queryStringParam(params)
    return ApiClientWithToken.get(
      `projects/${projectId}/process/average-point${
        queryString ? `?${queryString}` : ''
      }`,
      {
        ...config,
      }
    )
  },
  createNewProcess(projectId: string, payload: any) {
    return ApiClientWithToken.post(`/projects/${projectId}/process`, payload)
  },
  updateProcess(projectId: string, processId: string, payload: any) {
    return ApiClientWithToken.put(
      `/projects/${projectId}/process/${processId}`,
      payload
    )
  },
  deleteProcess(projectId: string, processId: string) {
    return ApiClientWithToken.delete(
      `/projects/${projectId}/process/${processId}`
    )
  },
  createEvaluateProject(payload: {
    projectId: string
    requestBody: {
      evaluationMonth: number
      totalPoint: number
      question: any[]
    }
  }) {
    return ApiClientWithToken.post(
      `/projects/${payload.projectId}/bonus-and-penalty/evaluate`,
      payload.requestBody
    )
  },
  getNameCustomerComplaintProject(projectId: string) {
    return ApiClientWithToken.get(
      `/projects/${projectId}/bonus-and-penalty/name-customer-complaint`
    )
  },
  getOverallDelivery(payload: {
    projectId: string
    queryParameters: {
      startMonth: number
      startYear: number
      endMonth: number
      endYear: number
      pageSize: number
      pageNum: number
    }
  }) {
    return ApiClientWithToken.get(
      `/projects/${payload.projectId}/milestone/timeliness`,
      {
        params: cleanObject(payload.queryParameters),
      }
    )
  },
  createMilestone(payload: {
    projectId: string
    requestBody: {
      actualDeliveryDate: number | null
      addedDate: number
      commitmentDeliveryDate: number
      description: string
      name: string
      status: number
      limitation?: string | null
      milestoneDecision?: boolean | null
      deliver?: number
    }
  }) {
    return ApiClientWithToken.post(
      `/projects/${payload.projectId}/milestone`,
      payload.requestBody
    )
  },
  getListProjectsMilestone(payload: {
    projectId: string
    queryParameters: any
    config: AxiosRequestConfig
  }) {
    return ApiClientWithToken.get(
      `/projects/${payload.projectId}/milestone/list`,
      {
        ...payload.config,
        params: cleanObject(payload.queryParameters),
      }
    )
  },
  deleteMilestone(payload: { projectId: string; milestoneId: number }) {
    return ApiClientWithToken.delete(
      `/projects/${payload.projectId}/milestone/${payload.milestoneId}`
    )
  },
  deliverMilestone(payload: {
    projectId: string
    milestoneId: number
    request: {
      actualDeliveryDate: number | null
      addedDate: number
      commitmentDeliveryDate: number
      description: string
      name: string
      status: number
      limitation?: string | null
      milestoneDecision: boolean | null
      deliver: 1 | 2
    }
  }) {
    return ApiClientWithToken.post(
      `/projects/${payload.projectId}/milestone/deliver/${payload.milestoneId}`,
      payload.request
    )
  },
  updateMilestone(payload: {
    projectId: string
    milestoneId: number
    requestBody: {
      actualDeliveryDate: number | null
      addedDate: number
      commitmentDeliveryDate: number
      description: string
      name: string
      status: number
      limitation?: string | null
      milestoneDecision?: boolean | null
      deliver?: number
    }
  }) {
    return ApiClientWithToken.put(
      `/projects/${payload.projectId}/milestone/${payload.milestoneId}`,
      payload.requestBody
    )
  },
  getDeliveryActivityLog(payload: { projectId: string; queryParameters: any }) {
    return ApiClientWithToken.get(
      `/projects/${payload.projectId}/milestone/activity-log`,
      {
        params: cleanObject(payload.queryParameters),
      }
    )
  },
  getEffortEfficiency(payload: { projectId: string; queryParameters: any }) {
    return ApiClientWithToken.get(
      `/projects/${payload.projectId}/cost/effort-efficiency`,
      {
        params: cleanObject(payload.queryParameters),
      }
    )
  },
  createSurvey(payload: { projectId: string; requestBody: any }) {
    return ApiClientWithToken.post(
      `/projects/${payload.projectId}/survey`,
      payload.requestBody
    )
  },
  getListSurvey(payload: {
    projectId: string
    queryParameters: any
    config: AxiosRequestConfig
  }) {
    return ApiClientWithToken.get(
      `/projects/${payload.projectId}/survey/customer-satisfaction`,
      {
        params: cleanObject(payload.queryParameters),
        ...payload.config,
      }
    )
  },
  getAveragePointSurvey(payload: {
    projectId: string
    queryParameters: any
    config: AxiosRequestConfig
  }) {
    return ApiClientWithToken.get(
      `/projects/${payload.projectId}/survey/average-points`,
      {
        params: cleanObject(payload.queryParameters),
        ...payload.config,
      }
    )
  },
  deleteSurvey(payload: { projectId: string; surveyId: number }) {
    return ApiClientWithToken.delete(
      `/projects/${payload.projectId}/survey/${payload.surveyId}`
    )
  },
  getSurveyDetails(payload: { projectId: string; surveyId: number }) {
    return ApiClientWithToken.get(
      `/projects/${payload.projectId}/survey/${payload.surveyId}/details`
    )
  },
  getSurveyResult(payload: { projectId: string; surveyId: number }) {
    return ApiClientWithToken.get(
      `/projects/${payload.projectId}/survey/${payload.surveyId}/result`
    )
  },
  getAllSurveyNames(projectId: string) {
    return ApiClientWithToken.get(`/projects/${projectId}/survey/name`)
  },
  updateSurvey(payload: {
    projectId: string
    surveyId: number
    requestBody: any
  }) {
    return ApiClientWithToken.put(
      `/projects/${payload.projectId}/survey/${payload.surveyId}`,
      payload.requestBody
    )
  },
  getQualityRate(payload: { projectId: string; queryParameters: any }) {
    return ApiClientWithToken.get(
      `/projects/${payload.projectId}/quality/rate`,
      {
        params: cleanObject(payload.queryParameters),
      }
    )
  },
  getKPISummary(payload: { projectId: string; queryParameters: any }) {
    return ApiClientWithToken.get(
      `/projects/${payload.projectId}/kpi-summary`,
      {
        params: payload.queryParameters,
      }
    )
  },
  getPermissionProjectKPI(projectId: string) {
    return ApiClientWithToken.get(`/projects/${projectId}/permission-kpi`)
  },
  getOverallEvaluationBonusAndPenalty(payload: {
    projectId: string
    queryParameters: any
  }) {
    return ApiClientWithToken.get(
      `/projects/${payload.projectId}/bonus-and-penalty/overall-evaluation`,
      {
        params: payload.queryParameters,
      }
    )
  },
  getEvaluationMonthBonusAndPenaltyProject(payload: {
    projectId: string
    evaluateId: number
  }) {
    return ApiClientWithToken.get(
      `/projects/${payload.projectId}/bonus-and-penalty/${payload.evaluateId}/evaluation-month`
    )
  },
  getViewCustomerComplaints(payload: {
    projectId: string
    evaluateId: number
    queryParameters: any
  }) {
    return ApiClientWithToken.get(
      `/projects/${payload.projectId}/bonus-and-penalty/${payload.evaluateId}/view-list-customer-complaint`,
      {
        params: payload.queryParameters,
      }
    )
  },
  deleteCustomerComplaint(payload: {
    projectId: string
    evaluateId: number
    complaintId: number
  }) {
    return ApiClientWithToken.delete(
      `/projects/${payload.projectId}/bonus-and-penalty/${payload.evaluateId}/customer-complaint-detail/${payload.complaintId}`
    )
  },
  getCustomerComplaintDetail(payload: {
    projectId: string
    evaluateId: number
    complaintId: number
  }) {
    return ApiClientWithToken.get(
      `/projects/${payload.projectId}/bonus-and-penalty/${payload.evaluateId}/customer-complaint-detail/${payload.complaintId}`
    )
  },
  updateCustomerComplaint(payload: {
    projectId: string
    evaluateId: number
    complaintId: number
    requestBody: any
  }) {
    return ApiClientWithToken.put(
      `/projects/${payload.projectId}/bonus-and-penalty/${payload.evaluateId}/customer-complaint-detail/${payload.complaintId}`,
      payload.requestBody
    )
  },
  getDetailEvaluationMonth(payload: {
    projectId: string
    month: number
    year: number
  }) {
    return ApiClientWithToken.get(
      `/projects/${payload.projectId}/bonus-and-penalty/evaluate/by-month?month=${payload.month}&year=${payload.year}`
    )
  },
  deleteEvaluateProject(payload: { projectId: string; evaluateId: number }) {
    return ApiClientWithToken.delete(
      `/projects/${payload.projectId}/bonus-and-penalty/evaluate/${payload.evaluateId}`
    )
  },
  updateEvaluateProject(payload: {
    projectId: string
    evaluateId: number
    requestBody: any
  }) {
    return ApiClientWithToken.put(
      `/projects/${payload.projectId}/bonus-and-penalty/evaluate/${payload.evaluateId}`,
      payload.requestBody
    )
  },
  getSummaryProjectDashboard(payload: {
    projectId: string
    queryParameters: any
  }) {
    return ApiClientWithToken.get(`/projects/${payload.projectId}/dashboard`, {
      params: payload.queryParameters,
    })
  },
  getQualityOverall(projectId: string, categoryRate: number) {
    return ApiClientWithToken.get(
      `/projects/${projectId}/quality/overall-rate?categoryRate=${categoryRate}`
    )
  },
  getOverallEffortEfficiency(projectId: string) {
    return ApiClientWithToken.get(
      `/projects/${projectId}/cost/overall-effort-efficiency`
    )
  },
  getProjectActivityLog(
    payload: { projectId: string; queryParameters: any },
    config: AxiosRequestConfig
  ) {
    return ApiClientWithToken.get(
      `/projects/${payload.projectId}/activity-log/activity-log`,
      {
        params: cleanObject(payload.queryParameters),
        ...config,
      }
    )
  },
  exportKPI(payload: { requestBody: any }) {
    return ApiClientWithToken.post(`/projects/export-kpi`, payload.requestBody)
  },
}
export type OTRequest = {
  divisionDirector: any
  endDate: number
  hours?: number
  members: number[]
  projectId: number
  reason?: string
  startDate: number
}
type ReportOT = {
  projectId: string | number
  otDate: number | undefined
  otFrom: string
  otTo: string
  reason: string
  hours: number
  otRequestId?: string
}
export type OTReport = {
  reportDate: number | undefined
  reports: any
}
export type ProjectPayload = {
  projectId: string
  id: string
  data?: any
}
export type IUpdateOTReport = ReportOT & { otRequestId: string }
export type IUpdateReportOT = {
  id: string
  data: IUpdateOTReport
}

export type PayloadProjectHeadcount = {
  projectId: string
  requestBody: {
    billableEffort: HeadcountOfYear[]
    shareEffort: {
      divisionId: string | number
      effort: HeadcountOfYear[]
    }[]
    totalContractEffort: number
    totalShareEffort: number
  }
}

export type PayloadProjectStaffHeadcount = {
  projectId: string
  id?: string
  data: {
    staffId?: string
    startDate: number
    endDate: number
    headcount: number
  }
}

export type PayloadListProject = {
  params?: IListProjectsParams
  projectId: string
}

export interface CustomerComplaintQueries extends Pagination {
  complaintDateFrom: any
  complaintDateTo: any
  complaintLevel: string
}

export interface ActualEffortQuery {
  year: number | null
  divisionId?: string
  unitOfTime: string
  pageNum: number
  pageSize: number
}

import ApiClientWithToken from '@/api/api'
import { IFeedBack } from '@/components/modal/ModalFeedBack'
import { IParamsGrade } from '@/modules/staff/types'
import {
  IQueries,
  IQueriesStaffAssignCycle,
  IQueriesStaffManager,
} from '@/types'
import { cleanObject, queryStringParam } from '@/utils'
import { AxiosRequestConfig } from 'axios'
import QueryString from 'query-string'

export default {
  getBranchList({
    useAllBranches,
    moduleConstant,
    subModuleConstant,
    isListProject,
  }: {
    useAllBranches: boolean
    moduleConstant: number
    subModuleConstant: number
    isListProject?: boolean
  }) {
    return ApiClientWithToken.get(
      isListProject
        ? 'master/branch-filter-project'
        : useAllBranches
        ? '/master/all-branches'
        : `/master/branches?module=${moduleConstant}&subModule=${subModuleConstant}`
    )
  },
  getBranchListFilterProject() {
    return ApiClientWithToken.get('master/branch-filter-project')
  },
  getBranchDashboardList({
    moduleConstant,
    subModuleConstant,
  }: {
    moduleConstant: number
    subModuleConstant: number
  }) {
    return ApiClientWithToken.get(
      `/master/dashboard/branches?module=${moduleConstant}&subModule=${subModuleConstant}`
    )
  },
  getContractGroups() {
    return ApiClientWithToken.get('/master/contract-group')
  },
  getContractTypes() {
    return ApiClientWithToken.get('/master/contract-type')
  },
  getDivisions(moduleConstant: number, subModuleConstant: number) {
    return ApiClientWithToken.get(
      `/master/divisions?module=${moduleConstant}&subModule=${subModuleConstant}`
    )
  },
  getDivisionsDashboard(moduleConstant: number, subModuleConstant: number) {
    return ApiClientWithToken.get(
      `/master/dashboard/divisions?module=${moduleConstant}&subModule=${subModuleConstant}`
    )
  },
  getDivisionsFilterByProject() {
    return ApiClientWithToken.get(`master/division-filter-project`)
  },
  getWorkTypeMbo(isMasterData: boolean, evaluationCycleId: string) {
    if (isMasterData) {
      return ApiClientWithToken.get('/master/work-type')
    }
    return ApiClientWithToken.get(
      `/evaluation-cycle/${evaluationCycleId}/work-type`
    )
  },
  getPriorities() {
    return ApiClientWithToken.get('/master/priorities')
  },
  getSkillSets() {
    return ApiClientWithToken.get('/master/skill-sets')
  },
  getStatus() {
    return ApiClientWithToken.get('/master/status')
  },
  getPositions() {
    return ApiClientWithToken.get('/master/positions')
  },
  getMarkets() {
    return ApiClientWithToken.get('/master/markets')
  },
  getCurrencies() {
    return ApiClientWithToken.get('/master/currency')
  },
  getProvinces() {
    return ApiClientWithToken.get('/master/provinces')
  },
  getGrades(params: IParamsGrade) {
    const queryString = queryStringParam(params)
    const url = `/master/grades${queryString ? `?${queryString}` : ''}`
    return ApiClientWithToken.get(url)
  },
  getLeaderGrades(params: IParamsGrade) {
    const queryString = queryStringParam(params)
    const url = `/master/leader_grades${queryString ? `?${queryString}` : ''}`
    return ApiClientWithToken.get(url)
  },
  getStaffContactPerson(payload: { branchId: string; moduleConstant: number }) {
    return ApiClientWithToken.get(
      `/master/contact-person/${payload.branchId}/${payload.moduleConstant}`
    )
  },
  sendFeedback(payload: IFeedBack) {
    return ApiClientWithToken.post('/support/feedback', payload)
  },
  notification(payload: Notification) {
    ApiClientWithToken.post('/fire-base', payload)
  },
  getCommonStaffs(params: any, config: AxiosRequestConfig) {
    const queryString = queryStringParam(params)
    const url = `/master/staffs-project${queryString ? `?${queryString}` : ''}`
    return ApiClientWithToken.get(url, config)
  },
  getStaffsHeadCount(params: any, config: AxiosRequestConfig) {
    const queryString = queryStringParam(params)
    const url = `/master/staffs-headcount${
      queryString ? `?${queryString}` : ''
    }`
    return ApiClientWithToken.get(url, config)
  },
  getStaffsAssignment(params: any, config: AxiosRequestConfig) {
    const queryString = queryStringParam(params)
    const url = `/master/project/staff-assignment${
      queryString ? `?${queryString}` : ''
    }`
    return ApiClientWithToken.get(url, config)
  },
  getCommonApproverStaffs(params: any, config: AxiosRequestConfig) {
    const queryString = queryStringParam(params)
    const url = `master/approver-staffs${queryString ? `?${queryString}` : ''}`
    return ApiClientWithToken.get(url, config)
  },
  getCommonPartners(params: any) {
    const queryString = queryStringParam(params)
    const url = `/master/partners${queryString ? `?${queryString}` : ''}`
    return ApiClientWithToken.get(url)
  },
  getOutsourcePartners(params: any) {
    const queryString = queryStringParam(params)
    const url = `/master/partners-outsource${
      queryString ? `?${queryString}` : ''
    }`
    return ApiClientWithToken.get(url)
  },
  getCommonCustomers(params: any, config: AxiosRequestConfig) {
    const queryString = queryStringParam(params)
    const url = `/master/customers${queryString ? `?${queryString}` : ''}`
    return ApiClientWithToken.get(url, config)
  },
  getOutsourceCustomers(params: any) {
    const queryString = queryStringParam(params)
    const url = `/master/customers-outsource${
      queryString ? `?${queryString}` : ''
    }`
    return ApiClientWithToken.get(url)
  },

  getProjectManagers(params: any, config: AxiosRequestConfig) {
    const queryString = queryStringParam(params)
    const url = `/master/project-manager${queryString ? `?${queryString}` : ''}`
    return ApiClientWithToken.get(url, config)
  },
  getProjects(params: any, config: AxiosRequestConfig) {
    const queryString = queryStringParam(params)
    const url = `/master/projects${queryString ? `?${queryString}` : ''}`
    return ApiClientWithToken.get(url, config)
  },
  getStaffsProject(params: any, config: AxiosRequestConfig) {
    const queryString = queryStringParam(params)
    const url = `/master/staffs-project${queryString ? `?${queryString}` : ''}`
    return ApiClientWithToken.get(url, config)
  },
  getDirectManager(params: any, config: AxiosRequestConfig) {
    const queryString = queryStringParam(params)
    const url = `/master/direct-manager${queryString ? `?${queryString}` : ''}`
    return ApiClientWithToken.get(url, config)
  },
  getStaffShareEffort(params: any, config: AxiosRequestConfig) {
    const queryString = queryStringParam(params)
    const url = `/master/project/staff-share-effort${
      queryString ? `?${queryString}` : ''
    }`
    return ApiClientWithToken.get(url, config)
  },
  getDivisionDirector(params: any) {
    const queryString = queryStringParam(params)
    const url = `/staffs/division/${params.divisionId}${
      queryString ? `?${queryString}` : ''
    }`
    return ApiClientWithToken.get(url)
  },
  getProjectCode(customerId: string) {
    const queryString = queryStringParam({
      customerId: customerId,
    })
    return ApiClientWithToken.get(
      `/master/project-code${queryString ? `?${queryString}` : ''}`
    )
  },
  getSaleMemberProject(params: any, config: AxiosRequestConfig) {
    const queryString = queryStringParam(params)
    const url = `/master/sale-member-project${
      queryString ? `?${queryString}` : ''
    }`
    return ApiClientWithToken.get(url, config)
  },
  getProjectStaffs(reportDate: number) {
    return ApiClientWithToken.get(
      `/master/project-staff?reportDate=${reportDate}`
    )
  },
  getProjectManagerStaffs(
    queries: IQueriesStaffManager,
    config: AxiosRequestConfig
  ) {
    const queryString = QueryString.stringify(cleanObject(queries))
    const url = `/master/project-manager/staffs${
      queryString ? `?${queryString}` : ''
    }`
    return ApiClientWithToken.get(url, config)
  },
  getContractCodes({
    customerId,
    projectId,
  }: {
    customerId: string | number
    projectId: string | number
  }) {
    return ApiClientWithToken.get(`/master/customer/${customerId}/contracts`, {
      params: cleanObject({
        projectId,
        sortBy: 'code',
        orderBy: 'asc',
      }),
    })
  },
  getProjectContractCodes(queryParameters: {
    branchId: string | number
    group: string | number
  }) {
    const url = `/master/contracts/project`
    return ApiClientWithToken.get(url, {
      params: queryParameters,
    })
  },
  getContractByGroup(payload: {
    group: string | number
    branchId: string | number
  }) {
    const url = `/master/contract/group/${payload.group}/${payload.branchId}`
    return ApiClientWithToken.get(url)
  },
  deleteFile(id: string) {
    return ApiClientWithToken.delete(`/support/delete-file/${id}`)
  },
  getNotificationsForUser(queries: IQueries) {
    return ApiClientWithToken.get(`/notifications`, {
      params: cleanObject(queries),
    })
  },
  getNumberOfNotification() {
    return ApiClientWithToken.get(`/notifications/number`)
  },
  readNotify(id: string | number) {
    return ApiClientWithToken.put(`/notifications/${id}`)
  },
  getPositionBranch() {
    return ApiClientWithToken.get('/master/position-branch')
  },
  getStaffAssignEvaluationCycle(
    queries: IQueriesStaffAssignCycle,
    config: AxiosRequestConfig
  ) {
    return ApiClientWithToken.get(
      `master/staffs/assign-evaluation-cycle/${queries.templateId}`,
      {
        params: cleanObject({
          name: queries?.name,
          positionId: queries?.positionId,
        }),
        ...config,
      }
    )
  },
  getProjectsEvaluationCycle(queryParameters: { evaluationCycleId: string }) {
    return ApiClientWithToken.get('/master/projects-evaluation-cycle', {
      params: queryParameters,
    })
  },
  getEmployeesEvaluation(payload: { projectId: string }) {
    return ApiClientWithToken.get('/master/employees/staffs', {
      params: cleanObject(payload),
    })
  },
  getWorkingDay(payload: { startDate: number; endDate: number }) {
    return ApiClientWithToken.get('/master/working-days', {
      params: cleanObject(payload),
    })
  },
  validateProjectOTReport(payload: { otDate: number; projectId: string }) {
    return ApiClientWithToken.get(`/master/validate/ot-report/ot-date`, {
      params: payload,
    })
  },
  getPersonInChargeProject(payload: {
    projectId: string
    keyword?: string
    config: AxiosRequestConfig
  }) {
    return ApiClientWithToken.get(
      `/master/project/complaint/person-in-charge/${payload.projectId}`,
      {
        params: cleanObject({
          keyword: payload.keyword || null,
        }),
        ...payload.config,
      }
    )
  },
  getMilestoneProject(projectId: string) {
    return ApiClientWithToken.get(
      `/master/project/${projectId}/delivery/milestone`
    )
  },
  getPersonActivityLogMilestoneProject(projectId: string) {
    return ApiClientWithToken.get(
      `/master/project/${projectId}/delivery/person`
    )
  },
  getProjectSurveyQuestions(surveyType: number) {
    return ApiClientWithToken.get(
      `/master/project/survey/category-question/${surveyType}`
    )
  },
  getMorRepresentative(payload: {
    projectId: string
    keyword?: string
    config: AxiosRequestConfig
  }) {
    return ApiClientWithToken.get(
      `/master/project/${payload.projectId}/survey/mor-representative`,
      {
        params: cleanObject({
          keyword: payload.keyword || null,
        }),
        ...payload.config,
      }
    )
  },
  getMemberProject(payload: {
    projectId: string
    keyword?: string
    config: AxiosRequestConfig
  }) {
    return ApiClientWithToken.get(
      `/master/project/${payload.projectId}/survey/member-project`,
      {
        params: cleanObject({
          keyword: payload.keyword || null,
        }),
        ...payload.config,
      }
    )
  },
  getAllDivisions() {
    return ApiClientWithToken.get('/master/all-divisions')
  },
  getDivisionsShareEffort() {
    return ApiClientWithToken.get('/master/project/division-share-effort')
  },
  getMasterQuestionProject() {
    return ApiClientWithToken.get('/master/project/evaluate-question-project')
  },
  getSystemDashboardDivisions() {
    return ApiClientWithToken.get('/master/dashboard-allocation/divisions')
  },
  getDivisionsExportKPI() {
    return ApiClientWithToken.get('/master/division-filter-export-kpi-project')
  },
}

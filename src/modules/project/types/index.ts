import {
  Branch,
  Division,
  FileItem,
  IDivision,
  IPosition,
  ISkillSet,
  MasterCommonType,
  OptionItem,
  Pagination,
  RangeDate,
} from '@/types'
import { CancelTokenSource } from 'axios'

export type IListProjectsParams = {
  divisionIds?: any
  customerIds?: any
  status?: any
  productType?: any
  keyword?: string
  pageNum?: number
  pageSize?: number
  startDateFrom?: null | Date
  startDateTo?: null | Date
  endDateFrom?: null | Date
  endDateTo?: null | Date
  sortBy?: string
  orderBy?: 'desc' | 'asc'
}
export type IListRequestParams = {
  branchId?: string
  pageSize?: number
  divisionId?: string
  projectId?: any
  pageNum?: number
  requestStartDateFrom?: null | Date
  requestStartDateTo?: null | Date
  requestEndDateFrom?: null | Date
  requestEndDateTo?: null | Date
  requestStatus?: any
  effectStatus?: any
  sortBy?: string
  keyword?: string
  orderBy?: 'desc' | 'asc'
}
export type IRequestOTTimesheetParams = {
  pageNum?: number
  pageSize?: number
  sortBy?: string
  keyword?: string
  orderBy?: 'desc' | 'asc'
  status?: any
  startDate?: any
  endDate?: any
  otDateFrom?: any
  otDateTo?: any
}
export type IReportOTTimesheetParams = {
  pageNum?: number
  pageSize?: number
  sortBy?: string
  keyword?: string
  orderBy?: 'desc' | 'asc'
  status?: any
  otDateFrom?: any
  otDateTo?: any
  project?: any
  myOT?: boolean
}
export interface IProcessQueriesState {
  endWeek: number
  endYear: number
  orderBy?: string
  pageNum: number
  pageSize: number
  sortBy?: string
  startWeek: number
  startYear: number
}
export type IProcessQueryApi = {
  orderBy?: string
  pageNum?: number
  pageSize?: number
  sortBy?: string
  startWeek?: string
  endWeek?: string
}
export type ICustomerSatisfactionParams = {
  pageNum?: number
  pageSize?: number
  sortBy?: string
  keyword?: string
  orderBy?: 'desc' | 'asc'
  from?: any
  to?: any
}
export interface ProjectState {
  processList: any[]
  totalProcessList: number
  approvalOTList: any[]
  processGraph: any
  processAveragePoints: any
  customerSatisfactionList: any[]
  approvalOTTimesheetQueryParameters: IReportOTTimesheetParams
  customerSatisfactionQueryParameters: ICustomerSatisfactionParams
  listCheckedReportOT: string[]
  listCheckedReportOTTemp: string[]
  isCheckAllReportOT: boolean
  isListReportOTFetching: boolean
  totalReportOT: any
  listCheckedApprovalOT: string[]
  listCheckedApprovalOTTemp: string[]
  isCheckAllApprovalOT: boolean
  projectList: any[]
  requestOTList: any[]
  reportOTList: any[]
  isListRequestOTFetching: boolean
  projectsTotalElements: number
  requestOTTotalElements: number
  reportOTTotalElements: number
  approvalOTTotalElements: number
  isListApprovalOTFetching: boolean
  customerSatisfactionTotalElements: number
  isListCustomerSatisfactionFetching: boolean
  activeStep: number
  generalInfo: IGeneralProjectState
  generalInfoFormik: IGeneralProjectState
  contractHeadcount: IContractHeadCountResponse[]
  assignHeadcounts: IAssignHeadCountResponse[]
  assignStaffs: any
  contractHeadcountInitial: IContractHeadCountRequest[]
  totalProjectCost: number
  pageProjectCost: number
  pageProjectRevenue: number
  totalMoneyCost: number
  totalExpectedMoneyCost: number
  totalActualRevenue: number | string
  totalExpectedRevenue: number | string
  projectCostDetail: any
  isRollbackGeneralChangeDate: boolean
  isRollbackGeneralStep: boolean
  isTotalContractHeadcountChange: boolean
  listStepHadFillData: number[]
  dashboardState: IProjectDashboard
  assignedStaffs: IStaffDashboard[]
  availableStaffs: IStaffDashboard[]
  isTotalAssignEffortError: boolean
  isListFetching: boolean
  cancelGetProjectList: CancelTokenSource | null
  cancelGetRequestOTList: CancelTokenSource | null
  cancelGetTimesheet: CancelTokenSource | null
  cancelGetReportOTList: CancelTokenSource | null
  cancelGetProjectReportOTList: CancelTokenSource | null
  setCancelGetReportOTTotal: CancelTokenSource | null
  cancelProjectResourceAllocation: CancelTokenSource | null
  cancelProcessGraph: CancelTokenSource | null
  cancelProcessList: CancelTokenSource | null
  cancelProcessAveragePoints: CancelTokenSource | null
  cancelGetApprovalOTList: CancelTokenSource | null
  cancelGetCustomerSatisfationList: CancelTokenSource | null
  projectQueryParameters: IListProjectsParams
  requestOTQueryParameters: IListRequestParams
  requestOTTimesheetQueryParameters: IRequestOTTimesheetParams
  reportOTTimesheetQueryParameters: IReportOTTimesheetParams
  assignEfforts: IAssignHeadCountResponse[]
  actualEfforts: IAssignHeadCountResponse[]
  shareEffort: IAssignHeadCountResponse[]
  totalStaffAssignment: number
  listCheckedRequestOT: string[]
  isCheckAllRequestOT: boolean
  listChecked: string[]
  isCheckAll: boolean
  invoices: FileItem[]
  viewOutsourceCostInfo: boolean
  updateOutsourceCostInfo: boolean
  viewDivisionCostInfo: boolean
  updateDivisionCostInfo: boolean
  viewHeadcountInfo: boolean
  updateProjectHeadcount: boolean
  viewGeneralInfo: boolean
  updateGeneralInfo: boolean
  updateProjectHeadcountContractEffort: boolean
  viewProjectRevenueInfo: boolean
  updateProjectRevenueInfo: boolean
  viewDivisionRevenueInfo: boolean
  updateDivisionRevenueInfo: boolean
  loaded: boolean
  isLoadingHeadCount: boolean
  projectManaged: any[]
  divisionStaff: OptionItem[]
  queryStaffAssignment: Pagination
  projectDashboardScreenDetail:
    | 'KPI_INFORMATION'
    | 'RESOURCE_ALLOCATION'
    | 'COST_AND_REVENUE'
    | 'KPI_INFORMATION_TABLE'
    | ''
  shareEffortList: ShareEffortListItem[]
  totalShareBMMOfProject: number
  permissionResourceAllocation: {
    updateBillableEffort?: boolean
    updateShareEffort?: boolean
    updateStaffAssignment?: boolean
    viewActualEffort?: boolean
    viewAllocationSummary?: boolean
    viewGeneralStaffAssignment?: boolean
    viewHistoryStaff?: boolean
    viewShareEffortList?: boolean
  }
  listProjectOtRequest: OptionItem[]
  customerComplaintState: {
    data: any[]
    totalElements: number
    loading: boolean
    queryParameters: Pagination
  }
  nameCustomerComplaintProject: {
    id: number
    name: string
  }[]
  cancelGetListSurvey: CancelTokenSource | null
  cancelGetAveragePointsSurvey: CancelTokenSource | null
  nameSurveyProject: {
    id: number
    name: string
  }[]
  permissionProjectKPI: {
    costEffortEfficiency?: boolean
    customerComplaintCreate?: boolean
    customerComplaintDelete?: boolean
    customerComplaintDetail?: boolean
    customerComplaintResolve?: boolean
    customerComplaintSummary?: boolean
    customerComplaintUpdate?: boolean
    deliveryMilestoneCreate?: boolean
    deliveryMilestoneDelete?: boolean
    deliveryMilestoneUpdate?: boolean
    deliveryViewActivityLog?: boolean
    deliveryViewTimeliness?: boolean
    plusAndMinusEditEvaluation?: boolean
    plusAndMinusViewOverallEvaluation?: boolean
    processCreate?: boolean
    processDelete?: boolean
    processUpdate?: boolean
    processView?: boolean
    summaryResultCreate?: boolean
    summaryResultDelete?: boolean
    summaryResultUpdate?: boolean
    summaryResultView?: boolean
    surveyFormCreate?: boolean
    surveyFormDelete?: boolean
    surveyFormUpdate?: boolean
    useDeliveryDeliverMilestone?: boolean
    viewBugRate?: boolean
    viewKPISummary?: boolean
    viewLeakageRate?: boolean
    viewSurveySummary?: boolean
    summaryCopyURL?: boolean
    exportKpi?: boolean
  }
  cancelMilestone: CancelTokenSource | null
  overallEvaluationBonusAndPenalty: {
    id: number
    month: string
    point: number
  }[]
  shareEffortDivision: OptionItem
  cancelProjectActivityLog: CancelTokenSource | null
  kpiDetailMenu: 'quality' | 'cost' | 'delivery' | 'process' | 'plusAndMinus'
  kpiRangeDateFilter: RangeDate
}

export interface ShareEffortListItem {
  id?: number | string
  staffId?: number | string
  branch: string
  division: string
  staffCode: string
  staffEmail: string
  staffName: string
  totalShareEffort: number
  projectShareId: number
}

export interface IStatus {
  status: string
  label: string
  type?: number
}

export interface IGeneralProjectResponse {
  branch: Branch
  customer: MasterCommonType
  divisions: IDivision[]
  endDate: Date | null
  id: string
  manager: string
  name: string
  note: string
  partner: MasterCommonType[]
  startDate: Date | null
  status: MasterCommonType
  technologies: ISkillSet[]
  type: string
}

export interface IGeneralProjectState {
  code?: string
  branchId: string
  customer: OptionItem
  divisionId: string
  endDate: Date | null
  projectManager: OptionItem
  subProjectManagers: OptionItem[]
  productType: string
  id?: string
  name: string
  note: string
  partners: OptionItem[]
  startDate: Date | null
  status: string
  technologies: OptionItem[]
  projectType: string
  description: string
  amSale: OptionItem
  subCustomer: string
  projectRank: string
  billableMM: number
  businessDomain: string
  driveLink: string
  slackLink: string
  referenceLink: string
  generateBitbucket: {
    autoGenerate: boolean
    name: string
  }
  generateGroupMail: {
    autoGenerate: boolean
    name: string
  }
  generateJira: {
    autoGenerate: boolean
    name: string
  }
  groupMail: string
  gitLink: string
  jiraLink: string
}

export interface IContractHeadCountRequest {
  headcount: string[] | number[]
  id: string
  type?: string
  year: string
}

export interface IContractHeadCountResponse {
  headcount: string[] | number[] | never[]
  id?: string
  type?: {
    id: string
    name: string
  }
  year: string
}

export interface IAssignHeadCountResponse {
  headcount: string[] | number[] | never[]
  id?: string
  type?: {
    id: string
    name: string
  }
  year: string
}

export interface IAssignStaffState {
  id?: string
  staffId: string
  staffName: string
  branch: Branch
  division: IDivision
  position: IPosition
  assignStartDate: Date | null
  assignEndDate: Date | null
  projectHeadcount: number | string
  role: string
  staffCode?: string
  status?: string
  viewOnly?: boolean
  staffEmail?: string
  isUpdateStaff?: boolean
}

export interface IStaffDashboard {
  branchName: string
  divisionName: string
  headcount: number
  staffCode: string
  staffId: string
  staffName: string
}

export interface ITotalProject {
  count: number
  percent: number
  status: {
    id: string
    name: String
  }
}

export interface ITotalStaff {
  name: string
  percent: number
  totalStaff: number
  staffs: IStaffDashboard[]
}

export interface IProjectDashboard {
  totalProject: {
    percentStatus: ITotalProject[]
    totalProject: number
  }
  totalStaff: {
    percentStaff: ITotalStaff[]
    totalStaff: number
  }
  health: {
    year: number
    contractEffort: string[]
    percentage: string[]
    staffAvailable: string[]
    totalStaff: string[]
  }
}

export interface IProjectAssignStaffResponse {
  id: number
  staffId: number
  staffCode: string
  staffName: string
  branch: Branch
  division: Division
  assignStartDate: Date | number | null
  assignEndDate: Date | number | null
  projectHeadcount: number
  role: string
  actualEffort: number[]
  position?: any
}

export interface ShareEffort {
  id?: string | number
  code: string
  staffId: number
  name: string
  email: string
  branch: {
    name: string
    id: string
  }
  division: {
    name: string
    id: string
  }
  totalShareBillableManMonth: number
  branchId?: string
  divisionId?: string
  shareMonthList: {
    id: string | number
    shareMonth: Date | number | null
    shareBillableManMonth: string | number
  }[]
}

export interface CreateShareEffortRequestBodyItem {
  listProjectShareEffortMonth: {
    month: number
    shareEffort: number
    year: number
  }[]
  staffId: number
}

export interface HeadcountOfYear {
  year: number
  headcount: number[] | string[]
}

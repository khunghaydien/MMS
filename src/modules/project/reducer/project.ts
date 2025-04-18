import { HttpStatusCode } from '@/api/types'
import { TableConstant } from '@/const'
import {
  customerSatisfactionParameters,
  initProjectQueryParameters,
  reportOTTimesheetQueryParameters,
  requestOTQueryParameters,
  requestOTTimesheetQueryParameters,
} from '@/modules/project/const'
import { RootState } from '@/store'
import { downloadFileFromByteArr } from '@/utils'
import { createSlice } from '@reduxjs/toolkit'
import {
  PROJECT_STEP,
  generalInitialState,
  initialStateDashboard,
} from '../const'
import { IProjectDashboard, ITotalStaff, ProjectState } from '../types'
import { convertProjectGeneralDataFromApi, formatPayloadCost } from '../utils'
import { Pagination } from './../../../types/index'
import {
  exportProjectList,
  exportProjectTimeSheet,
  getAllSurveyNames,
  getAveragePointsSurvey,
  getListApprovalOT,
  getListCustomerSatisfaction,
  getListIds,
  getListProjectReportOT,
  getListProjectRevenueByDivision,
  getListProjectRevenueByProject,
  getListProjects,
  getListProjectsMilestone,
  getListReportApprovalIds,
  getListReportIds,
  getListReportOT,
  getListRequestOT,
  getListSurvey,
  getNameCustomerComplaintProject,
  getPermissionProjectKPI,
  getPermissionResourceAllocation,
  getProcessAveragePoints,
  getProcessGraph,
  getProcessList,
  getProjectActivityLog,
  getProjectAssignment,
  getProjectCostDetail,
  getProjectCosts,
  getProjectDivisionStaff,
  getProjectGeneral,
  getProjectHeadcount,
  getProjectManaged,
  getProjectResourceAllocation,
  getProjectStatistics,
  getShareEffortList,
  getTimesheet,
  getTotalReportOT,
  getViewCustomerComplaints,
} from './thunk'

const initialState: ProjectState = {
  approvalOTList: [],
  approvalOTTimesheetQueryParameters: structuredClone(
    reportOTTimesheetQueryParameters
  ),
  listCheckedReportOT: [],
  listCheckedReportOTTemp: [],
  isCheckAllReportOT: false,
  requestOTList: [],
  isListApprovalOTFetching: false,
  reportOTList: [],
  isListRequestOTFetching: false,
  requestOTTotalElements: 0,
  reportOTTotalElements: 0,
  isListFetching: false,
  projectList: [],
  projectsTotalElements: 0,
  activeStep: PROJECT_STEP.GENERAL_INFORMATION,
  generalInfo: generalInitialState,
  generalInfoFormik: generalInitialState,
  contractHeadcount: [],
  assignHeadcounts: [],
  assignStaffs: [],
  contractHeadcountInitial: [],
  totalProjectCost: 0,
  pageProjectCost: 0,
  totalMoneyCost: 0,
  totalExpectedMoneyCost: 0,
  totalActualRevenue: 0,
  totalExpectedRevenue: 0,
  pageProjectRevenue: 0,
  projectCostDetail: {},
  isRollbackGeneralChangeDate: false,
  isRollbackGeneralStep: false,
  isTotalContractHeadcountChange: false,
  listStepHadFillData: [PROJECT_STEP.GENERAL_INFORMATION],
  dashboardState: initialStateDashboard,
  assignedStaffs: [],
  availableStaffs: [],
  isTotalAssignEffortError: false,
  cancelGetProjectList: null,
  cancelGetTimesheet: null,
  cancelGetRequestOTList: null,
  cancelGetReportOTList: null,
  cancelGetApprovalOTList: null,
  cancelProjectResourceAllocation: null,
  projectQueryParameters: structuredClone(initProjectQueryParameters),
  requestOTQueryParameters: structuredClone(requestOTQueryParameters),
  requestOTTimesheetQueryParameters: structuredClone(
    requestOTTimesheetQueryParameters
  ),
  reportOTTimesheetQueryParameters: structuredClone(
    reportOTTimesheetQueryParameters
  ),
  assignEfforts: [],
  actualEfforts: [],
  shareEffort: [],
  totalStaffAssignment: 0,
  listChecked: [],
  isCheckAll: false,
  invoices: [],
  viewOutsourceCostInfo: false,
  updateOutsourceCostInfo: false,
  viewDivisionCostInfo: false,
  updateDivisionCostInfo: false,
  viewProjectRevenueInfo: false,
  updateProjectRevenueInfo: false,
  viewDivisionRevenueInfo: false,
  updateDivisionRevenueInfo: false,
  viewHeadcountInfo: false,
  updateProjectHeadcount: false,
  viewGeneralInfo: false,
  updateProjectHeadcountContractEffort: false,
  updateGeneralInfo: false,
  loaded: true,
  isLoadingHeadCount: false,
  projectManaged: [],
  divisionStaff: [],
  listCheckedRequestOT: [],
  isCheckAllRequestOT: false,
  queryStaffAssignment: {
    pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
    pageSize: TableConstant.LIMIT_DEFAULT,
  },
  // @ts-ignore
  projectDashboardScreenDetail:
    sessionStorage.getItem('projectDashboardScreenDetail') ||
    'KPI_INFORMATION_TABLE',
  shareEffortList: [],
  totalShareBMMOfProject: 0,
  isListReportOTFetching: false,
  totalReportOT: null,
  approvalOTTotalElements: 0,
  listCheckedApprovalOT: [],
  listCheckedApprovalOTTemp: [],
  isCheckAllApprovalOT: false,
  setCancelGetReportOTTotal: null,
  cancelGetProjectReportOTList: null,
  permissionResourceAllocation: {},
  listProjectOtRequest: [],
  customerSatisfactionQueryParameters: structuredClone(
    customerSatisfactionParameters
  ),
  customerSatisfactionList: [],
  cancelGetCustomerSatisfationList: null,
  customerSatisfactionTotalElements: 0,
  isListCustomerSatisfactionFetching: false,
  cancelProcessGraph: null,
  cancelProcessList: null,
  cancelProcessAveragePoints: null,
  processGraph: undefined,
  processList: [],
  totalProcessList: 0,
  processAveragePoints: undefined,
  customerComplaintState: {
    loading: false,
    data: [],
    totalElements: 0,
    queryParameters: {
      pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
      pageSize: TableConstant.LIMIT_DEFAULT,
    } as Pagination,
  },
  nameCustomerComplaintProject: [],
  nameSurveyProject: [],
  cancelGetListSurvey: null,
  cancelGetAveragePointsSurvey: null,
  permissionProjectKPI: {},
  cancelMilestone: null,
  overallEvaluationBonusAndPenalty: [],
  shareEffortDivision: {},
  cancelProjectActivityLog: null,
  // @ts-ignore
  kpiDetailMenu: sessionStorage.getItem('kpiDetailMenu') || 'quality',
  kpiRangeDateFilter: {
    startDate: null,
    endDate: null,
  },
}

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setInitialProject: () => initialState,
    setActiveStep(state, { payload }) {
      //handle Save oldStep
      if (
        payload === PROJECT_STEP.GENERAL_INFORMATION &&
        state.activeStep === PROJECT_STEP.HEAD_COUNT
      ) {
        state.isRollbackGeneralStep = true
      }

      // handle Save list Step had fill data
      const _listStepHadFillData = JSON.parse(
        JSON.stringify(state.listStepHadFillData)
      )
      if (!_listStepHadFillData.includes(payload)) {
        _listStepHadFillData.push(payload)
      }
      // handle setGeneralFormik when unmount component step 1
      if (state.activeStep === PROJECT_STEP.GENERAL_INFORMATION) {
        state.generalInfoFormik = state.generalInfo
      }

      state.listStepHadFillData = _listStepHadFillData
      state.activeStep = payload
    },
    setGeneralInfo(state, action) {
      state.generalInfo = action.payload
    },
    setContractHeadcount(state, action) {
      state.contractHeadcount = action.payload
    },
    setAssignHeadcounts(state, action) {
      state.assignHeadcounts = action.payload
    },
    setAssignStaff(state, action) {
      state.assignStaffs = action.payload
    },
    resetProjectDataStep(state, action) {
      state.activeStep = PROJECT_STEP.GENERAL_INFORMATION
      state.generalInfo = generalInitialState
      state.generalInfoFormik = generalInitialState
      state.contractHeadcount = []
      state.contractHeadcountInitial = []
      // state.projectCosts = []
      // state.projectRevenuesByProject = []
      // state.projectRevenuesByDivision = []
      state.assignStaffs = []
      state.listStepHadFillData = [PROJECT_STEP.GENERAL_INFORMATION]
      state.shareEffortList = []
      state.assignEfforts = []
      state.actualEfforts = []
      state.shareEffort = []
      state.customerComplaintState = {
        data: [],
        totalElements: 0,
        loading: false,
        queryParameters: {
          pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
          pageSize: TableConstant.LIMIT_DEFAULT,
        },
      }
    },
    setIsRollbackGeneralChangeDate(state, action) {
      state.isRollbackGeneralChangeDate = action.payload
    },
    setIsTotalContractHeadcountChange(state, action) {
      state.isTotalContractHeadcountChange = action.payload
    },
    setCancelGetProjectList(state, { payload }) {
      state.cancelGetProjectList = payload
    },
    setCancelGetTimesheet(state, { payload }) {
      state.cancelGetTimesheet = payload
    },
    setProjectResourceAllocation(state, { payload }) {
      state.cancelProjectResourceAllocation = payload
    },
    setProjectProcessGraph(state, { payload }) {
      state.cancelProcessGraph = payload
    },
    setProjectProcessList(state, { payload }) {
      state.cancelProcessList = payload
    },
    setProjectProcessAveragePoints(state, { payload }) {
      state.cancelProcessAveragePoints = payload
    },
    setCancelGetRequestOTList(state, { payload }) {
      state.cancelGetRequestOTList = payload
    },
    setCancelGetReportOTList(state, { payload }) {
      state.cancelGetReportOTList = payload
    },
    setCancelGetProjectReportOTList(state, { payload }) {
      state.cancelGetProjectReportOTList = payload
    },
    setCancelGetReportOTTotal(state, { payload }) {
      state.setCancelGetReportOTTotal = payload
    },
    setCancelGetApprovalOTList(state, { payload }) {
      state.cancelGetApprovalOTList = payload
    },
    setCancelGetCustomerSatisfationList(state, { payload }) {
      state.cancelGetCustomerSatisfationList = payload
    },
    setCustomerSatisfactionQueryParameters(state, { payload }) {
      state.customerSatisfactionQueryParameters = payload
    },
    setProjectQueryParameters(state, { payload }) {
      state.projectQueryParameters = payload
    },
    setRequestOTQueryParameters(state, { payload }) {
      state.requestOTQueryParameters = payload
    },
    setRequestOTTimesheetQueryParameters(state, { payload }) {
      state.requestOTTimesheetQueryParameters = payload
    },
    setReportOTTimesheetQueryParameters(state, { payload }) {
      state.reportOTTimesheetQueryParameters = payload
    },
    setApprovalOTTimesheetQueryParameters(state, { payload }) {
      state.approvalOTTimesheetQueryParameters = payload
    },
    setListChecked(state, { payload }) {
      state.listChecked = payload
    },
    setIsCheckAll(state, { payload }) {
      state.isCheckAll = payload
    },
    setListCheckedReportOT(state, { payload }) {
      state.listCheckedReportOT = payload
    },
    setIsCheckAllReportOT(state, { payload }) {
      state.isCheckAllReportOT = payload
    },
    setListCheckedApprovalOT(state, { payload }) {
      state.listCheckedApprovalOT = payload
    },
    setIsCheckAllApprovalOT(state, { payload }) {
      state.isCheckAllApprovalOT = payload
    },
    setListCheckedRequestOT(state, { payload }) {
      state.listCheckedRequestOT = payload
    },
    setIsCheckAllRequestOT(state, { payload }) {
      state.isCheckAllRequestOT = payload
    },
    setInvoices(state, { payload }) {
      state.invoices = payload
    },
    resetProjectCostDetail(state) {
      state.projectCostDetail = {}
    },
    setQueryStaffAssignment(state, { payload }) {
      state.queryStaffAssignment = payload
    },
    setProjectDashboardScreenDetail(state, { payload }) {
      state.projectDashboardScreenDetail = payload
    },
    setIsListFetching(state, { payload }) {
      state.isListFetching = payload
    },
    setIsListRequestOTFetching(state, { payload }) {
      state.isListRequestOTFetching = payload
    },
    setCancelGetListSurvey(state, { payload }) {
      state.cancelGetListSurvey = payload
    },
    setCancelGetAveragePointsSurvey(state, { payload }) {
      state.cancelGetAveragePointsSurvey = payload
    },
    setCancelMilestone(state, { payload }) {
      state.cancelMilestone = payload
    },
    setCustomerComplaintState(state, { payload }) {
      state.customerComplaintState = payload
    },
    setShareEffortDivision(state, { payload }) {
      state.shareEffortDivision = payload
    },
    setCancelProjectActivityLog(state, { payload }) {
      state.cancelProjectActivityLog = payload
    },
    setKpiDetailMenu(state, { payload }) {
      state.kpiDetailMenu = payload
    },
    setKpiRangeDateFilter(state, { payload }) {
      state.kpiRangeDateFilter = payload
    },
  },
  extraReducers: builder => {
    // getListProjects
    builder.addCase(getListProjects.pending, state => {
      state.isListFetching = true
      if (state.cancelGetProjectList) {
        state.cancelGetProjectList.cancel()
      }
      state.projectList = []
      state.projectsTotalElements = 0
    })
    builder.addCase(getTimesheet.pending, state => {
      if (state.cancelGetTimesheet) {
        state.cancelGetTimesheet.cancel()
      }
    })
    builder.addCase(getProjectResourceAllocation.pending, state => {
      if (state.cancelProjectResourceAllocation) {
        state.cancelProjectResourceAllocation.cancel()
      }
    })
    builder.addCase(getListProjects.fulfilled, (state, { payload }) => {
      state.isListFetching = false
      let { data, status } = payload
      if (status === HttpStatusCode.OK) {
        state.projectList = data?.content
        state.projectsTotalElements = data?.totalElements
      }
    })
    builder.addCase(getListProjects.rejected, (state, action) => {
      state.isListFetching = false
    })
    //get list request ot
    builder.addCase(getListRequestOT.pending, state => {
      state.isListRequestOTFetching = true
      if (state.cancelGetRequestOTList) {
        state.cancelGetRequestOTList.cancel()
      }
    })
    builder.addCase(getListRequestOT.fulfilled, (state, { payload }) => {
      state.isListRequestOTFetching = false
      let { data, status } = payload
      if (status === HttpStatusCode.OK) {
        state.requestOTList = data?.content
        state.requestOTTotalElements = data?.totalElements
      }
    })
    builder.addCase(getListRequestOT.rejected, (state, action) => {
      state.isListRequestOTFetching = false
    })
    builder.addCase(getListReportOT.pending, state => {
      state.isListReportOTFetching = true
      if (state.cancelGetReportOTList) {
        state.cancelGetReportOTList.cancel()
      }
    })

    builder.addCase(getListReportOT.fulfilled, (state, { payload }) => {
      state.isListReportOTFetching = false
      let { data, status } = payload
      if (status === HttpStatusCode.OK) {
        state.reportOTList = data?.content
        state.reportOTTotalElements = data?.totalElements
      }
    })
    builder.addCase(getListReportOT.rejected, (state, action) => {
      state.isListReportOTFetching = false
    })

    builder.addCase(getListCustomerSatisfaction.pending, state => {
      state.isListCustomerSatisfactionFetching = true
      if (state.cancelGetCustomerSatisfationList) {
        state.cancelGetCustomerSatisfationList.cancel()
      }
    })

    builder.addCase(
      getListCustomerSatisfaction.fulfilled,
      (state, { payload }) => {
        state.isListCustomerSatisfactionFetching = false
        let { data, status } = payload
        if (status === HttpStatusCode.OK) {
          state.customerSatisfactionList = data?.content
          state.customerSatisfactionTotalElements = data?.totalElements
        }
      }
    )

    builder.addCase(getListCustomerSatisfaction.rejected, (state, action) => {
      state.isListCustomerSatisfactionFetching = false
    })

    builder.addCase(getListApprovalOT.pending, state => {
      state.isListApprovalOTFetching = true
      if (state.cancelGetApprovalOTList) {
        state.cancelGetApprovalOTList.cancel()
      }
    })

    builder.addCase(getListApprovalOT.fulfilled, (state, { payload }) => {
      state.isListApprovalOTFetching = false
      let { data, status } = payload
      if (status === HttpStatusCode.OK) {
        state.approvalOTList = data?.content
        state.approvalOTTotalElements = data?.totalElements
      }
    })
    builder.addCase(getListApprovalOT.rejected, (state, action) => {
      state.isListApprovalOTFetching = false
    })
    builder.addCase(getTotalReportOT.fulfilled, (state, { payload }) => {
      let { data, status } = payload
      if (status === HttpStatusCode.OK) {
        state.totalReportOT = data
      }
    })
    // getProjectDetailCost
    builder.addCase(getProjectCosts.fulfilled, (state, { payload }) => {
      let { data, status } = payload
      if (status === HttpStatusCode.OK) {
        // state.projectCosts = data.content.map(formatPayloadCost)
        state.totalProjectCost = data.totalElements
        state.pageProjectCost = data.currentPage
        state.totalMoneyCost = data.totalProject.totalActual
        state.totalExpectedMoneyCost = data.totalProject.totalExpected
      }
    })
    builder.addCase(getProjectManaged.fulfilled, (state, { payload }) => {
      let { data, status } = payload
      if (status === HttpStatusCode.OK) {
        state.projectManaged = data.content
      }
    })
    builder.addCase(getProjectDivisionStaff.fulfilled, (state, { payload }) => {
      let { data, status } = payload
      if (status === HttpStatusCode.OK) {
        state.divisionStaff = data.content
      }
    })
    // getListProjectCostDetail
    builder.addCase(getProjectCostDetail.fulfilled, (state, { payload }) => {
      let { data, status } = payload
      if (status === HttpStatusCode.OK) {
        state.projectCostDetail = formatPayloadCost(data)
      }
    })
    // getListProjectRevenueByDivision
    builder.addCase(
      getListProjectRevenueByDivision.fulfilled,
      (state, { payload }) => {
        let { data, status } = payload
        if (status === HttpStatusCode.OK) {
          // state.projectRevenuesByDivision =
          //   data.content?.map(formatPayloadRevenue)
          state.pageProjectRevenue = data.currentPage
          state.totalActualRevenue = data.totalProject?.totalActual
          state.totalExpectedRevenue = data.totalProject?.totalExpected
        }
      }
    )
    // getListProjectRevenueByProject
    builder.addCase(
      getListProjectRevenueByProject.fulfilled,
      (state, { payload }) => {
        let { data, status } = payload
        if (status === HttpStatusCode.OK) {
          // state.projectRevenuesByProject =
          //   data.content?.map(formatPayloadRevenue)
          state.pageProjectRevenue = data.currentPage
          state.totalActualRevenue = data.totalProject?.totalActual
          state.totalExpectedRevenue = data.totalProject?.totalExpected
        }
      }
    )
    // getListProjectHeadcount
    builder.addCase(getProjectHeadcount.fulfilled, (state, { payload }) => {
      let {
        data: { contractEffort, assignEffort, actualEffort, shareEffort },
      } = payload

      state.contractHeadcount = contractEffort
      state.contractHeadcountInitial = contractEffort
      state.assignEfforts = assignEffort
      state.actualEfforts = actualEffort
      state.shareEffort = shareEffort?.[0]?.effort || []
      state.shareEffortDivision = shareEffort?.[0]?.division || {}
      state.isLoadingHeadCount = false
    })
    builder.addCase(getProjectHeadcount.pending, state => {
      state.isLoadingHeadCount = true
    })
    builder.addCase(getProjectGeneral.fulfilled, (state, { payload }) => {
      const { data } = payload
      state.generalInfo = convertProjectGeneralDataFromApi(data)
      state.generalInfoFormik = convertProjectGeneralDataFromApi(data)

      state.viewGeneralInfo = data.viewGeneralInfo
      state.updateGeneralInfo = data.updateGeneralInfo
      state.viewOutsourceCostInfo = data.viewOutsourceCostInfo
      state.updateOutsourceCostInfo = data.updateOutsourceCostInfo
      state.viewDivisionCostInfo = data.viewDivisionCostInfo
      state.updateDivisionCostInfo = data.updateDivisionCostInfo
      state.viewProjectRevenueInfo = data.viewProjectRevenueInfo
      state.updateProjectRevenueInfo = data.updateProjectRevenueInfo
      state.viewDivisionRevenueInfo = data.viewDivisionRevenueInfo
      state.updateDivisionRevenueInfo = data.updateDivisionRevenueInfo
      state.viewHeadcountInfo = data.viewHeadcountInfo
      state.updateProjectHeadcount = data.updateProjectHeadcount
      state.updateProjectHeadcountContractEffort =
        data.updateProjectHeadcountContractEffort
      state.loaded = true
    })
    builder.addCase(getProjectGeneral.pending, state => {
      state.loaded = false
    })
    builder.addCase(getProjectAssignment.fulfilled, (state, { payload }) => {
      const { data } = payload
      state.assignStaffs = data.content
      state.totalStaffAssignment = data.totalElements
    })
    builder.addCase(getProjectStatistics.fulfilled, (state, { payload }) => {
      const { data }: { data: IProjectDashboard } = payload
      state.dashboardState = data || null

      if (!data?.totalStaff?.percentStaff) return
      data?.totalStaff?.percentStaff?.forEach((item: ITotalStaff) => {
        if (item.name === 'Assigned') {
          state.assignedStaffs = item.staffs
        } else if (item.name === 'Available') {
          state.availableStaffs = item.staffs
        }
      })
    })
    builder.addCase(getListIds.fulfilled, (state, { payload }) => {
      if (payload.data) {
        state.listChecked = payload.data
      }
    })
    builder.addCase(getListReportIds.fulfilled, (state, { payload }) => {
      if (payload.data) {
        state.listCheckedReportOT = payload.data
        state.listCheckedReportOTTemp = payload.data
      }
    })
    builder.addCase(
      getListReportApprovalIds.fulfilled,
      (state, { payload }) => {
        if (payload.data) {
          state.listCheckedApprovalOT = payload.data
          state.listCheckedApprovalOTTemp = payload.data
        }
      }
    )
    builder.addCase(exportProjectList.fulfilled, (_, { payload }) => {
      const { data } = payload
      downloadFileFromByteArr(data)
    })
    builder.addCase(exportProjectTimeSheet.fulfilled, (_, { payload }) => {
      const { data } = payload
      downloadFileFromByteArr(data)
    })
    builder.addCase(getShareEffortList.fulfilled, (state, { payload }) => {
      const { data } = payload
      if (data) {
        state.shareEffortList = data.content
        state.totalShareBMMOfProject = data.totalShareEffort || 0
      }
    })
    builder.addCase(getProcessGraph.fulfilled, (state, { payload }) => {
      const { data } = payload
      if (data) {
        state.processGraph = data
      }
    })
    builder.addCase(getProcessGraph.pending, state => {
      if (state.cancelProcessGraph) {
        state.cancelProcessGraph.cancel()
      }
    })
    builder.addCase(getProcessList.fulfilled, (state, { payload }) => {
      const { data } = payload
      if (data) {
        state.processList = data.content
        state.totalProcessList = data.totalElements
      }
    })
    builder.addCase(getProcessAveragePoints.fulfilled, (state, { payload }) => {
      const { data } = payload
      if (data) {
        state.processAveragePoints = data
      }
    })
    builder.addCase(getProcessList.pending, state => {
      if (state.cancelProcessList) {
        state.cancelProcessList.cancel()
      }
    })
    builder.addCase(getProcessAveragePoints.pending, state => {
      if (state.cancelProcessAveragePoints) {
        state.cancelProcessAveragePoints.cancel()
      }
    })
    builder.addCase(
      getPermissionResourceAllocation.fulfilled,
      (state, { payload }) => {
        const { data } = payload
        if (data) {
          state.permissionResourceAllocation = data
        }
      }
    )

    builder.addCase(getListProjectReportOT.fulfilled, (state, { payload }) => {
      const { data } = payload
      state.listProjectOtRequest = data.map((item: any) => ({
        id: item.project.id,
        value: item.project.id,
        label: item.project.name,
        requestId: item.requestId,
        uuid: item.requestId,
        code: item.project.code,
      }))
    })

    builder.addCase(
      getNameCustomerComplaintProject.fulfilled,
      (state, { payload }) => {
        const { data } = payload
        state.nameCustomerComplaintProject = data.map(
          (item: { id: string; name: string }) => ({
            id: +item.id,
            name: item.name,
          })
        )
      }
    )

    builder.addCase(getAllSurveyNames.fulfilled, (state, { payload }) => {
      const { data } = payload
      state.nameSurveyProject = data.map(
        (item: { id: string; name: string }) => ({
          id: +item.id,
          name: item.name,
        })
      )
    })

    builder.addCase(getListSurvey.pending, state => {
      if (state.cancelGetListSurvey) {
        state.cancelGetListSurvey.cancel()
      }
    })

    builder.addCase(getAveragePointsSurvey.pending, state => {
      if (state.cancelGetAveragePointsSurvey) {
        state.cancelGetAveragePointsSurvey.cancel()
      }
    })

    builder.addCase(getPermissionProjectKPI.fulfilled, (state, { payload }) => {
      const { data } = payload
      if (data) {
        state.permissionProjectKPI = data
      }
    })

    builder.addCase(getListProjectsMilestone.pending, state => {
      if (state.cancelMilestone) {
        state.cancelMilestone.cancel()
      }
    })

    builder.addCase(getViewCustomerComplaints.pending, state => {
      state.customerComplaintState = {
        ...state.customerComplaintState,
        loading: true,
        data: [],
        totalElements: 0,
      }
    })

    builder.addCase(
      getViewCustomerComplaints.fulfilled,
      (state, { payload }) => {
        state.customerComplaintState = {
          ...state.customerComplaintState,
          loading: false,
          data: payload.data.content,
          totalElements: payload.data.totalElements,
        }
      }
    )

    builder.addCase(getViewCustomerComplaints.rejected, state => {
      state.customerComplaintState = {
        ...state.customerComplaintState,
        loading: false,
      }
    })

    builder.addCase(getProjectActivityLog.pending, state => {
      if (state.cancelProjectActivityLog) {
        state.cancelProjectActivityLog.cancel()
      }
    })
  },
})

export const {
  setInitialProject,
  setActiveStep,
  setGeneralInfo,
  setAssignStaff,
  setContractHeadcount,
  resetProjectDataStep,
  setIsRollbackGeneralChangeDate,
  setProjectResourceAllocation,
  setProjectProcessGraph,
  setProjectProcessList,
  setProjectProcessAveragePoints,
  setIsTotalContractHeadcountChange,
  setAssignHeadcounts,
  setCancelGetProjectList,
  setCancelGetTimesheet,
  setCancelGetRequestOTList,
  setCancelGetReportOTTotal,
  setCancelGetReportOTList,
  setCancelGetProjectReportOTList,
  setCancelGetApprovalOTList,
  setCancelGetCustomerSatisfationList,
  setProjectQueryParameters,
  setRequestOTQueryParameters,
  setRequestOTTimesheetQueryParameters,
  setReportOTTimesheetQueryParameters,
  setApprovalOTTimesheetQueryParameters,
  setCustomerSatisfactionQueryParameters,
  setListChecked,
  setIsCheckAll,
  setListCheckedRequestOT,
  setIsCheckAllRequestOT,
  setInvoices,
  resetProjectCostDetail,
  setQueryStaffAssignment,
  setProjectDashboardScreenDetail,
  setListCheckedReportOT,
  setIsCheckAllReportOT,
  setListCheckedApprovalOT,
  setIsCheckAllApprovalOT,
  setIsListFetching,
  setIsListRequestOTFetching,
  setCancelGetListSurvey,
  setCancelGetAveragePointsSurvey,
  setCancelMilestone,
  setCustomerComplaintState,
  setShareEffortDivision,
  setCancelProjectActivityLog,
  setKpiDetailMenu,
  setKpiRangeDateFilter,
} = projectSlice.actions

export const projectSelector = (state: RootState) => state['project']

export default projectSlice.reducer

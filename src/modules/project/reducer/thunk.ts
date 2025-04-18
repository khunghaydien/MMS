import {
  alertError,
  alertSuccess,
  commonErrorAlert,
  updateLoading,
} from '@/reducer/screen'
import { IExportListToExcelBody } from '@/types'
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import i18next from 'i18next'
import { ProjectGeneralPayload } from '../pages/project-create/ProjectCreate'
import { ProjectService } from '../services'
import {
  PayloadListProject,
  PayloadProjectHeadcount,
} from '../services/project.service'
import {
  CreateShareEffortRequestBodyItem,
  IListProjectsParams,
  IProcessQueryApi,
  IReportOTTimesheetParams,
} from '../types'
import {
  setCancelGetApprovalOTList,
  setCancelGetAveragePointsSurvey,
  setCancelGetListSurvey,
  setCancelGetProjectList,
  setCancelGetProjectReportOTList,
  setCancelGetReportOTList,
  setCancelGetReportOTTotal,
  setCancelGetRequestOTList,
  setCancelGetTimesheet,
  setCancelMilestone,
  setCancelProjectActivityLog,
  setProjectProcessAveragePoints,
  setProjectProcessGraph,
  setProjectProcessList,
  setProjectResourceAllocation,
} from './project'

export const getListIds = createAsyncThunk(
  'project/getListIds',
  async (
    queryParameters: IListProjectsParams,
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await ProjectService.getListIds(queryParameters)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)
export const getListReportIds = createAsyncThunk(
  'project/getListReportIds',
  async (
    queryParameters: IReportOTTimesheetParams,
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await ProjectService.getListReportIds(queryParameters)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)
export const getListReportApprovalIds = createAsyncThunk(
  'project/getListReportApprovalIds',
  async (
    queryParameters: IReportOTTimesheetParams,
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await ProjectService.getListReportApprovalIds(queryParameters)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)
export const getProjectManaged = createAsyncThunk(
  'project/getProjectManaged',
  async (_, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await ProjectService.getProjectManaged()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const getProjectDivisionStaff = createAsyncThunk(
  'common/getProjectDivisionStaff',
  async (params: any, { rejectWithValue, dispatch }) => {
    try {
      const res = await ProjectService.getProjectDivisionStaff(params)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
    }
  }
)
export const getRequestOT = createAsyncThunk(
  'common/getProjectDivisionStaff',
  async (params: any, { rejectWithValue, dispatch }) => {
    try {
      const res = await ProjectService.getRequestOT(params)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
    }
  }
)
export const updateOTRequest = createAsyncThunk(
  'project/updateOTRequest',
  async (
    payload: {
      id: number
      data: any
    },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await ProjectService.updateOTRequest(payload.id, payload.data)
      dispatch(
        alertSuccess({
          message: res?.message,
        })
      )
      return res
    } catch (err: any) {
      if (!!err?.length && err[0]?.field?.includes('status')) {
        dispatch(
          alertError({
            message: err[0]?.message,
          })
        )
      }
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const updateOTRequestStatus = createAsyncThunk(
  'project/updateOTRequestStatus',
  async (
    payload: {
      id: number
      reasonReject?: string
      status: number
    },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await ProjectService.updateOTRequestStatus(payload)
      if (payload.status === 2) {
        dispatch(
          alertSuccess({
            message: i18next.t('project:MSG_APPROVE_REQUEST_OT_SUCCESS'),
          })
        )
      }
      if (payload.status === 3) {
        dispatch(
          alertSuccess({
            message: i18next.t('project:MSG_REJECT_REQUEST_OT_SUCCESS'),
          })
        )
      }
      return res
    } catch (err: any) {
      if (!!err?.length && err[0]?.field?.includes('status')) {
        dispatch(
          alertError({
            message: err[0]?.message,
          })
        )
      }
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)
export const updateOTReportStatus = createAsyncThunk(
  'project/updateOTReportStatus',
  async (
    payload: {
      ids: string[]
      reasonReject?: string
      status: number
    },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await ProjectService.updateOTReportStatus(payload)
      dispatch(
        alertSuccess({
          message: res.message,
        })
      )
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)
export const getProjectStaff = createAsyncThunk(
  'common/getProjectStaff',
  async (params: any, { rejectWithValue, dispatch }) => {
    try {
      const res = await ProjectService.getProjectStaff(params)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
    }
  }
)

export const getTimesheet = createAsyncThunk(
  'common/getTimesheet',
  async (
    payload: {
      projectId: string
      param: {
        year: string
        month: string
      }
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelGetTimesheet(source))
      const res = await ProjectService.getTimesheet(
        payload.projectId,
        payload.param,
        {
          cancelToken: source.token,
        }
      )
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
    }
  }
)

export const getProjectResourceAllocation = createAsyncThunk(
  'common/getProjectResourceAllocation',
  async (
    payload: {
      projectId: string
      param: {
        startMonth: string
        startYear: string
        endMonth: string
        endYear: string
      }
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setProjectResourceAllocation(source))
      const res = await ProjectService.getProjectResourceAllocation(
        payload.projectId,
        payload.param,
        {
          cancelToken: source.token,
        }
      )
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
    }
  }
)

export const getProjectTime = createAsyncThunk(
  'common/getProjectTime',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const res = await ProjectService.getProjectTime(projectId)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
    }
  }
)

export const deleteProject = createAsyncThunk(
  'project/deleteProject',
  async (
    { id, code }: { id: string; code: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await ProjectService.deleteProject(id)
      dispatch(
        alertSuccess({
          message: i18next.t('project:MSG_DELETE_PROJECT_SUCCESS', {
            projectId: code,
          }),
        })
      )
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)
export const deleteReportOT = createAsyncThunk(
  'project/deleteReportOT',
  async ({ id }: { id: string[] }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(updateLoading(true))
      const res = await ProjectService.deleteReportOT(id)
      dispatch(
        alertSuccess({
          message: i18next.t('project:MSG_DELETE_REPORT_OT_SUCCESS'),
        })
      )
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const getListProjects = createAsyncThunk(
  'project/getListProjects',
  async (params: IListProjectsParams, { rejectWithValue, dispatch }) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelGetProjectList(source))
      const res = await ProjectService.getListProjects(params, {
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)
export const getListRequestOT = createAsyncThunk(
  'project/getListRequestOT',
  async (params: IListProjectsParams, { rejectWithValue, dispatch }) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelGetRequestOTList(source))
      const res = await ProjectService.getListRequestOT(params, {
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)
export const getListReportOT = createAsyncThunk(
  'project/getListReportOT',
  async (params: IListProjectsParams, { rejectWithValue, dispatch }) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelGetReportOTList(source))
      const res = await ProjectService.getListReportOT(params, {
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)
export const getListProjectReportOT = createAsyncThunk(
  'project/getListProjectReportOT',
  async ({ reportDate }: any, { rejectWithValue, dispatch }) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelGetProjectReportOTList(source))
      const res = await ProjectService.getListProjectReportOT({
        config: {
          cancelToken: source.token,
        },
        params: {
          reportDate,
        },
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getListApprovalOT = createAsyncThunk(
  'project/getListApprovalOT',
  async (params: IListProjectsParams, { rejectWithValue, dispatch }) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelGetApprovalOTList(source))
      const res = await ProjectService.getListApprovalOT(params, {
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)
export const getListCustomerSatisfaction = createAsyncThunk(
  'project/getListCustomerSatisfaction',
  async (params: IListProjectsParams, { rejectWithValue, dispatch }) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelGetApprovalOTList(source))
      const res = await ProjectService.getListCustomerSatisfaction(params, {
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getTotalReportOT = createAsyncThunk(
  'project/getTotalReportOT',
  async (params: IListProjectsParams, { rejectWithValue, dispatch }) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelGetReportOTTotal(source))
      const res = await ProjectService.getTotalReportOT(params, {
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)
export const createNewProject = createAsyncThunk(
  'project/createNewProject',
  async (requestBody: any, { rejectWithValue, dispatch }) => {
    try {
      const res = await ProjectService.createNewProject(requestBody)
      dispatch(
        alertSuccess({
          message: res.message
            ? res.message
            : i18next.t('project:MSG_CREATE_PROJECT_SUCCESS', {
                projectId: res.data?.general?.code || '',
              }),
        })
      )
      return res
    } catch (err: any) {
      if (!!err?.length) {
        const message = err?.map((item: any) => item?.message)?.join(' and ')
        dispatch(
          alertError({
            message: message,
          })
        )
      } else
        dispatch(
          alertError({
            message: i18next.t('project:MSG_CREATE_PROJECT_ERROR'),
          })
        )
      return rejectWithValue(err)
    }
  }
)
export const projectGeneralValidate = createAsyncThunk(
  'project/projectGeneralValidate',
  async (payload: any, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await ProjectService.projectGeneralValidate(
        payload.requestBody
      )
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const createOTRequest = createAsyncThunk(
  'project/createOTRequest',
  async (payload: any, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await ProjectService.createOTRequest(payload)
      dispatch(
        alertSuccess({
          message: i18next.t('project:MSG_CREATE_REQUEST_OT_SUCCESS'),
        })
      )
      return res
    } catch (err: any) {
      if (!!err?.length) {
        dispatch(
          alertError({
            message: err[0]?.message,
          })
        )
      }
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)
export const createOTReport = createAsyncThunk(
  'project/createOTReport',
  async (payload: any, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await ProjectService.createOTReport(payload)
      dispatch(
        alertSuccess({
          message: res.message,
        })
      )
      return res
    } catch (err: any) {
      dispatch(
        alertError({
          message: i18next.t('project:MSG_CREATE_REPORT_OT_ERROR'),
        })
      )
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const uploadFileProjectCost = createAsyncThunk(
  'project/uploadFileCost',
  async (
    {
      projectId,
      costId,
      invoices,
    }: { projectId: string; costId: string; invoices: File[] },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const formData = new FormData()
      invoices.forEach((file: File) => {
        formData.append('invoices', file)
      })
      const res = await ProjectService.uploadFileProjectCost({
        projectId,
        costId: costId || '',
        formData,
      })

      return res
    } catch (err: any) {
      dispatch(commonErrorAlert())
      return rejectWithValue(err)
    }
  }
)

export const getProjectCosts = createAsyncThunk(
  'project/getProjectCosts',
  async (payload: any, { rejectWithValue, dispatch }) => {
    try {
      const res = await ProjectService.getProjectCosts(payload)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getListProjectRevenueByProject = createAsyncThunk(
  'project/getListProjectRevenueByProject',
  async ({ projectId, params }: any, { rejectWithValue, dispatch }) => {
    try {
      const res = await ProjectService.getListProjectRevenue({
        projectId,
        params: { ...params, tab: 'PROJECT' },
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)
export const getListProjectRevenueByDivision = createAsyncThunk(
  'project/getListProjectRevenueByDivision',
  async ({ projectId, params }: any, { rejectWithValue, dispatch }) => {
    try {
      const res = await ProjectService.getListProjectRevenue({
        projectId,
        params: { ...params, tab: 'DIVISION' },
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const createProjectRevenue = createAsyncThunk(
  'project/createProjectRevenue',
  async (payload: any, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const formData = new FormData()
      formData.append('requestBody', JSON.stringify(payload.requestBody))
      payload.invoices.forEach((file: File) => {
        formData.append('invoices', file)
      })
      const res = await ProjectService.createProjectRevenue({
        projectId: payload.projectId,
        formData,
      })
      dispatch(
        alertSuccess({
          message: i18next.t('project:MSG_CREATE_PROJECT_REVENUE_SUCCESS', {
            projectId: res.data.id || '',
          }),
        })
      )
      return res
    } catch (err: any) {
      dispatch(
        alertError({
          message: i18next.t('project:MSG_CREATE_PROJECT_ERROR'),
        })
      )

      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const projectRevenueUpdateFile = createAsyncThunk(
  'project/projectRevenueUpdateFile',
  async (
    payload: {
      revenueId: string
      projectId: string
      invoices: File[]
    },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData()
      payload.invoices.forEach((file: File) => {
        formData.append('invoices', file)
      })
      const res = await ProjectService.projectRevenueUpdateFile({
        projectId: payload.projectId,
        revenueId: payload.revenueId,
        formData,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const createProjectCost = createAsyncThunk(
  'project/createProjectCost',
  async (
    {
      projectId,
      requestBody,
      invoices,
    }: { projectId: string; requestBody: Object; invoices: File[] },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const formData = new FormData()
      formData.append('requestBody', JSON.stringify(requestBody))
      invoices.forEach((file: File) => {
        formData.append('invoices', file)
      })
      const res = await ProjectService.createProjectCost({
        projectId,
        formData,
      })
      dispatch(
        alertSuccess({
          message: i18next.t('project:MSG_CREATE_PROJECT_COST_SUCCESS', {
            projectId: res.data?.id || '',
          }),
        })
      )
      return res
    } catch (err: any) {
      dispatch(
        alertError({
          message: i18next.t('project:MSG_CREATE_PROJECT_ERROR'),
        })
      )

      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const updateProjectGeneral = createAsyncThunk(
  'project/updateProjectGeneral',
  async (
    payload: { projectId: string; data: ProjectGeneralPayload },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await ProjectService.updateProjectGeneral(payload)
      dispatch(
        alertSuccess({
          message: i18next.t('project:MSG_UPDATE_PROJECT_INFORMATION_SUCCESS', {
            projectId: payload.data.code || '',
          }),
        })
      )
      return res
    } catch (err: any) {
      if (!!err?.length) {
        const message = err?.map((item: any) => item?.message)?.join(' and ')
        dispatch(
          alertError({
            message: message,
          })
        )
      } else dispatch(commonErrorAlert())
      return rejectWithValue(err)
    }
  }
)
///
export const updateProjectHeadcount = createAsyncThunk(
  'project/updateProjectHeadcount',
  async (payload: PayloadProjectHeadcount, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await ProjectService.updateProjectHeadcount(payload)
      return res
    } catch (err: any) {
      dispatch(commonErrorAlert())

      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)
export const getProjectRevenueById = createAsyncThunk(
  'project/getProjectRevenueById',
  async (params: any, { rejectWithValue }) => {
    try {
      const res = await ProjectService.getProjectRevenueById(params)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)
export const getProjectCostDetail = createAsyncThunk(
  'project/getProjectCostDetail',
  async (params: any, { rejectWithValue }) => {
    try {
      const res = await ProjectService.getProjectCostDetail(params)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)
export const getListOTReportProject = createAsyncThunk(
  'project/getListOTReportProject',
  async (_, { rejectWithValue }) => {
    try {
      const res = await ProjectService.getListOTReportProject()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const updateProjectRevenue = createAsyncThunk(
  'project/updateProjectRevenue',
  async (payload: any, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await ProjectService.updateProjectRevenue(payload)
      return res
    } catch (err: any) {
      dispatch(commonErrorAlert())

      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const updateProjectCost = createAsyncThunk(
  'project/updateProjectCost',
  async (
    {
      projectId,
      id,
      data,
      invoices,
    }: { projectId: string; id: string; data: any; invoices: File[] },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await ProjectService.updateProjectCost({
        projectId,
        id,
        data,
      })
      uploadFileProjectCost({
        projectId: projectId || '',
        costId: id || '',
        invoices,
      })
      return res
    } catch (err: any) {
      dispatch(commonErrorAlert())
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)
export const updateReportOT = createAsyncThunk(
  'project/updateReportOT',
  async (
    { id, data }: { id: string; data: any },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await ProjectService.updateReportOT({
        id,
        data,
      })
      dispatch(
        alertSuccess({
          message: res.message,
        })
      )
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
    }
  }
)

export const deleteProjectRevenue = createAsyncThunk(
  'project/deleteProjectRevenue',
  async (payload: any, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await ProjectService.deleteProjectRevenue(payload)
      return res
    } catch (err: any) {
      dispatch(commonErrorAlert())

      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)
export const deleteProjectCost = createAsyncThunk(
  'project/deleteProjectCost',
  async (payload: any, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await ProjectService.deleteProjectCost(payload)
      return res
    } catch (err: any) {
      dispatch(commonErrorAlert())

      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const getProjectHeadcount = createAsyncThunk(
  'project/getProjectHeadcount',
  async (payload: string, { rejectWithValue, dispatch }) => {
    try {
      const res = await ProjectService.getProjectHeadcount(payload)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
    }
  }
)

export const getProjectGeneral = createAsyncThunk(
  'project/getProjectGeneral',
  async (
    payload: {
      projectId: string
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await ProjectService.getProjectGeneral(payload.projectId)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)
export const getReportOTDetail = createAsyncThunk(
  'project/getReportOTDetail',
  async (
    payload: {
      otReportId: number
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await ProjectService.getReportOTDetail(payload)
      return res
    } catch (err: any) {
      dispatch(commonErrorAlert())
      return rejectWithValue(err)
    }
  }
)

export const getProjectAssignment = createAsyncThunk(
  'project/getProjectAssignment',
  async (payload: PayloadListProject, { rejectWithValue, dispatch }) => {
    try {
      const res = await ProjectService.getProjectAssignment(payload)
      return res
    } catch (err: any) {
      dispatch(commonErrorAlert())

      return rejectWithValue(err)
    } finally {
    }
  }
)

export const getProjectStatistics = createAsyncThunk(
  'project/getProjectStatistics',
  async (payload: string, { rejectWithValue, dispatch }) => {
    try {
      const res = await ProjectService.getProjectStatistics(payload)
      return res
    } catch (err: any) {
      dispatch(commonErrorAlert())

      return rejectWithValue(err)
    } finally {
    }
  }
)

export const exportProjectList = createAsyncThunk(
  'project/exportProjectList',
  async (payload: IExportListToExcelBody, { rejectWithValue }) => {
    try {
      const res = await ProjectService.exportListToExcel(payload)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const exportProjectTimeSheet = createAsyncThunk(
  'project/exportProjectTimeSheetList',
  async (payload: IExportListToExcelBody, { rejectWithValue }) => {
    try {
      const res = await ProjectService.exportListTimeSheetToExcel(payload)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const createShareEffort = createAsyncThunk(
  'project/createShareEffort',
  async (
    payload: {
      projectId: string
      requestBody: CreateShareEffortRequestBodyItem[]
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await ProjectService.createShareEffort(payload)
      dispatch(
        alertSuccess({
          message: i18next.t('common:MSG_ADDED', {
            labelName: i18next.t('project:TXT_SHARE_EFFORT'),
          }),
        })
      )
      return res
    } catch (err: any) {
      dispatch(
        alertError({
          message: err?.[0]?.message,
        })
      )
      return rejectWithValue(err)
    }
  }
)

export const getShareEffortList = createAsyncThunk(
  'project/getShareEffortList',
  async (
    payload: {
      projectId: string
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await ProjectService.getShareEffortList(payload)
      return res
    } catch (err: any) {
      dispatch(
        alertError({
          message: err?.[0]?.message,
        })
      )
      return rejectWithValue(err)
    }
  }
)

export const getPermissionResourceAllocation = createAsyncThunk(
  'project/getPermissionResourceAllocation',
  async (
    payload: {
      projectId: string
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await ProjectService.getPermissionResourceAllocation(payload)
      return res
    } catch (err: any) {
      dispatch(
        alertError({
          message: err?.[0]?.message,
        })
      )
      return rejectWithValue(err)
    }
  }
)
export const getProcessGraph = createAsyncThunk(
  'common/getProcessGraph',
  async (
    payload: {
      projectId: string
      params: IProcessQueryApi
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setProjectProcessGraph(source))
      const res = await ProjectService.getProcessGraph(
        payload.projectId,
        payload.params,
        {
          cancelToken: source.token,
        }
      )
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
    }
  }
)
export const getProcessList = createAsyncThunk(
  'common/getProcessList',
  async (
    payload: {
      projectId: string
      params: IProcessQueryApi
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setProjectProcessList(source))
      const res = await ProjectService.getProcessList(
        payload.projectId,
        payload.params,
        {
          cancelToken: source.token,
        }
      )
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
    }
  }
)
export const getProcessAveragePoints = createAsyncThunk(
  'common/getProcessAveragePoints',
  async (
    payload: {
      projectId: string
      params: IProcessQueryApi
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setProjectProcessAveragePoints(source))
      const res = await ProjectService.getProcessAveragePoints(
        payload.projectId,
        payload.params,
        {
          cancelToken: source.token,
        }
      )
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
    }
  }
)

export const createNewProcess = createAsyncThunk(
  'project/createNewProcess',
  async (
    payload: {
      projectId: any
      data: any
    },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await ProjectService.createNewProcess(
        payload.projectId,
        payload.data
      )
      return res
    } catch (err: any) {
      dispatch(
        alertError({
          message: err?.[0]?.message,
        })
      )
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)
export const updateProcess = createAsyncThunk(
  'project/updateProcess',
  async (
    payload: {
      projectId: any
      processId: any
      data: any
    },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await ProjectService.updateProcess(
        payload.projectId,
        payload.processId,
        payload.data
      )
      return res
    } catch (err: any) {
      dispatch(
        alertError({
          message: err?.[0]?.message,
        })
      )
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)
export const deleteProcess = createAsyncThunk(
  'project/deleteProcess',
  async (
    payload: {
      projectId: any
      processId: any
    },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await ProjectService.deleteProcess(
        payload.projectId,
        payload.processId
      )
      return res
    } catch (err: any) {
      dispatch(
        alertError({
          message: err?.[0]?.message,
        })
      )
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const getNameCustomerComplaintProject = createAsyncThunk(
  'project/getNameCustomerComplaintProject',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const res = await ProjectService.getNameCustomerComplaintProject(
        projectId
      )
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getAllSurveyNames = createAsyncThunk(
  'project/getAllSurveyNames',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const res = await ProjectService.getAllSurveyNames(projectId)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getListSurvey = createAsyncThunk(
  'project/getListSurvey',
  async (
    payload: {
      projectId: string
      queryParameters: any
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelGetListSurvey(source))
      const res = await ProjectService.getListSurvey({
        ...payload,
        config: {
          cancelToken: source.token,
        },
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getAveragePointsSurvey = createAsyncThunk(
  'project/getAveragePointsSurvey',
  async (
    payload: {
      projectId: string
      queryParameters: any
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelGetAveragePointsSurvey(source))
      const res = await ProjectService.getAveragePointSurvey({
        ...payload,
        config: {
          cancelToken: source.token,
        },
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getPermissionProjectKPI = createAsyncThunk(
  'project/getPermissionProjectKPI',
  async (projectId: string, { rejectWithValue, dispatch }) => {
    try {
      const res = await ProjectService.getPermissionProjectKPI(projectId)
      return res
    } catch (err: any) {
      dispatch(
        alertError({
          message: err?.[0]?.message,
        })
      )
      return rejectWithValue(err)
    }
  }
)

export const getListProjectsMilestone = createAsyncThunk(
  'project/getListContracts',
  async (
    payload: {
      projectId: string
      queryParameters: any
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelMilestone(source))
      const res = await ProjectService.getListProjectsMilestone({
        projectId: payload.projectId,
        queryParameters: payload.queryParameters,
        config: {
          cancelToken: source.token,
        },
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getViewCustomerComplaints = createAsyncThunk(
  'project/getViewCustomerComplaints',
  async (
    payload: {
      projectId: string
      evaluateId: number
      queryParameters: any
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await ProjectService.getViewCustomerComplaints(payload)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getProjectActivityLog = createAsyncThunk(
  'project/getProjectActivityLog',
  async (
    payload: {
      projectId: string
      queryParameters: any
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelProjectActivityLog(source))
      const res = await ProjectService.getProjectActivityLog(payload, {
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

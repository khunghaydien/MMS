import { alertError, commonErrorAlert, updateLoading } from '@/reducer/screen'
import { RootState } from '@/store'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { CancelTokenSource } from 'axios'
import dailyReportService from '../services/dailyReport.service'
import {
  IDailyReportResponse,
  IGetDailyReportParams,
  IReport,
  IReportDetailParams,
  IReportRequest,
  IStaff,
} from '../types'

export interface IDailyReport {
  responseReport: IDailyReportResponse | null
  reports: IReport[]
  currentReports: IReport[]
  staffInfo: IStaff | null
  listApplications: any[]
  cancelGetDailyReport: CancelTokenSource | null
  isOpenConfirmReport: boolean
  isApplicationLoading: boolean
  reportLists: any[]
  totalElements: number
  isOpenModalDetailDailyReport: boolean
  reportDate: number | null
  reportListDetail: any
  isViewAllDailyReport: boolean
  countReCallApiDailyReports: number
  dailyReportId: number
  cancelGetStaffListDRM: CancelTokenSource | null
  staffListDrmListChecked: string[]
  isStaffListDrmCheckAll: boolean
}

const initialState: IDailyReport = {
  responseReport: null,
  reports: [],
  staffInfo: null,
  listApplications: [],
  cancelGetDailyReport: null,
  isOpenConfirmReport: false,
  isApplicationLoading: false,
  reportLists: [],
  totalElements: 0,
  isOpenModalDetailDailyReport: false,
  reportDate: 0,
  reportListDetail: [],
  isViewAllDailyReport: false,
  countReCallApiDailyReports: 0,
  dailyReportId: 0,
  currentReports: [],
  cancelGetStaffListDRM: null,
  staffListDrmListChecked: [],
  isStaffListDrmCheckAll: false,
}

export const getDailyReports = createAsyncThunk(
  'dailyReport/getDailyReports',
  async (params: IGetDailyReportParams, { rejectWithValue, dispatch }) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelGetDailyReport(source))
      const res = await dailyReportService.getDailyReports(params, {
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
    }
  }
)

export const getCurrentDailyReports = createAsyncThunk(
  'dailyReport/getCurrentDailyReports',
  async (params: IGetDailyReportParams, { rejectWithValue, dispatch }) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelGetDailyReport(source))
      const res = await dailyReportService.getDailyReports(params, {
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
    }
  }
)

export const getDailyReportDetail = createAsyncThunk(
  'dailyReport/getDailyReportDetail',
  async (params: IReportDetailParams, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await dailyReportService.getDailyReportDetail(params)
      return res
    } catch (err: any) {
      if (err[0]?.title) {
        dispatch(
          alertError({
            message: err[0]?.title,
          })
        )
      }
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const createDailyReport = createAsyncThunk(
  'dailyReport/createDailyReport',
  async (params: IReportRequest, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await dailyReportService.createDailyReport(params)
      return res
    } catch (err: any) {
      if (err[0].field === 'Account') {
        dispatch(
          alertError({
            message: err[0]?.message || 'An error has occurred',
          })
        )
      } else {
        dispatch(commonErrorAlert())
      }

      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const updateDailyReport = createAsyncThunk(
  'dailyReport/updateDailyReport',
  async (
    params: { reportId: string; data: IReportRequest },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await dailyReportService.updateDailyReport(params)
      return res
    } catch (err: any) {
      dispatch(commonErrorAlert())
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const deleteDailyReport = createAsyncThunk(
  'dailyReport/deleteDailyReport',
  async (params: string, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await dailyReportService.deleteDailyReport(params)
      return res
    } catch (err: any) {
      dispatch(commonErrorAlert())
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const getStaffListDailyReportManagement = createAsyncThunk(
  'dailyReport/getStaffListDailyReportManagement',
  async (
    queryParamters: {
      keyword: string
      pageSize: number
      pageNum: number
      projectId: string | number
      month: number
      year: number
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelGetStaffListDRM(source))
      const res = await dailyReportService.getStaffListDailyReportManagement(
        queryParamters,
        {
          cancelToken: source.token,
        }
      )
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getStaffListDrmIds = createAsyncThunk(
  'dailyReport/getStaffListDrmIds',
  async (
    queryParameters: {
      keyword: string
      pageSize: number
      pageNum: number
      projectId: string | number
      month: number
      year: number
    },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await dailyReportService.getStaffListDrmIds(queryParameters)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const dailyReportSlice = createSlice({
  name: 'dailyReport',
  initialState,
  reducers: {
    setInitialDailyReport: () => initialState,
    setReports(state, { payload }) {
      state.reports = payload
    },
    setApplications(state, { payload }) {
      state.listApplications = payload
    },
    setOpenConfirmDaily(state, { payload }) {
      state.isOpenConfirmReport = payload
    },
    setCancelGetDailyReport(state, { payload }) {
      state.cancelGetDailyReport = payload
    },
    setIsOpenModalDetailDailyReport(state, { payload }) {
      state.isOpenModalDetailDailyReport = payload
    },
    setReportDate(state, { payload }) {
      state.reportDate = payload
    },
    setReportListDetail(state, { payload }) {
      state.reportListDetail = payload
    },
    setIsViewAllDailyReport(state, { payload }) {
      state.isViewAllDailyReport = payload
    },
    setCountReCallApiDailyReports(state, { payload }) {
      state.countReCallApiDailyReports = payload
    },
    setDailyReportId(state, { payload }) {
      state.dailyReportId = payload
    },
    setCurrentReports(state, { payload }) {
      state.currentReports = payload
    },
    setCancelGetStaffListDRM(state, { payload }) {
      state.cancelGetStaffListDRM = payload
    },
    setStaffListDrmListChecked(state, { payload }) {
      state.staffListDrmListChecked = payload
    },
    setIsStaffListDrmCheckAll(state, { payload }) {
      state.isStaffListDrmCheckAll = payload
    },
  },
  extraReducers: builder => {
    builder.addCase(getDailyReports.pending, state => {
      if (state.cancelGetDailyReport) {
        state.cancelGetDailyReport.cancel()
      }
    })
    builder.addCase(getDailyReports.fulfilled, (state, { payload }) => {
      const {
        data: { staff, dailyReport },
      } = payload

      state.responseReport = payload?.data || null
      state.staffInfo = staff || null
      state.reports = dailyReport.map((_report: any) => ({
        ..._report,
        reportDate: new Date(_report.reportDate),
      }))
    })

    builder.addCase(getStaffListDailyReportManagement.pending, state => {
      if (state.cancelGetStaffListDRM) {
        state.cancelGetStaffListDRM.cancel()
      }
    })

    builder.addCase(getStaffListDrmIds.fulfilled, (state, { payload }) => {
      if (payload.data) {
        state.staffListDrmListChecked = payload.data
      }
    })
  },
})

export const {
  setInitialDailyReport,
  setReports,
  setApplications,
  setOpenConfirmDaily,
  setCancelGetDailyReport,
  setIsOpenModalDetailDailyReport,
  setReportDate,
  setReportListDetail,
  setIsViewAllDailyReport,
  setCountReCallApiDailyReports,
  setDailyReportId,
  setCurrentReports,
  setCancelGetStaffListDRM,
  setStaffListDrmListChecked,
  setIsStaffListDrmCheckAll,
} = dailyReportSlice.actions
export const dailyReportSelector = (state: RootState) => state['dailyReport']

export default dailyReportSlice.reducer

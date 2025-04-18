import { LIMIT_DEFAULT, PAGE_CURRENT_DEFAULT } from '@/const/table.const'
import { RootState } from '@/store'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import ProjectAllocationService from '../services/projectAllocation.service'
import StaffAllocationService from '../services/staffAllocation.service'
import {
  DashboardState,
  KPIMetricQueries,
  ProjectAllocationQueries,
  StaffAllocationQueries,
} from '../types'

const initialState: DashboardState = {
  dataStaffAssignAllocation: {
    dataList: [],
    totalElements: 0,
    loading: false,
  },
  staffAllocationQueries: {
    pageSize: LIMIT_DEFAULT,
    pageNum: PAGE_CURRENT_DEFAULT,
    keyword: '',
    divisionIds: [],
    jobType: [],
    startMonth: 0,
    endMonth: 0,
    startYear: 0,
    endYear: 0,
    startDate: new Date(),
    endDate: new Date(),
  },
  dataStaffBusyRate: {
    dataList: [],
    loading: false,
  },
  cancelGetStaffAssignAllocation: null,
  dataProjectAllocationStaff: {
    dataList: [],
    totalElements: 0,
    loading: false,
  },
  projectAllocationQueries: {
    pageSize: LIMIT_DEFAULT,
    pageNum: PAGE_CURRENT_DEFAULT,
    keyword: '',
    divisionIds: [],
    jobType: [],
    startMonth: 0,
    endMonth: 0,
    startYear: 0,
    endYear: 0,
    startDate: new Date(),
    endDate: new Date(),
    status: [],
  },
  dataProjectAllocationSummary: {
    dataList: [],
    loading: false,
  },
  cancelGetProjectAllocationStaff: null,
  cancelGetStaffBusyRate: null,
  cancelGetProjectAllocationSummary: null,
  kpiMetricQueries: {
    pageSize: LIMIT_DEFAULT,
    pageNum: PAGE_CURRENT_DEFAULT,
    keyword: '',
    branchId: '',
    startMonth: 0,
    endMonth: 0,
    startYear: 0,
    endYear: 0,
    startDate: new Date(),
    endDate: new Date(),
  },
  cancelGetKPIMetricSummary: null,
  dataKPIMetricSummary: {
    dataList: [],
    loading: false,
  },
}

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setInitialDashboard: () => initialState,
    setStaffAllocationQueries(state, { payload }) {
      state.staffAllocationQueries = {
        ...state.staffAllocationQueries,
        ...payload,
      }
    },
    setCancelGetStaffAssignAllocation(state, { payload }) {
      state.cancelGetStaffAssignAllocation = payload
    },
    setProjectAllocationQueries(state, { payload }) {
      state.projectAllocationQueries = {
        ...state.projectAllocationQueries,
        ...payload,
      }
    },
    setKPIMetricQueries(state, { payload }) {
      state.kpiMetricQueries = {
        ...state.kpiMetricQueries,
        ...payload,
      }
    },
    setCancelGetProjectAllocationStaff(state, { payload }) {
      state.cancelGetProjectAllocationStaff = payload
    },
    setCancelGetStaffBusyRate(state, { payload }) {
      state.cancelGetStaffBusyRate = payload
    },
    setCancelGetProjectAllocationSummary(state, { payload }) {
      state.cancelGetProjectAllocationSummary = payload
    },
    setCancelGetKPIMetricSummary(state, { payload }) {
      state.cancelGetKPIMetricSummary = payload
    },
  },
  extraReducers: builder => {
    builder.addCase(getStaffBusyRate.pending, state => {
      state.dataStaffBusyRate.loading = true
      if (state.cancelGetStaffBusyRate) {
        state.cancelGetStaffBusyRate.cancel()
      }
    })
    builder.addCase(getStaffBusyRate.fulfilled, (state, { payload }) => {
      const { data } = payload
      state.dataStaffBusyRate = {
        dataList: data,
        loading: false,
      }
    })
    builder.addCase(getStaffBusyRate.rejected, state => {
      state.dataStaffBusyRate.loading = false
    })
    /**-------- */
    builder.addCase(getStaffAssignAllocation.pending, state => {
      state.dataStaffAssignAllocation.loading = true
      if (state.cancelGetStaffAssignAllocation) {
        state.cancelGetStaffAssignAllocation.cancel()
      }
    })
    builder.addCase(
      getStaffAssignAllocation.fulfilled,
      (state, { payload }) => {
        const { data } = payload
        state.dataStaffAssignAllocation = {
          dataList: data.content,
          totalElements: data.totalElements,
          loading: false,
        }
      }
    )
    builder.addCase(getStaffAssignAllocation.rejected, state => {
      setTimeout(() => {
        state.dataStaffAssignAllocation.loading = false
      })
    })
    /**---------- */
    builder.addCase(getProjectAllocationSummary.pending, state => {
      state.dataProjectAllocationSummary.loading = true
      if (state.cancelGetProjectAllocationSummary) {
        state.cancelGetProjectAllocationSummary.cancel()
      }
    })
    builder.addCase(
      getProjectAllocationSummary.fulfilled,
      (state, { payload }) => {
        const { data } = payload
        state.dataProjectAllocationSummary = {
          dataList: data,
          loading: false,
        }
      }
    )
    builder.addCase(getProjectAllocationSummary.rejected, state => {
      state.dataProjectAllocationSummary.loading = false
    })
    /**---------- */
    builder.addCase(getKPIMetricSummary.pending, state => {
      state.dataKPIMetricSummary.loading = true
      if (state.cancelGetKPIMetricSummary) {
        state.cancelGetKPIMetricSummary.cancel()
      }
    })
    builder.addCase(getKPIMetricSummary.fulfilled, (state, { payload }) => {
      const { data } = payload
      state.dataKPIMetricSummary = {
        dataList: data,
        loading: false,
      }
    })
    builder.addCase(getKPIMetricSummary.rejected, state => {
      setTimeout(() => {
        state.dataKPIMetricSummary.loading = false
      })
    })
    /**-------- */
    builder.addCase(getProjectAllocationStaff.pending, state => {
      state.dataProjectAllocationStaff.loading = true
      if (state.cancelGetProjectAllocationStaff) {
        state.cancelGetProjectAllocationStaff.cancel()
      }
    })
    builder.addCase(
      getProjectAllocationStaff.fulfilled,
      (state, { payload }) => {
        const { data } = payload
        state.dataProjectAllocationStaff = {
          dataList: data.content,
          totalElements: data.totalElements,
          loading: false,
        }
      }
    )
    builder.addCase(getProjectAllocationStaff.rejected, state => {
      setTimeout(() => {
        state.dataProjectAllocationStaff.loading = false
      })
    })
  },
})

export const {
  setInitialDashboard,
  setStaffAllocationQueries,
  setCancelGetStaffAssignAllocation,
  setProjectAllocationQueries,
  setKPIMetricQueries,
  setCancelGetProjectAllocationStaff,
  setCancelGetStaffBusyRate,
  setCancelGetProjectAllocationSummary,
  setCancelGetKPIMetricSummary,
} = dashboardSlice.actions

export const dashboardSelector = (state: RootState) => state['dashboard']

export default dashboardSlice.reducer

export const getStaffBusyRate = createAsyncThunk(
  'dashboard/getStaffBusyRate',
  async (
    queryParameters: StaffAllocationQueries,
    { rejectWithValue, dispatch }
  ) => {
    try {
      const startDate = queryParameters.startDate || {
        getMonth: () => 0,
        getFullYear: () => 0,
      }
      const endDate = queryParameters.endDate || {
        getMonth: () => 0,
        getFullYear: () => 0,
      }
      const queries = {
        jobType: queryParameters.jobType?.join(', ') || '',
        divisionIds: queryParameters.divisionIds?.join(', ') || '',
        startMonth: startDate.getMonth() + 1,
        endMonth: endDate.getMonth() + 1,
        startYear: startDate.getFullYear(),
        endYear: endDate.getFullYear(),
      }
      const source = axios.CancelToken.source()
      dispatch(setCancelGetStaffBusyRate(source))
      const res = await StaffAllocationService.getStaffBusyRate(queries, {
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getStaffAssignAllocation = createAsyncThunk(
  'dashboard/getStaffAssignAllocation',
  async (
    queryParameters: StaffAllocationQueries,
    { rejectWithValue, dispatch }
  ) => {
    try {
      const startDate = queryParameters.startDate || {
        getMonth: () => 0,
        getFullYear: () => 0,
      }
      const endDate = queryParameters.endDate || {
        getMonth: () => 0,
        getFullYear: () => 0,
      }
      const queries = {
        jobType: queryParameters.jobType?.join(', ') || '',
        divisionIds: queryParameters.divisionIds?.join(', ') || '',
        startMonth: startDate.getMonth() + 1,
        endMonth: endDate.getMonth() + 1,
        startYear: startDate.getFullYear(),
        endYear: endDate.getFullYear(),
        keyword: queryParameters.keyword,
        pageSize: queryParameters.pageSize,
        pageNum: queryParameters.pageNum,
      }
      const source = axios.CancelToken.source()
      dispatch(setCancelGetStaffAssignAllocation(source))
      const res = await StaffAllocationService.getStaffAssignAllocation(
        queries,
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

export const getProjectAllocationSummary = createAsyncThunk(
  'dashboard/getProjectAllocationSummary',
  async (
    queryParameters: ProjectAllocationQueries,
    { rejectWithValue, dispatch }
  ) => {
    try {
      const startDate = queryParameters.startDate || {
        getMonth: () => 0,
        getFullYear: () => 0,
      }
      const endDate = queryParameters.endDate || {
        getMonth: () => 0,
        getFullYear: () => 0,
      }
      const queries = {
        divisionIds: queryParameters.divisionIds?.join(', ') || '',
        status: queryParameters.status?.join(', ') || '',
        startMonth: startDate.getMonth() + 1,
        endMonth: endDate.getMonth() + 1,
        startYear: startDate.getFullYear(),
        endYear: endDate.getFullYear(),
      }
      const source = axios.CancelToken.source()
      dispatch(setCancelGetProjectAllocationSummary(source))
      const res = await ProjectAllocationService.getProjectAllocationSummary(
        queries,
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
export const getKPIMetricSummary = createAsyncThunk(
  'dashboard/getKPIMetricSummary',
  async (queryParameters: KPIMetricQueries, { rejectWithValue, dispatch }) => {
    try {
      const startDate = queryParameters.startDate || {
        getMonth: () => 0,
        getFullYear: () => 0,
      }
      const endDate = queryParameters.endDate || {
        getMonth: () => 0,
        getFullYear: () => 0,
      }
      const queries = {
        branchId: queryParameters.branchId,
        startMonth: startDate.getMonth() + 1,
        endMonth: endDate.getMonth() + 1,
        startYear: startDate.getFullYear(),
        endYear: endDate.getFullYear(),
      }
      const source = axios.CancelToken.source()
      dispatch(setCancelGetKPIMetricSummary(source))
      const res = await ProjectAllocationService.getKPIMetricSummary(queries, {
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getProjectAllocationStaff = createAsyncThunk(
  'dashboard/getProjectAllocationStaff',
  async (
    queryParameters: ProjectAllocationQueries,
    { rejectWithValue, dispatch }
  ) => {
    try {
      const startDate = queryParameters.startDate || {
        getMonth: () => 0,
        getFullYear: () => 0,
      }
      const endDate = queryParameters.endDate || {
        getMonth: () => 0,
        getFullYear: () => 0,
      }
      const queries = {
        divisionIds: queryParameters.divisionIds?.join(', ') || '',
        status: queryParameters.status?.join(', ') || '',
        startMonth: startDate.getMonth() + 1,
        endMonth: endDate.getMonth() + 1,
        startYear: startDate.getFullYear(),
        endYear: endDate.getFullYear(),
        keyword: queryParameters.keyword,
        pageSize: queryParameters.pageSize,
        pageNum: queryParameters.pageNum,
      }
      const source = axios.CancelToken.source()
      dispatch(setCancelGetProjectAllocationStaff(source))
      const res = await ProjectAllocationService.getProjectAllocationStaff(
        queries,
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

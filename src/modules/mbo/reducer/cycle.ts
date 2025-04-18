import { TableConstant } from '@/const'
import {
  alertError,
  alertSuccess,
  commonErrorAlert,
  updateLoading,
} from '@/reducer/screen'
import { RootState } from '@/store'
import { OptionItem } from '@/types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { CancelTokenSource } from 'axios'
import i18next from 'i18next'
import {
  CycleQueryString,
  ICriteriaGroup,
  ICycleDetail,
  IPayloadCreateCycle,
  IPayloadCycleQueryString,
  IPayloadUpdateCycle,
} from '../models'
import {
  default as CycleService,
  default as cycleService,
} from '../services/cycle.service'

const initEvaluationCycle = {
  id: '',
  name: '',
  appraisees: [],
  appraiser: {},
  duration: 0,
  reviewer: {},
  startDate: 0,
  endDate: 0,
  position: [],
  status: {},
  attitudeWeight: 0,
  jobCompetencyWeight: 0,
  isTemplate: false,
}

export const updateEvaluationCycle = createAsyncThunk(
  'cycle/UpdateEvaluationCycle',
  async (payload: IPayloadUpdateCycle, { rejectWithValue }) => {
    try {
      const res = await cycleService.updateEvaluationCycle(payload)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getCycleList = createAsyncThunk(
  'cycle/getCycleList',
  async (
    queryParameters: IPayloadCycleQueryString,
    { rejectWithValue, dispatch }
  ) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelGetCycleList(source))
      const res = await CycleService.getCycleList(queryParameters, {
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)
export const getCycleListUpcomingTemplate = createAsyncThunk(
  'cycle/getCycleListUpcomingTemplate',
  async (_, { rejectWithValue }) => {
    try {
      const source = axios.CancelToken.source()
      const res = await CycleService.getCycleListUpcomingTemplate({
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getCycleDetail = createAsyncThunk(
  'cycle/getCycleDetail',
  async (id: string, { rejectWithValue }) => {
    try {
      const source = axios.CancelToken.source()
      const res = await CycleService.getCycleDetail(id, {
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const createCycle = createAsyncThunk(
  'cycle/createCycle',
  async (payload: IPayloadCreateCycle, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await CycleService.createCycle(payload)
      dispatch(
        alertSuccess({
          message: i18next.t('common:MSG_ADD_NEW_SUCCESS', {
            labelName: `${i18next.t('mbo:LB_CYCLE')} `,
          }),
        })
      )
      return res
    } catch (err: any) {
      dispatch(
        alertError({
          message: err[0]?.message || '',
        })
      )
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const deleteEvaluationCycle = createAsyncThunk(
  'cycle/deleteEvaluationCycle',
  async (id: string, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const source = axios.CancelToken.source()
      const res = await CycleService.deleteEvaluationCycle(id, {
        cancelToken: source.token,
      })
      dispatch(
        alertSuccess({
          message: i18next.t('mbo:MSG_DELETE_CYCLE_SUCCESS'),
        })
      )
      return res
    } catch (err: any) {
      dispatch(commonErrorAlert())
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export interface CycleState {
  cancelGetCycleList: CancelTokenSource | null
  isListFetching: boolean
  isDetailFetching: boolean
  cycleQueryString: CycleQueryString
  listCycle: any[]
  totalCycleElements: number
  payloadCycle: IPayloadCreateCycle
  cycleListUpcomingTemplate: OptionItem[]
  evaluationCycle: ICycleDetail
  criteriaGroupsCycle: ICriteriaGroup[]
}

const initialState: CycleState = {
  cancelGetCycleList: null,
  isDetailFetching: false,
  isListFetching: false,
  cycleQueryString: {
    pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
    pageSize: TableConstant.LIMIT_DEFAULT,
  },
  listCycle: [],
  totalCycleElements: 0,
  payloadCycle: {
    evaluationCycleTemplateId: '',
    appraisees: [],
    appraiser: '',
    reviewer: '',
  },
  cycleListUpcomingTemplate: [],
  evaluationCycle: initEvaluationCycle,
  criteriaGroupsCycle: [],
}

export const cycleSlice = createSlice({
  name: 'cycle',
  initialState,
  reducers: {
    setInitialCycle: () => initialState,
    setCancelGetCycleList(state, { payload }) {
      state.cancelGetCycleList = payload
    },
    setCycleQueryString(state, { payload }) {
      state.cycleQueryString = payload
    },
    setPayloadCycle(state, { payload }) {
      state.payloadCycle = payload
    },
  },
  extraReducers: builder => {
    builder.addCase(getCycleList.pending, state => {
      state.isListFetching = true
      if (state.cancelGetCycleList) {
        state.cancelGetCycleList.cancel()
      }
    })
    builder.addCase(getCycleList.fulfilled, (state, { payload }) => {
      state.isListFetching = false
      state.listCycle = payload.data.content
      state.totalCycleElements = payload.data.totalElements
    })
    builder.addCase(getCycleList.rejected, state => {
      state.isListFetching = false
    })
    builder.addCase(
      getCycleListUpcomingTemplate.fulfilled,
      (state, { payload }) => {
        state.cycleListUpcomingTemplate = payload.data.map((item: any) => ({
          id: item?.id,
          value: item?.id,
          label: item?.name,
        }))
      }
    )
    builder.addCase(getCycleDetail.pending, state => {
      state.isDetailFetching = true
      state.listCycle = []
      state.evaluationCycle = initEvaluationCycle
    })
    builder.addCase(getCycleDetail.rejected, state => {
      state.isDetailFetching = false
    })
    builder.addCase(getCycleDetail.fulfilled, (state, { payload }) => {
      const { data } = payload
      if (data) {
        state.evaluationCycle = {
          id: data.evaluationCycle?.id || '',
          name: data.evaluationCycle.name,
          appraisees: data?.evaluationCycle.appraisees?.map((item: any) => ({
            id: item.id,
            value: item.id,
            label: item.name,
            code: item.code,
            email: item.email,
            positionName: item.position.name,
          })),
          appraiser: {
            id: data.evaluationCycle.appraiser?.id,
            value: data.evaluationCycle.appraiser?.id,
            label: data.evaluationCycle.appraiser?.name,
            code: data.evaluationCycle.appraiser?.code,
            email: data.evaluationCycle.appraiser?.email,
          },
          duration: data.evaluationCycle.duration,
          reviewer: {
            id: data.evaluationCycle.reviewer?.id,
            value: data.evaluationCycle.reviewer?.id,
            label: data.evaluationCycle.reviewer?.name,
            code: data.evaluationCycle.reviewer?.code,
            email: data.evaluationCycle.reviewer?.email,
          },
          startDate: data.evaluationCycle.startDate,
          endDate: data.evaluationCycle.endDate,
          position: data.evaluationCycle.position,
          status: data.evaluationCycle.status,
          attitudeWeight: data.attitudeWeight,
          jobCompetencyWeight: data.jobCompetencyWeight,
          isTemplate: data.evaluationCycle.isTemplate,
        }
        state.criteriaGroupsCycle = data.criteriaGroups
      }
      state.isDetailFetching = false
    })
  },
})

export const { setCancelGetCycleList, setCycleQueryString, setPayloadCycle, setInitialCycle } =
  cycleSlice.actions
export const cycleSelector = (state: RootState) => state['cycle']

export default cycleSlice.reducer

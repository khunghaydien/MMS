import { TableConstant } from '@/const'
import {
  alertError,
  alertSuccess,
  commonErrorAlert,
  updateLoading,
} from '@/reducer/screen'
import { RootState } from '@/store'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { CancelTokenSource } from 'axios'
import i18next from 'i18next'
import StringFormat from 'string-format'
import {
  CriteriaQueryString,
  CriteriaRequest,
  ICriteriaGroupDataForm,
  ICriteriaGroupInformation,
} from '../models'
import CriteriaService from '../services/criteria.service'
import { formatCriteriaList } from '../utils'

export const getCriteriaList = createAsyncThunk(
  'criteria/getCriteriaList',
  async (
    queryParameters: CriteriaQueryString,
    { rejectWithValue, dispatch }
  ) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelGetCriteriaList(source))
      const res = await CriteriaService.getCriteriaList(queryParameters, {
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const deleteCriteriaGroup = createAsyncThunk(
  'criteria/deleteCriteriaGroup',
  async (
    payload: {
      criteriaGroupId: string | undefined
      alertName: string
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      dispatch(updateLoading(true))
      const res = await CriteriaService.deleteCriteriaGroup(
        payload.criteriaGroupId
      )
      dispatch(
        alertSuccess({
          message: i18next.t('common:MSG_DELETE_SUCCESS', {
            labelName: payload.alertName,
          }),
        })
      )
      return res
    } catch (err: any) {
      dispatch(
        alertError({
          message: err[0]?.message,
        })
      )
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const createCriteriaGroup = createAsyncThunk(
  'criteria/createCriteriaGroup',
  async (
    requestBody: ICriteriaGroupDataForm,
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await CriteriaService.createCriteriaGroup(requestBody)
      dispatch(
        alertSuccess({
          message: i18next.t('common:MSG_ADD_NEW_SUCCESS', {
            labelName: `${i18next.t('mbo:LB_CRITERIA_GROUP')}: ${res.data.name
              }`,
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

export const getCriteriaGroupDetail = createAsyncThunk(
  'criteria/getCriteriaGroup',
  async (
    criteriaGroupId: string | number | undefined,
    { dispatch, rejectWithValue }
  ) => {
    try {
      const res = await CriteriaService.getCriteriaGroupDetail(criteriaGroupId)
      return res.data
    } catch (err: any) {
      if (err[0].field === 'criteriaGroupId') {
        dispatch(
          alertError({
            message: StringFormat(
              i18next.t('common:MSG_SCREEN_NOT_FOUND'),
              i18next.t('mbo:LB_CRITERIA_GROUP') as string
            ),
          })
        )
      }
      return rejectWithValue(err[0].field)
    }
  }
)

export const updateCriteriaGroup = createAsyncThunk(
  'criteria/updateCriteriaGroup',
  async (
    payload: {
      criteriaGroupId: string | number | undefined
      requestBody: ICriteriaGroupInformation
    },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const newPayload = {
        criteriaGroupId: payload.criteriaGroupId,
        requestBody: payload.requestBody,
      }
      const res = await CriteriaService.updateCriteriaGroup(newPayload)
      dispatch(
        alertSuccess({
          message: i18next.t('common:MSG_UPDATE_SUCCESS', {
            labelName: `${i18next.t('mbo:LB_CRITERIA_GROUP')}: ${payload.requestBody.name
              }`,
          }),
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

export const updateHashCriteria = createAsyncThunk(
  'criteria/updateHashCriteria',
  async (
    payload: {
      criteriaGroupId: string | number | undefined
      requestBody: CriteriaRequest
      hashCriteriaId: string | number
      alertLabelName: string
    },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await CriteriaService.updateHashCriteria(payload)
      dispatch(
        alertSuccess({
          message: i18next.t('common:MSG_UPDATE_SUCCESS', {
            labelName: payload.alertLabelName,
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

export const deleteHashCriteria = createAsyncThunk(
  'criteria/deleteHashCriteria',
  async (
    payload: {
      criteriaGroupId: string | number | undefined
      hashCriteriaId: string | number
      alertName: string
    },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await CriteriaService.deleteHashCriteria(payload)
      dispatch(
        alertSuccess({
          message: i18next.t('common:MSG_DELETE_SUCCESS', {
            labelName: payload.alertName,
          }),
        })
      )
      return res
    } catch (err: any) {
      dispatch(
        alertError({
          message: err[0]?.message,
        })
      )
      return rejectWithValue(err)
    } finally {
      setTimeout(() => {
        dispatch(updateLoading(false))
      }, 1000)
    }
  }
)

export const createHashCriteria = createAsyncThunk(
  'criteria/createHashCriteria',
  async (
    payload: {
      criteriaGroupId: string | undefined
      requestBody: CriteriaRequest
      alertName: string
    },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await CriteriaService.createHashCriteria(payload)
      dispatch(
        alertSuccess({
          message: i18next.t('common:MSG_ADD_NEW_SUCCESS', {
            labelName: payload.alertName,
          }),
        })
      )
      return res
    } catch (err: any) {
      if (err[0]?.field === 'criteriaName') {
        dispatch(
          alertError({
            message: err[0]?.message,
          })
        )
      } else {
        dispatch(commonErrorAlert())
      }
      return rejectWithValue(err)
    } finally {
      setTimeout(() => {
        dispatch(updateLoading(false))
      }, 1000)
    }
  }
)

export interface CriteriaState {
  cancelGetCriteriaList: CancelTokenSource | null
  isListFetching: boolean
  criteriaList: any[]
  currentPage: number
  totalElements: number
  criteriaQueryString: CriteriaQueryString
}

const initialState: CriteriaState = {
  cancelGetCriteriaList: null,
  isListFetching: false,
  criteriaList: [],
  currentPage: 0,
  totalElements: 0,
  criteriaQueryString: {
    name: '',
    pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
    pageSize: TableConstant.LIMIT_DEFAULT,
    type: '',
    positionId: '',
  },
}

export const criteriaSlice = createSlice({
  name: 'criteria',
  initialState,
  reducers: {
    setInitialCriteria: () => initialState,
    setCancelGetCriteriaList(state, { payload }) {
      state.cancelGetCriteriaList = payload
    },
    setCriteriaList(state, { payload }) {
      state.criteriaList = payload.content.map(formatCriteriaList)
      state.currentPage = payload.currentPage
      state.totalElements = payload.totalElements
    },
    setCriteriaQueryString(state, { payload }) {
      state.criteriaQueryString = payload
    },
  },
  extraReducers: builder => {
    builder.addCase(getCriteriaList.pending, state => {
      state.isListFetching = true
      if (state.cancelGetCriteriaList) {
        state.cancelGetCriteriaList.cancel()
      }
    })
    builder.addCase(getCriteriaList.fulfilled, (state, { payload }) => {
      state.criteriaList = payload.data.content.map(formatCriteriaList)
      state.currentPage = payload.data.currentPage
      state.totalElements = payload.data.totalElements
      state.isListFetching = false
    })
    builder.addCase(getCriteriaList.rejected, state => {
      state.isListFetching = false
    })
  },
})

export const {
  setInitialCriteria,
  setCancelGetCriteriaList,
  setCriteriaList,
  setCriteriaQueryString,
} = criteriaSlice.actions
export const criteriaSelector = (state: RootState) => state['criteria']

export default criteriaSlice.reducer

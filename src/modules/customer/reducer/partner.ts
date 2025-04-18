import { alertError, alertSuccess, updateLoading } from '@/reducer/screen'
import { RootState } from '@/store'
import { IExportListToExcelBody, PayloadUpdate } from '@/types'
import { downloadFileFromByteArr } from '@/utils'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { CancelTokenSource } from 'axios'
import i18next from 'i18next'
import { partnerQueryParameters } from '../const'
import { PartnerService } from '../services'
import {
  IContractDetailPayload,
  IContractResponse,
  ICreateContractPayload,
  ListPartnersParams,
} from '../types'

export interface PartnerState {
  listPartners: any[]
  total: number
  stateContracts: IContractResponse[]
  isListFetching: boolean
  cancelGetPartnerList: CancelTokenSource | null
  partnerQueryParameters: ListPartnersParams
  listChecked: string[]
  isCheckAll: boolean
}

const initialState: PartnerState = {
  listPartners: [],
  total: 0,
  stateContracts: [],
  isListFetching: false,
  cancelGetPartnerList: null,
  partnerQueryParameters: structuredClone(partnerQueryParameters),
  listChecked: [],
  isCheckAll: false,
}

export const getListPartners = createAsyncThunk(
  'partner/getListPartners',
  async (params: ListPartnersParams, { rejectWithValue, dispatch }) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelGetPartnerList(source))
      const res = await PartnerService.getListPartners(params, {
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getListIds = createAsyncThunk(
  'partner/getListIds',
  async (
    queryParameters: ListPartnersParams,
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await PartnerService.getListIds(queryParameters)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const deletePartner = createAsyncThunk(
  'partner/deletePartner',
  async (idPartner: string, { rejectWithValue }) => {
    try {
      const res = await PartnerService.deletePartner(idPartner)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const createPartner = createAsyncThunk(
  'partner/createPartner',
  async (requestBody: any, { rejectWithValue, dispatch }) => {
    try {
      const res = await PartnerService.createPartner(requestBody)
      dispatch(
        alertSuccess({
          message: i18next.t('customer:MSG_CREATE_PARTNER_SUCCESS', {
            partnerName: res.data?.general?.id || '',
          }),
        })
      )
      return res
    } catch (err: any) {
      if (!!err?.length && err[0]?.field?.includes('contracts')) {
        dispatch(
          alertError({
            message:
              'This contract code has already been available in the partner contract list. Please check again or create new contract.',
          })
        )
      } else {
        dispatch(
          alertError({
            message: 'Failed to create a new partner, please try again.',
          })
        )
      }

      return rejectWithValue(err)
    }
  }
)

export const updatePartner = createAsyncThunk(
  'partner/updatePartner',
  async ({ id, requestBody }: PayloadUpdate, { rejectWithValue, dispatch }) => {
    try {
      const res = await PartnerService.updatePartner({ id, requestBody })
      dispatch(
        alertSuccess({
          message: i18next.t('customer:MSG_UPDATE_PARTNER_SUCCESS', {
            partnerId: id,
          }),
        })
      )
      return res
    } catch (err: any) {
      if (!!err?.length && err[0]?.field?.includes('contracts')) {
        dispatch(
          alertError({
            message:
              'This contract code has already been available in the partner contract list. Please check again or create new contract.',
          })
        )
      } else {
        dispatch(
          alertError({
            message: 'Update failed, please try again',
          })
        )
      }

      return rejectWithValue(err)
    }
  }
)

export const getContractsByPartnerId = createAsyncThunk(
  'partner/getContractsByPartnerId',
  async (params: string, { rejectWithValue, dispatch }) => {
    try {
      dispatch(updateLoading(true))
      const res = await PartnerService.getContractsByPartnerId(params)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const createPartnerContract = createAsyncThunk(
  'partner/createPartnerContract',
  async (payload: ICreateContractPayload, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await PartnerService.createPartnerContract(payload)
      dispatch(getContractsByPartnerId(payload.id))
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const updatePartnerContract = createAsyncThunk(
  'partner/updatePartnerContract',
  async (payload: IContractDetailPayload, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await PartnerService.updatePartnerContract(payload)
      dispatch(getContractsByPartnerId(payload.id))
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const deletePartnerContract = createAsyncThunk(
  'partner/deletePartnerContract',
  async (payload: IContractDetailPayload, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await PartnerService.deletePartnerContract(payload)
      dispatch(getContractsByPartnerId(payload.id))
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const exportPartnerList = createAsyncThunk(
  'customer/exportPartnerList',
  async (payload: IExportListToExcelBody, { rejectWithValue }) => {
    try {
      const res = await PartnerService.exportListToExcel(payload)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const partnerSlice = createSlice({
  name: 'partner',
  initialState,
  reducers: {
    setInitialPartner: () => initialState,
    setStateContracts(state, { payload }) {
      state.stateContracts = payload
    },
    setCancelGetPartnerList(state, { payload }) {
      state.cancelGetPartnerList = payload
    },
    setPartnerQueryParameters(state, { payload }) {
      state.partnerQueryParameters = payload
    },
    setListChecked(state, { payload }) {
      state.listChecked = payload
    },
    setIsCheckAll(state, { payload }) {
      state.isCheckAll = payload
    },
  },
  extraReducers: builder => {
    builder.addCase(getListPartners.pending, state => {
      state.isListFetching = true
      if (state.cancelGetPartnerList) {
        state.cancelGetPartnerList.cancel()
      }
    })
    builder.addCase(getListPartners.fulfilled, (state, { payload }) => {
      state.isListFetching = false
      state.listPartners = payload.data.content
      state.total = payload.data.totalElements
    })
    builder.addCase(getListPartners.rejected, state => {
      setTimeout(() => {
        state.isListFetching = false
      })
    })
    builder.addCase(getContractsByPartnerId.fulfilled, (state, { payload }) => {
      const {
        data: { content },
      } = payload
      if (content) {
        state.stateContracts = content.map((item: any) => ({
          ...item,
          group: item.group.id,
          type: item.type?.id || '',
          status: item.status.id,
        })) as any
      }
    })
    builder.addCase(getListIds.fulfilled, (state, { payload }) => {
      if (payload.data) {
        state.listChecked = payload.data
      }
    })
    builder.addCase(exportPartnerList.fulfilled, (_, { payload }) => {
      const { data } = payload
      downloadFileFromByteArr(data)
    })
  },
})

export const {
  setInitialPartner,
  setStateContracts,
  setCancelGetPartnerList,
  setPartnerQueryParameters,
  setListChecked,
  setIsCheckAll,
} = partnerSlice.actions
export const selectPartner = (state: RootState) => state['partner']

export default partnerSlice.reducer

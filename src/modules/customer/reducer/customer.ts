import { alertError, alertSuccess, updateLoading } from '@/reducer/screen'
import { RootState } from '@/store'
import { IExportListToExcelBody } from '@/types'
import { downloadFileFromByteArr } from '@/utils'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { CancelTokenSource } from 'axios'
import i18next from 'i18next'
import { customerQueryParameters, initialDataDashboard } from '../const'
import { CustomerService } from '../services'
import {
  IContractDetailPayload,
  IContractResponse,
  ICreateContractPayload,
  ICustomer,
  IDataDashboard,
  IListCustomersParams,
  Optional,
} from '../types'

export interface CustomerState {
  customerList: any
  dataDashboard: IDataDashboard
  listContract: IContractResponse[]
  isListFetching: boolean
  cancelGetCustomerList: CancelTokenSource | null
  queryParameters: IListCustomersParams
  listChecked: string[]
  isCheckAll: boolean
}

const initialState: CustomerState = {
  customerList: {},
  dataDashboard: initialDataDashboard,
  listContract: [],
  isListFetching: false,
  cancelGetCustomerList: null,
  queryParameters: structuredClone(customerQueryParameters),
  listChecked: [],
  isCheckAll: false,
}

export const getListCustomers = createAsyncThunk(
  'customer/getListCustomers',
  async (params: IListCustomersParams, { rejectWithValue, dispatch }) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelGetCustomerList(source))
      const res = await CustomerService.getListCustomers(params, {
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getListIds = createAsyncThunk(
  'customer/getListIds',
  async (
    queryParameters: IListCustomersParams,
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await CustomerService.getListIds(queryParameters)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const deleteCustomers = createAsyncThunk(
  'customer/deleteCustomers',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await CustomerService.deleteCustomers(id)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getCustomerDetail = createAsyncThunk(
  'customer/getCustomerDetail',
  async (customerId: string, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await CustomerService.getCustomerDetail(customerId)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const createCustomer = createAsyncThunk(
  'customer/createCustomer',
  async (payload: Optional<ICustomer>, { rejectWithValue, dispatch }) => {
    try {
      const res = await CustomerService.createCustomer(payload)
      dispatch(
        alertSuccess({
          message: i18next.t('customer:MSG_CREATE_CUSTOMER_SUCCESS', {
            customerId: res.data?.general?.id || '',
          }),
        })
      )
      return res
    } catch (err: any) {
      if (!!err?.length && err[0]?.field?.includes('contracts')) {
        dispatch(
          alertError({
            message:
              'This contract code has already been available in the customer contract list. Please check again or create new contract.',
          })
        )
      } else {
        dispatch(
          alertError({
            message: 'Failed to create a new customer, please try again.',
          })
        )
      }

      return rejectWithValue(err)
    }
  }
)

export const updateCustomer = createAsyncThunk(
  'customer/updateCustomer',
  async (
    payload: { customerId: string; data: Optional<ICustomer> },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await CustomerService.updateCustomer(payload)
      dispatch(
        alertSuccess({
          message: i18next.t('customer:MSG_UPDATE_CUSTOMER_SUCCESS', {
            customerId: payload.customerId,
          }),
        })
      )
      return res
    } catch (err: any) {
      if (!!err?.length && err[0]?.field?.includes('contracts')) {
        dispatch(
          alertError({
            message:
              'This contract code has already been available in the customer contract list. Please check again or create new contract.',
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

export const getStatisticCustomerAndPartner = createAsyncThunk(
  'customer/getStatisticCustomerAndPartner',
  async (params: string, { rejectWithValue }) => {
    try {
      const res = await CustomerService.getStatisticCustomerAndPartner(params)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getContractsByCustomerId = createAsyncThunk(
  'customer/getContractsByCustomerId',
  async (payload: string, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await CustomerService.getContractsByCustomerId(payload)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const createCustomerContract = createAsyncThunk(
  'customer/createCustomerContract',
  async (payload: ICreateContractPayload, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await CustomerService.createCustomerContract(payload)
      dispatch(getContractsByCustomerId(payload.id))
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const updateCustomerContract = createAsyncThunk(
  'customer/updateCustomerContract',
  async (payload: IContractDetailPayload, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await CustomerService.updateCustomerContract(payload)
      dispatch(getContractsByCustomerId(payload.id))
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const deleteCustomerContract = createAsyncThunk(
  'customer/deleteCustomerContract',
  async (payload: IContractDetailPayload, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await CustomerService.deleteCustomerContract(payload)
      dispatch(getContractsByCustomerId(payload.id))
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const exportCustomerList = createAsyncThunk(
  'customer/exportCustomerList',
  async (payload: IExportListToExcelBody, { rejectWithValue }) => {
    try {
      const res = await CustomerService.exportListToExcel(payload)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setInitialCustomer: () => initialState,
    setListContractState(state, { payload }) {
      state.listContract = payload
    },
    setCancelGetCustomerList(state, { payload }) {
      state.cancelGetCustomerList = payload
    },
    setQueryParameters(state, { payload }) {
      state.queryParameters = payload
    },
    setListChecked(state, { payload }) {
      state.listChecked = payload
    },
    setIsCheckAll(state, { payload }) {
      state.isCheckAll = payload
    },
  },
  extraReducers: builder => {
    // getListCustomers
    builder.addCase(getListCustomers.pending, (state, a) => {
      state.isListFetching = true
      if (state.cancelGetCustomerList) {
        state.cancelGetCustomerList.cancel()
      }
    })
    builder.addCase(getListCustomers.fulfilled, (state, { payload }) => {
      let { data, status } = payload
      if (status) {
        state.customerList = data
      }
      state.isListFetching = false
    })
    builder.addCase(getListCustomers.rejected, (state, action) => {
      setTimeout(() => {
        state.isListFetching = false
      })
    })
    builder.addCase(
      getStatisticCustomerAndPartner.fulfilled,
      (state, { payload: { data } }) => {
        if (data) {
          state.dataDashboard = { ...data }
        }
      }
    )
    builder.addCase(
      getContractsByCustomerId.fulfilled,
      (state, { payload }) => {
        const {
          data: { content },
        } = payload
        if (content) {
          state.listContract = content
        }
      }
    )
    builder.addCase(getListIds.fulfilled, (state, { payload }) => {
      if (payload.data) {
        state.listChecked = payload.data
      }
    })
    builder.addCase(exportCustomerList.fulfilled, (_, { payload }) => {
      const { data } = payload
      downloadFileFromByteArr(data)
    })
  },
})

export const {
  setInitialCustomer,
  setListContractState,
  setCancelGetCustomerList,
  setQueryParameters,
  setListChecked,
  setIsCheckAll,
} = customerSlice.actions
export const selectCustomer = (state: RootState) => state['customer']

export default customerSlice.reducer

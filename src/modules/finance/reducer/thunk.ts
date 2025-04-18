import { HttpStatusCode } from '@/api/types'
import { alertError, alertSuccess, updateLoading } from '@/reducer/screen'
import { createAsyncThunk } from '@reduxjs/toolkit'
import i18next from 'i18next'
import { FinanceService } from '../services'
import { IConfigBranchExpected, IConfigKpi, IDataFilter } from '../types'

export const getListFinanceDashBoard = createAsyncThunk(
  'finance/getListFinance',
  async (params: IDataFilter, { rejectWithValue }) => {
    try {
      const res = await FinanceService.getListFinance(params)
      return res
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const createNewConfigKpi = createAsyncThunk(
  'staff/createNewConfigKpi',
  async (payload: IConfigKpi, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await FinanceService.createNewConfigKpi(payload)
      if (res.status == HttpStatusCode.OK) {
        dispatch(
          alertSuccess({
            message: i18next.t('finance:MSG_CREATE_KPI_CONFIG_SUCCESS'),
          })
        )
      }
      return res
    } catch (err: any) {
      dispatch(
        alertError({
          message: i18next.t('finance:MSG_CREATE_KPI_CONFIG_ERROR'),
        })
      )

      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const updateConfigKpi = createAsyncThunk(
  'staff/updateConfigKpi',
  async (payload: IConfigKpi, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const listDivision =
        payload.configuration?.map(
          (item: IConfigBranchExpected) => item.division
        ) || []
      const listBranch =
        payload.configuration?.map((item: IConfigBranchExpected) => ({
          id: item.id,
          expectedKPI: item.expectedKPI,
        })) || []
      const payloadFormat = {
        configuration: [...listDivision?.flat(), ...listBranch],
        moduleId: payload.moduleId,
        year: payload.year,
      }
      const res = await FinanceService.updateConfigKpi(payloadFormat)
      if (res.status == HttpStatusCode.OK) {
        dispatch(
          alertSuccess({
            message: i18next.t('finance:MSG_UPDATE_KPI_CONFIG_SUCCESS'),
          })
        )
      }
      return res
    } catch (err: any) {
      dispatch(
        alertError({
          message: i18next.t('finance:MSG_UPDATE_KPI_CONFIG_ERROR'),
        })
      )

      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const getFinanceKpi = createAsyncThunk(
  'staff/getFinanceKpi',
  async (payload: any, { rejectWithValue }) => {
    try {
      const res = await FinanceService.getFinanceKpi(payload)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

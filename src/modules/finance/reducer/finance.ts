import { RootState } from '@/store'
import { createSlice } from '@reduxjs/toolkit'
import { IFinanceState } from '../types'
import { getFinanceKpi, getListFinanceDashBoard } from './thunk'

const initialState: IFinanceState = {
  finance: {},
  configKpi: {
    moduleId: '',
    year: null,
    configuration: [],
  },
  configurations: [],
}

export const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    setInitialFinance: () => initialState,
    setConfigKpi(state, action) {
      state.configKpi = action.payload
    },
    setConfigurations(state, action) {
      state.configurations = action.payload
    },
  },
  extraReducers: builder => {
    // getListProjects
    builder.addCase(getListFinanceDashBoard.fulfilled, (state, { payload }) => {
      state.finance = payload.data
    })
    // getFinanceKpi
    builder.addCase(getFinanceKpi.fulfilled, (state, { payload }) => {
      state.configurations = payload.data?.map((item: any) => ({
        id: item.id,
        branchId: item.branch.id,
        division: item.division.map((division: any) => ({
          divisionId: division.division.divisionId,
          expectedKPI: division.expectedKpi || '',
          id: division.id,
        })),
        expectedKPI: item.expectedKpi || '',
      }))
    })
  },
})
export const { setConfigKpi, setConfigurations, setInitialFinance } = financeSlice.actions

export const financeSelector = (state: RootState) => state['finance']

export default financeSlice.reducer

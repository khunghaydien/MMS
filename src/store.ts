import contractReducer from '@/modules/contract/reducer/contract'
import customerReducer from '@/modules/customer/reducer/customer'
import partnerReducer from '@/modules/customer/reducer/partner'
import dailyReportReducer from '@/modules/daily-report/reducer/dailyReport'
import dashboardReducer from '@/modules/dashboard/reducer/dashboard'
import financeReducer from '@/modules/finance/reducer/finance'
import criteriaReducer from '@/modules/mbo/reducer/criteria'
import cycleReducer from '@/modules/mbo/reducer/cycle'
import evaluationProcessReducer from '@/modules/mbo/reducer/evaluation-process'
import projectReducer from '@/modules/project/reducer/project'
import staffReducer from '@/modules/staff/reducer/staff'
import authReducer from '@/reducer/auth'
import commonReducer from '@/reducer/common'
import screenReducer from '@/reducer/screen'
import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit'

const rootReducer = combineReducers({
  screen: screenReducer,
  auth: authReducer,
  customer: customerReducer,
  common: commonReducer,
  partner: partnerReducer,
  project: projectReducer,
  staff: staffReducer,
  dailyReport: dailyReportReducer,
  finance: financeReducer,
  contract: contractReducer,
  criteria: criteriaReducer,
  cycle: cycleReducer,
  evaluationProcess: evaluationProcessReducer,
  dashboard: dashboardReducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

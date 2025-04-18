import { RootState } from '@/store'
import { AlertInfo } from '@/types'
import { createSlice } from '@reduxjs/toolkit'

export interface ScreenState {
  isShowAlert: boolean
  alertInfo: AlertInfo
  moduleName: string
  isLoading: boolean
  isShowSideBar: boolean
}

const DEFAULT_ALERT = {
  title: '',
  message: '',
  type: 'error',
}

const initialState: ScreenState = {
  isShowAlert: false,
  alertInfo: {
    ...DEFAULT_ALERT,
  },
  moduleName: '',
  isLoading: false,
  isShowSideBar: false,
}

export const screenSlice = createSlice({
  name: 'screen',
  initialState,
  reducers: {
    updateAlert: (state, action) => {
      state.isShowAlert = action.payload.isShowAlert
      state.alertInfo = { ...action.payload.alertInfo }
    },
    updateModuleName: (state, action) => {
      state.moduleName = action.payload
    },
    updateLoading: (state, action) => {
      state.isLoading = action.payload
    },
    commonErrorAlert(state) {
      state.isShowAlert = true
      state.alertInfo = {
        title: '',
        type: 'error',
        message: 'An error has occurred',
      }
    },
    alertSuccess(state, action) {
      state.isShowAlert = true
      state.alertInfo = {
        title: '',
        type: 'success',
        message: action.payload.message,
      }
    },
    alertError(state, action) {
      state.isShowAlert = true
      state.alertInfo = {
        title: '',
        type: 'error',
        message: action.payload.message,
      }
    },
    setIsShowSideBar(state, { payload }) {
      state.isShowSideBar = payload
    },
  },
})

export const selectScreen: any = (state: RootState) => state['screen']

export const {
  updateAlert,
  updateModuleName,
  updateLoading,
  commonErrorAlert,
  alertError,
  alertSuccess,
  setIsShowSideBar,
} = screenSlice.actions

export default screenSlice.reducer

import { alertError, alertSuccess, updateLoading } from '@/reducer/screen'
import { IExportListToExcelBody } from '@/types'
import { scrollToTop } from '@/utils'
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import i18next from 'i18next'
import { StaffService } from '../services'
import { StaffQueriesDashboard, UpdateSkillSetStaffDetail } from '../types'
import { DeleteStaffPayload } from '../types/staff-list'
import { setCancelGetStaffList, setCancelGetStaffListOutsource } from './staff'

export const getListIds = createAsyncThunk(
  'staff/getListIds',
  async (queryParameters: any, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await StaffService.getListIds(queryParameters)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const getListHROutsourceIds = createAsyncThunk(
  'staff/getListHROutsourceIds',
  async (queryParameters: any, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await StaffService.getListHROutsourceIds(queryParameters)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const getListStaff = createAsyncThunk(
  'staff/getListStaff',
  async (params: any, { rejectWithValue, dispatch }) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelGetStaffList(source))
      const res = await StaffService.getListStaff(params, {
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)
export const getListStaffOutsource = createAsyncThunk(
  'staff-outsource/getListStaffOutsource',
  async (params: any, { rejectWithValue, dispatch }) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelGetStaffListOutsource(source))
      const res = await StaffService.getListStaffOutsource(params, {
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)
export const getDetailStaff = createAsyncThunk(
  'staff/getDetailStaff',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await StaffService.getDetailStaff(id)
      scrollToTop()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getDetailStaffOutsource = createAsyncThunk(
  'staff-outsource/getDetailStaffOutsource',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await StaffService.getDetailStaffOutsource(id)
      scrollToTop()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getSkillSets = createAsyncThunk(
  'staff/getSkillSets',
  async (payload: any, { rejectWithValue }) => {
    try {
      const res = await StaffService.getSkillSets(payload)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getContracts = createAsyncThunk(
  'staff/getContracts',
  async (payload: any, { rejectWithValue, dispatch }) => {
    try {
      const res = await StaffService.getContracts(payload)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const getCertificates = createAsyncThunk(
  'staff/getCertificates',
  async (payload: any, { rejectWithValue, dispatch }) => {
    try {
      const res = await StaffService.getCertificates(payload)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const getCVs = createAsyncThunk(
  'staff/getCVs',
  async (payload: any, { rejectWithValue, dispatch }) => {
    try {
      const res = await StaffService.getCVs(payload)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)
export const createContract = createAsyncThunk(
  'staff/createContract',
  async (payload: any, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await StaffService.createContract(payload)
      return res
    } catch (err: any) {
      dispatch(
        alertError({
          message: i18next.t('staff:MSG_CREATE_CONTRACT_ERROR'),
        })
      )

      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const createCertificate = createAsyncThunk(
  'staff/createCertificate',
  async (payload: any, { rejectWithValue, dispatch }) => {
    try {
      const res = await StaffService.createCertificate(payload)
      return res
    } catch (err: any) {
      dispatch(
        alertError({
          message: i18next.t('staff:MSG_CREATE_CERTIFICATE_ERROR'),
        })
      )

      return rejectWithValue(err)
    }
  }
)
export const createCV = createAsyncThunk(
  'staff/createCV',
  async (payload: any, { rejectWithValue, dispatch }) => {
    try {
      const res = await StaffService.createCV(payload)
      return res
    } catch (err: any) {
      dispatch(
        alertError({
          message: i18next.t('staff:MSG_CREATE_CV_ERROR'),
        })
      )

      return rejectWithValue(err)
    }
  }
)

export const createSkillSet = createAsyncThunk(
  'staff/createSkillSet',
  async (payload: any, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await StaffService.createSkillSet(payload)
      dispatch(
        alertSuccess({
          message: i18next.t('staff:MSG_CREATE_SKILL_SET_SUCCESS'),
        })
      )
      return res
    } catch (err: any) {
      dispatch(
        alertError({
          message: i18next.t('staff:MSG_CREATE_SKILL_ERROR'),
        })
      )

      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)
export const updateSkillSet = createAsyncThunk(
  'staff/updateSkillSet',
  async (payload: any, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await StaffService.updateSkillSet(payload)
      dispatch(
        alertSuccess({
          message: i18next.t('staff:MSG_UPDATE_SKILL_SUCCESS', {
            skillId: payload.skillId,
          }),
        })
      )
      return res
    } catch (err: any) {
      dispatch(
        alertError({
          message: i18next.t('staff:MSG_UPDATE_SKILL_ERROR'),
        })
      )

      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)
export const deleteSkillSet = createAsyncThunk(
  'staff/deleteSkillSet',
  async (payload: any, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await StaffService.deleteSkillSet(payload)
      dispatch(
        alertSuccess({
          message: i18next.t('staff:MSG_DELETE_SKILL_ITEM_SUCCESS', {
            skillId: payload.skillId,
          }),
        })
      )
      return res
    } catch (err: any) {
      dispatch(
        alertError({
          message: i18next.t('staff:MSG_DELETE_SKILL_ERROR'),
        })
      )

      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const createNewStaff = createAsyncThunk(
  'staff/createNewStaff',
  async (payload: any, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await StaffService.createNewStaff(payload)
      dispatch(
        alertSuccess({
          message: i18next.t('staff:MSG_CREATE_STAFF_SUCCESS', {
            staffId: res.data?.general?.code || '',
          }),
        })
      )
      return res
    } catch (err: any) {
      if (err[0]?.code === 'staff.email-exist') {
        dispatch(
          alertError({
            message: err[0]?.title || '',
          })
        )
      } else if (err && err[0]?.field === 'email') {
        dispatch(
          alertError({
            message: err[0].message || '',
          })
        )
      } else {
        dispatch(
          alertError({
            message: i18next.t('staff:MSG_CREATE_STAFF_ERROR'),
          })
        )
      }

      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)
export const createNewHrOutsourcing = createAsyncThunk(
  'staff/createNewHrOutsourcing',
  async (payload: any, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await StaffService.createNewHrOutsourcing(payload)
      dispatch(
        alertSuccess({
          message: i18next.t('staff:MSG_CREATE_HR_OUTSOURCING_SUCCESS', {
            staffId: res.data?.code || '',
          }),
        })
      )
      return res
    } catch (err: any) {
      if (err[0]?.code === 'staff.email-exist') {
        dispatch(
          alertError({
            message: err[0]?.title || '',
          })
        )
      } else if (err && err[0]?.field === 'email') {
        dispatch(
          alertError({
            message: err[0].message || '',
          })
        )
      } else {
        dispatch(
          alertError({
            message: i18next.t('staff:MSG_CREATE_HR_OUTSOURCING_ERROR'),
          })
        )
      }

      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const updateStaffGeneralInfo = createAsyncThunk(
  'staff/updateStaffGeneralInfo',
  async (payload: any, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await StaffService.updateStaffGeneralInfo(payload)
      dispatch(
        alertSuccess({
          message: i18next.t('staff:MSG_UPDATE_STAFF_SUCCESS', {
            staffId: payload.code || '',
          }),
        })
      )
      return res
    } catch (err: any) {
      if (err && err[0]?.title) {
        dispatch(
          alertError({
            message: err[0].title || '',
          })
        )
      } else if (err && err[0]?.field === 'email') {
        dispatch(
          alertError({
            message: err[0].message || '',
          })
        )
      } else {
        dispatch(
          alertError({
            message: i18next.t('staff:MSG_UPDATE_STAFF_ERROR', {
              staffId: payload.id,
            }),
          })
        )
      }
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)
export const updateStaffOutsourceInfo = createAsyncThunk(
  'staff/updateStaffOutsourceInfo',
  async (payload: any, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await StaffService.updateStaffOutsourceInfo(payload)
      dispatch(
        alertSuccess({
          message: i18next.t('staff:MSG_UPDATE_STAFF_SUCCESS', {
            staffId: payload.code || '',
          }),
        })
      )
      return res
    } catch (err: any) {
      if (err && err[0]?.title) {
        dispatch(
          alertError({
            message: err[0].title || '',
          })
        )
      } else if (err && err[0]?.field === 'email') {
        dispatch(
          alertError({
            message: err[0].message || '',
          })
        )
      } else {
        dispatch(
          alertError({
            message: i18next.t('staff:MSG_UPDATE_STAFF_ERROR', {
              staffId: payload.id,
            }),
          })
        )
      }
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const deleteStaff = createAsyncThunk(
  'staff/deleteStaff',
  async (payload: DeleteStaffPayload, { rejectWithValue, dispatch }) => {
    try {
      const res = await StaffService.deleteStaff(payload.id)
      dispatch(
        alertSuccess({
          message: i18next.t('staff:MSG_DELETE_STAFF_SUCCESS', {
            code: payload.code,
          }),
        })
      )
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const deleteStaffOutsource = createAsyncThunk(
  'staff/deleteStaffOutsource',
  async (payload: DeleteStaffPayload, { rejectWithValue, dispatch }) => {
    try {
      const res = await StaffService.deleteStaffOutsource(payload.id)
      dispatch(
        alertSuccess({
          message: i18next.t('staff:MSG_DELETE_STAFF_SUCCESS', {
            code: payload.code,
          }),
        })
      )
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getStaffProject = createAsyncThunk(
  'staff/getStaffProject',
  async (
    payload: { staffId: string; pageNum: number; pageSize: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await StaffService.getStaffProject(payload)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const exportStaffSkillSet = createAsyncThunk(
  'staff/exportStaffSkillSet',
  async (
    { staffId, requestBody }: { staffId: string; requestBody: any },
    { rejectWithValue }
  ) => {
    try {
      const res = await StaffService.exportStaffSkillSet({
        staffId,
        requestBody,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const updateSkillSetStaffDetail = createAsyncThunk(
  'staff/updateSkillSetStaffDetail',
  async (
    {
      staffId,
      requestBody,
    }: { staffId: string; requestBody: UpdateSkillSetStaffDetail[] },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await StaffService.updateSkillSetStaffDetail({
        staffId,
        requestBody,
      })
      dispatch(
        alertSuccess({
          message: i18next.t('staff:MSG_UPDATE_SKILL_SUCCESS'),
        })
      )
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)
export const updateChangeStatus = createAsyncThunk(
  'staff/updateChangeStatus',
  async (
    {
      id,
      requestBody,
    }: {
      id: string
      requestBody: {
        endDate: number
        note: string
        startDate: number
        status: any
        estimateTo?: any
      }
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await StaffService.updateChangeStatus({
        id,
        requestBody,
      })
      dispatch(
        alertSuccess({
          message: res.message,
        })
      )
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getDashboardStaff = createAsyncThunk(
  'staff/getDashboardStaff',
  async (queries: StaffQueriesDashboard, { rejectWithValue }) => {
    try {
      const res = await StaffService.getDashboardStaff(queries)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const downLoadImageUrl = createAsyncThunk(
  'staff/downloadImage',
  async (payload: any, { rejectWithValue }) => {
    try {
      const res = await StaffService.downloadImage(payload)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const exportStaffList = createAsyncThunk(
  'staff/exportStaffList',
  async (payload: IExportListToExcelBody, { rejectWithValue }) => {
    try {
      const res = await StaffService.exportListToExcel(payload)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const exportListHROutsourceToExcel = createAsyncThunk(
  'staff/exportListHROutsourceToExcel',
  async (payload: IExportListToExcelBody, { rejectWithValue }) => {
    try {
      const res = await StaffService.exportListHROutsourceToExcel(payload)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

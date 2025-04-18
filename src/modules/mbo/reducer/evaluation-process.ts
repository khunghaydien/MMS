import { TableConstant } from '@/const'
import {
  alertError,
  alertSuccess,
  commonErrorAlert,
  updateLoading,
} from '@/reducer/screen'
import { RootState } from '@/store'
import { FileItem } from '@/types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { CancelTokenSource, HttpStatusCode } from 'axios'
import i18next from 'i18next'
import { ACHIEVEMENT_STATUS, EVALUATION_CYCLE_STATUS } from '../const'
import {
  AchievementListItemView,
  CriteriaRequest,
  ECListQueryParameters,
  ECListQueryParametersReviewer,
  EvaluationCycleItem,
  EvaluationCycleProjectMember,
  EvaluationTaskForm,
  IAppraiser,
  IJobResultAndAttitude,
  IPayloadAddNewTaskEvaluation,
  IQueryEvaluationAppraisees,
  IQueryParametersSummary,
  IQueryParametersTaskDetailByEvaluation,
  SummaryState,
  UpdateAchievementPayload,
} from '../models'
import EvaluationProcessService from '../services/evaluation-process.service'
import { formatAppraiserAttitude, formatDataEvaluation } from '../utils'

export const getPresentAndFutureEvaluationCycle = createAsyncThunk(
  'evaluationProcess/getPresentAndFutureEvaluationCycle',
  async (_, { rejectWithValue }) => {
    try {
      const source = axios.CancelToken.source()
      const res =
        await EvaluationProcessService.getPresentAndFutureEvaluationCycle({
          cancelToken: source.token,
        })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getCompletedEvaluationCycle = createAsyncThunk(
  'evaluationProcess/getCompletedEvaluationCycle',
  async (
    queryParameters: ECListQueryParameters,
    { rejectWithValue, dispatch }
  ) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelECList(source))
      const res = await EvaluationProcessService.getCompletedEvaluationCycle(
        queryParameters,
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

export const getPresentAndFutureEvaluationCycleForTeamMemberView =
  createAsyncThunk(
    'evaluationProcess/getPresentAndFutureEvaluationCycleForTeamMemberView',
    async (_, { rejectWithValue }) => {
      try {
        const source = axios.CancelToken.source()
        const res =
          await EvaluationProcessService.getPresentAndFutureEvaluationCycleForTeamMemberView(
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

export const getCompletedEvaluationCycleForTeamMemberView = createAsyncThunk(
  'evaluationProcess/getCompletedEvaluationCycleForTeamMemberView',
  async (
    queryParameters: ECListQueryParameters,
    { rejectWithValue, dispatch }
  ) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelECList(source))
      const res =
        await EvaluationProcessService.getCompletedEvaluationCycleForTeamMemberView(
          queryParameters,
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

export const getInProgressProjectMember = createAsyncThunk(
  'evaluationProcess/getInProgressProjectMember',
  async (queryParameters: ECListQueryParameters, { rejectWithValue }) => {
    try {
      const res = await EvaluationProcessService.getInProgressProjectMember(
        queryParameters
      )
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getCompletedProjectMember = createAsyncThunk(
  'evaluationProcess/getCompletedProjectMember',
  async (
    queryParameters: ECListQueryParameters,
    { rejectWithValue, dispatch }
  ) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelECList(source))
      const res = await EvaluationProcessService.getCompletedProjectMember(
        queryParameters,
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

export const getEvaluationCycleProcessDetail = createAsyncThunk(
  'evaluationProcess/getEvaluationCycleProcessDetail',
  async (queryParameters: IQueryParametersSummary, { rejectWithValue }) => {
    try {
      const res =
        await EvaluationProcessService.findTaskSummaryByEvaluationCycleId(
          queryParameters
        )
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const findTaskDetailByEvaluationCycleId = createAsyncThunk(
  'evaluationProcess/findTaskDetailByEvaluationCycleId',
  async (
    queryParameters: IQueryParametersTaskDetailByEvaluation,
    { rejectWithValue, dispatch }
  ) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelECList(source))
      const res =
        await EvaluationProcessService.findTaskDetailByEvaluationCycleId(
          queryParameters,
          { cancelToken: source.token }
        )
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getDurations = createAsyncThunk(
  'evaluationProcess/getDurations',
  async (typeDuration: number, { rejectWithValue }) => {
    try {
      const res = await EvaluationProcessService.getDurations(typeDuration)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getDurationForReviewer = createAsyncThunk(
  'evaluationProcess/getDurationForReviewer',
  async (tab: number, { rejectWithValue }) => {
    try {
      const source = axios.CancelToken.source()
      const res = await EvaluationProcessService.getDurationForReviewer(tab, {
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getDurationForTeamMemberView = createAsyncThunk(
  'evaluationProcess/getDurationForTeamMemberView',
  async (_, { rejectWithValue }) => {
    try {
      const source = axios.CancelToken.source()
      const res = await EvaluationProcessService.getDurationForTeamMemberView({
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const createTask = createAsyncThunk(
  'evaluationProcess/createTask',
  async (
    payload: {
      isAttitude: boolean
      evaluationCycleId: string
      requestBody: EvaluationTaskForm
    },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await EvaluationProcessService.createTask(payload)
      dispatch(
        alertSuccess({
          message: i18next.t('mbo:MSG_COMPLETE_CREATE_TASK', {
            taskName: payload.requestBody.name,
            task: payload.isAttitude ? 'attitude' : 'task',
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

export const createTaskEvaluation = createAsyncThunk(
  'evaluationProcess/createTaskEvaluation',
  async (
    payload: {
      staffName: string
      evaluationName: string
      taskId: string
      evaluationCycleId: string
      requestBody: IPayloadAddNewTaskEvaluation
    },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await EvaluationProcessService.createTaskEvaluation(payload)
      dispatch(
        alertSuccess({
          message: i18next.t('mbo:MSG_COMPLETE_STAFF_EVALUATION', {
            staffName: payload.staffName,
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

export const approvedStatus = createAsyncThunk(
  'evaluationProcess/approvedStatus',
  async (
    payload: {
      staffName: string
      evaluationName: string
      evaluationCycleId: string
      taskId: string
    },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await EvaluationProcessService.approvedStatus(payload)
      dispatch(
        alertSuccess({
          message: i18next.t('mbo:MSG_COMPLETE_STAFF_EVALUATION', {
            staffName: payload.staffName,
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

export const submitForStaff = createAsyncThunk(
  'evaluationProcess/submitForStaff',
  async (
    payload: {
      evaluationCycleId: string
      evaluationCycleStaffId: string
      staffName: string
    },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await EvaluationProcessService.submitForStaff(payload)
      dispatch(
        alertSuccess({
          message: i18next.t('mbo:MSG_COMPLETE_STAFF_EVALUATION', {
            staffName: payload.staffName,
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

export const updateEvaluationTaskEvaluation = createAsyncThunk(
  'evaluationProcess/updateEvaluationTaskEvaluation',
  async (
    payload: {
      isAttitude: boolean
      isAppraiseeUpdate: boolean
      staffName: string
      evaluationCycleId: string
      taskId: string
      requestBody: any
      evaluationName: string
    },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await EvaluationProcessService.updateEvaluationTaskEvaluation(
        payload
      )
      dispatch(
        alertSuccess({
          message: payload.isAppraiseeUpdate
            ? i18next.t('mbo:MSG_UPDATE_TASK_FOR_APPRAISEE', {
              taskName: payload.evaluationName,
              task: payload.isAttitude ? 'attitude' : 'task',
            })
            : i18next.t('mbo:MSG_UPDATE_STAFF_EVALUATION', {
              staffName: payload.staffName,
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

export const updateEvaluationTask = createAsyncThunk(
  'evaluationProcess/updateEvaluationTask',
  async (
    payload: {
      isAttitude: boolean
      isAppraiseeUpdate: boolean
      staffName: string
      evaluationCycleId: string
      taskId: string
      requestBody: any
      evaluationName: string
    },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await EvaluationProcessService.updateEvaluationTask(payload)
      dispatch(
        alertSuccess({
          message: payload.isAppraiseeUpdate
            ? i18next.t('mbo:MSG_UPDATE_TASK_FOR_APPRAISEE', {
              taskName: payload.evaluationName,
              task: payload.isAttitude ? 'attitude' : 'task',
            })
            : i18next.t('mbo:MSG_UPDATE_STAFF_EVALUATION', {
              staffName: payload.staffName,
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

export const getPresentAndFutureEvaluationCycleForReviewer = createAsyncThunk(
  'evaluationProcess/getPresentAndFutureEvaluationCycleForReviewer',
  async (tab: number, { rejectWithValue }) => {
    try {
      const source = axios.CancelToken.source()
      const res =
        await EvaluationProcessService.getPresentAndFutureEvaluationCycleForReviewer(
          {
            cancelToken: source.token,
          },
          tab
        )
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const findCriteriaGroupByEvaluationCycleAndWorkType = createAsyncThunk(
  'evaluationProcess/findCriteriaGroupByEvaluationCycleAndWorkType',
  async (
    payload: {
      evaluationCycleId: string
    },
    { rejectWithValue }
  ) => {
    try {
      const res =
        await EvaluationProcessService.findCriteriaGroupByEvaluationCycleAndWorkType(
          payload
        )
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getCompletedEvaluationCycleForReviewer = createAsyncThunk(
  'evaluationProcess/getCompletedEvaluationCycleForReviewer',
  async (
    QueryParametersReviewer: ECListQueryParametersReviewer,
    { rejectWithValue, dispatch }
  ) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelECList(source))
      const res =
        await EvaluationProcessService.getCompletedEvaluationCycleForReviewer(
          QueryParametersReviewer,
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

export const getAttitudeSummary = createAsyncThunk(
  'evaluationProcess/getAttitudeSummary',
  async (
    payload: { evaluationCycleId: string; staffId: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await EvaluationProcessService.getAttitudeSummary(payload)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const deleteTask = createAsyncThunk(
  'evaluationProcess/deleteTask',
  async (
    payload: { evaluationCycleId: string; taskId: string },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await EvaluationProcessService.deleteTask(payload)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const deleteComment = createAsyncThunk(
  'evaluationProcess/deleteComment',
  async (
    payload: {
      evaluationCycleId: string
      taskId: string
      evaluationCycleStaffId: string
      evaluationPeriodId: string
    },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await EvaluationProcessService.deleteComment(payload)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const addCommentForReviewer = createAsyncThunk(
  'evaluationProcess/addCommentForReviewer',
  async (
    payload: {
      evaluationCycleId: string
      taskId: string
      comment: string
      evaluationCycleStaffId: string
      evaluationPeriodId: string
    },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await EvaluationProcessService.addCommentForReviewer(payload)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const createEvaluationPeriod = createAsyncThunk(
  'evaluationProcess/createEvaluationPeriod',
  async (
    payload: {
      evaluationCycleId: string
      evaluationCycleStaffId: string
      requestBody: any
    },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await EvaluationProcessService.createEvaluationPeriod(payload)
      let message = ''
      if (payload.requestBody.isDraft) {
        message = i18next.t('mbo:MSG_EVALUATE_DRAFT_EVALUATION', {
          labelName: payload.requestBody.name,
        })
      } else {
        message = i18next.t('mbo:MSG_COMPLETE_CREATE_EVALUATION', {
          name: payload.requestBody.name,
        })
      }
      dispatch(
        alertSuccess({
          message,
        })
      )
      return res
    } catch (err: any) {
      dispatch(
        alertError({
          message: err[0]?.message || 'An error has occurred',
        })
      )
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const updateEvaluationPeriod = createAsyncThunk(
  'evaluationProcess/updateEvaluationPeriod',
  async (
    payload: {
      evaluationCycleId: string
      evaluationCycleStaffId: string
      evaluationPeriodId: string
      request: any
    },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await EvaluationProcessService.updateEvaluationPeriod(payload)
      if (res.status === HttpStatusCode.Ok) {
        dispatch(
          alertSuccess({
            message: i18next.t('mbo:MSG_UPDATE_EVALUATION_SUCCESS', {
              name: payload.request.name,
            }),
          })
        )
      }
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

export const deleteEvaluationPeriod = createAsyncThunk(
  'evaluationProcess/deleteEvaluationPeriod',
  async (
    payload: {
      evaluationCycleId: string
      evaluationPeriodId: string
      evaluationCycleStaffId: string
    },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await EvaluationProcessService.deleteEvaluationPeriod(payload)
      if (res.status === HttpStatusCode.Ok) {
        dispatch(
          alertSuccess({
            message: i18next.t('mbo:MSG_DELETE_EVALUATION_SUCCESS'),
          })
        )
      }
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const evaluateEvaluationPeriod = createAsyncThunk(
  'evaluationProcess/updateEvaluationPeriod',
  async (
    payload: {
      evaluationCycleId: string
      evaluationCycleStaffId: string
      evaluationPeriodId: string
      isEvaluate?: boolean
      staffName?: string
      request: any
      evaluationName?: string
    },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await EvaluationProcessService.evaluateEvaluationPeriod(
        payload
      )
      if (payload.isEvaluate) {
        if (payload.request.isDraft) {
          dispatch(
            alertSuccess({
              message: i18next.t('mbo:MSG_EVALUATE_DRAFT_EVALUATION', {
                labelName: payload.evaluationName,
              }),
            })
          )
        } else {
          dispatch(
            alertSuccess({
              message: i18next.t('mbo:MSG_COMPLETE_STAFF_EVALUATION', {
                staffName: payload.staffName,
              }),
            })
          )
        }
      } else {
        dispatch(
          alertSuccess({
            message: i18next.t('common:MSG_UPDATE_SUCCESS', {
              labelName: i18next.t('mbo:LB_EVALUATION_PERIOD'),
            }),
          })
        )
      }
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const updateTaskEvaluation = createAsyncThunk(
  'evaluationProcess/updateTaskEvaluation',
  async (
    payload: {
      evaluationCycleId: string
      evaluationCycleStaffId: string
      evaluationPeriodId: string
      request: any
    },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await EvaluationProcessService.updateTaskEvaluation(payload)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const revertEvaluationPeriod = createAsyncThunk(
  'evaluationProcess/revertEvaluationPeriod',
  async (
    payload: {
      evaluationCycleId: string
      evaluationCycleStaffId: string
      evaluationPeriodId: string
      saveDraft: boolean
      name: string
    },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await EvaluationProcessService.revertEvaluationPeriod(payload)
      dispatch(
        alertSuccess({
          message: i18next.t('mbo:MSG_EVALUATION_PERIOD_REVERTED', {
            name: payload.name,
          }),
        })
      )
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const clearEvaluationPeriod = createAsyncThunk(
  'evaluationProcess/revertEvaluationPeriod',
  async (
    payload: {
      evaluationCycleId: string
      evaluationCycleStaffId: string
      evaluationPeriodId: string
      saveDraft: boolean
      name: string
    },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await EvaluationProcessService.revertEvaluationPeriod(payload)
      if (payload.saveDraft) {
        dispatch(
          alertSuccess({
            message: i18next.t('mbo:MSG_EVALUATE_DRAFT_EVALUATION', {
              labelName: payload.name,
            }),
          })
        )
      } else {
        dispatch(
          alertSuccess({
            message: i18next.t('mbo:MSG_EVALUATION_PERIOD_CLEAR', {
              name: payload.name,
            }),
          })
        )
      }
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const approveEvaluationPeriod = createAsyncThunk(
  'evaluationProcess/approveEvaluationPeriod',
  async (
    payload: {
      evaluationCycleId: string
      evaluationCycleStaffId: string
      evaluationPeriodId: string
      isRejected: boolean
      name?: string
    },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await EvaluationProcessService.approveEvaluationPeriod(
        payload
      )

      if (payload.isRejected) {
        dispatch(
          alertSuccess({
            message: i18next.t('mbo:MSG_EVALUATION_PERIOD_REJECTED', {
              name: payload.name,
            }),
          })
        )
      } else {
        dispatch(
          alertSuccess({
            message: i18next.t('common:MSG_APPROVE_SUCCESS', {
              labelName: i18next.t('mbo:LB_EVALUATION_PERIOD'),
            }),
          })
        )
      }

      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const getEvaluationPeriod = createAsyncThunk(
  'evaluationProcess/getEvaluationPeriod',
  async (
    payload: { evaluationCycleId: string; evaluationCycleStaffId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await EvaluationProcessService.getEvaluationPeriod(payload)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getECStaffGeneralInfo = createAsyncThunk(
  'evaluationProcess/getECStaffGeneralInfo',
  async (
    payload: {
      evaluationCycleStaffId: string | number
      evaluationCycleId: string | number
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await EvaluationProcessService.getECStaffGeneralInfo(payload)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const createAchievements = createAsyncThunk(
  'evaluationProcess/createAchievements',
  async (
    payload: {
      achievements: AchievementListItemView[]
      evaluationCycleId: string | number
      evaluationCycleStaffId: string | number
      status: number
    },
    { dispatch, rejectWithValue }
  ) => {
    dispatch(updateLoading(true))
    try {
      const formData = new FormData()
      let allEvidences: FileItem[] = []
      payload.achievements.forEach(achievementItem => {
        allEvidences = [...allEvidences, ...(achievementItem?.evidences || [])]
      })
      allEvidences.forEach((evidence: FileItem) => {
        formData.append('certificate', evidence.FileObject)
      })
      formData.append(
        'requestBody',
        JSON.stringify(
          payload.achievements.map(achievementItem => {
            const newAchievement = {
              ...achievementItem,
              status: payload.status,
              startDate: achievementItem.startDate || 0,
              endDate: achievementItem.endDate || 0,
              rateOverTotalScore: achievementItem.rateOverTotalScore || 0,
              indexEvidence:
                achievementItem?.evidences?.map(evidence =>
                  allEvidences.findIndex(
                    evidenceFromAllEvidences =>
                      evidenceFromAllEvidences.id === evidence.id
                  )
                ) || [],
            }
            delete newAchievement.evidences
            delete newAchievement.id
            return newAchievement
          })
        )
      )
      const res = await EvaluationProcessService.createAchievements({
        formData,
        evaluationCycleId: payload.evaluationCycleId,
        evaluationCycleStaffId: payload.evaluationCycleStaffId,
      })
      dispatch(
        alertSuccess({
          message:
            payload.status === ACHIEVEMENT_STATUS.NOT_APPROVED
              ? i18next.t('mbo:MSG_CREATE_ACHIEVEMENTS_SUCCESS')
              : i18next.t('mbo:MSG_SAVED_AS_DRAFT_ACHIEVEMENTS_SUCCESS'),
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

export const updateAchievement = createAsyncThunk(
  'evaluationProcess/updateAchievement',
  async (payload: UpdateAchievementPayload, { dispatch, rejectWithValue }) => {
    dispatch(updateLoading(true))
    try {
      const formData = new FormData()
      formData.append('requestBody', JSON.stringify(payload.requestBody))
      payload.evidences.forEach((evidence: FileItem) => {
        formData.append('certificate', evidence.FileObject)
      })
      const res = await EvaluationProcessService.updateAchievement(
        payload,
        formData
      )
      let message = ''
      if (payload.requestBody.status === ACHIEVEMENT_STATUS.DRAFT) {
        message = i18next.t('mbo:MSG_EVALUATE_DRAFT_EVALUATION', {
          labelName: payload.requestBody.name,
        })
      } else {
        message = i18next.t('common:MSG_UPDATE_SUCCESS', {
          labelName: `${i18next.t('mbo:LB_ACHIEVEMENT')}: ${payload.preAchievementName
            }`,
        })
      }
      dispatch(
        alertSuccess({
          message,
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

export const deleteAchievement = createAsyncThunk(
  'evaluationProcess/deleteAchievement',
  async (
    payload: {
      evaluationCycleId: string | number
      evaluationCycleStaffId: string | number
      achievementId: string | number
      achievementName: string
    },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await EvaluationProcessService.deleteAchievement(payload)
      dispatch(
        alertSuccess({
          message: i18next.t('common:MSG_DELETE_SUCCESS', {
            labelName: payload.achievementName,
          }),
        })
      )
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const reviewerActionsOnAchievement = createAsyncThunk(
  'evaluationProcess/reviewerActionsOnAchievement',
  async (
    payload: {
      evaluationCycleId: string | number
      evaluationCycleStaffId: string | number
      achievementId: string | number
      achievementName: string
      requestBody: {
        comment: string
        status: number
      }
    },
    { dispatch, rejectWithValue }
  ) => {
    dispatch(updateLoading(true))
    try {
      let i18FormatMessage = ''
      if (payload.requestBody.status === ACHIEVEMENT_STATUS.APPROVED) {
        i18FormatMessage = 'common:MSG_APPROVE_SUCCESS'
      } else if (
        payload.requestBody.status === ACHIEVEMENT_STATUS.NOT_APPROVED
      ) {
        i18FormatMessage = 'common:MSG_REVERT_SUCCESS'
      } else {
        i18FormatMessage = 'common:MSG_REJECT_SUCCESS'
      }
      const res = await EvaluationProcessService.reviewerActionsOnAchievement(
        payload
      )
      dispatch(
        alertSuccess({
          message: i18next.t(i18FormatMessage, {
            labelName: payload.achievementName,
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

export const getEvaluationSummary = createAsyncThunk(
  'evaluationProcess/getEvaluationSummary',
  async (
    payload: {
      evaluationCycleId: string | number
      evaluationCycleStaffId: string | number
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await EvaluationProcessService.getEvaluationSummary(payload)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export interface EvaluationProcessState {
  evaluationCycleList: EvaluationCycleItem[]
  evaluationCycleListCompleted: EvaluationCycleItem[]
  evaluationCycleListProjectMember: EvaluationCycleProjectMember[]
  evaluationCycleListProjectMemberCompleted: EvaluationCycleProjectMember[]
  isTaskFetching: boolean
  isEvaluationCycleListFetching: boolean
  isEvaluationCycleListCompletedFetching: boolean
  ecListQueryParameters: ECListQueryParameters
  ecListQueryParametersForTeamMember: ECListQueryParameters
  ecListQueryParametersForProjectMemberInProgress: ECListQueryParameters
  ecListQueryParametersForProjectMemberCompleted: ECListQueryParameters
  ecListTotalElements: number
  ecListTotalElementsForTeamMember: number
  ecListTotalElementsForProjectMemberInProgress: number
  ecListTotalElementsForProjectMemberCompleted: number
  cancelECList: CancelTokenSource | null
  durationDetail: number
  cycleInformation: any
  listJobResultAndAttitude: IJobResultAndAttitude[]
  attitudeSummary: {
    criteria: CriteriaRequest[]
    appraisee?: IAppraiser
    appraisers: IAppraiser[]
    finalScore: number
    finalAppraiser2: number
  }
  queryEvaluationAppraisees: IQueryEvaluationAppraisees
  evidences: FileItem[]
  durationEvaluationProcess: number
  isCycleInformationLoading: boolean
  summary: SummaryState
}

const initialState: EvaluationProcessState = {
  evaluationCycleList: [],
  evaluationCycleListCompleted: [],
  evaluationCycleListProjectMember: [],
  evaluationCycleListProjectMemberCompleted: [],
  isTaskFetching: false,
  isEvaluationCycleListFetching: false,
  isEvaluationCycleListCompletedFetching: false,
  ecListQueryParameters: {
    pageNum: 1,
    pageSize: TableConstant.LIMIT_DEFAULT,
  },
  ecListQueryParametersForTeamMember: {
    pageNum: 1,
    pageSize: TableConstant.LIMIT_DEFAULT,
  },
  ecListQueryParametersForProjectMemberInProgress: {
    pageNum: 1,
    pageSize: TableConstant.LIMIT_DEFAULT,
  },
  ecListQueryParametersForProjectMemberCompleted: {
    pageNum: 1,
    pageSize: TableConstant.LIMIT_DEFAULT,
  },
  ecListTotalElements: 0,
  ecListTotalElementsForTeamMember: 0,
  ecListTotalElementsForProjectMemberInProgress: 0,
  ecListTotalElementsForProjectMemberCompleted: 0,
  cancelECList: null,
  durationDetail: 0,
  cycleInformation: {},
  listJobResultAndAttitude: [],
  attitudeSummary: {
    criteria: [],
    appraisers: [],
    finalScore: 0,
    finalAppraiser2: 0,
  },
  queryEvaluationAppraisees: {
    name: '',
    pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
    pageSize: TableConstant.LIMIT_DEFAULT,
    projectId: '',
    status: '',
  },
  evidences: [],
  durationEvaluationProcess: 0,
  isCycleInformationLoading: true,
  summary: {
    jobResult: '',
    attitude: '',
    achievement: '',
    finalEvaluationScore: '',
    evaluationPeriods: [],
    achievements: [],
    rate: 0,
    averageAttitude: '',
    averageFinalScore: '',
    averageJobResult: '',
    totalRate: '',
    totalAchievement: '',
  },
}

export const evaluationProcessSlice = createSlice({
  name: 'evaluationProcess',
  initialState,
  reducers: {
    setInitialEvaluation: () => initialState,
    setQueryEvaluationAppraisees(state, { payload }) {
      state.queryEvaluationAppraisees = payload
    },
    setECListQueryParameters(state, { payload }) {
      state.ecListQueryParameters = payload
    },
    setECListQueryParametersForTeamMember(state, { payload }) {
      state.ecListQueryParametersForTeamMember = payload
    },
    setECListQueryParametersForProjectMemberInProgress(state, { payload }) {
      state.ecListQueryParametersForProjectMemberInProgress = payload
    },
    setECListQueryParametersForProjectMemberCompleted(state, { payload }) {
      state.ecListQueryParametersForProjectMemberCompleted = payload
    },
    setCancelECList(state, { payload }) {
      state.cancelECList = payload
    },
    setCycleInformation(state, { payload }) {
      state.cycleInformation = payload
    },
    setEvidences(state, { payload }) {
      state.evidences = payload
    },
  },
  extraReducers: builder => {
    builder.addCase(getEvaluationCycleProcessDetail.pending, state => {
      state.isTaskFetching = true
    })
    builder.addCase(getEvaluationCycleProcessDetail.fulfilled, state => {
      state.isTaskFetching = false
    })
    builder.addCase(getEvaluationCycleProcessDetail.rejected, state => {
      state.isTaskFetching = false
    })
    builder.addCase(getPresentAndFutureEvaluationCycle.pending, state => {
      state.isEvaluationCycleListFetching = true
    })
    builder.addCase(
      getPresentAndFutureEvaluationCycle.fulfilled,
      (state, { payload }) => {
        state.evaluationCycleList = payload.data
        state.isEvaluationCycleListFetching = false
      }
    )
    builder.addCase(getPresentAndFutureEvaluationCycle.rejected, state => {
      state.isEvaluationCycleListFetching = false
    })
    builder.addCase(getCompletedEvaluationCycle.pending, state => {
      state.isEvaluationCycleListCompletedFetching = true
    })
    builder.addCase(
      getCompletedEvaluationCycle.fulfilled,
      (state, { payload }) => {
        state.evaluationCycleListCompleted = payload.data.content.map(
          (item: EvaluationCycleItem) => ({
            ...item,
            status: { id: EVALUATION_CYCLE_STATUS.COMPLETED },
          })
        )
        state.isEvaluationCycleListCompletedFetching = false
        state.ecListTotalElements = payload.data.totalElements
      }
    )
    builder.addCase(getCompletedEvaluationCycle.rejected, state => {
      state.isEvaluationCycleListCompletedFetching = false
    })
    builder.addCase(
      getPresentAndFutureEvaluationCycleForTeamMemberView.pending,
      state => {
        state.isEvaluationCycleListFetching = true
      }
    )
    builder.addCase(
      getPresentAndFutureEvaluationCycleForTeamMemberView.fulfilled,
      (state, { payload }) => {
        state.evaluationCycleList = payload.data
        state.isEvaluationCycleListFetching = false
      }
    )
    builder.addCase(
      getPresentAndFutureEvaluationCycleForTeamMemberView.rejected,
      state => {
        state.isEvaluationCycleListFetching = false
      }
    )
    builder.addCase(
      getCompletedEvaluationCycleForTeamMemberView.pending,
      state => {
        state.isEvaluationCycleListCompletedFetching = true
      }
    )
    builder.addCase(
      getCompletedEvaluationCycleForTeamMemberView.fulfilled,
      (state, { payload }) => {
        state.evaluationCycleListCompleted = payload.data.content.map(
          (item: EvaluationCycleItem) => ({
            ...item,
            status: { id: EVALUATION_CYCLE_STATUS.COMPLETED },
          })
        )
        state.isEvaluationCycleListCompletedFetching = false
        state.ecListTotalElementsForTeamMember = payload.data.totalElements
      }
    )
    builder.addCase(
      getCompletedEvaluationCycleForTeamMemberView.rejected,
      state => {
        state.isEvaluationCycleListCompletedFetching = false
      }
    )
    builder.addCase(getInProgressProjectMember.pending, state => {
      state.isEvaluationCycleListFetching = true
    })
    builder.addCase(
      getInProgressProjectMember.fulfilled,
      (state, { payload }) => {
        state.evaluationCycleListProjectMember = payload.data.content
        state.isEvaluationCycleListFetching = false
        state.ecListTotalElementsForProjectMemberInProgress =
          payload.data.totalElements
      }
    )
    builder.addCase(getInProgressProjectMember.rejected, state => {
      state.isEvaluationCycleListFetching = false
    })
    builder.addCase(getCompletedProjectMember.pending, state => {
      state.isEvaluationCycleListCompletedFetching = true
    })
    builder.addCase(
      getCompletedProjectMember.fulfilled,
      (state, { payload }) => {
        state.evaluationCycleListProjectMemberCompleted = payload.data.content
        state.isEvaluationCycleListCompletedFetching = false
        state.ecListTotalElementsForProjectMemberCompleted =
          payload.data.totalElements
      }
    )
    builder.addCase(getCompletedProjectMember.rejected, state => {
      state.isEvaluationCycleListCompletedFetching = false
    })
    builder.addCase(findTaskDetailByEvaluationCycleId.pending, state => {
      state.cancelECList?.cancel()
      state.isTaskFetching = true
      state.listJobResultAndAttitude = []
    })
    builder.addCase(
      findTaskDetailByEvaluationCycleId.fulfilled,
      (state, { payload }: any) => {
        state.listJobResultAndAttitude = payload.data?.map(formatDataEvaluation)
        state.isTaskFetching = false
      }
    )
    builder.addCase(findTaskDetailByEvaluationCycleId.rejected, state => {
      state.isTaskFetching = false
    })
    builder.addCase(
      getPresentAndFutureEvaluationCycleForReviewer.pending,
      state => {
        state.isEvaluationCycleListFetching = true
      }
    )
    builder.addCase(
      getPresentAndFutureEvaluationCycleForReviewer.fulfilled,
      (state, { payload }) => {
        state.evaluationCycleList = payload.data
        state.isEvaluationCycleListFetching = false
      }
    )
    builder.addCase(
      getPresentAndFutureEvaluationCycleForReviewer.rejected,
      state => {
        state.isEvaluationCycleListFetching = false
      }
    )
    builder.addCase(getCompletedEvaluationCycleForReviewer.pending, state => {
      state.isEvaluationCycleListCompletedFetching = true
    })
    builder.addCase(
      getCompletedEvaluationCycleForReviewer.fulfilled,
      (state, { payload }) => {
        state.evaluationCycleListCompleted = payload.data.content.map(
          (item: any) => ({
            ...item,
            status: { id: EVALUATION_CYCLE_STATUS.COMPLETED },
          })
        )
        state.isEvaluationCycleListCompletedFetching = false
        state.ecListTotalElements = payload.data.totalElements
      }
    )
    builder.addCase(getCompletedEvaluationCycleForReviewer.rejected, state => {
      state.isTaskFetching = false
      state.isEvaluationCycleListCompletedFetching = false
    })
    builder.addCase(getAttitudeSummary.pending, state => {
      state.isEvaluationCycleListFetching = true
      state.isTaskFetching = true
    })
    builder.addCase(getAttitudeSummary.fulfilled, (state, { payload }) => {
      state.isEvaluationCycleListFetching = false
      state.isTaskFetching = false
      state.attitudeSummary = {
        finalScore: payload.data.finalScore,
        finalAppraiser2: payload.data.finalAppraiser2,
        criteria: payload.data.criteriaGroup?.criteria || [],
        appraisee: formatAppraiserAttitude(payload.data.evaluations[0]) || null,
        appraisers:
          payload.data.evaluations
            ?.filter((evaluation: any, index: number) => index > 0)
            .map((item: any) => formatAppraiserAttitude(item)) || [],
      }
    })
    builder.addCase(getAttitudeSummary.rejected, state => {
      state.isEvaluationCycleListFetching = false
      state.isTaskFetching = false
    })
    builder.addCase(getECStaffGeneralInfo.pending, state => {
      state.isCycleInformationLoading = true
    })
    builder.addCase(getECStaffGeneralInfo.fulfilled, (state, { payload }) => {
      const { data } = payload
      state.durationEvaluationProcess = data.duration || 0
      state.isCycleInformationLoading = false
    })
    builder.addCase(getECStaffGeneralInfo.rejected, state => {
      state.isCycleInformationLoading = false
    })
    builder.addCase(getEvaluationSummary.fulfilled, (state, { payload }) => {
      state.summary = payload.data
    })
  },
})

export const {
  setInitialEvaluation,
  setECListQueryParameters,
  setCancelECList,
  setECListQueryParametersForTeamMember,
  setECListQueryParametersForProjectMemberInProgress,
  setECListQueryParametersForProjectMemberCompleted,
  setCycleInformation,
  setQueryEvaluationAppraisees,
  setEvidences,
} = evaluationProcessSlice.actions
export const evaluationProcessSelector = (state: RootState) =>
  state['evaluationProcess']

export default evaluationProcessSlice.reducer

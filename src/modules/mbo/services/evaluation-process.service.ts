import ApiClientWithToken, { ApiClientFormFile } from '@/api/api'
import { cleanObject } from '@/utils'
import { AxiosRequestConfig } from 'axios'
import {
  ALL_CYCLE,
  DURATION_DEFAULT,
  MBO_TAB_ALL,
  MY_EVALUATION,
  MY_TEAM_MEMBER_EVALUATION,
} from '../const'
import {
  ECListQueryParameters,
  ECListQueryParametersReviewer,
  EvaluationTaskForm,
  IPayloadAddNewTaskEvaluation,
  IQueryParametersSummary,
  IQueryParametersTaskDetailByEvaluation,
  UpdateAchievementPayload,
} from '../models'

export default {
  getPresentAndFutureEvaluationCycle(config: AxiosRequestConfig) {
    return ApiClientWithToken.get(
      '/evaluation-cycle/my-evaluation/present-future',
      {
        ...config,
      }
    )
  },
  getCompletedEvaluationCycle(
    queryParameters: ECListQueryParameters,
    config: AxiosRequestConfig
  ) {
    return ApiClientWithToken.get('/evaluation-cycle/my-evaluation/completed', {
      ...config,
      params: cleanObject(queryParameters),
    })
  },
  getPresentAndFutureEvaluationCycleForTeamMemberView(
    config: AxiosRequestConfig
  ) {
    return ApiClientWithToken.get(
      '/evaluation-cycle/team-member/present-future',
      {
        ...config,
      }
    )
  },
  getCompletedEvaluationCycleForTeamMemberView(
    queryParameters: ECListQueryParameters,
    config: AxiosRequestConfig
  ) {
    return ApiClientWithToken.get('/evaluation-cycle/team-member/completed', {
      ...config,
      params: cleanObject(queryParameters),
    })
  },
  findTaskSummaryByEvaluationCycleId(queryParameters: IQueryParametersSummary) {
    return ApiClientWithToken.get(
      `/evaluation-cycle/${queryParameters.evaluationCycleId}/task-summary/${queryParameters.staffId}`
    )
  },
  findCriteriaGroupByEvaluationCycleAndWorkType(params: {
    evaluationCycleId: string
  }) {
    return ApiClientWithToken.get(
      `/evaluation-cycle/${params.evaluationCycleId}/criteria-group`
    )
  },
  createTask(payload: {
    evaluationCycleId: string
    requestBody: EvaluationTaskForm
  }) {
    return ApiClientWithToken.post(
      `/evaluation-cycle/${payload.evaluationCycleId}/task`,
      payload.requestBody
    )
  },
  createTaskEvaluation(payload: {
    evaluationCycleId: string
    taskId: string
    requestBody: IPayloadAddNewTaskEvaluation
  }) {
    return ApiClientWithToken.post(
      `/evaluation-cycle/${payload.evaluationCycleId}/task/${payload.taskId}/add-evaluation`,
      payload.requestBody
    )
  },
  findTaskDetailByEvaluationCycleId(
    queryParameters: IQueryParametersTaskDetailByEvaluation,
    config: AxiosRequestConfig
  ) {
    return ApiClientWithToken.get(
      `/evaluation-cycle/${queryParameters.evaluationCycleId}/task-detail/${queryParameters.staffId}`,
      {
        ...config,
        params: cleanObject({
          type: queryParameters.type,
        }),
      }
    )
  },
  getDurations(typeDuration: number) {
    switch (typeDuration) {
      case DURATION_DEFAULT:
        return ApiClientWithToken.get(`/evaluation-cycle/duration`)
      case MY_EVALUATION:
        return ApiClientWithToken.get(
          `/evaluation-cycle/my-evaluation/duration`
        )
      case MY_TEAM_MEMBER_EVALUATION:
        return ApiClientWithToken.get(`/evaluation-cycle/team-member/duration`)
    }
  },
  getCycleDetailForTeamMemberView(payload: any) {
    return ApiClientWithToken.get(
      `/evaluation-cycle/${payload.evaluationCycleId}/member-info`,
      {
        params: cleanObject(payload.queries),
      }
    )
  },
  getInProgressProjectMember(queryParameters: ECListQueryParameters) {
    return ApiClientWithToken.get('/evaluation-cycle/project-member', {
      params: cleanObject({ ...queryParameters, tab: 'IN_PROGRESS' }),
    })
  },
  getCompletedProjectMember(
    queryParameters: ECListQueryParameters,
    config: AxiosRequestConfig
  ) {
    return ApiClientWithToken.get('/evaluation-cycle/project-member', {
      ...config,
      params: cleanObject({ ...queryParameters, tab: 'COMPLETED' }),
    })
  },
  approvedStatus(payload: { evaluationCycleId: string; taskId: string }) {
    return ApiClientWithToken.put(
      `/evaluation-cycle/${payload.evaluationCycleId}/task/${payload.taskId}/approve`
    )
  },
  updateEvaluationTaskEvaluation(payload: {
    evaluationCycleId: string
    taskId: string
    requestBody: any
  }) {
    return ApiClientWithToken.put(
      `/evaluation-cycle/${payload.evaluationCycleId}/task/${payload.taskId}/task-evaluation`,
      payload.requestBody
    )
  },
  updateEvaluationTask(payload: {
    evaluationCycleId: string
    taskId: string
    requestBody: any
  }) {
    return ApiClientWithToken.put(
      `/evaluation-cycle/${payload.evaluationCycleId}/task/${payload.taskId}/task`,
      payload.requestBody
    )
  },
  getPresentAndFutureEvaluationCycleForReviewer(
    config: AxiosRequestConfig,
    tab: number
  ) {
    return ApiClientWithToken.get('/evaluation-cycle/reviewer/present-future', {
      ...config,
      params: { tab: tab === MBO_TAB_ALL ? ALL_CYCLE : tab },
    })
  },
  getCompletedEvaluationCycleForReviewer(
    queryParametersReviewer: ECListQueryParametersReviewer,
    config: AxiosRequestConfig
  ) {
    return ApiClientWithToken.get('/evaluation-cycle/reviewer/completed', {
      ...config,
      params: cleanObject({
        ...queryParametersReviewer,
        tab:
          queryParametersReviewer.tab == MBO_TAB_ALL
            ? ALL_CYCLE
            : queryParametersReviewer.tab,
      }),
    })
  },
  getDurationForReviewer(tab: number, config: AxiosRequestConfig) {
    return ApiClientWithToken.get('/evaluation-cycle/reviewer/duration', {
      ...config,
      params: { tab: tab === MBO_TAB_ALL ? ALL_CYCLE : tab },
    })
  },
  getDurationForTeamMemberView(config: AxiosRequestConfig) {
    return ApiClientWithToken.get('/evaluation-cycle/team-member/duration', {
      ...config,
    })
  },
  getAttitudeSummary(payload: { evaluationCycleId: string; staffId: string }) {
    return ApiClientWithToken.get(
      `/evaluation-cycle/${payload.evaluationCycleId}/attitude-summary/${payload.staffId}`
    )
  },
  deleteTask(payload: { evaluationCycleId: string; taskId: string }) {
    return ApiClientWithToken.delete(
      `/evaluation-cycle/${payload.evaluationCycleId}/task/${payload.taskId}`
    )
  },
  addCommentForReviewer(payload: {
    evaluationCycleId: string
    taskId: string
    comment: string
    evaluationCycleStaffId: string
    evaluationPeriodId: string
  }) {
    return ApiClientWithToken.post(
      `/evaluation-cycle/${payload.evaluationCycleId}/evaluation-cycle-staff/${payload.evaluationCycleStaffId}/evaluation-period/${payload.evaluationPeriodId}/task/${payload.taskId}`,
      { comment: payload.comment }
    )
  },
  submitForStaff(payload: {
    evaluationCycleId: string
    evaluationCycleStaffId: string
  }) {
    return ApiClientWithToken.put(
      `/evaluation-cycle/${payload.evaluationCycleId}/evaluation-cycle-staff/${payload.evaluationCycleStaffId}/submit`
    )
  },
  deleteComment(payload: {
    evaluationCycleId: string
    taskId: string
    evaluationCycleStaffId: string
    evaluationPeriodId: string
  }) {
    return ApiClientWithToken.delete(
      `/evaluation-cycle/${payload.evaluationCycleId}/evaluation-cycle-staff/${payload.evaluationCycleStaffId}/evaluation-period/${payload.evaluationPeriodId}/task/${payload.taskId}`
    )
  },

  createEvaluationPeriod(payload: {
    evaluationCycleId: string
    evaluationCycleStaffId: string
    requestBody: any
  }) {
    return ApiClientWithToken.post(
      `/evaluation-cycle/${payload.evaluationCycleId}/evaluation-cycle-staff/${payload.evaluationCycleStaffId}/evaluation-period`,
      payload.requestBody
    )
  },

  updateEvaluationPeriod(payload: {
    evaluationCycleId: string
    evaluationCycleStaffId: string
    evaluationPeriodId: string
    request: any
  }) {
    return ApiClientWithToken.put(
      `/evaluation-cycle/${payload.evaluationCycleId}/evaluation-cycle-staff/${payload.evaluationCycleStaffId}/evaluation-period/${payload.evaluationPeriodId}`,
      payload.request
    )
  },

  updateTaskEvaluation(payload: {
    evaluationCycleId: string
    evaluationCycleStaffId: string
    evaluationPeriodId: string
    request: any
  }) {
    return ApiClientWithToken.put(
      `/evaluation-cycle/${payload.evaluationCycleId}/evaluation-cycle-staff/${payload.evaluationCycleStaffId}/evaluation-period/${payload.evaluationPeriodId}/task-evaluation`,
      payload.request
    )
  },

  revertEvaluationPeriod(payload: {
    evaluationCycleId: string
    evaluationCycleStaffId: string
    evaluationPeriodId: string
    saveDraft: boolean
  }) {
    return ApiClientWithToken.put(
      `/evaluation-cycle/${payload.evaluationCycleId}/evaluation-cycle-staff/${payload.evaluationCycleStaffId}/evaluation-period/${payload.evaluationPeriodId}/revert?saveDraft=${payload.saveDraft}`
    )
  },

  approveEvaluationPeriod(payload: {
    evaluationCycleId: string
    evaluationCycleStaffId: string
    evaluationPeriodId: string
    isRejected: boolean
  }) {
    return ApiClientWithToken.put(
      `/evaluation-cycle/${payload.evaluationCycleId}/evaluation-cycle-staff/${payload.evaluationCycleStaffId}/evaluation-period/${payload.evaluationPeriodId}/approve-reject?isRejected=${payload.isRejected}`,
      {
        params: { isDraft: payload.isRejected },
      }
    )
  },

  evaluateEvaluationPeriod(payload: {
    evaluationCycleId: string
    evaluationCycleStaffId: string
    evaluationPeriodId: string
    request: any
  }) {
    return ApiClientWithToken.put(
      `/evaluation-cycle/${payload.evaluationCycleId}/evaluation-cycle-staff/${payload.evaluationCycleStaffId}/evaluation-period/${payload.evaluationPeriodId}/evaluate`,
      payload.request
    )
  },

  getEvaluationPeriod(payload: {
    evaluationCycleId: string
    evaluationCycleStaffId: string
  }) {
    return ApiClientWithToken.get(
      `evaluation-cycle/${payload.evaluationCycleId}/evaluationCycleStaff/${payload.evaluationCycleStaffId}/evaluation-period`
    )
  },

  deleteEvaluationPeriod(payload: {
    evaluationCycleId: string
    evaluationPeriodId: string
    evaluationCycleStaffId: string
  }) {
    return ApiClientWithToken.delete(
      `evaluation-cycle/${payload.evaluationCycleId}/evaluation-cycle-staff/${payload.evaluationCycleStaffId}/evaluation-period/${payload.evaluationPeriodId}`
    )
  },

  getECStaffGeneralInfo(payload: {
    evaluationCycleStaffId: string | number
    evaluationCycleId: string | number
  }) {
    return ApiClientWithToken.get(
      `/evaluation-cycle/${payload.evaluationCycleId}/evaluation-cycle-staff/${payload.evaluationCycleStaffId}/general-info`
    )
  },

  createAchievements(payload: {
    formData: FormData
    evaluationCycleId: string | number
    evaluationCycleStaffId: string | number
  }) {
    return ApiClientFormFile.post(
      `/evaluation-cycle/${payload.evaluationCycleId}/evaluation-cycle-staff/${payload.evaluationCycleStaffId}/achievement`,
      payload.formData
    )
  },
  getAchievements(payload: {
    evaluationCycleId: string | number
    evaluationCycleStaffId: string | number
  }) {
    return ApiClientWithToken.get(
      `/evaluation-cycle/${payload.evaluationCycleId}/evaluation-cycle-staff/${payload.evaluationCycleStaffId}/achievement`
    )
  },
  deleteAchievement(payload: {
    evaluationCycleId: string | number
    evaluationCycleStaffId: string | number
    achievementId: string | number
  }) {
    return ApiClientWithToken.delete(
      `/evaluation-cycle/${payload.evaluationCycleId}/evaluation-cycle-staff/${payload.evaluationCycleStaffId}/achievement/${payload.achievementId}`
    )
  },
  updateAchievement(payload: UpdateAchievementPayload, formData: FormData) {
    return ApiClientFormFile.put(
      `/evaluation-cycle/${payload.evaluationCycleId}/evaluation-cycle-staff/${payload.evaluationCycleStaffId}/achievement/${payload.achievementId}`,
      formData
    )
  },
  reviewerActionsOnAchievement(payload: {
    evaluationCycleId: string | number
    evaluationCycleStaffId: string | number
    achievementId: string | number
    requestBody: {
      comment: string
      status: number
    }
  }) {
    return ApiClientWithToken.post(
      `/evaluation-cycle/${payload.evaluationCycleId}/evaluation-cycle-staff/${payload.evaluationCycleStaffId}/achievement/${payload.achievementId}/approved`,
      payload.requestBody
    )
  },
  getEvaluationSummary(payload: {
    evaluationCycleId: string | number
    evaluationCycleStaffId: string | number
  }) {
    return ApiClientWithToken.get(
      `/evaluation-cycle/${payload.evaluationCycleId}/evaluation-cycle-staff/${payload.evaluationCycleStaffId}/summary`
    )
  },
}

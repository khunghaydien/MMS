import { selectAuth } from '@/reducer/auth'
import { uuid } from '@/utils'
import { taskNameRegex } from '@/utils/yup'
import i18next from 'i18next'
import { useSelector } from 'react-redux'
import * as Yup from 'yup'
import { EVALUATION_PERIOD_STEP } from '../const'
import {
  EvaluationInformation,
  EvaluationTaskForm,
  TypeOfWork,
} from '../models'

export const initEvaluationForm: EvaluationTaskForm = {
  id: uuid(),
  appraiserId: '',
  typeOfWork: '',
  criteriaGroupId: '',
  name: '',
  difficultyId: '',
  projectId: '',
  effort: '',
  comment: '',
  taskEvaluationDetails: [],
  processingStatus: null,
  reasonDifficulty: '',
}

export const initEvaluationPeriod: EvaluationInformation = {
  name: '',
  startDate: null,
  endDate: null,
  evaluateDate: new Date(),
  taskRequests: [initEvaluationForm],
  attitudes: initEvaluationForm,
  status: EVALUATION_PERIOD_STEP.JOB_RESULT,
  processingStatus: null,
}

export const initEvaluatePeriod = {
  name: '',
  evaluateDate: null,
  taskRequests: [],
  attitudes: [],
  status: EVALUATION_PERIOD_STEP.JOB_RESULT,
}

export const useEvaluateMBOValidation = (
  taskRequests: EvaluationTaskForm[],
  typeOfWorkList?: TypeOfWork[]
) => {
  const { staff } = useSelector(selectAuth)

  const getTaskById = (taskId: number): any => {
    const task: EvaluationTaskForm | any = taskRequests.find(
      task => +task.id === taskId
    )
    return task || {}
  }

  const getDifficultyScore = (
    taskTypeOfWorkId: string | number,
    difficultyId: string | number
  ): any => {
    const typeOfWork = typeOfWorkList?.find(
      item => item?.type?.id == taskTypeOfWorkId
    )
    const difficultyWorkType = typeOfWork?.type?.difficultyWorkType
    const scoreOption = difficultyWorkType?.find(
      item => item?.id == difficultyId
    )
    return scoreOption?.score
  }

  const difficultyHasChanged = (difficultyId: number, taskId: number) => {
    const taskSelected: EvaluationTaskForm | any = getTaskById(taskId)
    return difficultyId !== +taskSelected?.difficultyId
  }

  const evaluateValidation = Yup.object({
    status: Yup.number(),
    attitudes: Yup.array().when('status', {
      is: (status: string | number) =>
        status === EVALUATION_PERIOD_STEP.ATTITUDE,
      then: Yup.array()
        .of(
          Yup.object().shape({
            comment: Yup.string()
              .nullable()
              .when('commentType', {
                is: (commentType: string) => commentType === '1', // 1 = general comment
                then: Yup.string()
                  .nullable()
                  .required(
                    i18next.t('common:MSG_INPUT_REQUIRE', {
                      name: i18next.t('common:LB_COMMENT'),
                    }) as string
                  ),
              }),
            taskEvaluationDetails: Yup.array().of(
              Yup.object().shape({
                criteriaDetailId: Yup.string().required(
                  i18next.t('common:MSG_SELECT_REQUIRE', {
                    name: i18next.t('LB_SCORE'),
                  }) as string
                ),
                comment: Yup.string()
                  .nullable()
                  .when('commentType', {
                    is: (commentType: string) => commentType === '2', // 1 = general comment
                    then: Yup.string()
                      .nullable()
                      .required(
                        i18next.t('common:MSG_INPUT_REQUIRE', {
                          name: i18next.t('common:LB_COMMENT'),
                        }) as string
                      ),
                  }),
              })
            ),
          })
        )
        .min(1),
    }),
    taskRequests: Yup.array().of(
      Yup.object().shape({
        difficultyId: Yup.string().required(
          i18next.t('common:MSG_SELECT_REQUIRE', {
            name: i18next.t('mbo:LB_DIFFICULTY'),
          }) as string
        ),
        comment: Yup.string().when('commentType', {
          is: (commentType: string) => commentType === '1', // 1 = general comment
          then: Yup.string().required(
            i18next.t('common:MSG_INPUT_REQUIRE', {
              name: i18next.t('common:LB_COMMENT'),
            }) as string
          ),
        }),
        reasonDifficulty: Yup.string().when(['difficultyId', 'id'], {
          is: (difficultyId: string, id: number) => {
            const task = getTaskById(id)
            const isAppraiser1 = staff?.id === task.appraiser1Id
            if (task.appraiser1Id === task.appraiser2Id || isAppraiser1) {
              return getDifficultyScore(task.typeOfWork?.id, difficultyId) >= 3
            }
            return !!difficultyId && difficultyHasChanged(+difficultyId, id)
          },
          then: Yup.string().required(
            i18next.t('common:MSG_INPUT_REQUIRE', {
              name: i18next.t('mbo:LB_DIFFICULTY_REASON'),
            }) as string
          ),
        }),
        taskEvaluationDetails: Yup.array().of(
          Yup.object().shape({
            criteriaDetailId: Yup.string()
              .nullable()
              .required(
                i18next.t('common:MSG_SELECT_REQUIRE', {
                  name: i18next.t('LB_SCORE'),
                }) as string
              ),
            comment: Yup.string()
              .nullable()
              .when('commentType', {
                is: (commentType: string) => commentType === '2', // 1 = general comment
                then: Yup.string()
                  .nullable()
                  .required(
                    i18next.t('common:MSG_INPUT_REQUIRE', {
                      name: i18next.t('common:LB_COMMENT'),
                    }) as string
                  ),
              }),
          })
        ),
      })
    ),
  })

  return { evaluateValidation }
}

export const evaluationPeriod = Yup.object({
  status: Yup.number(),
  name: Yup.string()
    .required(
      i18next.t('common:MSG_INPUT_REQUIRE', {
        name: i18next.t('mbo:LB_EVALUATION_NAME'),
      }) as string
    )
    .matches(
      taskNameRegex,
      i18next.t('common:MSG_INPUT_NAME_INVALID', {
        name: i18next.t('mbo:LB_EVALUATION_NAME'),
      }) as string
    ),
  startDate: Yup.number()
    .nullable()
    .required(
      i18next.t('common:MSG_INPUT_DATE_REQUIRE', {
        name: i18next.t('common:LB_START_DATE'),
      }) as string
    ),
  endDate: Yup.number()
    .nullable()
    .required(
      i18next.t('common:MSG_INPUT_DATE_REQUIRE', {
        name: i18next.t('common:LB_END_DATE'),
      }) as string
    ),
  attitudes: Yup.object().when('status', {
    is: (status: number) => status === EVALUATION_PERIOD_STEP.ATTITUDE,
    then: Yup.object({
      appraiserId: Yup.string().required(
        i18next.t('common:MSG_SELECT_REQUIRE', {
          name: i18next.t('mbo:LB_APPRAISER'),
        }) as string
      ),
      comment: Yup.string().when('commentType', {
        is: (commentType: string) => commentType === '1', // 1 = general comment
        then: Yup.string().required(
          i18next.t('common:MSG_INPUT_REQUIRE', {
            name: i18next.t('common:LB_COMMENT'),
          }) as string
        ),
      }),
      taskEvaluationDetails: Yup.array()
        .of(
          Yup.object().shape({
            criteriaDetailId: Yup.string().required(
              i18next.t('common:MSG_SELECT_REQUIRE', {
                name: i18next.t('LB_SCORE'),
              }) as string
            ),
            comment: Yup.string().when('commentType', {
              is: (commentType: string) => commentType === '2', // 1 = general comment
              then: Yup.string().required(
                i18next.t('common:MSG_INPUT_REQUIRE', {
                  name: i18next.t('common:LB_COMMENT'),
                }) as string
              ),
            }),
          })
        )
        .min(1),
    }),
  }),
  taskRequests: Yup.array().of(
    Yup.object().shape({
      name: Yup.string()
        .required(
          i18next.t('common:MSG_INPUT_REQUIRE', {
            name: i18next.t('mbo:LB_TASK_NAME'),
          }) as string
        )
        .matches(
          taskNameRegex,
          i18next.t('common:MSG_INPUT_NAME_INVALID', {
            name: i18next.t('mbo:LB_TASK_NAME'),
          }) as string
        ),
      appraiserId: Yup.string().required(
        i18next.t('common:MSG_SELECT_REQUIRE', {
          name: i18next.t('mbo:LB_APPRAISER'),
        }) as string
      ),
      typeOfWork: Yup.string().required(
        i18next.t('common:MSG_SELECT_REQUIRE', {
          name: i18next.t('mbo:LB_TYPE_OF_WORK'),
        }) as string
      ),
      effort: Yup.string()
        .nullable()
        .required(
          i18next.t('common:MSG_INPUT_REQUIRE', {
            name: i18next.t('mbo:LB_EFFORT'),
          }) as string
        ),
      projectId: Yup.string().required(
        i18next.t('common:MSG_SELECT_REQUIRE', {
          name: i18next.t('common:LB_PROJECT'),
        }) as string
      ),
      comment: Yup.string().when('commentType', {
        is: (commentType: string) => commentType === '1', // 1 = general comment
        then: Yup.string().required(
          i18next.t('common:MSG_INPUT_REQUIRE', {
            name: i18next.t('common:LB_COMMENT'),
          }) as string
        ),
      }),
      taskEvaluationDetails: Yup.array()
        .of(
          Yup.object().shape({
            criteriaDetailId: Yup.string().required(
              i18next.t('common:MSG_SELECT_REQUIRE', {
                name: i18next.t('LB_SCORE'),
              }) as string
            ),
            comment: Yup.string().when('commentType', {
              is: (commentType: string) => commentType === '2', // 1 = general comment
              then: Yup.string().required(
                i18next.t('common:MSG_INPUT_REQUIRE', {
                  name: i18next.t('common:LB_COMMENT'),
                }) as string
              ),
            }),
          })
        )
        .min(1),
    })
  ),
})

export const taskFormValidation = (isReqProject: boolean) =>
  Yup.object({
    name: Yup.string()
      .required(
        i18next.t('common:MSG_INPUT_REQUIRE', {
          name: i18next.t('mbo:LB_TASK_NAME'),
        }) as string
      )
      .matches(
        taskNameRegex,
        i18next.t('common:MSG_INPUT_NAME_INVALID', {
          name: i18next.t('mbo:LB_TASK_NAME'),
        }) as string
      ),
    projectManagerId: Yup.string().required(
      i18next.t('common:MSG_SELECT_REQUIRE', {
        name: i18next.t('mbo:LB_APPRAISER'),
      }) as string
    ),
    typeOfWork: Yup.string().required(
      i18next.t('common:MSG_SELECT_REQUIRE', {
        name: i18next.t('mbo:LB_TYPE_OF_WORK'),
      }) as string
    ),
    projectId: isReqProject
      ? Yup.string().required(
          i18next.t('common:MSG_SELECT_REQUIRE', {
            name: i18next.t('common:LB_PROJECT'),
          }) as string
        )
      : Yup.string(),
    startDate: Yup.number()
      .nullable()
      .required(
        i18next.t('common:MSG_INPUT_DATE_REQUIRE', {
          name: i18next.t('common:LB_START_DATE'),
        }) as string
      ),
    endDate: Yup.number()
      .nullable()
      .required(
        i18next.t('common:MSG_INPUT_DATE_REQUIRE', {
          name: i18next.t('common:LB_END_DATE'),
        }) as string
      ),
    effort: Yup.number()
      .required(
        i18next.t('common:MSG_INPUT_REQUIRE', {
          name: i18next.t('mbo:LB_EFFORT'),
        }) as string
      )
      .max(100, i18next.t('mbo:MSG_INPUT_MAX_EFFORT_100_PERCENT') as string),
  })

export const evaluationFormValidation = Yup.object({
  name: Yup.string()
    .required(
      i18next.t('common:MSG_INPUT_REQUIRE', {
        name: i18next.t('mbo:LB_EVALUATION_NAME'),
      }) as string
    )
    .matches(
      taskNameRegex,
      i18next.t('common:MSG_INPUT_NAME_INVALID', {
        name: i18next.t('mbo:LB_EVALUATION_NAME'),
      }) as string
    ),
  projectManagerId: Yup.string().required(
    i18next.t('common:MSG_SELECT_REQUIRE', {
      name: i18next.t('mbo:LB_APPRAISER'),
    }) as string
  ),
  startDate: Yup.number()
    .nullable()
    .required(
      i18next.t('common:MSG_INPUT_DATE_REQUIRE', {
        name: i18next.t('common:LB_START_DATE'),
      }) as string
    ),
  endDate: Yup.number()
    .nullable()
    .required(
      i18next.t('common:MSG_INPUT_DATE_REQUIRE', {
        name: i18next.t('common:LB_END_DATE'),
      }) as string
    ),
})

export const achievementFormYup = {
  name: Yup.string()
    .trim()
    .required(
      i18next.t('common:MSG_INPUT_REQUIRE', {
        name: i18next.t('mbo:LB_ACHIEVEMENT_NAME'),
      }) as string
    )
    .matches(
      taskNameRegex,
      i18next.t('common:MSG_INPUT_NAME_INVALID', {
        name: i18next.t('mbo:LB_ACHIEVEMENT_NAME'),
      }) as string
    ),
  startDate: Yup.number()
    .nullable()
    .required(
      i18next.t('common:MSG_INPUT_DATE_REQUIRE', {
        name: i18next.t('mbo:LB_ACHIEVEMENT_DATE'),
      }) as string
    ),
  rateOverTotalScore: Yup.string()
    .required(
      i18next.t('common:MSG_INPUT_DATE_REQUIRE', {
        name: i18next.t('mbo:LB_RATE_OVER_TOTAL_SCORE'),
      }) as string
    )
    .test(
      'is-valid-rate',
      i18next.t('common:MSG_RANGE_NUMBER_VALIDATION', {
        labelName: i18next.t('mbo:LB_RATE_OVER_TOTAL_SCORE'),
        min: 0,
        max: 10,
      }) as string,
      (value: string | undefined) => {
        const rate = parseFloat(value || '')
        return !isNaN(rate) && rate >= 0 && rate <= 10
      }
    ),
  evidences: Yup.array().min(
    1,
    i18next.t('common:MSG_SELECT_REQUIRE', {
      name: i18next.t('mbo:LB_EVIDENCE'),
    }) as string
  ),
}

export const achievementValidation = Yup.object({
  achievements: Yup.array().of(Yup.object().shape(achievementFormYup)),
})

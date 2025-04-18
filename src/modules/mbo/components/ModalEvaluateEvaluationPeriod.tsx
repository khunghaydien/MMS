import ConditionalRender from '@/components/ConditionalRender'
import CardForm from '@/components/Form/CardForm'
import FormItem from '@/components/Form/FormItem/FormItem'
import Modal from '@/components/common/Modal'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import CommonStep from '@/components/step/Stepper'
import { LangConstant } from '@/const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { AppDispatch } from '@/store'
import { cleanObject, formatDate, scrollToFirstErrorMessage } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import { useFormik } from 'formik'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { EVALUATION_PERIOD_STEP } from '../const'
import {
  initEvaluatePeriod,
  useEvaluateMBOValidation,
} from '../formik/evaluationProcessFormik'
import { EvaluationTaskForm, TypeOfWork } from '../models'
import {
  EvaluationProcessState,
  evaluationProcessSelector,
  findCriteriaGroupByEvaluationCycleAndWorkType,
} from '../reducer/evaluation-process'
import TaskEvaluateItem from './FormItem/TaskEvaluateItem'

const VALIDATED = '{}'

interface ModalEvaluateEvaluationPeriodProps {
  title: string
  labelSubmit: string
  evaluationPeriodItem: any
  onClose: () => void
  submit: (value: any) => void
  onSaveDraft?: (value: any) => void
  useSaveDraftButton?: boolean
  isNotEvaluated?: boolean
  setIsShowModalEvaluate?: Dispatch<SetStateAction<boolean>>
  setReviewEvaluateId?: Dispatch<SetStateAction<string | null>>
}

const ModalEvaluateEvaluationPeriod = ({
  title,
  labelSubmit,
  onClose,
  submit,
  useSaveDraftButton = false,
  onSaveDraft = value => {},
  evaluationPeriodItem,
  isNotEvaluated,
  setIsShowModalEvaluate,
  setReviewEvaluateId,
}: ModalEvaluateEvaluationPeriodProps) => {
  const classes = useStyles()
  const params = useParams()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)
  const dispatch = useDispatch<AppDispatch>()
  const [isShowModalConfirm, setIsShowModalConfirm] = useState<boolean>(false)
  const CONFIG_EVALUATION_PERIOD_STEP = [
    {
      step: EVALUATION_PERIOD_STEP.JOB_RESULT,
      label: i18Mbo('LB_JOB_RESULT'),
    },
    {
      step: EVALUATION_PERIOD_STEP.ATTITUDE,
      label: i18Mbo('LB_ATTITUDE'),
    },
  ]

  const [taskRequestsAppraiser1, setTaskRequestAppraiser1] = useState<
    EvaluationTaskForm[]
  >([])
  const [flagInitTaskRequest, setFlagInitTaskRequest] = useState(false)
  const [typeOfWorkList, setTypeOfWorkList] = useState<TypeOfWork[]>()

  const { evaluateValidation } = useEvaluateMBOValidation(
    taskRequestsAppraiser1,
    typeOfWorkList
  )

  const {
    values,
    setValues,
    setFieldValue,
    handleSubmit: onSubmit,
    errors,
    touched,
    setTouched,
  } = useFormik({
    initialValues: initEvaluatePeriod,
    validationSchema: evaluateValidation,
    onSubmit: values => {},
  })

  useEffect(() => {
    if (values.taskRequests.length && !flagInitTaskRequest) {
      setTaskRequestAppraiser1(values.taskRequests)
      setFlagInitTaskRequest(true)
    }
  }, [values.taskRequests, flagInitTaskRequest])

  const { cycleInformation }: EvaluationProcessState = useSelector(
    evaluationProcessSelector
  )
  const { staff }: AuthState = useSelector(selectAuth)
  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false)
  const isAttitudeEvaluateAble = evaluationPeriodItem.attitudes.length > 0
  const isJobResultEvaluateAble = evaluationPeriodItem.jobResults.length > 0
  evaluationPeriodItem.currentLoginRole.appraiser_2.length > 0
  const isReviewer = cycleInformation.reviewer?.id == staff?.id
  const isDraft = useMemo(() => {
    if (evaluationPeriodItem.attitudes[0]?.taskEvaluations)
      return Object.keys(
        evaluationPeriodItem.attitudes[0]?.taskEvaluations
      ).some((item: any) => {
        return (
          evaluationPeriodItem.attitudes[0]?.taskEvaluations[item].appraiser
            ?.id === staff?.id &&
          evaluationPeriodItem.attitudes[0]?.taskEvaluations[item].isDraft
        )
      })
  }, [evaluationPeriodItem.attitudes, staff])
  const isSaveDraftButton = useMemo(() => {
    if (useSaveDraftButton && !isNotEvaluated) {
      if (isAttitudeEvaluateAble && isJobResultEvaluateAble) {
        return values.status === EVALUATION_PERIOD_STEP.ATTITUDE
      } else {
        return true
      }
    }
    return false
  }, [
    isAttitudeEvaluateAble,
    isJobResultEvaluateAble,
    values.status,
    isNotEvaluated,
  ])

  const configStep = useMemo(() => {
    if (!(isAttitudeEvaluateAble && isJobResultEvaluateAble)) {
      return []
    } else {
      return CONFIG_EVALUATION_PERIOD_STEP
    }
  }, [isAttitudeEvaluateAble, isJobResultEvaluateAble])

  const handleLabelSubmit = useMemo(() => {
    if (isAttitudeEvaluateAble && isJobResultEvaluateAble) {
      return (
        (values.status === EVALUATION_PERIOD_STEP.JOB_RESULT
          ? i18('LB_NEXT')
          : labelSubmit) || ''
      )
    } else {
      return labelSubmit
    }
  }, [values.status])

  const handleTaskValueChange = (
    index: number,
    keyName: string,
    value: any
  ) => {
    setFieldValue(`taskRequests.${index}.${keyName}`, value)
    if (keyName === 'commentType') {
      setFieldValue(
        `taskRequests.${index}.taskEvaluationDetails`,
        // @ts-ignore
        values.taskRequests[index]?.taskEvaluationDetails?.map(item => ({
          ...item,
          commentType: value,
        }))
      )
    }
  }

  const handleAttitudeChange = (index: number, keyName: string, value: any) => {
    setFieldValue(`attitudes.${index}.${keyName}`, value)

    if (
      keyName === 'commentType' &&
      // @ts-ignore
      !!values.attitudes?.taskEvaluationDetails
    ) {
      setFieldValue(
        `attitudes.${index}.taskEvaluationDetails`,
        // @ts-ignore
        values.attitudes?.taskEvaluationDetails?.map((item: any) => ({
          ...item,
          commentType: value,
        }))
      )
    }
  }

  const handleSubmit = () => {
    setTimeout(() => {
      scrollToFirstErrorMessage()
    })
    onSubmit()
    if (isAttitudeEvaluateAble && isJobResultEvaluateAble) {
      if (values.status === EVALUATION_PERIOD_STEP.JOB_RESULT) {
        if (JSON.stringify(errors) === VALIDATED) {
          setTouched({})
          setFieldValue(`status`, EVALUATION_PERIOD_STEP.ATTITUDE)
        }
      } else if (values.status === EVALUATION_PERIOD_STEP.ATTITUDE) {
        if (isNotEvaluated) {
          onSaveDraft(values)
        } else if (JSON.stringify(errors) === VALIDATED) {
          if (isDraft && evaluationPeriodItem.isUpdated) {
            setIsShowModalConfirm(true)
          } else {
            submit(values)
          }
        }
      }
    } else {
      if (isNotEvaluated) {
        onSaveDraft(values)
      } else if (JSON.stringify(errors) === VALIDATED) {
        if (isDraft && evaluationPeriodItem.isUpdated) {
          setIsShowModalConfirm(true)
        } else {
          submit(values)
        }
      }
    }
  }

  const mapTaskEvaluationDetails = (task: any, role: string) => {
    let comments: string[] = []
    const isAppraiser1Login =
      staff?.id == task.taskEvaluations.appraiser_1?.appraiser.id
    const isAppraiser2Login =
      staff?.id == task.taskEvaluations.appraiser_2.appraiser.id
    const appraiser1OnAction = !!task.taskEvaluations.appraiser_1?.id
    const appraiser2OnAction = !!task.taskEvaluations.appraiser_2.id

    comments = task.taskEvaluations[role]?.taskEvaluationDetails?.map(
      (item: any, index: number) => {
        if (isReviewer) {
          return (
            task.taskEvaluations['reviewer']?.taskEvaluationDetails?.[index]
              ?.comment || ''
          )
        }
        if (isAppraiser1Login) {
          if (appraiser1OnAction) {
            return task.taskEvaluations['appraiser_1'].taskEvaluationDetails[
              index
            ].comment
          } else {
            return ''
          }
        } else if (isAppraiser2Login) {
          if (appraiser2OnAction) {
            return task.taskEvaluations['appraiser_2'].taskEvaluationDetails[
              index
            ].comment
          } else {
            return ''
          }
        }
      }
    )

    return (
      task.taskEvaluations[role]?.taskEvaluationDetails?.map(
        (item: any, index: number) => ({
          criteriaDetailId: item.criteriaDetail.id,
          comment: comments[index],
          commentType: '',
        })
      ) || []
    )
  }
  const [personUpdateName, setPersonUpdateName] = useState(false)
  useEffect(() => {
    let attitudes: any = []
    let taskRequests: any = []
    let status: number = 0
    let generalCommentTask = ''
    let generalCommentAttitude = ''
    if (isJobResultEvaluateAble || isReviewer) {
      taskRequests = evaluationPeriodItem.jobResults.map((item: any) => {
        const isAppraiser1Login =
          staff?.id == item.taskEvaluations.appraiser_1?.appraiser.id
        const isAppraiser2Login =
          staff?.id == item.taskEvaluations.appraiser_2.appraiser.id
        const appraiser1OnAction = !!item.taskEvaluations.appraiser_1?.id
        const appraiser2OnAction = !!item.taskEvaluations.appraiser_2.id

        let taskEvaluationDetails: any = []
        let difficultyId: string = ''
        let difficultyAppraiser1 = ''
        let reasonDifficulty = ''
        if (isReviewer) {
          taskEvaluationDetails = mapTaskEvaluationDetails(item, 'reviewer')
          difficultyId = item.taskEvaluations.reviewer.difficulty?.id
          reasonDifficulty =
            item.taskEvaluations.reviewer.reasonDifficulty || ''
          generalCommentTask = item.taskEvaluations.reviewer?.comment || ''
          setPersonUpdateName(item.taskEvaluations.appraiser_2?.appraiser.name)
        }
        if (isAppraiser1Login) {
          if (appraiser1OnAction) {
            taskEvaluationDetails = mapTaskEvaluationDetails(
              item,
              'appraiser_1'
            )
            difficultyId = item.taskEvaluations.appraiser_1?.difficulty?.id
            reasonDifficulty =
              item.taskEvaluations.appraiser_1?.reasonDifficulty || ''
            generalCommentTask = item.taskEvaluations.appraiser_1?.comment || ''
          } else {
            taskEvaluationDetails = mapTaskEvaluationDetails(item, 'appraisees')
            difficultyId = item.taskEvaluations.appraisees.difficulty?.id
            generalCommentTask = ''
          }
          setPersonUpdateName(item.taskEvaluations.appraisees?.appraiser.name)
        } else if (isAppraiser2Login) {
          if (appraiser2OnAction) {
            taskEvaluationDetails = mapTaskEvaluationDetails(
              item,
              'appraiser_2'
            )
            difficultyId = item.taskEvaluations.appraiser_2.difficulty?.id
            reasonDifficulty =
              item.taskEvaluations.appraiser_2?.reasonDifficulty || ''
            generalCommentTask = item.taskEvaluations.appraiser_2?.comment || ''
            difficultyAppraiser1 =
              item.taskEvaluations.appraiser_1.difficulty?.id
          } else if (appraiser1OnAction) {
            taskEvaluationDetails = mapTaskEvaluationDetails(
              item,
              'appraiser_1'
            )
            difficultyId = item.taskEvaluations.appraiser_1?.difficulty?.id
            reasonDifficulty = ''
            generalCommentTask = ''
            difficultyAppraiser1 =
              item.taskEvaluations.appraiser_1.difficulty?.id
          } else {
            taskEvaluationDetails = mapTaskEvaluationDetails(item, 'appraisees')
            difficultyId = item.taskEvaluations.appraisees.difficulty?.id
            generalCommentTask = ''
          }
          setPersonUpdateName(item.taskEvaluations.appraiser_1?.appraiser.name)
        }
        return {
          id: item.id,
          comment: generalCommentTask,
          criteriaGroupId: item.criteriaGroup.id,
          effort: item.effort,
          name: item.name,
          projectId: item.project?.name || 'none',
          taskEvaluationDetails,
          typeOfWork: item.workTask,
          criteria: item.criteriaGroup.criteria,
          difficultyId,
          reasonDifficulty,
          difficultyAppraiser1,
          appraiser1Id: item.taskEvaluations?.appraiser_1?.appraiser?.id,
          appraiser2Id: item.taskEvaluations?.appraiser_2?.appraiser?.id,
        }
      })
    }

    if (isAttitudeEvaluateAble || isReviewer) {
      attitudes = evaluationPeriodItem.attitudes.map((item: any) => {
        const isAppraiser1Login =
          staff?.id == item.taskEvaluations.appraiser_1?.appraiser.id
        const isAppraiser2Login =
          staff?.id == item.taskEvaluations.appraiser_2.appraiser.id
        const appraiser1OnAction = !!item.taskEvaluations.appraiser_1?.id
        const appraiser2OnAction = !!item.taskEvaluations.appraiser_2.id
        let taskEvaluationDetails: any = []
        if (isReviewer) {
          taskEvaluationDetails = mapTaskEvaluationDetails(item, 'reviewer')
          generalCommentAttitude = item.taskEvaluations.reviewer.comment || ''
        }
        if (isAppraiser1Login) {
          if (appraiser1OnAction) {
            taskEvaluationDetails = mapTaskEvaluationDetails(
              item,
              'appraiser_1'
            )
            generalCommentAttitude =
              item.taskEvaluations.appraiser_1?.comment || ''
          } else {
            taskEvaluationDetails = mapTaskEvaluationDetails(item, 'appraisees')
            generalCommentAttitude = ''
          }
        } else if (isAppraiser2Login) {
          if (appraiser2OnAction) {
            taskEvaluationDetails = mapTaskEvaluationDetails(
              item,
              'appraiser_2'
            )
            generalCommentAttitude =
              item.taskEvaluations.appraiser_2?.comment || ''
          } else if (isAppraiser1Login) {
            taskEvaluationDetails = mapTaskEvaluationDetails(
              item,
              'appraiser_1'
            )
            generalCommentAttitude = ''
          } else {
            taskEvaluationDetails = mapTaskEvaluationDetails(item, 'appraisees')
            generalCommentAttitude = ''
          }
        }
        return {
          id: item.id,
          criteriaGroupId: item.criteriaGroup.id,
          typeOfWork: item.workTask,
          taskEvaluationDetails,
          criteria: item.criteriaGroup.criteria,
          comment: generalCommentAttitude,
        }
      })
    }

    const _formData = {
      name: evaluationPeriodItem.name,
      evaluateDate: evaluationPeriodItem.evaluateDate,
      taskRequests,
      attitudes,
    }
    if (isAttitudeEvaluateAble && !isJobResultEvaluateAble) {
      status = EVALUATION_PERIOD_STEP.ATTITUDE
    }
    setValues({ ...values, ..._formData, status })
  }, [evaluationPeriodItem])

  const getTypeOfWork = () => {
    setIsLoadingModal(true)
    dispatch(
      findCriteriaGroupByEvaluationCycleAndWorkType({
        evaluationCycleId: params.evaluationCycleId || '',
      })
    )
      .unwrap()
      .then((res: AxiosResponse) => {
        setTypeOfWorkList(res.data)
      })
      .finally(() => {
        setIsLoadingModal(false)
      })
  }

  useEffect(() => {
    setIsLoadingModal(true)
    getTypeOfWork()
  }, [])

  const handleReview = () => {
    setIsShowModalConfirm(false)
    if (setIsShowModalEvaluate) {
      setIsShowModalEvaluate(false)
      if (setReviewEvaluateId) setReviewEvaluateId(evaluationPeriodItem.id)
    }
  }

  return (
    <>
      <Modal
        open
        width={1000}
        title={title}
        submitDisabled={isLoadingModal}
        labelSubmit={handleLabelSubmit}
        onSubmit={handleSubmit}
        isButtonCustom={
          values.status === EVALUATION_PERIOD_STEP.ATTITUDE &&
          isAttitudeEvaluateAble &&
          isJobResultEvaluateAble
        }
        isButtonCustom2={isSaveDraftButton}
        onSubmitCustom2={() => onSaveDraft(values)}
        labelButtonCustom={i18('LB_PREVIOUS') || ''}
        labelButtonCustom2={i18('LB_SAVE_DRAFT') || ''}
        colorButtonCustom2={'inherit'}
        onSubmitCustom={() => setFieldValue('status', values.status - 1)}
        onClose={() => onClose()}
        loading={isLoadingModal}
      >
        <Box className={classes.rootModalEvaluateCycle}>
          <Box className={classes.stepper}>
            <CommonStep activeStep={values.status} configSteps={configStep} />
          </Box>

          <ConditionalRender
            conditional={evaluationPeriodItem.jobResults?.length > 0}
          >
            <Box
              sx={cleanObject({
                display:
                  values.status !== EVALUATION_PERIOD_STEP.JOB_RESULT
                    ? 'none'
                    : null,
              })}
            >
              <FormItem label={i18Mbo('LB_EVALUATION_DATE')}>
                <Box className={classes.evaluateDate}>
                  {evaluationPeriodItem.evaluateDate
                    ? formatDate(evaluationPeriodItem.evaluateDate)
                    : formatDate(new Date())}
                </Box>
              </FormItem>
              <ConditionalRender conditional={isJobResultEvaluateAble}>
                <CardForm title={i18Mbo('LB_JOB_RESULT_EVALUATION')}>
                  {values.taskRequests.map((item: any, index) => (
                    <TaskEvaluateItem
                      evaluate={EVALUATION_PERIOD_STEP.JOB_RESULT}
                      key={item.id}
                      index={index}
                      task={item}
                      typeOfWorkList={typeOfWorkList || []}
                      errors={
                        errors.taskRequests ? errors.taskRequests[index] : ''
                      }
                      touched={
                        touched.taskRequests ? touched.taskRequests[index] : ''
                      }
                      setFieldValue={(keyName, value) =>
                        handleTaskValueChange(index, keyName, value)
                      }
                    />
                  ))}
                </CardForm>
              </ConditionalRender>
            </Box>
          </ConditionalRender>

          <ConditionalRender conditional={isAttitudeEvaluateAble}>
            <Box
              sx={cleanObject({
                display:
                  values.status !== EVALUATION_PERIOD_STEP.ATTITUDE
                    ? 'none'
                    : null,
              })}
            >
              <CardForm title={i18Mbo('LB_ATTITUDE_EVALUATION')}>
                {values.attitudes.map((item: any, index: number) => (
                  <TaskEvaluateItem
                    evaluate={EVALUATION_PERIOD_STEP.ATTITUDE}
                    key={item.id}
                    task={item}
                    typeOfWorkList={typeOfWorkList || []}
                    errors={errors.attitudes ? errors.attitudes[index] : ''}
                    touched={touched.attitudes ? touched.attitudes[index] : ''}
                    setFieldValue={(keyName, value) =>
                      handleAttitudeChange(index, keyName, value)
                    }
                  />
                ))}
              </CardForm>
            </Box>
          </ConditionalRender>
        </Box>
      </Modal>
      <ModalDeleteRecords
        labelSubmit={i18Mbo('LB_SUBMIT_ANYWAY')}
        open={isShowModalConfirm}
        onClose={() => setIsShowModalConfirm(false)}
        isReviewButton={true}
        labelButtonCustom={i18('LB_REVIEW') || ''}
        onSubmit={() => {
          submit(values)
        }}
        titleMessage={i18Mbo('LB_EVALUATE_TASK')}
        subMessage={`${personUpdateName} has changed his evaluation. Do you want to review it?`}
        onReview={handleReview}
      />
    </>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootModalEvaluateCycle: {
    display: 'grid',
  },
  stepper: {
    marginBottom: theme.spacing(2),
  },
  evaluateDate: {
    background: theme.color.grey.secondary,
    height: theme.spacing(5),
    width: 'max-content',
    borderRadius: '4px',
    lineHeight: theme.spacing(5),
    padding: theme.spacing(0, 2),
    fontWeight: 700,
  },
}))

export default ModalEvaluateEvaluationPeriod

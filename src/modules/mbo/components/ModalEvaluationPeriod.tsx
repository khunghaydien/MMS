import ConditionalRender from '@/components/ConditionalRender/index.js'
import InputDateFns from '@/components/Datepicker/InputDateFns.js'
import CardForm from '@/components/Form/CardForm/index.js'
import FormItem from '@/components/Form/FormItem/FormItem.js'
import FormLayout from '@/components/Form/FormLayout/index.js'
import ButtonAddPlus from '@/components/buttons/ButtonAddPlus.js'
import Modal from '@/components/common/Modal'
import InputTextLabel from '@/components/inputs/InputTextLabel.js'
import CommonStep from '@/components/step/Stepper.js'
import {
  getEmployeesEvaluation,
  getProjectsEvaluationCycle,
  getWorkingDay,
} from '@/reducer/common.js'
import { alertError } from '@/reducer/screen.js'
import { AppDispatch } from '@/store.js'
import { BackEndGlobalResponse, EventInput, OptionItem } from '@/types/index.js'
import {
  cleanObject,
  formatDate,
  formatNumber,
  scrollToFirstErrorMessage,
  uuid,
} from '@/utils/index.js'
import { Box, CircularProgress, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import { useFormik } from 'formik'
import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { LangConstant } from '../../../const/index.js'
import {
  APPRAISEES_EVALUATED,
  APPRAISER_1_EVALUATED,
  EVALUATION_PERIOD_STEP,
} from '../const.js'
import {
  evaluationPeriod,
  initEvaluationForm,
  initEvaluationPeriod,
} from '../formik/evaluationProcessFormik.js'
import { TypeOfWork } from '../models.js'
import {
  EvaluationProcessState,
  evaluationProcessSelector,
  findCriteriaGroupByEvaluationCycleAndWorkType,
} from '../reducer/evaluation-process.js'
import AttitudeFormItem from './FormItem/AttitudeFormItem.js'
import TaskFormItem from './FormItem/TaskFormItem.js'
const MAX_TASK = 10

interface ModalEvaluationPeriodProps {
  open?: boolean
  useSaveDraftButton?: boolean
  title: string
  finalStepButtonLabel: string
  evaluationPeriodItem?: any
  isDetail?: boolean
  onClose: (keyName: string) => void
  submit: (value: any) => void
  onSaveDraft?: (value: any) => void
  isAddEvaluation: boolean
}

const ModalEvaluationPeriod = ({
  open = true,
  isDetail = false,
  title,
  onClose,
  submit,
  useSaveDraftButton = false,
  onSaveDraft = value => {},
  finalStepButtonLabel,
  evaluationPeriodItem,
  isAddEvaluation,
}: ModalEvaluationPeriodProps) => {
  const classes = useStyles()
  const params = useParams()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)
  const { t: i18 } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const { cycleInformation }: EvaluationProcessState = useSelector(
    evaluationProcessSelector
  )

  const { values, setValues, setFieldValue, errors, touched, handleSubmit } =
    useFormik({
      initialValues: initEvaluationPeriod,
      validationSchema: evaluationPeriod,
      onSubmit: values => {},
    })

  const CONFIG_EVALUATION_PERIOD_STEP = [
    {
      step: EVALUATION_PERIOD_STEP.JOB_RESULT,
      label: i18Mbo('mbo:LB_JOB_RESULT'),
    },
    {
      step: EVALUATION_PERIOD_STEP.ATTITUDE,
      label: i18Mbo('mbo:LB_ATTITUDE'),
    },
  ]

  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false)
  const [days, setDays] = useState(0)
  const [loadingDays, setLoadingDays] = useState(false)
  const [appraisersList, setAppraisersList] = useState<OptionItem[]>()
  const [typeOfWorkList, setTypeOfWorkList] = useState<TypeOfWork[]>()
  const [defaultAppraiser, setDefaultAppraiser] = useState<string>()
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

  const handleAttitudeChange = (keyName: string, value: any) => {
    setFieldValue(`attitudes.${keyName}`, value)
    if (
      keyName === 'commentType' &&
      !!values.attitudes?.taskEvaluationDetails
    ) {
      setFieldValue(
        'attitudes.taskEvaluationDetails',
        values.attitudes?.taskEvaluationDetails?.map((item: any) => ({
          ...item,
          commentType: value,
        }))
      )
    }
  }

  const handleAddNewTask = () => {
    if (values.taskRequests.length < MAX_TASK) {
      setFieldValue('taskRequests', [
        ...values.taskRequests,
        { ...initEvaluationForm, id: uuid(), processingStatus: 1 },
      ])
    } else {
      dispatch(
        alertError({
          message: 'you can only have 10 task',
        })
      )
    }
  }

  const handleDeleteTask = (index: number) => {
    const taskList = JSON.parse(JSON.stringify(values.taskRequests))
    taskList.splice(index, 1)
    setFieldValue('taskRequests', taskList)
  }

  const handleClickPrevious = () => {
    setFieldValue(`status`, EVALUATION_PERIOD_STEP.JOB_RESULT)
  }

  useEffect(() => {
    if (!!values.startDate && !!values.endDate) {
      setLoadingDays(true)
      dispatch(
        getWorkingDay({
          startDate: Number(values.startDate),
          endDate: Number(values.endDate),
        })
      )
        .unwrap()
        .then((res: BackEndGlobalResponse) => {
          setDays(res.data)
        })
        .finally(() => {
          setLoadingDays(false)
        })
    }
  }, [values.startDate, values.endDate])

  const appraisers = useMemo(() => {
    if (appraisersList && appraisersList.length > 0) {
      return appraisersList?.map((item: any) => ({
        id: item.id,
        email: item.email,
        value: item.id,
        code: item.code,
        label: item.name,
        description: item.email,
      }))
    }
  }, [appraisersList])

  const isAttitudeEditAble =
    values?.attitudes.processingStatus === APPRAISEES_EVALUATED
  const isJobResultEditAble = values?.taskRequests?.some(
    (item: any) =>
      item.processingStatus === APPRAISEES_EVALUATED ||
      (item.processingStatus === APPRAISER_1_EVALUATED && isAttitudeEditAble)
  )
  const isDisabledCommonInfo = values?.taskRequests?.some(
    (item: any) =>
      item.processingStatus === APPRAISER_1_EVALUATED && isAttitudeEditAble
  )
  const isEvaluationInformationDisabled =
    (isDetail && (!isAttitudeEditAble || !isJobResultEditAble)) ||
    isDisabledCommonInfo

  const handleSubmitForm = () => {
    if (
      !!configStep.length &&
      values.status === EVALUATION_PERIOD_STEP.JOB_RESULT
    ) {
      setFieldValue(`status`, EVALUATION_PERIOD_STEP.ATTITUDE)
      return
    }
    if (
      !!configStep.length &&
      values.status === EVALUATION_PERIOD_STEP.ATTITUDE
    ) {
      handleSubmit()
      setTimeout(() => {
        scrollToFirstErrorMessage()
      })
      let isJobResultsError =
        !!errors.name ||
        !!errors.startDate ||
        !!errors.endDate ||
        !!errors.taskRequests?.length
      let isAttitudesError = !!errors.attitudes
      if (!isJobResultsError && !isAttitudesError) {
        submit(values)
      } else {
        if (isJobResultsError) {
          setFieldValue(`status`, EVALUATION_PERIOD_STEP.JOB_RESULT)
          setTimeout(() => {
            scrollToFirstErrorMessage()
          })
        }
      }
    }
  }

  const fillFormData = () => {
    let attitudes: any = []
    let taskRequests: any = []
    let status: number = 0
    taskRequests = evaluationPeriodItem.jobResults.map((item: any) => ({
      id: item.id,
      appraiserId: item.taskEvaluations.appraiser_1.appraiser?.id,
      comment: item.taskEvaluations.appraisees.comment,
      criteriaGroupId: item.criteriaGroup?.id,
      difficultyId: item.taskEvaluations.appraisees.difficulty?.id,
      effort: item.effort,
      name: item.name,
      projectId: item.project?.id || 'none',
      processingStatus: item.processingStatus,
      taskEvaluationDetails: item.criteriaGroup?.criteria?.map((itemA: any) => {
        const matchingItemB =
          item.taskEvaluations.appraisees.taskEvaluationDetails.find(
            (itemB: any) => itemB.criteria.id === itemA.id
          )
        if (matchingItemB)
          return {
            comment: matchingItemB.comment,
            criteriaDetailId: matchingItemB.criteriaDetail.id,
            commentType: '2',
          }
        else
          return {
            comment: '',
            criteriaDetailId: '',
            commentType: '2',
          }
      }),
      typeOfWork: item.workTask?.id,
      criteria: item.criteriaGroup?.criteria,
    }))
    attitudes = {
      ...values.attitudes,
      id: evaluationPeriodItem.attitudes[0].id,
      comment:
        evaluationPeriodItem.attitudes[0].taskEvaluations.appraisees.comment,
      appraiserId:
        evaluationPeriodItem.attitudes[0].taskEvaluations.appraiser_1.appraiser
          ?.id,
      criteriaGroupId: evaluationPeriodItem.attitudes[0].criteriaGroup?.id,
      criteria: evaluationPeriodItem.attitudes[0].criteriaGroup?.criteria,
      processingStatus: evaluationPeriodItem.attitudes[0].processingStatus,
      taskEvaluationDetails:
        evaluationPeriodItem.attitudes[0].criteriaGroup?.criteria?.map(
          (itemA: any) => {
            const matchingItemB =
              evaluationPeriodItem.attitudes[0].taskEvaluations.appraisees.taskEvaluationDetails.find(
                (itemB: any) => itemB.criteria.id === itemA.id
              )
            if (matchingItemB)
              return {
                comment: matchingItemB.comment,
                criteriaDetailId: matchingItemB.criteriaDetail.id,
                commentType: '2',
              }
            else
              return {
                comment: '',
                criteriaDetailId: '',
                commentType: '2',
              }
          }
        ),
    }
    const _formData = {
      name: evaluationPeriodItem.name,
      startDate: evaluationPeriodItem.startDate,
      endDate: evaluationPeriodItem.endDate,
      evaluateDate: evaluationPeriodItem.evaluateDate,
      taskRequests,
      attitudes,
    }
    setValues({ ...values, ..._formData, status })
  }

  const handleLabelSubmit = useMemo(() => {
    if (!!evaluationPeriodItem) {
      if (isAttitudeEditAble && isJobResultEditAble) {
        return (
          (values.status === EVALUATION_PERIOD_STEP.JOB_RESULT
            ? i18('LB_NEXT')
            : finalStepButtonLabel) || ''
        )
      } else {
        return finalStepButtonLabel
      }
    } else {
      return (
        (values.status === EVALUATION_PERIOD_STEP.JOB_RESULT
          ? i18('LB_NEXT')
          : finalStepButtonLabel) || ''
      )
    }
  }, [
    values.status,
    evaluationPeriodItem,
    isAttitudeEditAble,
    isJobResultEditAble,
  ])

  const handleCustomButton = useMemo(() => {
    if (!!evaluationPeriodItem) {
      return (
        values.status === EVALUATION_PERIOD_STEP.ATTITUDE &&
        isAttitudeEditAble &&
        isJobResultEditAble
      )
    } else {
      return values.status === EVALUATION_PERIOD_STEP.ATTITUDE
    }
  }, [
    values.status,
    isAttitudeEditAble,
    isJobResultEditAble,
    evaluationPeriodItem,
  ])

  const configStep = useMemo(() => {
    if (!!evaluationPeriodItem) {
      if (!(isAttitudeEditAble && isJobResultEditAble)) {
        return []
      } else {
        return CONFIG_EVALUATION_PERIOD_STEP
      }
    } else {
      return CONFIG_EVALUATION_PERIOD_STEP
    }
  }, [isAttitudeEditAble, isJobResultEditAble, evaluationPeriodItem])

  const renderAttitude = useMemo(() => {
    if (!!evaluationPeriodItem) {
      return isAttitudeEditAble
    } else {
      return true
    }
  }, [evaluationPeriodItem, isAttitudeEditAble])

  useEffect(() => {
    if (evaluationPeriodItem) {
      fillFormData()
    }
  }, [evaluationPeriodItem])

  useLayoutEffect(() => {
    setIsLoadingModal(true)
    const promises = [
      dispatch(
        getProjectsEvaluationCycle({
          evaluationCycleId: params.evaluationCycleId || '',
        })
      ),
      dispatch(
        findCriteriaGroupByEvaluationCycleAndWorkType({
          evaluationCycleId: params.evaluationCycleId || '',
        })
      )
        .unwrap()
        .then((res: AxiosResponse) => {
          setTypeOfWorkList(res.data)
        }),
      dispatch(getEmployeesEvaluation({ projectId: '' }))
        .unwrap()
        .then((res: BackEndGlobalResponse) => {
          setAppraisersList(res.data)
          setDefaultAppraiser(res.data[0].id)
          setLoadingDays(false)
        }),
    ]
    Promise.all(promises)
      .then(() => {
        setIsLoadingModal(false)
      })
      .catch(error => {
        setIsLoadingModal(false)
      })
  }, [])

  useEffect(() => {
    if (evaluationPeriodItem) {
      if (isAttitudeEditAble && !isJobResultEditAble) {
        setFieldValue('status', EVALUATION_PERIOD_STEP.ATTITUDE)
      }
    }
  }, [evaluationPeriodItem, isAttitudeEditAble, isJobResultEditAble])

  return (
    <Modal
      open={open}
      width={1000}
      title={title}
      labelSubmit={handleLabelSubmit}
      onSubmit={handleSubmitForm}
      submitDisabled={isLoadingModal}
      isButtonCustom={handleCustomButton}
      isButtonCustom2={useSaveDraftButton}
      labelButtonCustom2={i18('LB_SAVE_DRAFT') || ''}
      colorButtonCustom2={'inherit'}
      labelButtonCustom={i18('LB_PREVIOUS') || ''}
      onSubmitCustom={handleClickPrevious}
      onSubmitCustom2={() => onSaveDraft(values)}
      onClose={() => onClose('close')}
      loading={isLoadingModal}
    >
      <Box className={classes.rootModalAddNewEvaluationPeriod}>
        <Box className={classes.stepper}>
          <CommonStep activeStep={values.status} configSteps={configStep} />
        </Box>

        <ConditionalRender conditional={true}>
          <Box
            sx={cleanObject({
              display:
                values.status !== EVALUATION_PERIOD_STEP.JOB_RESULT
                  ? 'none'
                  : null,
            })}
          >
            <CardForm title={i18Mbo('LB_EVALUATION_INFORMATION')}>
              <Box className={classes.evaluationForm}>
                <Box className={classes.evaluationName}>
                  <InputTextLabel
                    required
                    disabled={isEvaluationInformationDisabled}
                    error={!!errors.name && touched.name}
                    errorMessage={errors.name}
                    value={values.name}
                    label={i18Mbo('LB_EVALUATION_NAME')}
                    placeholder={i18Mbo('PLH_INPUT_TASK_NAME')}
                    onChange={(e: EventInput) =>
                      setFieldValue('name', e.target.value)
                    }
                  />
                </Box>
                <FormLayout gap={24}>
                  <InputDateFns
                    required
                    disabled={isEvaluationInformationDisabled}
                    width={160}
                    defaultCalendarMonth={
                      cycleInformation?.startDate
                        ? new Date(cycleInformation?.startDate)
                        : null
                    }
                    label={i18('LB_START_DATE')}
                    minDate={cycleInformation?.startDate}
                    maxDate={cycleInformation?.endDate}
                    value={values.startDate}
                    onChange={(value: Date | null) => {
                      setValues({
                        ...values,
                        startDate: value?.getTime() || null,
                        endDate: null,
                      })
                    }}
                    error={!!errors.startDate && touched.startDate}
                    errorMessage={errors.startDate}
                  />
                  <InputDateFns
                    required
                    disabled={
                      !values.startDate || isEvaluationInformationDisabled
                    }
                    defaultCalendarMonth={
                      values.startDate ? new Date(values.startDate) : new Date()
                    }
                    label={i18('LB_END_DATE')}
                    minDate={values.startDate}
                    maxDate={cycleInformation?.endDate}
                    value={values.endDate}
                    onChange={(value: Date | null) =>
                      setFieldValue('endDate', value?.getTime())
                    }
                    error={
                      !!errors.endDate && touched.endDate && !!values.startDate
                    }
                    errorMessage={errors.endDate}
                  />
                  <FormItem label={i18Mbo('LB_EVALUATION_DATE')}>
                    <Box className={classes.disabledView}>
                      {formatDate(values.evaluateDate)}
                    </Box>
                  </FormItem>

                  <Box style={{ width: '50px' }}>
                    <FormItem label={i18('LB_DAYS')}>
                      <Box className={classes.disabledView}>
                        <ConditionalRender conditional={loadingDays}>
                          <CircularProgress
                            color="inherit"
                            size={20}
                            className="iconCircle"
                          />
                        </ConditionalRender>
                        <ConditionalRender conditional={!loadingDays}>
                          {formatNumber(days)}
                        </ConditionalRender>
                      </Box>
                    </FormItem>
                  </Box>
                </FormLayout>
              </Box>
            </CardForm>
            <CardForm title={i18Mbo('LB_JOB_RESULT_EVALUATION')}>
              {values.taskRequests.map((item: any, index) => (
                <TaskFormItem
                  directManager={defaultAppraiser}
                  defaultAppraiser={
                    item?.appraiserId ? item?.appraiserId : defaultAppraiser
                  }
                  disabled={
                    (values.taskRequests[index]?.processingStatus as any) >=
                    APPRAISER_1_EVALUATED
                  }
                  key={item?.id}
                  index={index}
                  task={item}
                  typeOfWorkList={typeOfWorkList || []}
                  appraisersList={appraisers || []}
                  errors={errors.taskRequests ? errors.taskRequests[index] : ''}
                  removable={values.taskRequests.length !== 1}
                  onDelete={() => handleDeleteTask(index)}
                  touched={
                    touched.taskRequests ? touched.taskRequests[index] : ''
                  }
                  setFieldValue={(keyName, value) =>
                    handleTaskValueChange(index, keyName, value)
                  }
                  isAddEvaluation={isAddEvaluation}
                />
              ))}
              <Box className={classes.button}>
                <ButtonAddPlus
                  onClick={handleAddNewTask}
                  label={i18Mbo('LB_ADD_NEW_TASK')}
                />
              </Box>
            </CardForm>
          </Box>
        </ConditionalRender>

        <ConditionalRender conditional={renderAttitude}>
          <Box
            sx={cleanObject({
              display:
                values.status !== EVALUATION_PERIOD_STEP.ATTITUDE
                  ? 'none'
                  : null,
            })}
          >
            <AttitudeFormItem
              defaultAppraiser={defaultAppraiser}
              task={values.attitudes}
              typeOfWorkList={typeOfWorkList || []}
              appraisersList={appraisers || []}
              errors={errors?.attitudes || ''}
              touched={touched?.attitudes || ''}
              setFieldValue={handleAttitudeChange}
              isAddEvaluation={isAddEvaluation}
            />
          </Box>
        </ConditionalRender>
      </Box>
    </Modal>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootModalAddNewEvaluationPeriod: {
    display: 'grid',
  },
  title: {},
  stepper: {
    marginBottom: theme.spacing(2),
  },
  evaluationForm: {
    display: 'grid',
    gap: theme.spacing(3),
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
  },
  taskForm: {},
  button: {
    margin: theme.spacing(1, 0),
  },
  evaluationName: {
    gridColumn: 'span 4',
  },
  disabledView: {
    borderRadius: '4px',
    background: theme.color.grey.secondary,
    padding: theme.spacing(0, 2),
    height: theme.spacing(5),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 700,
  },
}))
export default ModalEvaluationPeriod

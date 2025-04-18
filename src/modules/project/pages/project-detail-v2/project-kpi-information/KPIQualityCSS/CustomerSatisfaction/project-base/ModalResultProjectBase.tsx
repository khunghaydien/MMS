import CardForm from '@/components/Form/CardForm'
import CardFormEdit from '@/components/Form/CardFormEdit'
import FormItem from '@/components/Form/FormItem/FormItem'
import Modal from '@/components/common/Modal'
import StatusItem from '@/components/common/StatusItem'
import ToggleSectionIcon from '@/components/icons/ToggleSectionIcon'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputRadioList from '@/components/inputs/InputRadioList'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import LoadingSkeleton from '@/components/loading/LoadingSkeleton'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import { NS_PROJECT } from '@/const/lang.const'
import {
  FEEDBACK_LABELS,
  PROJECT_BASE_SECTION_SURVEY,
  SURVEY_TYPE_POINT_VALUES,
  SURVEY_TYPE_VALUES,
  getProjectSatisFactionOptions,
} from '@/modules/project/const'
import { projectSelector } from '@/modules/project/reducer/project'
import { ProjectService } from '@/modules/project/services'
import { alertSuccess, updateLoading } from '@/reducer/screen'
import customerSatisfactionSurveyService from '@/services/customer-satisfaction-survey.service'
import { AppDispatch } from '@/store'
import { EventInput, OptionItem } from '@/types'
import { formatDate } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import { useFormik } from 'formik'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import useKPIValidation from '../../../useKPIValidation'
import SurveyInformation from '../SurveyInformation'
import { PROJECT_INFORMATION_LABELS } from '../SurveyProjectInformation'
import {
  CATEGORY_LABELS,
  COMMENT_LABELS,
  PLH_SATISFACTION_LABELS,
} from './ProjectBaseQuestionScoring'

export interface SurveyInformationPreview {
  surveyName: string
  morRepresentative: string
  customersRepresentative: string
  surveyPoints: string
  language: number
}

interface QuestionItem {
  id: number
  questionName: string
  questionPointId: number
  questionType: number
  comment: string
  answer: number
  required: boolean
}

interface SectionItem {
  id: number
  categoryName: string
  questions: QuestionItem[]
}

interface EvaluatorItem {
  id: number
  evaluatorName: string
  surveyDate: number
  averagePoints: number
  sections: SectionItem[]
}

interface ModalResultProjectBaseProps {
  onClose: () => void
  surveyId: number
  onGetCustomerSatisfaction: () => void
}

const ModalResultProjectBase = ({
  surveyId,
  onClose,
  onGetCustomerSatisfaction,
}: ModalResultProjectBaseProps) => {
  const classes = useStyles()
  const params = useParams()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const [surveyInfo, setSurveyInfo] = useState<SurveyInformationPreview>({
    surveyName: '',
    morRepresentative: '',
    customersRepresentative: '',
    surveyPoints: '',
    language: 0,
  })
  const [loading, setLoading] = useState(false)

  const form = useFormik({
    initialValues: {
      listEvaluator: [] as EvaluatorItem[],
    },
    onSubmit: () => {},
  })
  const { values, setFieldValue } = form

  const getSectionsFromApi = (
    overallEvalute: any[],
    brseAvailable: boolean,
    language: number
  ) => {
    const result = overallEvalute
      .filter(item => {
        return (
          brseAvailable ||
          item.keyUnique.id !== PROJECT_BASE_SECTION_SURVEY.BRSE
        )
      })
      .map(item => ({
        id: item.id,
        categoryName: item.name.find(
          (nameOption: OptionItem) => nameOption.id === language
        ).name,
        questions: item.question.map((question: any) => ({
          id: question.questionId,
          questionPointId: question.questionPointId,
          questionName: `${question.order}. ${
            question.questionName.find(
              (nameOption: OptionItem) => nameOption.id === language
            ).name
          }`,
          questionType: question.typePoint?.id,
          comment: question.comment,
          answer: question.point,
          required: item.keyUnique.id !== PROJECT_BASE_SECTION_SURVEY.FEEDBACK,
        })),
      }))
    return result
  }

  const fillSurveyResult = ({ data }: AxiosResponse) => {
    setSurveyInfo({
      surveyName: data.name,
      morRepresentative: data.morRepresentative.name,
      customersRepresentative: data.customerRepresentative,
      surveyPoints: data.surveyPoints,
      language: data.language?.id,
    })
    const listEvaluator: EvaluatorItem[] = data.customerSatisfaction.map(
      (item: any) => ({
        id: item.id,
        evaluatorName: item.evaluatorName,
        surveyDate: item.surveyDate,
        averagePoints: item.totalPoint,
        sections: getSectionsFromApi(
          item.overallEvaluate,
          data.brseAvailable,
          data.language?.id
        ),
      })
    )
    setFieldValue('listEvaluator', listEvaluator)
  }

  const getSurveyResult = () => {
    setLoading(true)
    ProjectService.getSurveyResult({
      projectId: params.projectId as string,
      surveyId,
    })
      .then(fillSurveyResult)
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    getSurveyResult()
  }, [])

  return (
    <Modal
      open
      hideFooter
      width={1060}
      title={i18Project('TXT_CUSTOMER_SATISFACTION_SURVEY')}
      onClose={onClose}
    >
      <Box className={classes.body}>
        {loading && <LoadingSkeleton />}
        {!loading && (
          <Fragment>
            <SurveyInformation surveyInfo={surveyInfo} />
            <Box className={classes.listEvaluator}>
              {values.listEvaluator.map(
                (evaluator: EvaluatorItem, index: number) => (
                  <EvaluatorItem
                    key={evaluator.id}
                    index={index}
                    surveyId={surveyId}
                    language={surveyInfo.language}
                    evaluator={evaluator}
                    onSuccessfullyUpdated={() => {
                      getSurveyResult()
                      onGetCustomerSatisfaction()
                    }}
                    onSuccessfullyDeleted={() => {
                      if (values.listEvaluator.length === 1) {
                        onClose()
                      }
                    }}
                  />
                )
              )}
            </Box>
          </Fragment>
        )}
      </Box>
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  listEvaluator: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  evaluatorItem: {
    border: `1px solid ${theme.color.grey.secondary}`,
    borderRadius: '4px',
  },
  evaluatorItemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.color.grey.secondary}`,
  },
  title: {
    fontWeight: 700,
    color: theme.color.blue.primary,
    borderRadius: '3px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(0.5),
  },
  evaluatorLabel: {
    marginRight: theme.spacing(0.5),
  },
  nameViewMode: {
    display: 'inline-block',
    color: theme.color.black.primary,
    fontSize: 18,
  },
  bodyItem: { padding: theme.spacing(2) },
  point: {
    minWidth: '70px',
  },
  averagePointsHeader: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
  },
  averagePointsLabel: {
    color: theme.color.blue.primary,
    fontWeight: 700,
  },
  RootEvaluatorItemViewMode: {},
  label: {
    fontSize: 14,
    color: theme.color.black.secondary,
  },
  value: {
    fontSize: 14,
    marginTop: theme.spacing(0.5),
    fontWeight: 700,
    wordBreak: 'break-all',
  },
  listFields: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  boxRadio: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing(2),
    '& .formContent': {
      width: 'unset',
    },
    '& .label': {
      marginBottom: 'unset',
    },
  },
  question: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(3),
  },
  questionName: {
    fontWeight: 700,
    fontSize: 14,
  },
  satisfaction: {
    color: theme.color.blue.primary,
    fontWeight: 700,
    border: `1px solid ${theme.color.blue.primary}`,
    borderRadius: '4px',
    padding: theme.spacing(1),
    minWidth: '200px',
    textAlign: 'center',
  },
  radioAnswer: {
    color: theme.color.blue.primary,
    fontWeight: 700,
  },
}))

export default ModalResultProjectBase

const EvaluatorItem = ({
  index,
  evaluator,
  language,
  surveyId,
  onSuccessfullyUpdated,
  onSuccessfullyDeleted,
}: {
  index: number
  evaluator: EvaluatorItem
  language: number
  surveyId: number
  onSuccessfullyUpdated: () => void
  onSuccessfullyDeleted: () => void
}) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const { evaluateProjectBaseValidation } = useKPIValidation()

  const { permissionProjectKPI } = useSelector(projectSelector)

  const [openData, setOpenData] = useState(false)
  const [useDetailViewMode, setUseDetailViewMode] = useState(true)
  const [openModalDeleteEvaluator, setOpenModalDeleteEvaluator] =
    useState(false)

  const form = useFormik({
    initialValues: { ...evaluator },
    validationSchema: evaluateProjectBaseValidation,
    onSubmit: () => {
      updateCustomerSurvey()
    },
  })
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setTouched,
    setErrors,
    setValues,
  } = form

  const buttonUseDetailEditDisabled = useMemo(() => {
    return JSON.stringify(evaluator) === JSON.stringify(values)
  }, [evaluator, values])

  const averagePoints = useMemo(() => {
    let totalPoint = 0
    let countQuestionPoint = 0
    form.values.sections.forEach((section: { questions: any[] }) => {
      section.questions.forEach(question => {
        if (question.questionType === SURVEY_TYPE_POINT_VALUES.DROPDOWN) {
          totalPoint += +question.answer
          countQuestionPoint += 1
        }
      })
    })
    return +(totalPoint / countQuestionPoint).toFixed(2)
  }, [form.values.sections])

  const updateCustomerSurvey = () => {
    dispatch(updateLoading(true))
    const overallEvaluate: {
      comment: string
      point: number
      questionId: number
      questionPointId: number
    }[] = []
    values.sections.forEach((section: { questions: any[] }) => {
      section.questions.forEach(question => {
        overallEvaluate.push({
          comment: question.comment,
          point: +question.answer,
          questionId: question.id,
          questionPointId: question.questionPointId,
        })
      })
    })
    const payload = {
      customerSurveyId: evaluator.id,
      requestBody: {
        averagePoints: values.averagePoints,
        evaluatorName: values.evaluatorName,
        surveyDate: values.surveyDate,
        typeSurvey: SURVEY_TYPE_VALUES.PROJECT_BASE,
        memberEvaluate: null,
        overallEvaluate,
        surveyId,
      },
    }
    customerSatisfactionSurveyService
      .updateCustomerSurvey(payload)
      .then(() => {
        onSuccessfullyUpdated()
        dispatch(
          alertSuccess({
            message: i18Project('UPDATE_EVALUATOR_RESULT', {
              evaluatorsName: values.evaluatorName,
            }),
          })
        )
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  const onCancel = () => {
    setUseDetailViewMode(true)
    setTouched({})
    setErrors({})
    setValues(evaluator)
  }

  const deleteEvaluatorApi = () => {
    dispatch(updateLoading(true))
    customerSatisfactionSurveyService
      .deleteCustomerSurvey(evaluator.id)
      .then(() => {
        onSuccessfullyDeleted()
        onSuccessfullyUpdated()
        dispatch(
          alertSuccess({
            message: i18Project('DELETE_EVALUATOR_RESULT', {
              evaluatorsName: evaluator.evaluatorName,
            }),
          })
        )
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  useEffect(() => {
    if (averagePoints) {
      form.setFieldValue('averagePoints', averagePoints)
    }
  }, [averagePoints])

  return (
    <Fragment>
      {openModalDeleteEvaluator && (
        <ModalDeleteRecords
          open
          titleMessage={i18Project('TXT_DELETE_EVALUATOR')}
          subMessage={i18Project('MSG_CONFIRM_EVALUATOR_DELETE', {
            labelName: evaluator.evaluatorName,
          })}
          onClose={() => setOpenModalDeleteEvaluator(false)}
          onSubmit={deleteEvaluatorApi}
        />
      )}
      <Box className={classes.evaluatorItem}>
        <Box className={classes.evaluatorItemHeader}>
          <Box className={classes.title}>
            <ToggleSectionIcon
              open={openData}
              onToggle={() => setOpenData(!openData)}
            />
            <Box>
              <Box component="span" className={classes.evaluatorLabel}>
                {i18Project('TXT_EVALUATOR')} #{index + 1}:
              </Box>
              <Box className={classes.nameViewMode} component="span">
                {evaluator.evaluatorName}
              </Box>
            </Box>
          </Box>
          <Box className={classes.averagePointsHeader}>
            <Box className={classes.averagePointsLabel}>
              {i18Project('TXT_AVERAGE_POINTS')}:
            </Box>
            <StatusItem
              className={classes.point}
              typeStatus={{
                color: 'green',
                label: values.averagePoints.toString(),
              }}
            />
          </Box>
          <CardFormEdit
            hideBorder
            buttonUseDetailEditDisabled={buttonUseDetailEditDisabled}
            useDeleteMode={
              useDetailViewMode && !!permissionProjectKPI.summaryResultDelete
            }
            useDetailEditMode={!useDetailViewMode}
            useDetailViewMode={
              useDetailViewMode && !!permissionProjectKPI.summaryResultUpdate
            }
            onOpenEditMode={() => {
              setOpenData(true)
              setUseDetailViewMode(false)
            }}
            onCancelEditMode={onCancel}
            onOpenDeleteMode={() => setOpenModalDeleteEvaluator(true)}
            onSaveAs={() => form.handleSubmit()}
          />
        </Box>
        {openData && (
          <Box className={classes.bodyItem}>
            {useDetailViewMode && (
              <EvaluatorItemViewMode
                language={language}
                evaluator={evaluator}
              />
            )}
            {!useDetailViewMode && (
              <Box>
                <InputTextLabel
                  required
                  value={values.evaluatorName}
                  error={!!errors.evaluatorName && touched.evaluatorName}
                  errorMessage={errors.evaluatorName}
                  label={PROJECT_INFORMATION_LABELS.EVALUATORS_NAME[language]}
                  placeholder={i18('PLH_PERSON_NAME')}
                  onChange={(e: EventInput) =>
                    setFieldValue('evaluatorName', e.target.value)
                  }
                />
                {values.sections.map((section: any, sectionIndex: number) => (
                  <CardForm
                    title={`${CATEGORY_LABELS[language]} #${
                      sectionIndex + 1
                    }: ${section.categoryName}`}
                    key={section.id}
                  >
                    <Box className={classes.listFields}>
                      {section.questions.map(
                        (question: any, questionIndex: number) => (
                          <Box className={classes.formGroup} key={question.id}>
                            <FormItem
                              required={question.required}
                              className={classes.boxRadio}
                              label={question.questionName}
                            >
                              {question.questionType ===
                                SURVEY_TYPE_POINT_VALUES.DROPDOWN && (
                                <InputDropdown
                                  width={260}
                                  isShowClearIcon={false}
                                  value={question.answer}
                                  listOptions={getProjectSatisFactionOptions(
                                    language
                                  )}
                                  placeholder={
                                    PLH_SATISFACTION_LABELS[language]
                                  }
                                  onChange={value =>
                                    setFieldValue(
                                      `sections[${sectionIndex}].questions[${questionIndex}].answer`,
                                      value
                                    )
                                  }
                                />
                              )}
                              {question.questionType ===
                                SURVEY_TYPE_POINT_VALUES.RADIO && (
                                <InputRadioList
                                  value={question.answer}
                                  listOptions={[
                                    {
                                      id: 1,
                                      label: FEEDBACK_LABELS[1][language],
                                      value: 1,
                                    },
                                    {
                                      id: 2,
                                      label: FEEDBACK_LABELS[2][
                                        language
                                      ] as string,
                                      value: 2,
                                    },
                                    {
                                      id: 3,
                                      label: FEEDBACK_LABELS[3][
                                        language
                                      ] as string,
                                      value: 3,
                                    },
                                  ]}
                                  onChange={value =>
                                    setFieldValue(
                                      `sections[${sectionIndex}].questions[${questionIndex}].answer`,
                                      value
                                    )
                                  }
                                />
                              )}
                              <Fragment />
                            </FormItem>
                            <InputTextLabel
                              label={`${COMMENT_LABELS[language]}:`}
                              placeholder={i18('PLH_COMMENT')}
                              value={question.comment}
                              onChange={(e: EventInput) =>
                                setFieldValue(
                                  `sections[${sectionIndex}].questions[${questionIndex}].comment`,
                                  e.target.value
                                )
                              }
                            />
                          </Box>
                        )
                      )}
                    </Box>
                  </CardForm>
                ))}
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Fragment>
  )
}

const EvaluatorItemViewMode = ({
  evaluator,
  language,
}: {
  language: number
  evaluator: EvaluatorItem
}) => {
  const classes = useStyles()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const getSatisfactionDropdown = (questionAnswer: number) => {
    return getProjectSatisFactionOptions(language).find(
      option => option.value === questionAnswer
    )?.label
  }

  const getSatisfactionRadio = (questionAnswer: number) => {
    return FEEDBACK_LABELS?.[questionAnswer]?.[language]
  }

  return (
    <Box className={classes.RootEvaluatorItemViewMode}>
      <Box>
        <Box className={classes.label}>{i18Project('TXT_SURVEY_DATE')}</Box>
        <Box className={classes.value}>{formatDate(evaluator.surveyDate)}</Box>
      </Box>
      {evaluator.sections.map((section, index) => (
        <CardForm
          title={`${CATEGORY_LABELS[language]} #${index + 1}: ${
            section.categoryName
          }`}
          key={section.id}
        >
          <Box className={classes.listFields}>
            {section.questions.map(question => (
              <Box className={classes.formGroup} key={question.id}>
                <Box className={classes.question}>
                  <Box className={classes.questionName}>
                    {question.questionName}
                  </Box>
                  {question.questionType ===
                    SURVEY_TYPE_POINT_VALUES.DROPDOWN && (
                    <Box className={classes.satisfaction}>
                      {getSatisfactionDropdown(question.answer)}
                    </Box>
                  )}
                  {question.questionType === SURVEY_TYPE_POINT_VALUES.RADIO && (
                    <Box className={classes.radioAnswer}>
                      {getSatisfactionRadio(question.answer)}
                    </Box>
                  )}
                </Box>
                <Box>
                  <Box className={classes.label}>
                    {COMMENT_LABELS[language]}
                  </Box>
                  <Box className={classes.value}>
                    {question.comment || '--'}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </CardForm>
      ))}
    </Box>
  )
}

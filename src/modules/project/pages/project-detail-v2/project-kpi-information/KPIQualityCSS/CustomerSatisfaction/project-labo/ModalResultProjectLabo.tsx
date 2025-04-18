import CardForm from '@/components/Form/CardForm'
import CardFormEdit from '@/components/Form/CardFormEdit'
import FormItem from '@/components/Form/FormItem/FormItem'
import FormLayout from '@/components/Form/FormLayout'
import ButtonAddPlus from '@/components/buttons/ButtonAddPlus'
import Modal from '@/components/common/Modal'
import StatusItem from '@/components/common/StatusItem'
import DeleteIcon from '@/components/icons/DeleteIcon'
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
import { formatDate, scrollToFirstErrorMessage, uuid } from '@/utils'
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
import { SurveyInformationPreview } from '../project-base/ModalResultProjectBase'
import {
  CATEGORY_LABELS,
  COMMENT_LABELS,
  PLH_SATISFACTION_LABELS,
} from '../project-base/ProjectBaseQuestionScoring'
import { MemberScoringForm } from './ProjectLaboQuestionScoring'

interface ModalResultProjectLaboProps {
  onClose: () => void
  surveyId: number
  onGetCustomerSatisfaction: () => void
}

interface EvaluatorItemData {
  id: number
  evaluatorName: string
  surveyDate: number
  averagePoints: number
  overallEvaluation: {
    cardFormName: string
    general: any
    feedback: any
  }
  memberEvaluation: any[]
}

const ModalResultProjectLabo = ({
  surveyId,
  onClose,
  onGetCustomerSatisfaction,
}: ModalResultProjectLaboProps) => {
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
      listEvaluator: [] as EvaluatorItemData[],
    },
    onSubmit: () => {},
  })
  const { values, setFieldValue } = form

  const fillSurveyResult = ({ data }: AxiosResponse) => {
    setSurveyInfo({
      surveyName: data.name,
      morRepresentative: data.morRepresentative.name,
      customersRepresentative: data.customerRepresentative,
      surveyPoints: data.surveyPoints,
      language: data.language.id,
    })

    const listEvaluator: EvaluatorItemData[] = data.customerSatisfaction.map(
      (item: any) => ({
        id: item.id,
        evaluatorName: item.evaluatorName,
        surveyDate: item.surveyDate,
        averagePoints: item.totalPoint,
        overallEvaluation: {
          sectionName: '',
          general: {
            cardFormName: item.overallEvaluate[0].name.find(
              (nameOption: OptionItem) => nameOption.id === data.language.id
            ).name,
            questions: item.overallEvaluate[0].question.map(
              (question: any) => ({
                id: question.questionId,
                questionPointId: question.questionPointId,
                questionName: `${question.order}. ${
                  question.questionName.find(
                    (nameOption: OptionItem) =>
                      nameOption.id === data.language.id
                  ).name
                }`,
                questionType: question.typePoint?.id,
                comment: question.comment,
                answer: question.point,
                required: true,
              })
            ),
          },
          feedback: {
            sectionName: item.overallEvaluate[1].name.find(
              (nameOption: OptionItem) => nameOption.id === data.language.id
            ).name,
            questions: item.overallEvaluate[1].question.map(
              (question: any) => ({
                id: question.questionId,
                questionPointId: question.questionPointId,
                questionName: `${question.order}. ${
                  question.questionName.find(
                    (nameOption: OptionItem) =>
                      nameOption.id === data.language.id
                  ).name
                }`,
                questionType: question.typePoint?.id,
                comment: question.comment,
                answer: question.point,
                required: false,
              })
            ),
          },
        },
        memberEvaluation: item.memberEvaluation.map((memberItem: any) => ({
          id: memberItem.id,
          member: {
            id: memberItem.staff.id,
            value: memberItem.staff.id,
            label: memberItem.staff.name,
          },
          role: memberItem.roles,
          averageMemberPoints: memberItem.averagePoints,
          sections: memberItem.categoryQuestion.map((category: any) => ({
            id: category.id,
            categoryName: category.name.find(
              (nameOption: OptionItem) => nameOption.id === data.language.id
            ).name,
            questions: category.question.map((question: any) => ({
              id: question.questionId,
              questionPointId: question.questionPointId,
              questionName: `${question.order}. ${
                question.questionName.find(
                  (nameOption: OptionItem) => nameOption.id === data.language.id
                ).name
              }`,
              questionType: question.typePoint?.id,
              comment: question.comment,
              answer: question.point,
              required:
                category.keyUnique.id !== PROJECT_BASE_SECTION_SURVEY.FEEDBACK,
            })),
          })),
        })),
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
                (evaluator: EvaluatorItemData, index: number) => (
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
  feedback: {
    marginTop: theme.spacing(3),
    width: '100%',
  },
  feedbackTitle: {
    color: theme.color.blue.primary,
    fontWeight: 700,
    marginBottom: theme.spacing(2),
  },
  feedbackBox: {
    border: `1px solid ${theme.color.grey.secondary}`,
    borderRadius: '6px',
    padding: theme.spacing(2),
  },
  boxMember: {},
  memberList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  boxMemberEvaluationItem: {
    position: 'relative',
    border: `1px solid ${theme.color.grey.secondary}`,
    padding: theme.spacing(3, 2, 2, 2),
    borderRadius: '4px',
  },
  memberEvaluationIndex: {
    color: theme.color.blue.primary,
    fontWeight: 700,
    position: 'absolute',
    top: '-10px',
    left: '8px',
    background: '#fff',
    padding: theme.spacing(0, 1),
  },
  boxDeleteIcon: {
    position: 'absolute',
    right: '5px',
    top: theme.spacing(1),
  },
}))

export default ModalResultProjectLabo

const EvaluatorItem = ({
  index,
  evaluator,
  language,
  surveyId,
  onSuccessfullyUpdated,
  onSuccessfullyDeleted,
}: {
  index: number
  evaluator: EvaluatorItemData
  language: number
  surveyId: number
  onSuccessfullyUpdated: () => void
  onSuccessfullyDeleted: () => void
}) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const { permissionProjectKPI } = useSelector(projectSelector)

  const { evaluateProjectLaboValidation } = useKPIValidation()

  const [openData, setOpenData] = useState(false)
  const [useDetailViewMode, setUseDetailViewMode] = useState(true)
  const [openModalDeleteEvaluator, setOpenModalDeleteEvaluator] =
    useState(false)

  const form = useFormik({
    initialValues: { ...evaluator },
    validationSchema: evaluateProjectLaboValidation,
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
  }: any = form

  const randomId = uuid()

  const buttonUseDetailEditDisabled = useMemo(() => {
    return JSON.stringify(evaluator) === JSON.stringify(values)
  }, [evaluator, values])

  const averagePoints = useMemo(() => {
    let totalPoint = 0
    let countQuestionPoint = 0
    values.overallEvaluation.general?.questions?.forEach((question: any) => {
      if (question.questionType === SURVEY_TYPE_POINT_VALUES.DROPDOWN) {
        totalPoint += +question.answer
        countQuestionPoint += 1
      }
    })
    values.memberEvaluation.forEach((member: any) => {
      totalPoint += +member.averageMemberPoints
      countQuestionPoint += 1
    })
    return +(totalPoint / countQuestionPoint).toFixed(2)
  }, [values.overallEvaluation, values.memberEvaluation])

  const updateCustomerSurvey = () => {
    dispatch(updateLoading(true))
    const payload = {
      customerSurveyId: evaluator.id,
      requestBody: {
        averagePoints: values.averagePoints,
        evaluatorName: values.evaluatorName,
        surveyDate: values.surveyDate,
        typeSurvey: SURVEY_TYPE_VALUES.PROJECT_LABO,
        memberEvaluate: values.memberEvaluation.map((member: any) => {
          const questionPoint: {
            comment: string
            point: number
            questionId: number
            questionPointId: number
          }[] = []
          member.sections.forEach((section: { questions: any[] }) => {
            section.questions.forEach(question => {
              questionPoint.push({
                comment: question.comment,
                point: +question.answer,
                questionId: question.id,
                questionPointId: question.questionPointId,
              })
            })
          })
          return {
            averagePoints: member.averageMemberPoints,
            role: member.role,
            staffId: member.member.id,
            questionPoint,
          }
        }),
        overallEvaluate: [
          ...values.overallEvaluation.general.questions.map(
            (question: any) => ({
              comment: question.comment,
              point: +question.answer,
              questionId: question.id,
              questionPointId: question.questionPointId,
            })
          ),
          ...values.overallEvaluation.feedback.questions.map(
            (question: any) => ({
              comment: question.comment,
              point: +question.answer,
              questionId: question.id,
              questionPointId: question.questionPointId,
            })
          ),
        ],
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
              evaluatorsName: evaluator.evaluatorName,
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

  const onDeleteMemberEvaluationItem = (index: number) => {
    const newMemberEvaluation = [...values.memberEvaluation]
    newMemberEvaluation.splice(index, 1)
    setFieldValue('memberEvaluation', newMemberEvaluation)
  }

  const addNewMemberEvaluation = () => {
    const newEvaluateMember = {
      id: randomId,
      averageMemberPoints: '',
      member: {},
      role: '',
      sections: (evaluator.memberEvaluation[0] as any).sections.map(
        (section: { questions: any[] }) => ({
          ...section,
          questions: section.questions.map(question => ({
            ...question,
            answer: '',
            comment: '',
          })),
        })
      ),
    }
    setFieldValue('memberEvaluation', [
      ...values.memberEvaluation,
      newEvaluateMember,
    ])
  }

  const onSubmitEditEvaluator = () => {
    form.handleSubmit()
    setTimeout(() => {
      scrollToFirstErrorMessage()
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
            onSaveAs={onSubmitEditEvaluator}
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
                <CardForm title={values.overallEvaluation.general.cardFormName}>
                  <Box className={classes.listFields}>
                    {values.overallEvaluation.general.questions?.map(
                      (question: any, index: number) => (
                        <Box className={classes.formGroup} key={question.id}>
                          <FormItem
                            required={question.required}
                            className={classes.boxRadio}
                            label={question.questionName}
                          >
                            <InputDropdown
                              width={260}
                              isShowClearIcon={false}
                              error={
                                !!errors.overallEvaluation?.general
                                  ?.questions?.[index]?.answer &&
                                touched.overallEvaluation?.general?.questions?.[
                                  index
                                ]?.answer
                              }
                              errorMessage={
                                errors.overallEvaluation?.general?.questions?.[
                                  index
                                ]?.answer
                              }
                              value={question.answer}
                              listOptions={getProjectSatisFactionOptions(
                                language
                              )}
                              placeholder={PLH_SATISFACTION_LABELS[language]}
                              onChange={value =>
                                setFieldValue(
                                  `overallEvaluation.general.questions[${index}].answer`,
                                  value
                                )
                              }
                            />
                          </FormItem>
                          <InputTextLabel
                            label={`${COMMENT_LABELS[language]}:`}
                            placeholder={i18('PLH_COMMENT')}
                            value={question.comment}
                            onChange={(e: EventInput) =>
                              setFieldValue(
                                `overallEvaluation.general.questions[${index}].comment`,
                                e.target.value
                              )
                            }
                          />
                        </Box>
                      )
                    )}
                  </Box>
                  <Box className={classes.feedback}>
                    <Box className={classes.feedbackTitle}>
                      {values.overallEvaluation.feedback.sectionName}
                    </Box>
                    <Box className={classes.feedbackBox}>
                      <Box className={classes.listFields}>
                        {values.overallEvaluation.feedback.questions?.map(
                          (question: any, index: number) => (
                            <Box
                              className={classes.formGroup}
                              key={question.id}
                            >
                              <FormItem
                                required={false}
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
                                        `overallEvaluation.feedback.questions[${index}].answer`,
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
                                        `overallEvaluation.feedback.questions[${index}].answer`,
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
                                    `overallEvaluation.feedback.questions[${index}].comment`,
                                    e.target.value
                                  )
                                }
                              />
                            </Box>
                          )
                        )}
                      </Box>
                    </Box>
                  </Box>
                </CardForm>
                <CardForm title={i18Project('TXT_MEMBER_EVALUATION')}>
                  <Box className={classes.boxMember}>
                    <Box className={classes.memberList}>
                      {values.memberEvaluation.map(
                        (item: any, index: number) => (
                          <Box
                            className={classes.boxMemberEvaluationItem}
                            key={item.id}
                          >
                            <Box
                              className={classes.memberEvaluationIndex}
                            >{`${i18Project('LB_MEMBER')} #${index + 1}`}</Box>
                            {values.memberEvaluation.length > 1 && (
                              <Box className={classes.boxDeleteIcon}>
                                <DeleteIcon
                                  onClick={() =>
                                    onDeleteMemberEvaluationItem(index)
                                  }
                                />
                              </Box>
                            )}
                            <MemberScoringForm
                              disabled={false}
                              formik={form}
                              memberIndex={index}
                              language={language}
                            />
                          </Box>
                        )
                      )}
                    </Box>
                    <FormLayout top={16}>
                      <ButtonAddPlus
                        disabled={
                          !values.memberEvaluation[
                            values.memberEvaluation.length - 1
                          ]?.member?.id
                        }
                        label={i18Project('TXT_EVALUATE_NEW_MEMBER')}
                        onClick={addNewMemberEvaluation}
                      />
                    </FormLayout>
                  </Box>
                </CardForm>
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
  evaluator: EvaluatorItemData
}) => {
  const classes = useStyles()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const getSatisfactionDropdown = (questionAnswer: number) => {
    return getProjectSatisFactionOptions(language).find(
      option => option.value === questionAnswer
    )?.label
  }

  const getSatisfactionRadio = (questionAnswer: number) => {
    return FEEDBACK_LABELS[questionAnswer][language]
  }

  return (
    <Box className={classes.RootEvaluatorItemViewMode}>
      <Box>
        <Box className={classes.label}>{i18Project('TXT_SURVEY_DATE')}</Box>
        <Box className={classes.value}>{formatDate(evaluator.surveyDate)}</Box>
      </Box>
      <CardForm title={evaluator.overallEvaluation.general.cardFormName}>
        <Box className={classes.listFields}>
          {evaluator.overallEvaluation.general.questions?.map(
            (question: any) => (
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
            )
          )}
        </Box>
        <Box className={classes.feedback}>
          <Box className={classes.feedbackTitle}>
            {evaluator.overallEvaluation.feedback.sectionName}
          </Box>
          <Box className={classes.feedbackBox}>
            <Box className={classes.listFields}>
              {evaluator.overallEvaluation.feedback.questions?.map(
                (question: any, index: number) => (
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
                      {question.questionType ===
                        SURVEY_TYPE_POINT_VALUES.RADIO && (
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
                )
              )}
            </Box>
          </Box>
        </Box>
      </CardForm>
      <CardForm title={i18Project('TXT_MEMBER_EVALUATION')}>
        <Box className={classes.boxMember}>
          <Box className={classes.memberList}>
            {evaluator.memberEvaluation.map((item: any, index: number) => (
              <Box className={classes.boxMemberEvaluationItem} key={item.id}>
                <Box className={classes.memberEvaluationIndex}>{`${i18Project(
                  'LB_MEMBER'
                )} #${index + 1}`}</Box>
                <FormLayout gap={24}>
                  <Box>
                    <Box className={classes.label}>
                      {i18Project('TXT_MEMBER')}
                    </Box>
                    <Box className={classes.value}>{item.member.label}</Box>
                  </Box>
                  <Box>
                    <Box className={classes.label}>{i18Project('LB_ROLE')}</Box>
                    <Box className={classes.value}>{item.role}</Box>
                  </Box>
                  <Box>
                    <Box className={classes.label}>
                      {i18Project('TXT_AVERAGE_POINTS')}
                    </Box>
                    <Box className={classes.value}>
                      {item.averageMemberPoints}
                    </Box>
                  </Box>
                </FormLayout>
                {item.sections.map((section: any, index: number) => (
                  <CardForm
                    title={`${CATEGORY_LABELS[language]} #${index + 1}: ${
                      section.categoryName
                    }`}
                    key={section.id}
                  >
                    <Box className={classes.listFields}>
                      {section.questions.map((question: any) => (
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
                            {question.questionType ===
                              SURVEY_TYPE_POINT_VALUES.RADIO && (
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
            ))}
          </Box>
        </Box>
      </CardForm>
    </Box>
  )
}

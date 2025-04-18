import CardForm from '@/components/Form/CardForm'
import FormItem from '@/components/Form/FormItem/FormItem'
import FormLayout from '@/components/Form/FormLayout'
import ButtonAddPlus from '@/components/buttons/ButtonAddPlus'
import DeleteIcon from '@/components/icons/DeleteIcon'
import InputCurrency from '@/components/inputs/InputCurrency'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputRadioList from '@/components/inputs/InputRadioList'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import { NS_PROJECT } from '@/const/lang.const'
import {
  FEEDBACK_LABELS,
  SURVEY_TYPE_POINT_VALUES,
  getProjectSatisFactionOptions,
} from '@/modules/project/const'
import { EventInput } from '@/types'
import { uuid } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Fragment, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import SelectMemberProject from '../SelectMemberProject'
import {
  CATEGORY_LABELS,
  COMMENT_LABELS,
  PLH_SATISFACTION_LABELS,
} from '../project-base/ProjectBaseQuestionScoring'

interface ProjectLaboQuestionScoringProps {
  disabled: boolean
  formik: any
  language: number
}

const ProjectLaboQuestionScoring = ({
  disabled,
  formik,
  language,
}: ProjectLaboQuestionScoringProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const randomId = uuid()
  const { values, setFieldValue, errors, touched } = formik
  const { overallEvaluation, memberEvaluation } = values

  const onDeleteMemberEvaluationItem = (index: number) => {
    const newMemberEvaluation = [...memberEvaluation]
    newMemberEvaluation.splice(index, 1)
    setFieldValue('memberEvaluation', newMemberEvaluation)
  }

  const addNewMemberEvaluation = () => {
    const newEvaluateMember = {
      id: randomId,
      averageMemberPoints: '',
      member: {},
      role: '',
      sections: memberEvaluation[0].sections.map(
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
    setFieldValue('memberEvaluation', [...memberEvaluation, newEvaluateMember])
  }

  return (
    <Box className={classes.RootProjectLaboQuestionScoring}>
      <CardForm title={overallEvaluation.cardFormName}>
        <Box className={classes.listFields}>
          {overallEvaluation.general.questions?.map(
            (question: any, index: number) => (
              <Box className={classes.formGroup} key={question.id}>
                <FormItem
                  required={question.required}
                  className={classes.boxRadio}
                  label={question.questionName}
                >
                  <InputDropdown
                    width={260}
                    isDisable={disabled}
                    isShowClearIcon={false}
                    error={
                      !!errors.overallEvaluation?.general?.questions?.[index]
                        ?.answer &&
                      touched.overallEvaluation?.general?.questions?.[index]
                        ?.answer
                    }
                    errorMessage={
                      errors.overallEvaluation?.general?.questions?.[index]
                        ?.answer
                    }
                    value={question.answer}
                    listOptions={getProjectSatisFactionOptions(language)}
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
                  disabled={disabled}
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
            {overallEvaluation.feedback.sectionName}
          </Box>
          <Box className={classes.feedbackBox}>
            <Box className={classes.listFields}>
              {overallEvaluation.feedback.questions?.map(
                (question: any, index: number) => (
                  <Box className={classes.formGroup} key={question.id}>
                    <FormItem
                      required={false}
                      className={classes.boxRadio}
                      label={question.questionName}
                    >
                      {question.questionType ===
                        SURVEY_TYPE_POINT_VALUES.DROPDOWN && (
                        <InputDropdown
                          width={260}
                          isDisable={disabled}
                          isShowClearIcon={false}
                          value={question.answer}
                          listOptions={getProjectSatisFactionOptions(language)}
                          placeholder={PLH_SATISFACTION_LABELS[language]}
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
                          disabed={disabled}
                          value={question.answer}
                          listOptions={[
                            {
                              id: 1,
                              label: FEEDBACK_LABELS[1][language],
                              value: 1,
                            },
                            {
                              id: 2,
                              label: FEEDBACK_LABELS[2][language] as string,
                              value: 2,
                            },
                            {
                              id: 3,
                              label: FEEDBACK_LABELS[3][language] as string,
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
                      disabled={disabled}
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
            {memberEvaluation.map((item: any, index: number) => (
              <Box className={classes.boxMemberEvaluationItem} key={item.id}>
                <Box className={classes.memberEvaluationIndex}>{`${i18Project(
                  'LB_MEMBER'
                )} #${index + 1}`}</Box>
                {values.memberEvaluation.length > 1 && (
                  <Box className={classes.boxDeleteIcon}>
                    <DeleteIcon
                      onClick={() => onDeleteMemberEvaluationItem(index)}
                    />
                  </Box>
                )}
                <MemberScoringForm
                  disabled={disabled}
                  formik={formik}
                  memberIndex={index}
                  language={language}
                />
              </Box>
            ))}
          </Box>
          <FormLayout top={16}>
            <ButtonAddPlus
              disabled={
                !values.memberEvaluation[values.memberEvaluation.length - 1]
                  ?.member?.id || disabled
              }
              label={i18Project('TXT_EVALUATE_NEW_MEMBER')}
              onClick={addNewMemberEvaluation}
            />
          </FormLayout>
        </Box>
      </CardForm>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootProjectLaboQuestionScoring: {},
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

export default ProjectLaboQuestionScoring

interface MemberScoringFormProps {
  disabled: boolean
  memberIndex: number
  formik: any
  language: number
}

export const MemberScoringForm = ({
  disabled,
  memberIndex,
  formik,
  language,
}: MemberScoringFormProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const { values, setFieldValue, errors, touched } = formik

  const formItem = values.memberEvaluation[memberIndex]

  const ignoreMemberOptionById = useMemo(() => {
    const ids = values.memberEvaluation
      .map((item: any) => +item.member.id)
      .filter((id: number) => id && id !== formItem.memberId)
    return ids
  }, [values.memberEvaluation])

  useEffect(() => {
    let totalPoint = 0
    let countQuestionPoint = 0
    formItem.sections.forEach((section: { questions: any[] }) => {
      section.questions.forEach(question => {
        if (question.questionType === SURVEY_TYPE_POINT_VALUES.DROPDOWN) {
          totalPoint += +question.answer
          countQuestionPoint += 1
        }
      })
    })

    const averageMemberPoints = +(totalPoint / countQuestionPoint).toFixed(2)
    if (averageMemberPoints) {
      setFieldValue(
        `memberEvaluation[${memberIndex}].averageMemberPoints`,
        averageMemberPoints
      )
    }
  }, [formItem.sections])

  return (
    <Box>
      <FormLayout gap={24}>
        <SelectMemberProject
          required
          disabled={disabled}
          ignoreOptionById={ignoreMemberOptionById}
          width={370}
          error={
            !!errors.memberEvaluation?.[memberIndex]?.member &&
            !!touched.memberEvaluation?.[memberIndex]?.member
          }
          errorMessage={errors.memberEvaluation?.[memberIndex]?.member}
          value={formItem.member}
          onChange={(staff: any) => {
            setFieldValue(
              `memberEvaluation[${memberIndex}].role`,
              staff?.role || ''
            )
            setFieldValue(`memberEvaluation[${memberIndex}].member`, staff)
          }}
        />
        <InputTextLabel
          value={formItem.role}
          label={i18Project('LB_ROLE')}
          placeholder={i18Project('PLH_ROLE')}
          onChange={(e: EventInput) => {
            setFieldValue(
              `memberEvaluation[${memberIndex}].role`,
              e.target.value
            )
          }}
        />
        <InputCurrency
          disabled
          placeholder="--"
          value={formItem.averageMemberPoints}
          label={i18Project('TXT_AVERAGE_POINTS')}
        />
      </FormLayout>
      {formItem.sections.map((section: any, sectionIndex: number) => (
        <FormLayout gap={24} top={24} key={section.id}>
          <Box className={classes.feedback}>
            <Box className={classes.feedbackTitle}>
              {CATEGORY_LABELS[language]} #{sectionIndex + 1}:{' '}
              {section.categoryName}
            </Box>
            <Box className={classes.feedbackBox}>
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
                            isDisable={disabled}
                            isShowClearIcon={false}
                            error={
                              !!errors.memberEvaluation?.[memberIndex]
                                ?.sections?.[sectionIndex]?.questions?.[
                                questionIndex
                              ]?.answer &&
                              !!touched.memberEvaluation?.[memberIndex]
                                ?.sections?.[sectionIndex]?.questions?.[
                                questionIndex
                              ]?.answer
                            }
                            errorMessage={
                              errors.memberEvaluation?.[memberIndex]
                                ?.sections?.[sectionIndex]?.questions?.[
                                questionIndex
                              ]?.answer
                            }
                            value={question.answer}
                            listOptions={getProjectSatisFactionOptions(
                              language
                            )}
                            placeholder={PLH_SATISFACTION_LABELS[language]}
                            onChange={value => {
                              setFieldValue(
                                `memberEvaluation[${memberIndex}].sections[${sectionIndex}].questions[${questionIndex}].answer`,
                                value
                              )
                            }}
                          />
                        )}
                        {question.questionType ===
                          SURVEY_TYPE_POINT_VALUES.RADIO && (
                          <InputRadioList
                            disabed={disabled}
                            value={question.answer}
                            listOptions={[
                              {
                                id: 1,
                                label: FEEDBACK_LABELS[1][language],
                                value: 1,
                              },
                              {
                                id: 2,
                                label: FEEDBACK_LABELS[2][language] as string,
                                value: 2,
                              },
                              {
                                id: 3,
                                label: FEEDBACK_LABELS[3][language] as string,
                                value: 3,
                              },
                            ]}
                            onChange={value => {
                              setFieldValue(
                                `memberEvaluation[${memberIndex}].sections[${sectionIndex}].questions[${questionIndex}].answer`,
                                value
                              )
                            }}
                          />
                        )}
                        <Fragment />
                      </FormItem>
                      <InputTextLabel
                        disabled={disabled}
                        label={`${COMMENT_LABELS[language]}:`}
                        placeholder={i18('PLH_COMMENT')}
                        value={question.comment}
                        onChange={(e: EventInput) => {
                          setFieldValue(
                            `memberEvaluation[${memberIndex}].sections[${sectionIndex}].questions[${questionIndex}].comment`,
                            e.target.value
                          )
                        }}
                      />
                    </Box>
                  )
                )}
              </Box>
            </Box>
          </Box>
        </FormLayout>
      ))}
    </Box>
  )
}

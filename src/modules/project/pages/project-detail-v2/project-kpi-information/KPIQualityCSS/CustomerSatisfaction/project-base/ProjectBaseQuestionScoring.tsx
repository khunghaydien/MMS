import CardForm from '@/components/Form/CardForm'
import FormItem from '@/components/Form/FormItem/FormItem'
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
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

interface ProjectBaseQuestionScoringProps {
  disabled: boolean
  formik: any
  language: number
}

export const CATEGORY_LABELS: any = {
  1: 'Category',
  2: 'カテゴリー',
  3: '카테고리',
}

export const COMMENT_LABELS: any = {
  1: 'Comment',
  2: 'コメント',
  3: '의견',
}

export const PLH_SATISFACTION_LABELS: any = {
  1: 'Select Point',
  2: 'ポイントの選択',
  3: '포인트 선택',
}

const ProjectBaseQuestionScoring = ({
  disabled,
  formik,
  language,
}: ProjectBaseQuestionScoringProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const { values, setFieldValue, errors, touched } = formik

  return (
    <Box className={classes.RootProjectBaseQuestionScoring}>
      {values.sections.map((section: any, sectionIndex: number) => (
        <CardForm
          title={`${CATEGORY_LABELS[language]} #${sectionIndex + 1}: ${
            section.categoryName
          }`}
          key={section.id}
        >
          <Box className={classes.listFields}>
            {section.questions.map((question: any, questionIndex: number) => (
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
                      error={
                        !!errors.sections?.[sectionIndex]?.questions?.[
                          questionIndex
                        ]?.answer &&
                        touched.sections?.[sectionIndex]?.questions?.[
                          questionIndex
                        ]?.answer
                      }
                      errorMessage={
                        errors.sections?.[sectionIndex]?.questions?.[
                          questionIndex
                        ]?.answer
                      }
                      isDisable={disabled}
                      isShowClearIcon={false}
                      value={question.answer}
                      listOptions={getProjectSatisFactionOptions(language)}
                      placeholder={PLH_SATISFACTION_LABELS[language]}
                      onChange={value =>
                        setFieldValue(
                          `sections[${sectionIndex}].questions[${questionIndex}].answer`,
                          value
                        )
                      }
                    />
                  )}
                  {question.questionType === SURVEY_TYPE_POINT_VALUES.RADIO && (
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
                          `sections[${sectionIndex}].questions[${questionIndex}].answer`,
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
                      `sections[${sectionIndex}].questions[${questionIndex}].comment`,
                      e.target.value
                    )
                  }
                />
              </Box>
            ))}
          </Box>
        </CardForm>
      ))}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootProjectBaseQuestionScoring: {},
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
}))

export default ProjectBaseQuestionScoring

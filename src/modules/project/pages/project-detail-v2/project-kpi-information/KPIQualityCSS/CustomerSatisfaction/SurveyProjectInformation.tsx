import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import CardForm from '@/components/Form/CardForm'
import InputCurrency from '@/components/inputs/InputCurrency'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import { EventInput } from '@/types'
import { formatDate } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import { SurveyFormValues } from './CustomerSatisfaction'

interface SurveyProjectInformationProps {
  surveyInfo: SurveyFormValues
  formik: any
  disabled: boolean
}

export const PROJECT_INFORMATION_LABELS: any = {
  TITLE: {
    1: 'Project Information',
    2: 'プロジェクト情報',
    3: '프로젝트 정보',
  },
  PROJECT_NAME: {
    1: 'Project Name',
    2: 'プロジェクト名',
    3: '프로젝트명',
  },
  PROJECT_START_DATE: {
    1: 'Project Start Date',
    2: 'プロジェクトの開始日',
    3: '프로젝트 시작일',
  },
  PROJECT_END_DATE: {
    1: 'Project End Date',
    2: 'プロジェクトの終了日',
    3: '프로젝트 종료일',
  },
  MOR_SOFTWARES_REPRESENTATIVE: {
    1: "MOR Software's representative",
    2: "MOR Software's 代表者",
    3: 'MOR소프트웨어의 대표',
  },
  CUSTOMERS_REPRESENTATIVE: {
    1: "Customer's representative",
    2: '顧客の代表者',
    3: '고객의 대표',
  },
  EVALUATORS_NAME: {
    1: "Evaluator's Name",
    2: '評価者の名前',
    3: '평가자명',
  },
  SURVEY_DATE: {
    1: 'Survey Date',
    2: '調査日',
    3: '설문조사 날짜',
  },
  AVERAGE_POINTS: {
    1: 'Average Points',
    2: '平均点',
    3: '평균 포인트',
  },
}

const SurveyProjectInformation = ({
  surveyInfo,
  formik,
  disabled,
}: SurveyProjectInformationProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()

  const informationList = [
    {
      id: 'projectName',
      label: PROJECT_INFORMATION_LABELS.PROJECT_NAME[surveyInfo.language],
      value: surveyInfo.project.name,
      width: 190,
    },
    {
      id: 'startDate',
      label: PROJECT_INFORMATION_LABELS.PROJECT_START_DATE[surveyInfo.language],
      value: formatDate(surveyInfo.project.startDate as Date),
      width: 140,
    },
    {
      id: 'endDate',
      label: PROJECT_INFORMATION_LABELS.PROJECT_END_DATE[surveyInfo.language],
      value: formatDate(surveyInfo.project.endDate as Date),
      width: 140,
    },
    {
      id: 'morRepresentative',
      label:
        PROJECT_INFORMATION_LABELS.MOR_SOFTWARES_REPRESENTATIVE[
          surveyInfo.language
        ],
      value: surveyInfo.morRepresentative.label,
      width: 200,
    },
    {
      id: 'customerRepresentative',
      label:
        PROJECT_INFORMATION_LABELS.CUSTOMERS_REPRESENTATIVE[
          surveyInfo.language
        ],
      value: surveyInfo.customerRepresentative,
      width: 190,
    },
  ]

  const { values, errors, touched, setFieldValue } = formik

  return (
    <CardForm title={PROJECT_INFORMATION_LABELS.TITLE[surveyInfo.language]}>
      <Box className={classes.body}>
        <Box className={classes.listFields}>
          {informationList.map(option => (
            <Box width={option.width} key={option.id}>
              <Box className={classes.label}>{option.label}</Box>
              <Box className={classes.value} title={option.value}>
                {option.value || ''}
              </Box>
            </Box>
          ))}
        </Box>
        <Box className={classes.listFields}>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}>
            <InputTextLabel
              required
              disabled={disabled}
              value={values.evaluatorName}
              error={!!errors.evaluatorName && touched.evaluatorName}
              errorMessage={errors.evaluatorName}
              label={
                PROJECT_INFORMATION_LABELS.EVALUATORS_NAME[surveyInfo.language]
              }
              placeholder={i18('PLH_PERSON_NAME')}
              onChange={(e: EventInput) =>
                setFieldValue('evaluatorName', e.target.value)
              }
            />
          </Box>
          <InputDatepicker
            disabled
            width={160}
            label={PROJECT_INFORMATION_LABELS.SURVEY_DATE[surveyInfo.language]}
            value={values.surveyDate}
            placeholder="--"
          />
          <InputCurrency
            disabled
            placeholder="--"
            value={values.averagePoints}
            label={
              PROJECT_INFORMATION_LABELS.AVERAGE_POINTS[surveyInfo.language]
            }
          />
        </Box>
      </Box>
    </CardForm>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  listFields: {
    display: 'flex',
    gap: theme.spacing(3),
    flexWrap: 'wrap',
  },
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
}))

export default SurveyProjectInformation

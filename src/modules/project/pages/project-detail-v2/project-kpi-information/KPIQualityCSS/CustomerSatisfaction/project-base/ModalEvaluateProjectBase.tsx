import Modal from '@/components/common/Modal'
import LoadingSkeleton from '@/components/loading/LoadingSkeleton'
import { NS_PROJECT } from '@/const/lang.const'
import {
  PROJECT_BASE_SECTION_SURVEY,
  SURVEY_TYPE_POINT_VALUES,
  SURVEY_TYPE_VALUES,
} from '@/modules/project/const'
import { ProjectService } from '@/modules/project/services'
import { alertError, alertSuccess, updateLoading } from '@/reducer/screen'
import commonService from '@/services/common.service'
import customerSatisfactionSurveyService from '@/services/customer-satisfaction-survey.service'
import { AppDispatch } from '@/store'
import { ErrorResponse, OptionItem } from '@/types'
import { scrollToFirstErrorMessage } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import { useFormik } from 'formik'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import useKPIValidation from '../../../useKPIValidation'
import { SurveyFormValues, getSurveyURL } from '../CustomerSatisfaction'
import SurveyProjectInformation from '../SurveyProjectInformation'
import SurveyQuestionExplanation from '../SurveyQuestionExplanation'
import ProjectBaseQuestionScoring from './ProjectBaseQuestionScoring'

export const MODAL_EVALUATE_PROJECT_TITLE: any = {
  1: 'Customer Satisfaction Survey',
  2: '顧客満足度調査',
  3: '고객 만족도 조사',
}

interface ModalEvaluateProjectBaseProps {
  onClose?: () => void
  dataPreview: SurveyFormValues
  mode: 'preview' | 'edit'
  surveyId?: number
  onSuccessfullyAdded?: (surveyId: number) => void
  onSuccessfullyEvaluated?: () => void
  dataDetail?: any
  useClient?: boolean
}

const ModalEvaluateProjectBase = ({
  onClose,
  dataPreview,
  mode,
  onSuccessfullyAdded,
  surveyId,
  onSuccessfullyEvaluated,
  dataDetail,
  useClient,
}: ModalEvaluateProjectBaseProps) => {
  const classes = useStyles()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)
  const { evaluateProjectBaseValidation } = useKPIValidation()

  const [surveyInfo, setSurveyInfo] = useState(dataPreview)
  const [loading, setLoading] = useState(false)

  const form = useFormik({
    initialValues: {
      evaluatorName: '',
      surveyDate: surveyId ? new Date() : null,
      averagePoints: '',
      sections: [],
    } as any,
    validationSchema: evaluateProjectBaseValidation,
    onSubmit: () => {
      evaluateSurveyProject()
    },
  })
  const { values } = form

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

  const evaluateSurveyProject = () => {
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
          questionPointId: 0,
        })
      })
    })
    const payload = {
      surveyId: surveyId as number,
      requestBody: {
        averagePoints: values.averagePoints,
        evaluatorName: values.evaluatorName,
        surveyDate: values.surveyDate?.getTime(),
        surveyId,
        typeSurvey: SURVEY_TYPE_VALUES.PROJECT_BASE,
        overallEvaluate,
        memberEvaluate: null,
      },
    }
    customerSatisfactionSurveyService
      .evaluateSurveyProject(payload)
      .then(() => {
        !!onSuccessfullyEvaluated && onSuccessfullyEvaluated()
        !!onClose && onClose()
        dispatch(
          alertSuccess({
            message: i18Project('MSG_COMPLETED_THE_SURVEY', {
              labelName: surveyInfo.project.name,
            }),
          })
        )
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  const onCreateSurvey = () => {
    const questionIds: number[] = []
    form.values.sections.forEach((section: any) => {
      section.questions.forEach((question: any) => {
        questionIds.push(question.id)
      })
    })
    const payload = {
      projectId: params.projectId as string,
      requestBody: {
        brseAvailable: surveyInfo.brseAvailable === 'yes',
        closedDate: surveyInfo.closedDate?.getTime(),
        customerRepresentative: surveyInfo.customerRepresentative,
        language: surveyInfo.language,
        morRepresentative: surveyInfo.morRepresentative.id,
        name: surveyInfo.name,
        type: SURVEY_TYPE_VALUES.PROJECT_BASE,
      },
    }
    dispatch(updateLoading(true))
    ProjectService.createSurvey(payload)
      .catch((errors: ErrorResponse[]) => {
        dispatch(
          alertError({
            message: errors?.[0]?.message,
          })
        )
      })
      .then((res: AxiosResponse) => {
        dispatch(
          alertSuccess({
            message: i18Project('MSG_PROJECT_CSS_CREATED', {
              surveyName: surveyInfo.name,
              surveyURL: getSurveyURL(res.data),
            }),
          })
        )
        !!onSuccessfullyAdded && onSuccessfullyAdded(res.data)
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  const handleSubmit = () => {
    if (mode === 'preview') {
      onCreateSurvey()
    } else {
      form.handleSubmit()
      scrollToFirstErrorMessage()
    }
  }

  const fillSectionsPreview = (
    res: AxiosResponse,
    language: number,
    brseAvailable: boolean
  ) => {
    const sections = res.data
      .filter((section: any) => {
        if (brseAvailable) {
          return brseAvailable
        } else {
          return section.keyUnique.id !== PROJECT_BASE_SECTION_SURVEY.BRSE
        }
      })
      .map((section: any) => {
        const categoryName = section.name.find(
          (nameOption: OptionItem) => nameOption.id === language
        ).name
        const questions = section.question.map((question: any) => ({
          id: question.id,
          questionName: `${question.order}. ${
            question.name.find(
              (nameOption: OptionItem) => nameOption.id === language
            ).name
          }`,
          questionType: question.typePoint?.id,
          comment: '',
          answer: '',
          required:
            section.keyUnique.id !== PROJECT_BASE_SECTION_SURVEY.FEEDBACK,
        }))
        return {
          id: section.id,
          categoryName,
          questions,
        }
      })
    form.setFieldValue('sections', sections)
  }

  const getProjectSurveyQuestionsPreview = (
    language: number,
    brseAvailable: boolean
  ) => {
    setLoading(true)
    commonService
      .getProjectSurveyQuestions(SURVEY_TYPE_VALUES.PROJECT_BASE)
      .then((res: AxiosResponse) =>
        fillSectionsPreview(res, language, brseAvailable)
      )
      .finally(() => {
        setLoading(false)
      })
  }

  const fillSurveyDetails = (data: any) => {
    setSurveyInfo({
      name: data.name,
      createdDate: new Date(data.createdDate),
      closedDate: new Date(data.closedDate),
      morRepresentative: {
        id: data.morRepresentative.id,
        value: data.morRepresentative.id,
        label: data.morRepresentative.name,
      },
      customerRepresentative: data.customerRepresentative,
      language: data.language.id,
      brseAvailable: data.brseAvailable ? 'yes' : 'no',
      project: {
        name: data.project.name,
        startDate: new Date(data.project.startDate),
        endDate: new Date(data.project.endDate),
      },
    })
    getProjectSurveyQuestionsPreview(data.language.id, data.brseAvailable)
  }

  const getSurveyDetails = () => {
    setLoading(true)
    ProjectService.getSurveyDetails({
      projectId: params.projectId as string,
      surveyId: surveyId as number,
    }).then((res: AxiosResponse) => fillSurveyDetails(res.data))
  }

  useEffect(() => {
    if (mode === 'preview') {
      getProjectSurveyQuestionsPreview(
        +surveyInfo.language,
        surveyInfo.brseAvailable === 'yes'
      )
    }
  }, [])

  useEffect(() => {
    if (mode === 'edit' && !dataDetail) {
      getSurveyDetails()
    } else {
      !!Object.keys(dataDetail || {}).length && fillSurveyDetails(dataDetail)
    }
  }, [dataDetail])

  useEffect(() => {
    if (averagePoints) {
      form.setFieldValue('averagePoints', averagePoints)
    }
  }, [averagePoints])

  return (
    <Modal
      open
      cancelOutlined
      useButtonCancel
      useButtonDontSave={!useClient}
      isHideButtonClose={useClient}
      width={1100}
      title={
        loading
          ? 'Loading...'
          : MODAL_EVALUATE_PROJECT_TITLE[surveyInfo.language || 1]
      }
      labelSubmit={
        mode === 'preview'
          ? (i18Project('TXT_CREATE_SURVEY') as string)
          : (i18('LB_SUBMIT') as string)
      }
      onClose={onClose}
      onDontSave={onClose}
      onSubmit={handleSubmit}
    >
      <Box className={classes.body}>
        {loading && <LoadingSkeleton />}
        {!loading && (
          <Fragment>
            <SurveyProjectInformation
              disabled={mode === 'preview'}
              formik={form}
              surveyInfo={surveyInfo}
            />
            <SurveyQuestionExplanation language={+surveyInfo.language} />
            <ProjectBaseQuestionScoring
              disabled={mode === 'preview'}
              formik={form}
              language={+surveyInfo.language}
            />
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
}))

export default ModalEvaluateProjectBase

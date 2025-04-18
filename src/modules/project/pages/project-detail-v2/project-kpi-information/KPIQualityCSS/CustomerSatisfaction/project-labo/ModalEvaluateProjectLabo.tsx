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
import { MODAL_EVALUATE_PROJECT_TITLE } from '../project-base/ModalEvaluateProjectBase'
import ProjectLaboQuestionScoring from './ProjectLaboQuestionScoring'

interface ModalEvaluateProjectLaboProps {
  onClose?: () => void
  dataPreview: SurveyFormValues
  mode: 'preview' | 'edit'
  surveyId?: number
  onSuccessfullyAdded?: (surveyId: number) => void
  onSuccessfullyEvaluated?: () => void
  dataDetail?: any
  useClient?: boolean
}

const SURVEY_PROJECT_LABO_OVERALL_EVALUATION = 1
const SURVEY_PROJECT_LABO_MEMBER_EVALUATION = 2

const ModalEvaluateProjectLabo = ({
  onClose,
  dataPreview,
  mode,
  onSuccessfullyAdded,
  surveyId,
  onSuccessfullyEvaluated,
  dataDetail,
  useClient,
}: ModalEvaluateProjectLaboProps) => {
  const classes = useStyles()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const { evaluateProjectLaboValidation } = useKPIValidation()

  const [surveyInfo, setSurveyInfo] = useState(dataPreview)
  const [loading, setLoading] = useState(false)

  const form = useFormik({
    initialValues: {
      evaluatorName: '',
      surveyDate: surveyId ? new Date() : null,
      averagePoints: '',
      overallEvaluation: {
        sectionName: '',
        general: {},
        feedback: [],
      },
      memberEvaluation: [],
    } as any,
    validationSchema: evaluateProjectLaboValidation,
    onSubmit: () => {
      evaluateSurveyProject()
    },
  })
  const { values } = form

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

  const evaluateSurveyProject = () => {
    dispatch(updateLoading(true))
    const payload = {
      surveyId: surveyId as number,
      requestBody: {
        averagePoints: values.averagePoints,
        evaluatorName: values.evaluatorName,
        surveyDate: values.surveyDate?.getTime(),
        surveyId,
        typeSurvey: SURVEY_TYPE_VALUES.PROJECT_LABO,
        overallEvaluate: [
          ...values.overallEvaluation.general.questions.map(
            (question: any) => ({
              comment: question.comment,
              point: +question.answer,
              questionId: question.id,
              questionPointId: 0,
            })
          ),
          ...values.overallEvaluation.feedback.questions.map(
            (question: any) => ({
              comment: question.comment,
              point: +question.answer,
              questionId: question.id,
              questionPointId: 0,
            })
          ),
        ],
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
                questionPointId: 0,
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
    const payload = {
      projectId: params.projectId as string,
      requestBody: {
        brseAvailable: null,
        closedDate: dataPreview.closedDate?.getTime(),
        customerRepresentative: dataPreview.customerRepresentative,
        language: dataPreview.language,
        morRepresentative: dataPreview.morRepresentative.id,
        name: dataPreview.name,
        type: SURVEY_TYPE_VALUES.PROJECT_LABO,
      },
    }
    dispatch(updateLoading(true))
    ProjectService.createSurvey(payload)
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
      .catch((errors: ErrorResponse[]) => {
        dispatch(
          alertError({
            message: errors?.[0]?.message,
          })
        )
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
      setTimeout(() => {
        scrollToFirstErrorMessage()
      })
    }
  }

  const fillSectionsPreview = (res: AxiosResponse, language: number) => {
    const overallEvaluation = res.data.filter(
      (item: { type: { id: number } }) =>
        item.type.id === SURVEY_PROJECT_LABO_OVERALL_EVALUATION
    )
    const memberEvaluation = res.data.filter(
      (item: { type: { id: number } }) =>
        item.type.id === SURVEY_PROJECT_LABO_MEMBER_EVALUATION
    )
    form.setValues({
      ...form.values,
      overallEvaluation: {
        cardFormName: overallEvaluation[0].name.find(
          (nameOption: OptionItem) => nameOption.id === language
        ).name,
        general: {
          sectionName: '',
          questions: overallEvaluation[0].question.map((question: any) => ({
            id: question.id,
            questionName: `${question.order}. ${
              question.name.find(
                (nameOption: OptionItem) => nameOption.id === language
              ).name
            }`,
            questionType: question.typePoint?.id,
            comment: '',
            answer: '',
            required: true,
          })),
        },
        feedback: {
          sectionName: overallEvaluation[1].name.find(
            (nameOption: OptionItem) => nameOption.id === language
          ).name,
          questions: overallEvaluation[1].question.map((question: any) => ({
            id: question.id,
            questionName: `${question.order}. ${
              question.name.find(
                (nameOption: OptionItem) => nameOption.id === language
              ).name
            }`,
            questionType: question.typePoint?.id,
            comment: '',
            answer: '',
            required: false,
          })),
        },
      },
      memberEvaluation: [
        {
          id: 1,
          member: {},
          role: '',
          averageMemberPoints: '',
          sections: memberEvaluation.map((section: any) => {
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
          }),
        },
      ],
    })
  }

  const getProjectSurveyQuestionsPreview = (language: number) => {
    setLoading(true)
    commonService
      .getProjectSurveyQuestions(SURVEY_TYPE_VALUES.PROJECT_LABO)
      .then((res: AxiosResponse) => fillSectionsPreview(res, language))
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
    getProjectSurveyQuestionsPreview(data.language.id)
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
      getProjectSurveyQuestionsPreview(+surveyInfo.language)
    }
  }, [])

  useEffect(() => {
    if (mode === 'edit' && !dataDetail) {
      getSurveyDetails()
    } else {
      !!Object.keys(dataDetail || {}).length && fillSurveyDetails(dataDetail)
    }
  }, [])

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
            {!!form.values.overallEvaluation.cardFormName && (
              <ProjectLaboQuestionScoring
                disabled={mode === 'preview'}
                formik={form}
                language={+surveyInfo.language}
              />
            )}
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

export default ModalEvaluateProjectLabo

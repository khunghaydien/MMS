import Processing from '@/components/common/Processing'
import { PathConstant } from '@/const'
import { NS_PROJECT } from '@/const/lang.const'
import { SURVEY_TYPE_VALUES } from '@/modules/project/const'
import { SurveyFormValues } from '@/modules/project/pages/project-detail-v2/project-kpi-information/KPIQualityCSS/CustomerSatisfaction/CustomerSatisfaction'
import ModalEvaluateProjectBase from '@/modules/project/pages/project-detail-v2/project-kpi-information/KPIQualityCSS/CustomerSatisfaction/project-base/ModalEvaluateProjectBase'
import ModalEvaluateProjectLabo from '@/modules/project/pages/project-detail-v2/project-kpi-information/KPIQualityCSS/CustomerSatisfaction/project-labo/ModalEvaluateProjectLabo'
import { ScreenState, selectScreen } from '@/reducer/screen'
import customerSatisfactionSurveyService from '@/services/customer-satisfaction-survey.service'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import { useFormik } from 'formik'
import moment from 'moment'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

const CustomerSurveyLayout = () => {
  const classes = useStyles()
  const navigate = useNavigate()
  const { surveyId }: any = useParams()
  const { isLoading }: ScreenState = useSelector(selectScreen)
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const [surveyType, setSurveyType] = useState(0)
  const [loading, setLoading] = useState(true)
  const [dataDetail, setDataDetail] = useState<any>({})
  const [isEvaluated, setIsEvaluated] = useState(false)

  const initialFormDataCreatedValues: SurveyFormValues = useMemo(() => {
    return {
      name: '',
      createdDate: new Date(),
      closedDate: null,
      morRepresentative: {},
      project: {
        name: '',
        startDate: null,
        endDate: null,
      },
      customerRepresentative: '',
      language: '',
      brseAvailable: 'yes',
    }
  }, [])

  const formDataCreateSurvey = useFormik({
    initialValues: initialFormDataCreatedValues,
    onSubmit: () => {},
  })

  const getSurveyDetails = () => {
    setTimeout(() => {
      setLoading(true)
    })
    customerSatisfactionSurveyService
      .getSurveyDetails(surveyId)
      .then((res: AxiosResponse) => {
        setDataDetail(res.data)
        setSurveyType(res.data.type.id)
        const closedDate = new Date(
          moment(res.data.closedDate).format('MM/DD/YYYY')
        ).getTime()
        const currentDate = new Date(
          moment(new Date()).format('MM/DD/YYYY')
        ).getTime()
        if (closedDate - currentDate < 0) {
          navigate(PathConstant.PAGE_404)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const onSuccessfullyEvaluated = () => {
    setSurveyType(0)
    setIsEvaluated(true)
  }

  useEffect(() => {
    getSurveyDetails()
  }, [])

  return loading ? (
    <Processing open />
  ) : (
    <Fragment>
      <Processing open={isLoading} />
      {isEvaluated && (
        <Box className={classes.messageContainer}>
          <Box className={classes.messageBox}>
            <Box className={classes.title}>
              {i18Project('TXT_CUSTOMER_SATISFACTION_SURVEY')}
            </Box>
            <Box className={classes.description}>
              {i18Project('CUSTOMER_EVALUATE_MESSAGE_THANK_YOU')}
            </Box>
          </Box>
        </Box>
      )}
      {surveyType === SURVEY_TYPE_VALUES.PROJECT_BASE && !isEvaluated && (
        <ModalEvaluateProjectBase
          useClient
          dataDetail={dataDetail}
          surveyId={surveyId}
          mode="edit"
          dataPreview={formDataCreateSurvey.values}
          onSuccessfullyEvaluated={onSuccessfullyEvaluated}
        />
      )}
      {surveyType === SURVEY_TYPE_VALUES.PROJECT_LABO && !isEvaluated && (
        <ModalEvaluateProjectLabo
          useClient
          dataDetail={dataDetail}
          surveyId={surveyId}
          mode="edit"
          dataPreview={formDataCreateSurvey.values}
          onSuccessfullyEvaluated={onSuccessfullyEvaluated}
        />
      )}
    </Fragment>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  messageContainer: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: theme.spacing(10),
  },
  messageBox: {
    border: `1px solid ${theme.color.grey.secondary}`,
    borderRadius: '8px',
    padding: theme.spacing(3),
  },
  title: {
    color: theme.color.blue.primary,
    fontWeight: 700,
    marginBottom: theme.spacing(1),
    fontSize: 18,
  },
  description: {},
}))

export default CustomerSurveyLayout

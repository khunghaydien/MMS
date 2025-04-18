import CardFormModeView from '@/components/Form/CardForm/CardFormModeView'
import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import { LangConstant, PathConstant } from '@/const'
import { LIMIT_DEFAULT, PAGE_CURRENT_DEFAULT } from '@/const/table.const'
import { useQuery } from '@/hooks/useQuery'
import { alertError } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { ErrorResponse } from '@/types'
import { formatDate } from '@/utils'
import { AxiosResponse } from 'axios'
import QueryString from 'query-string'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import StringFormat from 'string-format'
import ECAppraiseeList from '../../components/ECAppraiseeList'
import { MY_TEAM_MEMBER_EVALUATION } from '../../const'
import { AppraiseeItem, EvaluationCycleItem } from '../../models'
import {
  EvaluationProcessState,
  evaluationProcessSelector,
  setQueryEvaluationAppraisees,
} from '../../reducer/evaluation-process'
import EvaluationProcessService from '../../services/evaluation-process.service'

const EvaluationCycleProcessAppraiseeList = () => {
  const params = useParams()
  const navigate = useNavigate()
  const queryParams = useQuery()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)
  const { queryEvaluationAppraisees }: EvaluationProcessState = useSelector(
    evaluationProcessSelector
  )

  const [isLoading, setIsLoading] = useState(false)
  const [cycleInformation, setCycleInformation] = useState<EvaluationCycleItem>(
    {}
  )
  const [appraiseeList, setAppraiseeList] = useState<AppraiseeItem[]>([])
  const [totalElements, setTotalElements] = useState(0)

  const cycleInformationListOptions = useMemo(() => {
    return [
      {
        id: 1,
        value: cycleInformation?.name || '',
        label: i18Mbo('LB_CYCLE_NAME') || '',
      },
      {
        id: 2,
        value: `${cycleInformation.duration} ${i18('LB_MONTHS')}`,
        label: i18('LB_DURATION') || '',
      },
      {
        id: 3,
        value: formatDate(cycleInformation.startDate),
        label: i18('LB_START_DATE') || '',
      },
      {
        id: 4,
        value: formatDate(cycleInformation.endDate),
        label: i18('LB_END_DATE') || '',
      },
      {
        id: 5,
        value: cycleInformation.appraiser?.name,
        label: i18Mbo('LB_ORIGINATOR') || '',
      },
    ]
  }, [cycleInformation, i18, i18Mbo])

  const fillDataDetail = (data: any) => {
    setCycleInformation(data.evaluationCycle)
    setAppraiseeList(data.appraiseesResponses.content)
    setTotalElements(data.appraiseesResponses.totalElements)
  }

  const getCycleDetailForTeamMemberView = async () => {
    setIsLoading(true)
    const promise = EvaluationProcessService.getCycleDetailForTeamMemberView({
      evaluationCycleId: params.evaluationCycleId || '',
      queries: queryEvaluationAppraisees,
    })
    promise
      .then((res: AxiosResponse) => {
        fillDataDetail(res.data)
      })
      .catch((errors: ErrorResponse[]) => {
        if (errors[0]?.field === 'evaluationCycleId') {
          handleBackPage()
          dispatch(
            alertError({
              message: StringFormat(
                i18('MSG_SCREEN_NOT_FOUND'),
                i18Mbo('LB_CYCLE') || ''
              ),
            })
          )
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleBackPage = () => {
    navigate({
      pathname: PathConstant.MBO_EVALUATION_PROCESS,
      search: QueryString.stringify({
        tab: queryParams.get('tab') || MY_TEAM_MEMBER_EVALUATION,
      }),
    })
  }

  useEffect(() => {
    getCycleDetailForTeamMemberView()
  }, [queryEvaluationAppraisees])

  useEffect(() => {
    return () => {
      dispatch(
        setQueryEvaluationAppraisees({
          name: '',
          pageNum: PAGE_CURRENT_DEFAULT,
          pageSize: LIMIT_DEFAULT,
          projectId: '',
          status: '',
        })
      )
    }
  }, [])

  return (
    <CommonScreenLayout
      useBackPage
      backLabel={i18Mbo('TXT_BACK_TO_EVALUATION_PROCESS')}
      onBack={handleBackPage}
    >
      <CardFormModeView
        isLoading={isLoading && !cycleInformation.id}
        title={i18Mbo('TXT_CYCLE_INFORMATION')}
        dataRendering={cycleInformationListOptions}
        isVertical={false}
      />
      <ECAppraiseeList
        isLoading={isLoading}
        appraiseeList={appraiseeList}
        totalElements={totalElements}
      />
    </CommonScreenLayout>
  )
}

export default EvaluationCycleProcessAppraiseeList

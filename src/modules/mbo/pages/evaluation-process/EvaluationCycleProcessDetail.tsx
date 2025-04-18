import { HttpStatusCode } from '@/api/types'
import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import ConditionalRender from '@/components/ConditionalRender'
import LoadingSkeleton from '@/components/loading/LoadingSkeleton'
import CommonTabs from '@/components/tabs'
import { LangConstant } from '@/const'
import {
  MBO_EVALUATION_PROCESS,
  MBO_EVALUATION_PROCESS_APPRAISEE_LIST_FORMAT,
} from '@/const/path.const'
import { useQuery } from '@/hooks/useQuery'
import ECProcessEvaluationPeriod from '@/modules/mbo/components/ECProcessEvaluationPeriod'
import { alertError } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { IProjectManager, OptionItem } from '@/types'
import { formatDate } from '@/utils'
import QueryString from 'query-string'
import { useLayoutEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import StringFormat from 'string-format'
import CycleInformationSection from '../../components/CycleInformationSection'
import ECProcessAchievement from '../../components/ECProcessAchievement'
import ECProcessSummary from '../../components/ECProcessSummary/ECProcessSummary'
import { APPROVED, CYCLE_STATUS } from '../../const'
import {
  EvaluationProcessState,
  evaluationProcessSelector,
  getECStaffGeneralInfo,
  setCycleInformation,
} from '../../reducer/evaluation-process'

const SUMMARY = 1
export const EVALUATION_PERIOD = 2
export const ATTITUDE = 3
const ACHIEVEMENT = 4

const EvaluationCycleProcessDetail = () => {
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const queryParams = useQuery()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)
  const {
    cycleInformation,
    isTaskFetching,
    isCycleInformationLoading,
  }: EvaluationProcessState = useSelector(evaluationProcessSelector)

  const [activeTab, setActiveTab] = useState(SUMMARY)
  const [dataRendering, setDataRendering] = useState<OptionItem[]>([])

  const statusTaskInformation = useMemo(() => {
    return CYCLE_STATUS[cycleInformation.evaluationCycleStatus?.id]
  }, [cycleInformation])
  const tabDetail = useMemo(() => queryParams.get('tab'), [queryParams])
  const tabs = useMemo(() => {
    return [
      {
        step: SUMMARY,
        label: i18Mbo('LB_SUMMARY'),
        disabled: !cycleInformation.isSummary,
      },
      {
        step: EVALUATION_PERIOD,
        label: i18Mbo('LB_EVALUATION_PERIOD'),
        disabled: !cycleInformation.isEvaluationPeriod,
      },
      {
        step: ACHIEVEMENT,
        label: i18Mbo('LB_ACHIEVEMENT'),
        disabled: !cycleInformation.isAchievement,
      },
    ]
  }, [
    cycleInformation.isSummary,
    cycleInformation.isJobResult,
    cycleInformation.isAchievement,
  ])

  const handleActiveTab = (value: number) => {
    setActiveTab(value)
  }

  const fillDataRendering = (data: any) => {
    setDataRendering([
      {
        id: 1,
        label: i18Mbo('LB_APPRAISEE') || '',
        value: data.staff.name || '',
      },
      {
        id: 2,
        label: i18('LB_DURATION') || '',
        value: `${data.duration || 0} ${i18('LB_MONTHS')}`,
      },
      {
        id: 3,
        label: i18('LB_START_DATE') || '',
        value: formatDate(data.startDate),
      },
      {
        id: 4,
        label: i18('LB_END_DATE') || '',
        value: formatDate(data.endDate),
      },
      {
        id: 5,
        label: i18Mbo('LB_APPRAISER') || '',
        value:
          data.appraisers
            ?.map((item: IProjectManager) => item.name)
            ?.join(', ') || 'None',
      },
      {
        id: 6,
        label: i18Mbo('LB_REVIEWER') || '',
        value: data.reviewer.name || '',
      },
    ])
  }

  const handleBackPage = () => {
    navigate({
      pathname:
        queryParams.get('history') === 'appraisee-list'
          ? StringFormat(
              MBO_EVALUATION_PROCESS_APPRAISEE_LIST_FORMAT,
              params.evaluationCycleId || ''
            )
          : MBO_EVALUATION_PROCESS,
      search: QueryString.stringify({
        tab: queryParams.get('tab'),
      }),
    })
  }
  const [errorCycleInformation, setErrorCycleInformation] = useState(false)
  const dispatchGetECStaffGeneralInfo = () => {
    dispatch(
      getECStaffGeneralInfo({
        evaluationCycleId: params.evaluationCycleId || '',
        evaluationCycleStaffId: queryParams.get('evaluationCycleStaffId') || '',
      })
    )
      .unwrap()
      .then(res => {
        dispatch(setCycleInformation(res.data))
        fillDataRendering(res.data)
      })
      .catch(error => {
        setErrorCycleInformation(true)
        dispatch(
          alertError({
            message: 'This content does not exist ',
          })
        )
        if (error[0]?.field === 'evaluationCycleId') {
          navigate(MBO_EVALUATION_PROCESS)
          dispatch(
            alertError({
              message: StringFormat(
                i18('MSG_SCREEN_NOT_FOUND'),
                i18Mbo('LB_CYCLE') || ''
              ),
            })
          )
        }
        if (error[0]?.field === 'staffId') {
          navigate(
            StringFormat(
              MBO_EVALUATION_PROCESS_APPRAISEE_LIST_FORMAT,
              params.evaluationCycleId || ''
            )
          )
          dispatch(
            alertError({
              message: StringFormat(
                i18('MSG_SCREEN_NOT_FOUND'),
                i18Mbo('LB_STAFF') || ''
              ),
            })
          )
        }
      })
  }

  useLayoutEffect(() => {
    dispatchGetECStaffGeneralInfo()
  }, [queryParams])

  useLayoutEffect(() => {
    const listActiveTabs = tabs.filter(tab => !tab.disabled)
    if (listActiveTabs[0] && listActiveTabs[0].step !== activeTab) {
      setActiveTab(listActiveTabs[0].step)
    }
  }, [tabs])

  const getIsApproved = useMemo(() => {
    return cycleInformation.evaluationCycleStaffStatus?.id === APPROVED
  }, [cycleInformation])

  const [isApproved, setIsApproved] = useState<boolean>(false)
  const handleSubmit = (value: any) => {
    if (value.status === HttpStatusCode.OK) {
      setIsApproved(true)
    }
  }
  return (
    <CommonScreenLayout
      useBackPage
      backLabel={i18Mbo('TXT_BACK_TO_EVALUATION_CYCLE_LIST')}
      onBack={handleBackPage}
    >
      <CycleInformationSection
        dataRendering={dataRendering}
        isLoading={isCycleInformationLoading}
        statusItem={statusTaskInformation}
      />
      {!!Object.keys(cycleInformation).length && (
        <CommonTabs
          disabled={isTaskFetching}
          configTabs={tabs}
          activeTab={activeTab}
          onClickTab={handleActiveTab}
        />
      )}
      <ConditionalRender
        conditional={
          !!Object.keys(cycleInformation).length || errorCycleInformation
        }
        fallback={<LoadingSkeleton />}
      >
        {activeTab === SUMMARY && !!cycleInformation.isSummary && (
          <ECProcessSummary
            isApproved={isApproved || getIsApproved}
            handleSubmit={handleSubmit}
          />
        )}
        {activeTab === ACHIEVEMENT && !!cycleInformation.isAchievement && (
          <ECProcessAchievement isApproved={isApproved || getIsApproved} />
        )}
        {activeTab === EVALUATION_PERIOD &&
          !!cycleInformation.isEvaluationPeriod && (
            <ECProcessEvaluationPeriod
              isApproved={isApproved || getIsApproved}
              tabEvaluation={Number(tabDetail)}
              evaluationCycleId={cycleInformation.evaluationCycleId || null}
              dispatchGetECStaffGeneralInfo={dispatchGetECStaffGeneralInfo}
            />
          )}
      </ConditionalRender>
    </CommonScreenLayout>
  )
}

export default EvaluationCycleProcessDetail

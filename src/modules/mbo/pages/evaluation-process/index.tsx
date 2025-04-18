import ConditionalRender from '@/components/ConditionalRender'
import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import CommonTabs from '@/components/tabs'
import { LangConstant } from '@/const'
import SelfInfo from '@/modules/settings/components/SelfInfo'
import { AuthState, selectAuth } from '@/reducer/auth'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import QueryString from 'query-string'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useLocation, useSearchParams } from 'react-router-dom'
import {
  APPROVE_AS_REVIEWER,
  EVALUATE_AS_APPRAISER,
  MBO_TAB_ALL,
  MY_EVALUATION,
  MY_PROJECT_MEMBER_EVALUATION,
  MY_TEAM_MEMBER_EVALUATION,
} from '../../const'
import {
  EvaluationProcessState,
  evaluationProcessSelector,
} from '../../reducer/evaluation-process'
import EvaluationCycleList from './EvaluationCycleList'
import EvaluationCycleReviewerList from './EvaluationCycleReviewerList'
const EvaluationProcess = () => {
  const classes = useStyles()
  const { search } = useLocation()
  const [_, setSearchParams] = useSearchParams()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)

  const { staff, permissions }: AuthState = useSelector(selectAuth)

  const {
    isEvaluationCycleListFetching,
    isEvaluationCycleListCompletedFetching,
  }: EvaluationProcessState = useSelector(evaluationProcessSelector)

  const tabs = useMemo(() => {
    if (permissions.useMBOAllCycle) {
      return [
        {
          step: MBO_TAB_ALL,
          label: i18Mbo('LB_ALL_CYCLE'),
          isVisible: permissions.useMBOAllCycle,
        },
        {
          step: EVALUATE_AS_APPRAISER,
          label: i18Mbo('LB_EVALUATE_AS_APPRAISER'),
          isVisible: permissions.useMBOEvaluateAsAppraiser,
        },
        {
          step: APPROVE_AS_REVIEWER,
          label: i18Mbo('LB_APPROVE_AS_REVIEWER'),
          isVisible: permissions.useMBOViewEvaluationManager,
        },
      ].filter(tab => tab.isVisible)
    } else {
      return [
        {
          step: MY_EVALUATION,
          label: i18Mbo('TXT_MY_EVALUATION'),
          isVisible: permissions.useMBOMyEvaluation,
        },
        {
          step: MY_TEAM_MEMBER_EVALUATION,
          label: i18Mbo('TXT_TEAM_MEMBER_EVALUATION'),
          isVisible: permissions.useMBOTeamMemberEvaluation,
        },
        {
          step: MY_PROJECT_MEMBER_EVALUATION,
          label: i18Mbo('TXT_PROJECT_MEMBER_EVALUATION'),
          isVisible: permissions.useMBOProjectMemberEvaluation,
        },
      ].filter(tab => tab.isVisible)
    }
  }, [permissions, i18Mbo])

  const [activeTab, setActiveTab] = useState(() => {
    const tabQuery = +(QueryString.parse(search).tab || 0)
    const isTabExist = tabs.some(tab => tab.step === tabQuery)
    if (!tabQuery || !isTabExist) return tabs[0]?.step || MY_EVALUATION
    return tabQuery
  })

  const handleActiveTab = (value: number) => {
    setActiveTab(value)
    setSearchParams({
      tab: value.toString(),
    })
  }

  const isLoading =
    isEvaluationCycleListFetching || isEvaluationCycleListCompletedFetching

  return (
    <CommonScreenLayout>
      <ConditionalRender conditional={!!tabs.length}>
        <CommonTabs
          disabled={isLoading}
          configTabs={tabs}
          activeTab={activeTab}
          onClickTab={handleActiveTab}
        />
      </ConditionalRender>
      <Box className={classes.evaluationContainer}>
        <ConditionalRender
          conditional={
            activeTab === MY_EVALUATION &&
            !permissions.useMBOViewEvaluationManager
          }
        >
          <SelfInfo title={`${staff?.name} - ${staff?.positionName}`} />
        </ConditionalRender>

        <ConditionalRender conditional={permissions.useMBOAllCycle}>
          <EvaluationCycleReviewerList tabMember={activeTab} />
        </ConditionalRender>

        <ConditionalRender conditional={!permissions.useMBOAllCycle}>
          <EvaluationCycleList tabMember={activeTab} />
        </ConditionalRender>
      </Box>
    </CommonScreenLayout>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  evaluationContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
}))

export default EvaluationProcess

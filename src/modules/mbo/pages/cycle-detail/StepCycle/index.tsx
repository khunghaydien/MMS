import CommonTabs from '@/components/tabs'
import { LangConstant } from '@/const'
import { CYCLE_STEP } from '@/modules/mbo/const'
import { CycleState, cycleSelector } from '@/modules/mbo/reducer/cycle'
import { Box } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import CycleAppraiseesList from './CycleAppraiseesList'
import CycleAppraiserReviewersList from './CycleAppraiserReviewersList'
import CycleCriteriaInformation from './CycleCriteriaInformation'

interface IProps {
  loadingStep: boolean
}

const StepCycle = ({ loadingStep }: IProps) => {
  const { evaluationCycle }: CycleState = useSelector(cycleSelector)
  const [activeTab, setActiveTab] = useState(CYCLE_STEP.APPRAISEES_LIST)
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)
  const tabs = [
    {
      step: CYCLE_STEP.APPRAISEES_LIST,
      label: i18Mbo('LB_APPRAISEES_LIST'),
    },
    {
      step: CYCLE_STEP.APPRAISER_AND_REVIEWERS_LIST,
      label: i18Mbo('LB_APPRAISER_AND_REVIEWERS_LISTS'),
    },
    {
      step: CYCLE_STEP.CRITERIA_INFORMATION,
      label: i18Mbo('LB_CRITERIA_INFORMATION'),
    },
    // {
    //   step: CYCLE_STEP.ADVANCE_SETTING,
    //   label: 'Advance Setting',
    // },
  ]

  const handleActiveTab = (value: number) => {
    setActiveTab(value)
  }

  return (
    <Box>
      <CommonTabs
        disabled={false}
        configTabs={tabs}
        activeTab={activeTab}
        onClickTab={handleActiveTab}
      />
      <Box>
        {activeTab == CYCLE_STEP.APPRAISEES_LIST && <CycleAppraiseesList />}
        {activeTab == CYCLE_STEP.APPRAISER_AND_REVIEWERS_LIST && (
          <CycleAppraiserReviewersList
            appraisees={evaluationCycle?.appraisees || []}
            loadingStep={loadingStep}
          />
        )}
        {activeTab == CYCLE_STEP.CRITERIA_INFORMATION && (
          <CycleCriteriaInformation loadingStep={loadingStep} />
        )}
        {/* {activeTab == CYCLE_STEP.ADVANCE_SETTING && <AdvanceSetting />} */}
      </Box>
    </Box>
  )
}
export default StepCycle

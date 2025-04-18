import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import ConditionalRender from '@/components/ConditionalRender'
import CommonTabs from '@/components/tabs'
import { LangConstant } from '@/const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import MyOTReport from './MyOTReport'
import OTReportForApproval from './OTReportForApproval'

const MY_OT_REPORT = 1
const OT_REPORT_FOR_APPROVAL = 2
const OT_REPORT_FOR_ALL = 3
const RootTimesheetOTManagement = () => {
  const { t: i18DailyReport } = useTranslation(LangConstant.NS_DAILY_REPORT)
  const { role }: AuthState = useSelector(selectAuth)
  const [activeTab, setActiveTab] = useState(1)

  const isDivisionDirector = useMemo(() => {
    return role.some((item: any) => item.name === 'Division Director')
  }, [role])

  const isCEO = useMemo(() => {
    return role.some(
      (item: any) => item.name === 'CEO' || item.name === 'Admin'
    )
  }, [role])

  const tabs = [
    {
      step: MY_OT_REPORT,
      label: i18DailyReport('LB_MY_OT_REPORT'),
      isVisible: !isDivisionDirector,
    },
    {
      step: OT_REPORT_FOR_APPROVAL,
      label: i18DailyReport('LB_OT_REPORT_FOR_APPROVAL'),
      isVisible: true,
    },
    {
      step: OT_REPORT_FOR_ALL,
      label: i18DailyReport('LB_OT_REPORT_FOR_ALL'),
      isVisible: isCEO,
    },
  ].filter(tab => tab.isVisible)

  return (
    <CommonScreenLayout title={i18DailyReport('TXT_TIMESHEET_OT_MANAGEMENT')}>
      <CommonTabs
        activeTab={isDivisionDirector ? 2 : activeTab}
        configTabs={tabs}
        onClickTab={tab => setActiveTab(tab)}
      />
      <ConditionalRender
        conditional={!isDivisionDirector}
        fallback={
          <OTReportForApproval isDivisionDirector={isDivisionDirector} />
        }
      >
        {activeTab === MY_OT_REPORT && <MyOTReport />}
        {activeTab === OT_REPORT_FOR_APPROVAL && (
          <OTReportForApproval isDivisionDirector={isDivisionDirector} />
        )}
        {activeTab === OT_REPORT_FOR_ALL && (
          <OTReportForApproval
            isDivisionDirector={isDivisionDirector}
            isAllReportOT={true}
          />
        )}
      </ConditionalRender>
    </CommonScreenLayout>
  )
}

export default RootTimesheetOTManagement

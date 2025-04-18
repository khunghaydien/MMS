import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import CommonTabs from '@/components/tabs'
import { NS_SETTING } from '@/const/lang.const'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import FeaturesOfSettings from './features'

export const TAB_YOUR_PROFILE = 1
export const TAB_ACCOUNT_SETTINGS = 2

const ModuleSettings = () => {
  const { t: i18Setting } = useTranslation(NS_SETTING)

  const settingsTab = [
    {
      step: TAB_YOUR_PROFILE,
      label: i18Setting('LB_PROFILE'),
    },
    {
      step: TAB_ACCOUNT_SETTINGS,
      label: i18Setting('LB_ACCOUNT_SETTINGS'),
    },
  ]

  const [activeSettingTab, setActiveSettingTab] = useState(settingsTab[0].step)

  const handleTabChange = (tab: number) => {
    setActiveSettingTab(tab)
  }

  return (
    <CommonScreenLayout title="">
      <CommonTabs
        configTabs={settingsTab}
        activeTab={activeSettingTab}
        onClickTab={handleTabChange}
      />
      <FeaturesOfSettings activeSettingTab={activeSettingTab} />
    </CommonScreenLayout>
  )
}

export default ModuleSettings

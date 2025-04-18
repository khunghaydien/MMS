import { Fragment } from 'react'
import AccountSettings from './AccountSettings'
import PublicProfile from './PublicProfile'

interface FeaturesOfSettingsProps {
  activeSettingTab: number
}

const FeaturesOfSettings = ({ activeSettingTab }: FeaturesOfSettingsProps) => {
  switch (activeSettingTab) {
    case 1:
      return <PublicProfile />
    case 2:
      return <AccountSettings />
    default:
      return <Fragment />
  }
}

export default FeaturesOfSettings

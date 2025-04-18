import { NS_SETTING } from '@/const/lang.const'
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import SelfInfo from '../components/SelfInfo'

const PublicProfile = () => {
  const { t: i18Setting } = useTranslation(NS_SETTING)
  return (
    <Box>
      <SelfInfo title={i18Setting('LB_PUBLIC_PROFILE') || ''} isVertical />
      {/* more card form... */}
    </Box>
  )
}

export default PublicProfile

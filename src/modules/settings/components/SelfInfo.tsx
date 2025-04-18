import CardFormModeView from '@/components/Form/CardForm/CardFormModeView'
import { LangConstant } from '@/const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

interface SelfInfoProps {
  title?: string
  isVertical?: boolean
}

const SelfInfo = ({ title = '', isVertical = false }: SelfInfoProps) => {
  const { t: i18 } = useTranslation()
  const { t: i18Setting } = useTranslation(LangConstant.NS_SETTING)

  const { staff }: AuthState = useSelector(selectAuth)

  return (
    <CardFormModeView
      title={title || i18('TXT_GENERAL_INFORMATION') || ''}
      isVertical={isVertical}
      dataRendering={[
        {
          id: 1,
          value: staff?.code || '',
          label: i18('LB_CODE') || '',
        },
        {
          id: 2,
          value: staff?.name || '',
          label: i18Setting('LB_FULL_NAME') || '',
        },
        {
          id: 3,
          value: staff?.dateOfBirth || '',
          label: i18Setting('LB_DATE_OF_BIRTH') || '',
        },
        {
          id: 4,
          value: staff?.email || '',
          label: i18('LB_EMAIL') || '',
        },
        {
          id: 5,
          value: staff?.positionName || '',
          label: i18('LB_POSITION') || '',
        },
        {
          id: 6,
          value: staff?.branch?.name || '',
          label: i18('LB_BRANCH') || '',
        },
        {
          id: 7,
          value: staff?.division?.name || '',
          label: i18('LB_DIVISION') || '',
        },
        {
          id: 8,
          value: staff?.directManager?.name || '',
          label: i18Setting('LB_DIRECT_MANAGER') || '',
        },
      ]}
    />
  )
}

export default SelfInfo

import ModalConfirm from '@/components/modal/ModalConfirm'
import { useTranslation } from 'react-i18next'

interface DialogBoxProps {
  showDialog: boolean
  cancelNavigation: any
  confirmNavigation: any
}

const DialogBox: React.FC<DialogBoxProps> = ({
  showDialog,
  cancelNavigation,
  confirmNavigation,
}) => {
  const { t: i18 } = useTranslation()
  return (
    <ModalConfirm
      title={i18('TXT_LEAVE_SITE')}
      description={i18('MSG_DESCRIPTION_CONFIRM_LEAVE')}
      open={showDialog}
      titleSubmit={i18('LB_LEAVE') as string}
      onClose={() => cancelNavigation()}
      onSubmit={() => confirmNavigation()}
    />
  )
}
export default DialogBox

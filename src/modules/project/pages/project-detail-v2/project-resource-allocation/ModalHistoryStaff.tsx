import Modal from '@/components/common/Modal'
import { LangConstant } from '@/const'
import { useTranslation } from 'react-i18next'
import TableHistoryStaff from './TableHistoryStaff'

interface ModalHistoryStaffProps {
  onClose: () => void
  reGetListAssignHeadcount: Function
}

const ModalHistoryStaff = ({
  onClose,
  reGetListAssignHeadcount,
}: ModalHistoryStaffProps) => {
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)

  return (
    <Modal
      open
      width={1200}
      hideFooter
      title={i18Project('LB_HISTORY_STAFF')}
      onClose={onClose}
    >
      <TableHistoryStaff reGetListAssignHeadcount={reGetListAssignHeadcount} />
    </Modal>
  )
}

export default ModalHistoryStaff

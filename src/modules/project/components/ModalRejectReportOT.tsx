import FormItem from '@/components/Form/FormItem/FormItem'
import FormLayout from '@/components/Form/FormLayout'
import Modal from '@/components/common/Modal'
import InputTextArea from '@/components/inputs/InputTextArea'
import { LangConstant } from '@/const'
import { AppDispatch } from '@/store'
import { scrollToFirstErrorMessage } from '@/utils'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { updateOTReportStatus } from '../reducer/thunk'

interface ModalRejectReportProps {
  onClose: () => void
  ids?: string[]
  onSubmit?: () => void
}
const ModalRejectReport = ({
  onClose,
  ids,
  onSubmit,
}: ModalRejectReportProps) => {
  const { t: i18nProject } = useTranslation(LangConstant.NS_PROJECT)
  const dispatch = useDispatch<AppDispatch>()
  const [reasonReject, setReasonReject] = useState('')
  const [isClickSubmit, setIsClickSubmit] = useState(false)
  const handleSubmit = async () => {
    setIsClickSubmit(true)
    if (ids && reasonReject) {
      await dispatch(
        updateOTReportStatus({
          ids: ids,
          reasonReject: String(reasonReject),
          status: 3,
        })
      )
      onClose()
      !!onSubmit && onSubmit()
    } else scrollToFirstErrorMessage()
  }
  const handleClose = () => {
    onClose()
  }
  return (
    <Modal
      open
      labelSubmit={String(i18nProject('LB_CONFIRM'))}
      title={i18nProject('LB_REJECT_CONFIRMATION')}
      subTitle={i18nProject('MSG_REJECT_CONFIRMATION')}
      onClose={handleClose}
      isButtonCustom={true}
      onSubmit={handleSubmit}
      onSubmitCustom={handleClose}
      labelButtonCustom={String(i18nProject('LB_CANCEL'))}
    >
      <FormLayout top={24}>
        <FormItem
          required={true}
          label={i18nProject('LB_REJECT_REASON')}
          error={!reasonReject && isClickSubmit}
          errorMessage={'Reject Reason must has input'}
        >
          <InputTextArea
            name="reason"
            onChange={(e: any) => {
              setReasonReject(e.target.value)
            }}
            error={!reasonReject && isClickSubmit}
          />
        </FormItem>
      </FormLayout>
    </Modal>
  )
}

export default ModalRejectReport

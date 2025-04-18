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
import { updateOTRequestStatus } from '../reducer/thunk'

interface ModalReasonRejectProps {
  onClose: () => void
  requestOTId?: string
  onCloseModalRequestOT?: () => void
  onSubmit?: () => void
}
const ModalReasonReject = ({
  onClose,
  requestOTId,
  onCloseModalRequestOT,
  onSubmit,
}: ModalReasonRejectProps) => {
  const { t: i18nProject } = useTranslation(LangConstant.NS_PROJECT)
  const dispatch = useDispatch<AppDispatch>()
  const [reasonReject, setReasonReject] = useState('')
  const [isClickSubmit, setIsClickSubmit] = useState(false)
  const handleSubmit = async () => {
    setIsClickSubmit(true)
    if (requestOTId && reasonReject) {
      await dispatch(
        updateOTRequestStatus({
          id: parseInt(requestOTId),
          reasonReject: String(reasonReject),
          status: 3,
        })
      )
      onClose()
      !!onSubmit && onSubmit()
      !!onCloseModalRequestOT && onCloseModalRequestOT()
    } else scrollToFirstErrorMessage()
  }
  const handleClose = () => {
    onClose()
  }
  return (
    <Modal
      open
      labelSubmit={String(i18nProject('LB_CONFIRM'))}
      title={i18nProject('LB_CONFIRM_REJECT')}
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

export default ModalReasonReject

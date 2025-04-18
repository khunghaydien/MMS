import { isEmpty } from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from '../common/Modal'
import FormItem from '../Form/FormItem/FormItem'
import FormLayout from '../Form/FormLayout'
import InputTextArea from '../inputs/InputTextArea'
import InputTextLabel from '../inputs/InputTextLabel'

interface IProps {
  onClose: () => void
  onSubmit: (value: any) => void
}
export interface IFeedBack {
  name: string
  note: string
}
const ModalFeedBack = ({ onClose, onSubmit }: IProps) => {
  const { t: i18 } = useTranslation()
  const [feedback, setFeedback] = useState<IFeedBack>({
    name: '',
    note: '',
  })

  const isFeedbackEmpty = useMemo(() => {
    return isEmpty(feedback?.name) && isEmpty(feedback?.note)
  }, [feedback])

  const handleClose = () => {
    onClose()
  }

  const handleSubmit = () => {
    onSubmit(feedback)
  }

  const handleInputChange = useCallback(
    (e: any, keyName: string) => {
      setFeedback({ ...feedback, [keyName]: e.target.value })
    },
    [feedback]
  )
  useEffect(() => {
    if (!open) {
      setFeedback({
        name: '',
        note: '',
      })
    }
  }, [open])
  return (
    <Modal
      open
      title={i18('TXT_GIVE_FEED_BACK')}
      labelSubmit={i18('LB_SUBMIT') || ''}
      colorModal="primary"
      submitDisabled={isFeedbackEmpty}
      onClose={handleClose}
      onSubmit={handleSubmit}
    >
      <form>
        <FormLayout gap={24}>
          <InputTextLabel
            label={i18('LB_FULL_NAME')}
            placeholder={i18('PLH_PERSON_NAME')}
            keyName="name"
            value={feedback.name}
            onChange={handleInputChange}
          />
        </FormLayout>
        <FormLayout top={24}>
          <FormItem label={i18('LB_NOTE')}>
            <InputTextArea
              placeholder={i18('PLH_NOTE')}
              keyName="note"
              defaultValue={feedback.note}
              onChange={handleInputChange}
            />
          </FormItem>
        </FormLayout>
      </form>
    </Modal>
  )
}

export default ModalFeedBack

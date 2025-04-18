import CardForm from '@/components/Form/CardForm'
import FormItem from '@/components/Form/FormItem/FormItem'
import FormLayout from '@/components/Form/FormLayout'
import InputTextArea from '@/components/inputs/InputTextArea'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import { LangConstant } from '@/const'
import { CUSTOMER_STATUS_TYPE } from '@/const/app.const'
import { EventInput } from '@/types'
import { Box } from '@mui/material'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface IProps {
  customerFormik: any
}

const CustomerContactInformation = ({ customerFormik }: IProps) => {
  const { t: i18Common } = useTranslation()
  const { t } = useTranslation(LangConstant.NS_CUSTOMER)

  const { values, errors, touched } = customerFormik

  const useRequired = useMemo(() => {
    return values.status !== CUSTOMER_STATUS_TYPE.DRAFT
  }, [values.status])

  const handleContactNameChange = useCallback((event: EventInput) => {
    const { value } = event.target
    customerFormik.setFieldValue('contactName', value)
  }, [])

  const handleContactPhoneNumberChange = useCallback((event: EventInput) => {
    const { value } = event.target
    customerFormik.setFieldValue('contactPhoneNumber', value)
  }, [])

  const handleEmailAddressChange = useCallback((event: EventInput) => {
    const { value } = event.target
    customerFormik.setFieldValue('emailAddress', value)
  }, [])

  const handleContactNoteChange = useCallback((event: EventInput) => {
    const { value } = event.target
    customerFormik.setFieldValue('contactNote', value)
  }, [])

  const handleWorkingTitleChange = useCallback((event: EventInput) => {
    const { value } = event.target
    customerFormik.setFieldValue('workingTitle', value)
  }, [])

  return (
    <CardForm title={t('TXT_CONTACT_INFORMATION')}>
      <Box style={{ maxWidth: '600px' }}>
        <FormLayout top={24}>
          <InputTextLabel
            label={t('LB_CONTACT_NAME')}
            placeholder={t('PLH_CONTACT_NAME')}
            required={useRequired}
            value={values.contactName}
            onChange={handleContactNameChange}
            error={!!errors.contactName && !!touched.contactName}
            errorMessage={errors.contactName}
          />
        </FormLayout>
        <FormLayout top={24}>
          <InputTextLabel
            label={t('LB_WORKING_TITLE')}
            placeholder={t('PLH_WORKING_TITLE')}
            value={values.workingTitle}
            onChange={handleWorkingTitleChange}
          />
        </FormLayout>
        <FormLayout top={24}>
          <InputTextLabel
            maxLength={15}
            type="number"
            label={t('LB_PHONE_NUMBER')}
            placeholder={t('PLH_PHONE_NUMBER')}
            value={values.contactPhoneNumber}
            onChange={handleContactPhoneNumberChange}
            error={!!errors.contactPhoneNumber && !!touched.contactPhoneNumber}
            errorMessage={errors.contactPhoneNumber}
          />
        </FormLayout>
        <FormLayout top={24}>
          <InputTextLabel
            label={i18Common('LB_EMAIL_ADDRESS')}
            placeholder={i18Common('PLH_INPUT_EMAIL')}
            value={values.emailAddress}
            error={!!errors.emailAddress && !!touched.emailAddress}
            errorMessage={errors.emailAddress}
            onChange={handleEmailAddressChange}
          />
        </FormLayout>
        <FormLayout top={24}>
          <FormItem label={t('LB_NOTE')}>
            <InputTextArea
              placeholder={t('PLH_NOTE')}
              defaultValue={values.contactNote}
              onChange={handleContactNoteChange}
            />
          </FormItem>
        </FormLayout>
      </Box>
    </CardForm>
  )
}

export default CustomerContactInformation

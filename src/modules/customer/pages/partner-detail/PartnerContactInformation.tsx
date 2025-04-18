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

interface PartnerContactInformationProps {
  partnerFormik: any
}

const PartnerContactInformation = ({
  partnerFormik,
}: PartnerContactInformationProps) => {
  const { t: i18Common } = useTranslation()
  const { t: i18Customer } = useTranslation(LangConstant.NS_CUSTOMER)

  const { errors, values, touched } = partnerFormik

  const useRequired = useMemo(() => {
    return values.status !== CUSTOMER_STATUS_TYPE.DRAFT
  }, [values.status])

  const handleContactNameChange = useCallback((event: EventInput) => {
    const { value } = event.target
    partnerFormik.setFieldValue('contactName', value)
  }, [])

  const handleContactPhoneNumberChange = useCallback((event: EventInput) => {
    const { value } = event.target
    partnerFormik.setFieldValue('contactPhoneNumber', value)
  }, [])

  const handleEmailAddressChange = useCallback((event: EventInput) => {
    const { value } = event.target
    partnerFormik.setFieldValue('emailAddress', value)
  }, [])

  const handleNoteChange = useCallback((event: EventInput) => {
    const { value } = event.target
    partnerFormik.setFieldValue('note', value)
  }, [])

  const handleWorkingTitleChange = useCallback((event: EventInput) => {
    const { value } = event.target
    partnerFormik.setFieldValue('workingTitle', value)
  }, [])

  return (
    <CardForm title={i18Customer('TXT_CONTACT_INFORMATION')}>
      <Box style={{ maxWidth: '600px' }}>
        <InputTextLabel
          required={useRequired}
          error={errors.contactName && touched.contactName}
          errorMessage={errors.contactName}
          value={values.contactName}
          label={i18Customer('LB_CONTACT_NAME')}
          placeholder={i18Customer('PLH_CONTACT_NAME')}
          onChange={handleContactNameChange}
        />
        <FormLayout top={24}>
          <InputTextLabel
            label={i18Customer('LB_WORKING_TITLE')}
            placeholder={i18Customer('PLH_WORKING_TITLE')}
            value={values.workingTitle}
            onChange={handleWorkingTitleChange}
          />
        </FormLayout>
        <FormLayout top={24}>
          <InputTextLabel
            type="number"
            maxLength={15}
            error={errors.contactPhoneNumber && touched.contactPhoneNumber}
            errorMessage={errors.contactPhoneNumber}
            value={values.contactPhoneNumber}
            label={i18Customer('LB_PHONE_NUMBER')}
            placeholder={i18Customer('PLH_PHONE_NUMBER')}
            onChange={handleContactPhoneNumberChange}
          />
        </FormLayout>
        <FormLayout top={24}>
          <InputTextLabel
            error={errors.emailAddress && touched.emailAddress}
            errorMessage={errors.emailAddress}
            value={values.emailAddress}
            label={i18Common('LB_EMAIL_ADDRESS')}
            placeholder={i18Common('PLH_INPUT_EMAIL')}
            onChange={handleEmailAddressChange}
          />
        </FormLayout>
        <FormLayout top={24}>
          <FormItem label={i18Customer('LB_NOTE')}>
            <InputTextArea
              defaultValue={values.note}
              placeholder={i18Customer('PLH_NOTE')}
              onChange={handleNoteChange}
            />
          </FormItem>
        </FormLayout>
      </Box>
    </CardForm>
  )
}

export default PartnerContactInformation

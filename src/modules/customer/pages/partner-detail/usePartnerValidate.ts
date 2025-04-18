import { LangConstant } from '@/const'
import { CUSTOMER_STATUS_TYPE } from '@/const/app.const'
import { phoneRegex } from '@/utils'
import { abbreviationRegex } from '@/utils/yup'
import { useTranslation } from 'react-i18next'
import StringFormat from 'string-format'
import * as Yup from 'yup'

const usePartnerValidate = () => {
  const { t: i18nCommon } = useTranslation(LangConstant.NS_COMMON)
  const partnerValidate = Yup.object({
    name: Yup.string()
      .customerNameValidation(
        'Partner Name cannot contain unauthorized character. Please update this information'
      )
      .when('status', {
        is: (status: string | number) => +status !== CUSTOMER_STATUS_TYPE.DRAFT,
        then: Yup.string().textRequired('Partner Name required to have input'),
      }),
    abbreviation: Yup.string()
      .matches(
        abbreviationRegex,
        'Partner Abbreviation cannot contain unauthorized character. Please update this information'
      )
      .when('status', {
        is: (status: string | number) => +status !== CUSTOMER_STATUS_TYPE.DRAFT,
        then: Yup.string().textRequired(
          'Partner Abbreviation required to have input'
        ),
      }),
    taxNumber: Yup.string().when('status', {
      is: (status: string | number) => +status !== CUSTOMER_STATUS_TYPE.DRAFT,
      then: Yup.string().textRequired('Tax Number required to have input'),
    }),
    branchId: Yup.string().when('status', {
      is: (status: string | number) => +status !== CUSTOMER_STATUS_TYPE.DRAFT,
      then: Yup.string().required('Branch must be selected'),
    }),
    skillSetIds: Yup.array()
      .max(10, 'Strength must not have more than 10 items')
      .when('status', {
        is: (status: string | number) => +status !== CUSTOMER_STATUS_TYPE.DRAFT,
        then: Yup.array().min(1, 'Strength must be selected'),
      }),
    priority: Yup.string().when('status', {
      is: (status: string | number) => +status !== CUSTOMER_STATUS_TYPE.DRAFT,
      then: Yup.string().required('Priority must be selected'),
    }),
    status: Yup.string().required('Status must be selected'),
    collaborationStartDate: Yup.number()
      .nullable()
      .when('status', {
        is: (status: string | number) => +status !== CUSTOMER_STATUS_TYPE.DRAFT,
        then: Yup.number()
          .nullable()
          .required('Collaboration Start Date must have a specific date'),
      }),
    contactName: Yup.string().when('status', {
      is: (status: string | number) => +status !== CUSTOMER_STATUS_TYPE.DRAFT,
      then: Yup.string().required('Contact Name required to have input'),
    }),
    contactPhoneNumber: Yup.string()
      .trim()
      .matches(
        phoneRegex,
        'Contact Phone Number cannot contain unauthorized character. Please update this information'
      )
      .min(
        5,
        i18nCommon('MSG_INVALID_INPUT_MIN', {
          name: 'Contact Phone Number',
          count: 4,
        }) as string
      )
      .max(
        15,
        i18nCommon('MSG_INVALID_INPUT_MAX', {
          name: 'Contact Phone Number',
        }) as string
      ),
    emailAddress: Yup.string()
      .trim()
      .emailValidation(
        StringFormat(
          i18nCommon('MSG_HAS_INVALID_EMAIL'),
          i18nCommon('LB_EMAIL_ADDRESS') || ''
        )
      )
      .specialCharacters(
        StringFormat(
          i18nCommon('MSG_HAS_CONTAIN_UNAUTHORIZED_CHARACTER__EMAIL'),
          i18nCommon('LB_EMAIL_ADDRESS') || ''
        )
      ),
    provinceIds: Yup.array().max(
      10,
      'Province must not have more than 10 items'
    ),
    scale: Yup.string()
      .trim()
      .scaleValidation(
        'Customer Scale cannot contain unauthorized character. Please update this information'
      ),
  })

  return {
    partnerValidate,
  }
}

export default usePartnerValidate

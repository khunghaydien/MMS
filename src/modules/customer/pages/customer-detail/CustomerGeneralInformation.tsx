import InputDatePicker from '@/components/Datepicker/InputDatepicker'
import CardForm from '@/components/Form/CardForm'
import FormLayout from '@/components/Form/FormLayout'
import InputCheckbox from '@/components/inputs/InputCheckbox'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import SelectBranch from '@/components/select/SelectBranch'
import SelectDivisionSingle from '@/components/select/SelectDivisionSingle'
import SelectMarket from '@/components/select/SelectMarket'
import SelectPriority from '@/components/select/SelectPriority'
import SelectProvinces from '@/components/select/SelectProvinces'
import SelectService from '@/components/select/SelectService'
import SelectStaffContactPerson from '@/components/select/SelectStaffContactPerson'
import { LangConstant } from '@/const'
import {
  ABBREVIATION_MAX_LENGTH,
  CUSTOMER_STATUS,
  CUSTOMER_STATUS_TYPE,
  LIST_OF_LANGUAGES,
  MODULE_CUSTOMER_CONST,
  YEAR_2016,
} from '@/const/app.const'
import { convertStatusInSelectOption } from '@/modules/customer/utils'
import { CommonState, commonSelector } from '@/reducer/common'
import { EventInput, MarketType, OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import StringFormat from 'string-format'
import SelectLanguage from '../../components/SelectLanguage'

interface IProps {
  customerFormik: any
  isDetailPage: boolean
}

const CustomerGeneralInformation = ({
  customerFormik,
  isDetailPage,
}: IProps) => {
  const { t: i18 } = useTranslation()
  const { t } = useTranslation(LangConstant.NS_CUSTOMER)
  const classes = useStyles()

  const { listMarket }: CommonState = useSelector(commonSelector)

  const { values, errors, touched } = customerFormik

  const [dateError, setDateError] = useState(false)

  const useRequired = useMemo(() => {
    return values.status !== CUSTOMER_STATUS_TYPE.DRAFT
  }, [values.status])

  const isShowVietnamCities = useMemo(() => {
    const vietnam: MarketType =
      listMarket.find((market: MarketType) => market.acronym === 'VNM') || {}
    return vietnam.id == values.marketId
  }, [listMarket, values.marketId])

  const customerStatus = convertStatusInSelectOption(
    Object.values(CUSTOMER_STATUS),
    isDetailPage && useRequired
  )

  const handleTextChange = useCallback((event: EventInput, keyName: string) => {
    const { value } = event.target
    customerFormik.setFieldValue(keyName, value)
  }, [])

  const handleBranchChange = useCallback((branchId: string) => {
    customerFormik.setFieldValue('branchId', branchId)
  }, [])

  const handleServicesChange = useCallback((serviceIds: OptionItem[]) => {
    customerFormik.setFieldValue('serviceIds', serviceIds)
  }, [])

  const handlePriorityChange = useCallback((priority: string) => {
    customerFormik.setFieldValue('priority', priority)
  }, [])

  const handleStatusChange = useCallback((status: string) => {
    customerFormik.setFieldValue('status', status)
  }, [])

  const handleCollaborationStartChange = useCallback((date: Date) => {
    customerFormik.setFieldValue('collaborationStartDate', date)
  }, [])

  const handleSignNdaChange = useCallback(() => {
    customerFormik.setFieldValue('signNda', !values.signNda)
  }, [values.signNda])

  const handleMarketChange = useCallback((marketId: string) => {
    customerFormik.setFieldValue('marketId', marketId)
  }, [])

  const handleContactPersonIdChange = useCallback(
    (contactPersonId: OptionItem) => {
      customerFormik.setFieldValue('contactPersonId', contactPersonId)
    },
    []
  )

  const handleCitiesChange = useCallback((provinceIds: OptionItem[]) => {
    customerFormik.setFieldValue('provinceIds', provinceIds)
  }, [])

  const handleLanguageChange = useCallback((languageIds: OptionItem[]) => {
    customerFormik.setFieldValue(
      'languageIds',
      JSON.stringify(languageIds.map((lang: OptionItem) => lang.id))
    )
  }, [])

  const handleDivisionsChange = useCallback((divisions: OptionItem) => {
    customerFormik.setFieldValue('divisionIds', divisions)
  }, [])

  const getLanguages = (languageIdsJSON: string) => {
    const languageIds = JSON.parse(languageIdsJSON)
    if (languageIds.length) {
      const result: OptionItem[] = []
      LIST_OF_LANGUAGES.forEach((lang: OptionItem) => {
        if (languageIds.includes(lang.id)) {
          result.push(lang)
        }
      })
      return JSON.stringify(result)
    }
    return '[]'
  }

  return (
    <CardForm title={i18('TXT_GENERAL_INFORMATION')}>
      <Box style={{ maxWidth: '600px' }}>
        <FormLayout top={24}>
          <InputTextLabel
            keyName="name"
            required={useRequired}
            label={t('LB_CUSTOMER_NAME')}
            placeholder={t('PLH_INPUT_TEXT_CUSTOMER_NAME')}
            value={values.name}
            onChange={handleTextChange}
            error={!!errors.name && !!touched.name}
            errorMessage={errors.name}
          />
        </FormLayout>
        <FormLayout top={24} gap={24}>
          <InputTextLabel
            keyName="abbreviation"
            required={useRequired}
            maxLength={ABBREVIATION_MAX_LENGTH}
            error={!!errors.abbreviation && !!touched.abbreviation}
            errorMessage={errors.abbreviation}
            value={values.abbreviation}
            label={StringFormat(t('LB_ABBREVIATION'), 'Customer')}
            placeholder={i18('PLH_ABBREVIATION')}
            onChange={handleTextChange}
          />
          <SelectLanguage
            value={JSON.parse(getLanguages(values.languageIds))}
            onChange={handleLanguageChange}
          />
        </FormLayout>
        <FormLayout top={24}>
          <InputTextLabel
            keyName="taxNumber"
            value={values.taxNumber}
            required={useRequired}
            error={!!errors.taxNumber && !!touched.taxNumber}
            errorMessage={errors.taxNumber}
            label={t('LB_TAX_NUMBER')}
            placeholder={t('PLH_TAX_NUMBER')}
            onChange={handleTextChange}
          />
        </FormLayout>
        <FormLayout top={24} gap={24}>
          <SelectBranch
            moduleConstant={MODULE_CUSTOMER_CONST}
            required={useRequired}
            label={t('LB_BRANCH')}
            error={!!errors.branchId && !!touched.branchId}
            errorMessage={errors.branchId}
            value={values.branchId}
            onChange={handleBranchChange}
          />
          <SelectDivisionSingle
            moduleConstant={MODULE_CUSTOMER_CONST}
            label={i18('LB_DIVISION') || ''}
            branchId={values.branchId}
            isDisable={!values.branchId}
            placeholder={i18('PLH_SELECT_DIVISION') || ''}
            value={
              values.divisionIds?.length
                ? values.divisionIds[0]?.id
                : values.divisionIds?.id
            }
            onChange={handleDivisionsChange}
          />
        </FormLayout>
        <FormLayout top={24}>
          <SelectService
            required={useRequired}
            width={'100%'}
            label={t('LB_SERVICE')}
            placeholder={t('PLH_SELECT_SERVICE')}
            error={!!errors.serviceIds && !!touched.serviceIds}
            errorMessage={errors.serviceIds}
            value={values.serviceIds}
            onChange={handleServicesChange}
          />
        </FormLayout>
        <FormLayout top={24} gap={24}>
          <SelectPriority
            required={useRequired}
            label={t('LB_PRIORITY') as string}
            value={values.priority}
            onChange={handlePriorityChange}
            error={!!errors.priority && !!touched.priority}
            errorMessage={errors.priority}
          />
          <SelectMarket
            required={useRequired}
            label="Market"
            error={!!errors.marketId && !!touched.marketId}
            errorMessage={errors.marketId}
            value={values.marketId}
            onChange={handleMarketChange}
          />
        </FormLayout>
        {isShowVietnamCities && (
          <FormLayout top={24}>
            <SelectProvinces
              width={'100%'}
              error={!!errors.provinceIds && !!touched.provinceIds}
              errorMessage={errors.provinceIds}
              label="Province"
              value={values.provinceIds}
              onChange={handleCitiesChange}
            />
          </FormLayout>
        )}
        <FormLayout top={24} gap={24}>
          <InputTextLabel
            keyName="scale"
            error={!!errors.scale && !!touched.scale}
            errorMessage={errors.scale}
            value={values.scale}
            label={t('LB_CUSTOMER_SCALE')}
            placeholder={t('PLH_CUSTOMER_SCALE')}
            onChange={handleTextChange}
          />
          <SelectStaffContactPerson
            moduleConstant={MODULE_CUSTOMER_CONST}
            disabled={!values.branchId}
            branchId={values.branchId}
            error={!!errors.contactPersonId && !!touched.contactPersonId}
            errorMessage={errors.contactPersonId}
            label="Contact Person"
            value={values.contactPersonId}
            onChange={handleContactPersonIdChange}
          />
        </FormLayout>

        <FormLayout top={24}>
          <InputTextLabel
            keyName="website"
            value={values.website}
            label={'Customer Website'}
            placeholder={t('PLH_WEBSITE')}
            onChange={handleTextChange}
          />
        </FormLayout>

        <FormLayout top={24} gap={24}>
          <InputDropdown
            label={t('LB_STATUS')}
            required
            listOptions={customerStatus}
            onChange={handleStatusChange}
            placeholder={t('PLH_SELECT_STATUS')}
            width={'100%'}
            value={values.status}
            error={!!errors.status && !!touched.status}
            errorMessage={errors.status}
          />
          <InputDatePicker
            required={useRequired}
            width="100%"
            minDate={YEAR_2016}
            error={
              (!!errors.collaborationStartDate &&
                !!touched.collaborationStartDate) ||
              dateError
            }
            errorMessage={
              dateError
                ? 'Collaboration Start Date has invalid date'
                : !!touched.collaborationStartDate
                ? errors.collaborationStartDate
                : ''
            }
            label={t('LB_COLLABORATION_START_DATE')}
            value={values.collaborationStartDate}
            onChange={handleCollaborationStartChange}
            onError={(error: string | null) => setDateError(!!error)}
          />
          {/* </FormItem> */}
        </FormLayout>
        <FormLayout top={24}>
          <InputCheckbox
            label={t('LB_SIGN_NDA')}
            className={classes.customCheckbox}
            checked={values.signNda}
            onClick={handleSignNdaChange}
          />
        </FormLayout>
      </Box>
    </CardForm>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  customCheckbox: {
    '& > span': {
      fontSize: 14,
      lineHeight: '24px',
    },
  },
}))

export default CustomerGeneralInformation

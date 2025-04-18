import InputDateFns from '@/components/Datepicker/InputDateFns'
import FormLayout from '@/components/Form/FormLayout'
import Modal from '@/components/common/Modal'
import InputCheckbox from '@/components/inputs/InputCheckbox'
import InputCurrency from '@/components/inputs/InputCurrency'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputTextArea from '@/components/inputs/InputTextArea'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import SelectCurrency from '@/components/select/SelectCurrency'
import SelectService from '@/components/select/SelectService'
import SelectStaff from '@/components/select/SelectStaff'
import { LangConstant } from '@/const'
import { INPUT_LEVEL_MAX_LENGTH, UNIT_OF_TIME } from '@/const/app.const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { EventInput, OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useFormik } from 'formik'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import StringFormat from 'string-format'
import { EXTERNAL, INTERNAL } from '../const'
import useContractFormik, { initStaffForm } from '../contractFormik'
import { ContractStaffInformationRequest } from '../models'

interface ModalContractStaffProps {
  onClose: () => void
  isDetail: boolean
  onSubmit: (staff: ContractStaffInformationRequest) => void
  staffIds: string[]
  staffDetail: ContractStaffInformationRequest
  branchId: string
  contractStartDate: number | null
  contractEndDate: number | null
}

const ModalContractStaff = ({
  onClose,
  isDetail,
  onSubmit,
  staffIds,
  staffDetail,
  branchId,
  contractStartDate,
  contractEndDate,
}: ModalContractStaffProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Contract } = useTranslation(LangConstant.NS_CONTRACT)

  const { permissions }: AuthState = useSelector(selectAuth)

  const { staffFormValidation } = useContractFormik()

  const [staffSelected, setStaffSelected] = useState<OptionItem | null>({})
  const [staffTemp, setStaffTemp] =
    useState<ContractStaffInformationRequest>(initStaffForm)
  const [codeCurrency, setCodeCurrency] = useState('')
  const [startDateError, setStartDateError] = useState(false)
  const [endDateError, setEndDateError] = useState(false)

  const form = useFormik({
    initialValues: structuredClone(initStaffForm),
    validationSchema: staffFormValidation,
    onSubmit: (values: any) => {
      onSubmit({ ...values, staffId: values.staffId.id || staffSelected?.id })
    },
  })
  const { values, touched, errors } = form

  const isButtonSubmitDisabled = useMemo(() => {
    if (isDetail) {
      return JSON.stringify(values) === JSON.stringify(staffTemp)
    }
    return false
  }, [values, staffTemp])

  const useInputName = useMemo(() => {
    return values.sourceStaff === EXTERNAL
  }, [values.sourceStaff])

  const staffQuery = useMemo(() => {
    return { branchId }
  }, [])

  const staffIdsIgnore = useMemo(() => {
    if (!isDetail) return staffIds
    const indexCurrentStaffId = staffIds.indexOf(
      staffTemp.staffId?.toString() || ''
    )
    const newStaffIds = structuredClone(staffIds)
    if (indexCurrentStaffId > -1) {
      newStaffIds.splice(indexCurrentStaffId, 1)
    }
    return newStaffIds
  }, [staffIds, staffTemp])

  const formDisabled = useMemo(() => {
    return !permissions.useContractUpdate || !!staffDetail.viewOnly
  }, [permissions.useContractUpdate, staffDetail.viewOnly])

  const handleStaffChange = useCallback(
    (value: any) => {
      setStaffSelected(value)
      form.setFieldValue('positionName', value.positionName || '')
      form.setFieldValue('staffId', value?.id?.toString() || '')
      form.setFieldValue('staffName', value?.label || '')
    },
    [form.values.positionName, form.values.staffId, form.values.staffName]
  )

  const handleTextChange = useCallback((e: EventInput, keyName?: string) => {
    const value = e.target.value
    form.setFieldValue(keyName || '', value)
  }, [])

  const handleSkillSetsChange = useCallback((skillSets: OptionItem[]) => {
    form.setFieldValue('skillIds', skillSets)
  }, [])

  const handleCurrencyChange = useCallback((value: any, keyName?: string) => {
    form.setFieldValue(keyName || '', value)
  }, [])

  const handleInputDropdownChange = (
    value: string,
    _?: OptionItem,
    keyName?: string
  ) => {
    form.setFieldValue(keyName || '', value)
    if ((keyName = 'currencyId')) {
      _?.label === 'VND' && form.setFieldValue('rate', '1')
      setCodeCurrency(_?.label || '')
    }
  }

  const handleStartDateChange = useCallback((value: Date | null) => {
    form.setFieldValue('startDate', value)
  }, [])

  const handleEndDateChange = useCallback((value: Date | null) => {
    form.setFieldValue('endDate', value)
  }, [])

  const fillStaffDetail = () => {
    setStaffSelected({
      id: staffDetail.staffId,
      label: staffDetail.staffName,
      value: staffDetail.staffId,
    })
    const staff = {
      id: staffDetail.id || '',
      staffId: staffDetail.staffId || '',
      staffName: staffDetail.staffName || '',
      positionName: staffDetail.positionName || '',
      skillIds: staffDetail.skillIds,
      levelName: staffDetail.levelName || '',
      rate: staffDetail.rate || '',
      unitOfTime: staffDetail.unitOfTime || '',
      note: staffDetail.note || '',
      sourceStaff: staffDetail.sourceStaff,
      startDate: staffDetail.startDate ? new Date(staffDetail.startDate) : null,
      endDate: staffDetail.endDate ? new Date(staffDetail.endDate) : null,
      currencyId: staffDetail.currencyId,
      price: staffDetail.price || '',
    }
    setCodeCurrency(staffDetail.codeCurrency || '')
    form.setValues(staff)
    setStaffTemp(staff)
  }

  const handleToggleModeNameField = () => {
    form.setFieldValue('staffId', '')
    form.setFieldValue('staffName', '')
    form.setFieldValue('positionName', '')
    form.setFieldValue('sourceStaff', useInputName ? INTERNAL : EXTERNAL)
    setStaffSelected({})
  }

  useEffect(() => {
    if (isDetail) {
      fillStaffDetail()
    }
  }, [])

  return (
    <form>
      <Modal
        open
        submitDisabled={
          isButtonSubmitDisabled || startDateError || endDateError
        }
        title={i18Contract(
          isDetail ? 'TXT_UPDATE_CONTRACT' : 'TXT_CREATE_NEW_STAFF'
        )}
        labelSubmit={i18(isDetail ? 'LB_UPDATE' : 'LB_SUBMIT') || ''}
        onClose={onClose}
        onSubmit={form.handleSubmit}
      >
        <Box className={classes.listFields}>
          <InputCheckbox
            disabled={formDisabled}
            checked={useInputName}
            label={i18Contract('LB_OUTSOURCE_STAFF')}
            onClick={handleToggleModeNameField}
          />
          <FormLayout gap={24}>
            <Box
              sx={{
                display: useInputName ? 'none' : 'block',
                width: '100%',
              }}
            >
              <SelectStaff
                required
                width={256}
                disabled={formDisabled}
                queries={staffQuery}
                staffIdsIgnore={staffIdsIgnore}
                customZIndex
                error={!!errors.staffName && !!touched.staffName}
                errorMessage={errors.staffName}
                label={i18('LB_STAFF_NAME')}
                placeholder={i18('PLH_SELECT_STAFF') as string}
                value={staffSelected}
                onChange={handleStaffChange}
              />
            </Box>
            <Box
              sx={{
                display: useInputName ? 'block' : 'none',
                width: '100%',
              }}
            >
              <InputTextLabel
                required
                disabled={formDisabled}
                keyName="staffName"
                label={i18('LB_STAFF_NAME')}
                placeholder={i18('PLH_PERSON_NAME') as string}
                error={!!errors.staffName && !!touched.staffName}
                errorMessage={
                  i18(
                    values.staffName
                      ? 'MSG_INPUT_NAME_INVALID'
                      : 'MSG_INPUT_REQUIRE',
                    {
                      name: i18('LB_STAFF_NAME'),
                    }
                  ) as string
                }
                value={values.staffName}
                onChange={handleTextChange}
              />
            </Box>
            <InputDropdown
              required
              keyName="unitOfTime"
              isDisable={formDisabled}
              error={!!errors.unitOfTime && !!touched.unitOfTime}
              errorMessage={errors.unitOfTime}
              label={i18('LB_UNIT_OF_TIME')}
              value={values?.unitOfTime?.toString() || ''}
              listOptions={UNIT_OF_TIME}
              placeholder={i18('PLH_SELECT_UNIT_OF_TIME')}
              onChange={handleInputDropdownChange}
            />
          </FormLayout>
          <FormLayout gap={24}>
            <InputTextLabel
              required={values.sourceStaff === EXTERNAL}
              disabled={formDisabled || values.sourceStaff === INTERNAL}
              error={
                values.sourceStaff === EXTERNAL &&
                !!errors.positionName &&
                !!touched.positionName
              }
              errorMessage={errors.positionName}
              keyName="positionName"
              label={i18Contract('LB_STAFF_POSITION')}
              placeholder={i18('PLH_STAFF_POSITION')}
              value={values.positionName}
              onChange={handleTextChange}
            />
            <InputTextLabel
              required
              disabled={formDisabled}
              maxLength={INPUT_LEVEL_MAX_LENGTH}
              error={!!errors.levelName && !!touched.levelName}
              errorMessage={errors.levelName}
              keyName="levelName"
              label={i18Contract('LB_STAFF_LEVEL')}
              placeholder={i18Contract('PLH_STAFF_LEVEL')}
              value={values.levelName}
              onChange={handleTextChange}
            />
          </FormLayout>
          <SelectService
            required
            disabled={formDisabled}
            error={!!errors.skillIds && !!touched.skillIds}
            errorMessage={errors.skillIds as string}
            width={'100%'}
            label={i18Contract('LB_SERVICE_SKILLSET')}
            placeholder={i18Contract('PLH_SELECT_SERVICE_SKILLSET')}
            value={values.skillIds}
            onChange={handleSkillSetsChange}
          />
          <FormLayout>
            <InputCurrency
              label={i18('LB_PRICE')}
              disabled={formDisabled}
              keyName="price"
              placeholder={i18('PLH_INPUT_CURRENCY')}
              value={values.price.toString()}
              onChange={handleCurrencyChange}
            />
          </FormLayout>
          <FormLayout gap={24}>
            <SelectCurrency
              disabled={formDisabled}
              label={i18('LB_CURRENCY')}
              value={values.currencyId || ''}
              onChange={handleInputDropdownChange}
            />
            <InputCurrency
              label={i18('LB_RATE')}
              maxLength={8}
              disabled={formDisabled || codeCurrency === 'VND'}
              keyName="rate"
              placeholder={i18('PLH_INPUT_CURRENCY')}
              value={values.rate.toString()}
              onChange={handleCurrencyChange}
            />
          </FormLayout>
          <FormLayout gap={24}>
            <InputDateFns
              error={startDateError}
              errorMessage={StringFormat(
                i18('MSG_INVALID_DATE'),
                i18('LB_START_DATE') as string
              )}
              width={'100%'}
              isShowClearIcon={true}
              disabled={formDisabled}
              defaultCalendarMonth={null}
              label={i18('LB_START_DATE')}
              minDate={contractStartDate}
              maxDate={values.endDate || contractEndDate}
              value={values.startDate}
              onChange={handleStartDateChange}
              onError={(error: string | null) => setStartDateError(!!error)}
            />
            <InputDateFns
              error={endDateError}
              errorMessage={StringFormat(
                i18('MSG_INVALID_DATE'),
                i18('LB_END_DATE') as string
              )}
              width={'100%'}
              isShowClearIcon={true}
              disabled={formDisabled}
              defaultCalendarMonth={null}
              label={i18('LB_END_DATE')}
              minDate={values.startDate || contractStartDate}
              maxDate={contractEndDate}
              value={values.endDate}
              onChange={handleEndDateChange}
              onError={(error: string | null) => setEndDateError(!!error)}
            />
          </FormLayout>
          <InputTextArea
            disabled={formDisabled}
            keyName="note"
            label={i18('LB_NOTE') as string}
            placeholder={i18('PLH_NOTE')}
            defaultValue={values.note}
            onChange={handleTextChange}
          />
        </Box>
      </Modal>
    </form>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  listFields: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
}))

export default ModalContractStaff

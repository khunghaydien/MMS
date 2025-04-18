import ConditionalRender from '@/components/ConditionalRender'
import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import CardForm from '@/components/Form/CardForm'
import FormLayout from '@/components/Form/FormLayout'
import InputCheckbox from '@/components/inputs/InputCheckbox'
import InputCurrency from '@/components/inputs/InputCurrency'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputTextArea from '@/components/inputs/InputTextArea'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import ModalConfirm from '@/components/modal/ModalConfirm'
import SelectBranch from '@/components/select/SelectBranch'
import SelectCurrency from '@/components/select/SelectCurrency'
import SelectCustomer from '@/components/select/SelectCustomer'
import SelectPartner from '@/components/select/SelectPartner'
import SelectStaffContactPerson from '@/components/select/SelectStaffContactPerson'
import { LangConstant } from '@/const'
import {
  CONTRACT_STATUS,
  CONTRACT_STATUS_TYPE,
  INPUT_TEXTAREA_MAX_LENGTH,
  MODULE_CONTRACT_CONST,
  SUB_MODULE_STAFF_FILTER,
} from '@/const/app.const'
import { convertStatusInSelectOption } from '@/modules/customer/utils'
import { AuthState, selectAuth } from '@/reducer/auth'
import { CommonState, commonSelector, getBranchList } from '@/reducer/common'
import { updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { EventInput, Installment, OptionItem } from '@/types'
import {
  convertTimestampToDate,
  getObjectDiffKeys,
  scrollToFirstErrorMessage,
  scrollToTop,
} from '@/utils'
import { abbreviationRegex } from '@/utils/yup'
import { Timeline } from '@mui/icons-material'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import {
  Dispatch,
  Fragment,
  SetStateAction,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import ContractStepAction from '../../components/ContractStepAction'

import InstallmentForm from '../../components/InstallmentForm'
import SelectContractByContractGroup from '../../components/SelectContractByContractGroup'
import {
  CONTRACT_GROUP,
  CONTRACT_TYPE,
  DUE_DATE,
  DUE_DATE_METHOD_TYPE,
  EXTERNAL,
  INSTALLMENT,
  INTERNAL,
  NDA,
  ORDER,
  ORDER_TYPES,
  TEMPLATE,
} from '../../const'
import {
  IContractState,
  contractSelector,
  setActiveStep,
  setCodeCurrency,
} from '../../reducer/contract'
import { updateContractGeneral } from '../../reducer/thunk'
import { CONFIG_CONTRACT_STEPS } from './ContractDetail'
import GeneralInformationContractDetail from './GeneralInformationContractDetail'
import ModalActivityContractGeneral from './ModalActivityContractGeneral'

const contractStatus = convertStatusInSelectOption(
  Object.values(CONTRACT_STATUS)
)

const MAX_LENGTH = {
  DUE_DATE_PAYMENT: 5,
  PROJECT_ABBREVIATION_NAME: 50,
}

interface ContractGeneralInformationProps {
  isDetailPage: boolean
  form: any
  getDetailContractGeneralInformation: () => void
  isShowModalConfirm: boolean
  setIsShowModalConfirm: Dispatch<SetStateAction<boolean>>
  setShowEditInformation: Dispatch<SetStateAction<boolean>>
  isButtonSubmitDisabled: boolean
  flagUpdate: boolean
  setFlagUpdate: Dispatch<SetStateAction<boolean>>
  tempStep: number
  showEditInformation: boolean
  generalTemp: any
  branchDisabled: boolean
}

const ContractGeneralInformation = (
  {
    isDetailPage,
    form,
    isShowModalConfirm,
    setIsShowModalConfirm,
    getDetailContractGeneralInformation,
    isButtonSubmitDisabled,
    flagUpdate,
    setFlagUpdate,
    tempStep,
    showEditInformation,
    generalTemp,
    setShowEditInformation,
    branchDisabled,
  }: ContractGeneralInformationProps,
  ref: any
) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Contract } = useTranslation(LangConstant.NS_CONTRACT)
  const { projectInfo, activeStep, codeCurrency }: IContractState =
    useSelector(contractSelector)
  const { listBranches }: CommonState = useSelector(commonSelector)
  const { permissions, staff }: AuthState = useSelector(selectAuth)
  const [isDisabledBranch, setIsDisabledBranch] = useState<boolean>(false)
  const dispatch = useDispatch<AppDispatch>()
  const params = useParams()
  const { values, errors } = form

  const [showLeaveSite, setShowLeaveSite] = useState(false)
  const [countSubmit, setCountSubmit] = useState(0)
  const [isOpenModalActivity, setIsOpenModalActivity] = useState(false)

  const isDetailDraft = useMemo(() => {
    return (
      +generalTemp.status === CONTRACT_STATUS[CONTRACT_STATUS_TYPE.DRAFT].type
    )
  }, [generalTemp.status])

  const useRequired = useMemo(() => {
    return values.status !== CONTRACT_STATUS[CONTRACT_STATUS_TYPE.DRAFT].type
  }, [values.status])

  const warning = useMemo(() => {
    if (
      !Object.keys(projectInfo).length ||
      (values.branchId === generalTemp.branchId &&
        values.group === generalTemp.group &&
        values.orderType === generalTemp.orderType)
    )
      return ''

    return i18Contract('MSG_UPDATE_CONTRACT_WARNING')
  }, [
    projectInfo,
    values.branchId,
    values.group,
    values.orderType,
    generalTemp.branchId,
    generalTemp.group,
    generalTemp.orderType,
  ])

  const relatedContractDisabled = useMemo(() => {
    return (
      values.group?.toString() === NDA.toString() ||
      !values.group ||
      !values.branchId
    )
  }, [values.group, values.branchId])

  const relatedOrderDisabled = useMemo(() => {
    return (
      values.group?.toString() !== ORDER.toString() ||
      !values.group ||
      !values.branchId
    )
  }, [values.group, values.branchId])

  const contractNumberError = useMemo(() => {
    return (
      !!countSubmit &&
      +values.source === EXTERNAL &&
      !values.contractNumber &&
      useRequired
    )
  }, [
    values.source,
    values.contractNumber,
    countSubmit,
    errors.contractNumber,
    useRequired,
  ])

  const contractTypeError = useMemo(() => {
    return (
      !!countSubmit &&
      !values.type &&
      values.group?.toString() !== NDA.toString() &&
      useRequired
    )
  }, [countSubmit, values.type, values.group, useRequired])

  const contractByGroupError = useMemo(() => {
    return (
      !!countSubmit &&
      !values.selectContractGroup &&
      !relatedContractDisabled &&
      useRequired
    )
  }, [
    countSubmit,
    values.selectContractGroup,
    relatedContractDisabled,
    useRequired,
  ])

  const contractByGroupErrorMessage = useMemo(() => {
    return !(!values.group || +values.group === NDA)
      ? (i18('MSG_SELECT_REQUIRE', {
          name:
            +values.group === TEMPLATE
              ? i18Contract('LB_NDA')
              : i18Contract('LB_TEMPLATE'),
        }) as string)
      : ''
  }, [values.group])

  const contractNumberErrorMessage = useMemo(() => {
    return +values.source === EXTERNAL
      ? (i18(
          values.contractNumber
            ? 'MSG_INPUT_NAME_INVALID'
            : 'MSG_INPUT_REQUIRE',
          {
            name: i18('LB_CONTRACT_NUMBER'),
          }
        ) as string)
      : ''
  }, [values.source, values.contractNumber])

  const contactPersonError = useMemo(() => {
    return (
      !!countSubmit &&
      !values.contactPerson?.id &&
      !!values.branchId &&
      useRequired
    )
  }, [countSubmit, values.contactPerson, values.branchId, useRequired])

  const projectAbbreviationNameError = useMemo(() => {
    return (
      !!countSubmit &&
      values.group?.toString() === ORDER.toString() &&
      ((!values.projectAbbreviationName && useRequired) ||
        (!!values.projectAbbreviationName &&
          !abbreviationRegex.test(values.projectAbbreviationName)))
    )
  }, [values.group, countSubmit, values.projectAbbreviationName, useRequired])

  const projectAbbreviationNameErrorMessage = useMemo(() => {
    if (values.group?.toString() !== ORDER.toString()) return ''
    if (!values.projectAbbreviationName.trim()) {
      return i18('MSG_INPUT_REQUIRE', {
        name: i18Contract('LB_PROJECT_ABBREVIATION_NAME'),
      }) as string
    }
    return i18('MSG_INPUT_NAME_INVALID', {
      name: i18Contract('LB_PROJECT_ABBREVIATION_NAME'),
    }) as string
  }, [values.group, values.projectAbbreviationName])

  const expectedValueError = useMemo(() => {
    return (
      !!countSubmit &&
      values.group?.toString() === ORDER.toString() &&
      ((!values.value && useRequired) ||
        (!!values.value && values.value.toString().length < 2))
    )
  }, [countSubmit, values.group, values.value, useRequired])

  const expectedValueErrorMessage = useMemo(() => {
    if (values.group?.toString() !== ORDER.toString()) return ''
    if (!values.value) {
      return i18('MSG_INPUT_REQUIRE', {
        name: i18('LB_EXPECTED_VALUE'),
      }) as string
    }
    return i18('MSG_INVALID_INPUT_MIN', {
      name: i18('LB_EXPECTED_VALUE'),
      count: 1,
    }) as string
  }, [values.group, values.value])

  const currencyError = useMemo(() => {
    return (
      !!countSubmit &&
      values.group?.toString() === ORDER.toString() &&
      !values.currencyId &&
      useRequired
    )
  }, [values.currencyId, countSubmit, values.group, useRequired])

  const rateError = useMemo(() => {
    return (
      !!countSubmit &&
      values.group?.toString() === ORDER.toString() &&
      ((!values.rate && useRequired) ||
        (!!values.rate && +values.rate > 99999999))
    )
  }, [countSubmit, values.group, values.rate, useRequired])

  const orderTypeError = useMemo(() => {
    return (
      !!countSubmit &&
      !values.orderType &&
      +values.group === ORDER &&
      useRequired
    )
  }, [countSubmit, values.orderType, values.group, useRequired])

  const percentageError = useMemo(() => {
    const isPercentageExist = values.installments.some(
      (item: Installment) => !!item.percentage
    )
    const percentagesExist = values.installments.filter(
      (item: Installment) => !!item.percentage
    )
    let totalPercentage = 0
    values.installments.forEach((item: Installment) => {
      totalPercentage += +item.percentage
    })
    return (
      !!countSubmit &&
      values.paymentMethod === INSTALLMENT &&
      isPercentageExist &&
      totalPercentage > 100
    )
  }, [countSubmit, values.installments, values.paymentMethod])

  const isError = useMemo(() => {
    return (
      contractNumberError ||
      contractTypeError ||
      contractByGroupError ||
      contactPersonError ||
      expectedValueError ||
      projectAbbreviationNameError ||
      currencyError ||
      rateError ||
      orderTypeError ||
      percentageError
    )
  }, [
    contractNumberError,
    contractTypeError,
    contractByGroupError,
    contactPersonError,
    expectedValueError,
    projectAbbreviationNameError,
    currencyError,
    rateError,
    orderTypeError,
    percentageError,
  ])

  const handleSingleDropdownChange = useCallback(
    (value: string, _?: OptionItem, keyName?: string) => {
      if (keyName === 'group') {
        form.setFieldValue('type', '')
        form.setFieldValue('selectContractGroup', '')
        form.setFieldValue('value', '')
        form.setFieldValue('dueDatePayment', '')
        form.setFieldValue('projectAbbreviationName', '')
        form.setFieldValue('orderType', '')
        form.setFieldValue('relatedOrders', [])
        form.setFieldValue('rate', '')
        form.setFieldValue('currencyId', '')
      }
      if (keyName === 'branchId') {
        form.setFieldValue('selectContractGroup', '')
        form.setFieldValue('contactPerson', '')
      }
      if (keyName === 'currencyId') {
        _?.label === 'VND' && form.setFieldValue('rate', '1')
        dispatch(setCodeCurrency(_?.label))
      }
      form.setFieldValue(keyName, value)
    },
    []
  )

  const handleInstallmentChange = (value: any) => {
    form.setFieldValue('installments', value)
  }

  const handleTextChange = useCallback((e: EventInput, keyName?: string) => {
    let value = e.target.value
    form.setFieldValue(keyName, value)
  }, [])

  const handleCurrencyChange = useCallback((value: any, keyName?: string) => {
    if (
      keyName === 'dueDatePayment' &&
      value.length > MAX_LENGTH.DUE_DATE_PAYMENT
    ) {
      value = value.slice(0, MAX_LENGTH.DUE_DATE_PAYMENT)
    }
    form.setFieldValue(keyName, value)
    if (!value) {
      form.setFieldValue(keyName, '')
    }
  }, [])

  const handleDateChange = useCallback((date: Date, keyName: string) => {
    form.setFieldValue(keyName, date?.getTime() || null)
  }, [])

  const handleOptionChange = useCallback((value: any, keyName?: string) => {
    form.setFieldValue(keyName, value)
    if (keyName === 'selectContractGroup') {
      autoFillWithRelatedOrder(value)
      form.setFieldValue(keyName, value)
    }
  }, [])

  const handleSourceChange = () => {
    form.setFieldValue(
      'source',
      +values.source === INTERNAL ? EXTERNAL : INTERNAL
    )
    form.setFieldValue('contractNumber', '')
  }

  const autoFillWithRelatedOrder = (value: any) => {
    if (value) {
      form.setFieldValue('type', value.type?.id || '')
      form.setFieldValue('buyerId', {
        id: value.buyer?.id,
        value: value.buyer?.id,
        label: value.buyer?.name,
      })
      form.setFieldValue('sellerId', {
        id: value.seller?.id,
        value: value.seller?.id,
        label: value.seller?.name,
      })
      form.setFieldValue('contactPerson', {
        id: value.contactPerson?.id,
        value: value.contactPerson?.id,
        label: value.contactPerson?.name,
      })
    } else {
      form.setFieldValue('type', '')
      form.setFieldValue('buyerId', null)
      form.setFieldValue('sellerId', null)
      form.setFieldValue('contactPerson', null)
    }
  }

  const handleNextStep = () => {
    setCountSubmit(prev => prev + 1)
    setTimeout(() => {
      scrollToFirstErrorMessage()
    })
  }

  const handleUpdateContractGeneral = (
    useSetActiveStep?: boolean | undefined
  ) => {
    const { contractId } = params
    dispatch(updateLoading(true))
    const fieldsUpdate = getObjectDiffKeys(values, generalTemp)
    dispatch(
      updateContractGeneral({
        id: contractId as string,
        data: {
          ...values,
          buyerId: values.buyerId?.id || '',
          contactPerson: values.contactPerson?.id || '',
          selectContractGroup: values.selectContractGroup?.id || '',
          sellerId: values.sellerId?.id || '',
          relatedOrders: values.relatedOrders.map((item: any) => item.id),
          fieldsUpdate,
        },
      })
    )
      .unwrap()
      .then(() => {
        getDetailContractGeneralInformation()
        setFlagUpdate(false)
        !!useSetActiveStep && dispatch(setActiveStep(tempStep))
      })
      .finally(() => {
        scrollToTop()
        dispatch(updateLoading(false))
      })
  }

  const setUseUpdateContract = () => {
    setShowEditInformation(true)
  }

  const handleCancelEditMode = () => {
    if (isButtonSubmitDisabled) {
      setShowEditInformation(false)
    } else {
      setShowLeaveSite(true)
    }
  }

  const handleSaveAs = () => {
    setCountSubmit(prev => prev + 1)
    setTimeout(() => {
      scrollToFirstErrorMessage()
    })
    if (!isError) {
      form.handleSubmit()
    }
  }

  useImperativeHandle(ref, () => {
    return {
      error: isError,
    }
  })

  useEffect(() => {
    if (flagUpdate) {
      handleUpdateContractGeneral(true)
    }
  }, [flagUpdate])

  useEffect(() => {
    if (!listBranches.length) {
      dispatch(
        getBranchList({
          useAllBranches: false,
          moduleConstant: MODULE_CONTRACT_CONST,
          subModuleConstant: SUB_MODULE_STAFF_FILTER,
        })
      )
    }
  }, [])

  useEffect(() => {
    if (branchDisabled) {
      setIsDisabledBranch(branchDisabled)
      form.setFieldValue('branchId', staff?.branch.id)
    }
  }, [branchDisabled])

  return (
    <form onSubmit={form.handleSubmit}>
      <Box className={classes.rootContractGeneralInformation}>
        <ConditionalRender conditional={showEditInformation || !isDetailPage}>
          <CardForm
            useDetailEditMode={isDetailPage}
            buttonUseDetailEditDisabled={isButtonSubmitDisabled}
            title={i18('TXT_GENERAL_INFORMATION')}
            onSaveAs={handleSaveAs}
            onCancelEditMode={handleCancelEditMode}
          >
            <Box className={classes.listFields}>
              {(!isDetailPage || isDetailDraft) && (
                <InputCheckbox
                  checked={+values.source === INTERNAL}
                  label={i18Contract('LB_MORS_FORM')}
                  onClick={handleSourceChange}
                />
              )}
              {(!isDetailPage || isDetailDraft) &&
                values.source === EXTERNAL && (
                  <InputTextLabel
                    required={useRequired}
                    error={contractNumberError}
                    errorMessage={contractNumberErrorMessage}
                    keyName="contractNumber"
                    label={i18('LB_CONTRACT_NUMBER')}
                    placeholder={i18('PLH_CONTRACT_NUMBER')}
                    value={values.contractNumber}
                    onChange={handleTextChange}
                  />
                )}
              {!isDetailPage && values.source === INTERNAL && (
                <InputTextLabel
                  disabled
                  required={useRequired}
                  label={i18('LB_CONTRACT_NUMBER')}
                  placeholder={i18('PLH_AUTO_GENERATED')}
                />
              )}
              <FormLayout gap={24}>
                <SelectBranch
                  disabled={isDisabledBranch}
                  moduleConstant={MODULE_CONTRACT_CONST}
                  required={useRequired}
                  error={
                    !!errors.branchId &&
                    !!countSubmit &&
                    !values.branchId &&
                    useRequired
                  }
                  errorMessage={errors.branchId}
                  label={i18('LB_BRANCH')}
                  placeholder={i18('PLH_SELECT_BRANCH')}
                  value={values.branchId}
                  onChange={handleSingleDropdownChange}
                />
              </FormLayout>
              <FormLayout gap={24}>
                <InputDropdown
                  isDisable={isDetailPage && !isDetailDraft && !!values.group}
                  required={useRequired}
                  error={
                    !values.group &&
                    !!errors.group &&
                    !!countSubmit &&
                    useRequired
                  }
                  errorMessage={errors.group}
                  keyName="group"
                  label={i18('LB_CONTRACT_GROUP')}
                  placeholder={i18('PLH_SELECT_CONTRACT_GROUP')}
                  listOptions={CONTRACT_GROUP}
                  value={values.group}
                  onChange={handleSingleDropdownChange}
                />
                {values.group === ORDER && (
                  <InputDropdown
                    required={useRequired}
                    keyName="orderType"
                    label={i18Contract('LB_ORDER_TYPE')}
                    placeholder={i18Contract('PLH_SELECT_ORDER_TYPE')}
                    error={orderTypeError}
                    errorMessage={
                      i18('MSG_SELECT_REQUIRE', {
                        name: i18Contract('LB_ORDER_TYPE'),
                      }) as string
                    }
                    listOptions={ORDER_TYPES}
                    value={values.orderType}
                    onChange={handleSingleDropdownChange}
                  />
                )}
              </FormLayout>
              {!relatedContractDisabled && (
                <SelectContractByContractGroup
                  disabled={
                    isDetailPage &&
                    !isDetailDraft &&
                    !!values.selectContractGroup
                  }
                  required={useRequired}
                  branchId={values.branchId}
                  label={i18Contract(
                    +values.group === ORDER ? 'LB_TEMPLATE' : 'LB_NDA'
                  )}
                  placeholder={i18Contract(
                    +values.group === ORDER
                      ? 'PLH_SELECT_TEMPLATE'
                      : 'PLH_SELECT_NDA'
                  )}
                  error={contractByGroupError}
                  errorMessage={contractByGroupErrorMessage}
                  group={+values.group === ORDER ? TEMPLATE : NDA}
                  value={values.selectContractGroup}
                  onChange={handleOptionChange}
                  numberEllipsis={50}
                />
              )}
              {!relatedOrderDisabled && (
                <SelectContractByContractGroup
                  branchId={values.branchId}
                  group={ORDER}
                  keyName="relatedOrders"
                  label={i18Contract('LB_RELATED_ORDERS')}
                  placeholder={'Select Related Orders'}
                  value={values.relatedOrders}
                  multiple={true}
                  onChange={handleOptionChange}
                />
              )}
              {values.group !== NDA && (
                <FormLayout gap={24}>
                  <InputDropdown
                    required={useRequired}
                    error={contractTypeError}
                    errorMessage={
                      values.group !== NDA
                        ? (i18('MSG_SELECT_REQUIRE', {
                            name: i18('LB_CONTRACT_TYPE'),
                          }) as string)
                        : ''
                    }
                    keyName="type"
                    label={i18('LB_CONTRACT_TYPE')}
                    placeholder={i18('PLH_SELECT_CONTRACT_TYPE')}
                    listOptions={CONTRACT_TYPE}
                    value={values.type}
                    onChange={handleSingleDropdownChange}
                  />
                </FormLayout>
              )}
              {!!values.branchId && (
                <SelectStaffContactPerson
                  moduleConstant={MODULE_CONTRACT_CONST}
                  required={useRequired}
                  branchId={values.branchId}
                  keyName="contactPerson"
                  error={contactPersonError}
                  errorMessage={i18('MSG_SELECT_REQUIRE', {
                    name: i18('LB_CONTACT_PERSON'),
                  })}
                  value={values.contactPerson}
                  onChange={handleOptionChange}
                />
              )}
              <FormLayout gap={24}>
                <InputDatepicker
                  disabled={isDetailPage && !isDetailDraft && !!values.signDate}
                  required={useRequired}
                  error={!!errors.signDate && !!countSubmit && useRequired}
                  errorMessage={errors.signDate}
                  width={'100%'}
                  keyName="signDate"
                  label={i18Contract('LB_CONTRACT_SIGN_DATE')}
                  placeholder={i18('PLH_INPUT_DATE') as string}
                  value={convertTimestampToDate(values.signDate)}
                  onChange={handleDateChange}
                />
                <InputDatepicker
                  width={'100%'}
                  keyName="startDate"
                  label={i18Contract('LB_CONTRACT_START_DATE')}
                  placeholder={i18('PLH_INPUT_DATE') as string}
                  maxDate={values.endDate}
                  value={convertTimestampToDate(values.startDate)}
                  onChange={handleDateChange}
                />
                <InputDatepicker
                  width={'100%'}
                  keyName="endDate"
                  label={i18Contract('LB_CONTRACT_END_DATE')}
                  placeholder={i18('PLH_INPUT_DATE') as string}
                  minDate={values.startDate}
                  value={convertTimestampToDate(values.endDate)}
                  onChange={handleDateChange}
                />
              </FormLayout>
              <FormLayout gap={24}>
                <SelectCustomer
                  width={288}
                  disabled={isDetailPage && !isDetailDraft && !!values.buyerId}
                  required={useRequired}
                  keyName="buyerId"
                  label={i18Contract('LB_BUYER')}
                  placeholder={i18Contract('PLH_SELECT_BUYER') as string}
                  error={
                    !!errors.buyerId &&
                    !!countSubmit &&
                    !values.buyerId?.id &&
                    useRequired
                  }
                  errorMessage={errors.buyerId}
                  value={values.buyerId}
                  onChange={handleOptionChange}
                />
                <SelectPartner
                  width={288}
                  disabled={isDetailPage && !isDetailDraft && !!values.sellerId}
                  required={useRequired}
                  keyName="sellerId"
                  label={i18Contract('LB_SELLER')}
                  placeholder={i18Contract('PLH_SELECT_SELLER') as string}
                  error={
                    !!errors.sellerId &&
                    !!countSubmit &&
                    !values.sellerId?.id &&
                    useRequired
                  }
                  errorMessage={errors.sellerId}
                  multiple={false}
                  value={values.sellerId}
                  onChange={handleOptionChange}
                />
              </FormLayout>
              {values.group === ORDER && (
                <FormLayout gap={24}>
                  <InputTextLabel
                    required={useRequired}
                    maxLength={MAX_LENGTH.PROJECT_ABBREVIATION_NAME}
                    error={projectAbbreviationNameError}
                    errorMessage={projectAbbreviationNameErrorMessage}
                    label={i18Contract('LB_PROJECT_ABBREVIATION_NAME')}
                    placeholder={i18('PLH_ABBREVIATION')}
                    keyName="projectAbbreviationName"
                    value={values.projectAbbreviationName}
                    onChange={handleTextChange}
                  />
                </FormLayout>
              )}
              {values.group === ORDER && (
                <Fragment>
                  <FormLayout gap={24}>
                    <InputCurrency
                      required={useRequired}
                      label={i18('LB_EXPECTED_VALUE')}
                      error={expectedValueError}
                      errorMessage={expectedValueErrorMessage}
                      keyName="value"
                      placeholder={i18('PLH_INPUT_CURRENCY')}
                      value={values.value}
                      onChange={handleCurrencyChange}
                    />
                  </FormLayout>
                  <FormLayout gap={24}>
                    <SelectCurrency
                      required={useRequired}
                      error={currencyError}
                      errorMessage={
                        i18('MSG_SELECT_REQUIRE', {
                          name: i18('LB_CURRENCY'),
                        }) as string
                      }
                      label={i18('LB_CURRENCY')}
                      value={values.currencyId}
                      onChange={handleSingleDropdownChange}
                    />
                    <InputCurrency
                      required={useRequired}
                      maxLength={8}
                      label={i18('LB_RATE')}
                      error={rateError}
                      errorMessage={
                        !values.rate
                          ? (i18('MSG_INPUT_REQUIRE', {
                              name: i18('LB_RATE'),
                            }) as string)
                          : (i18('MSG_INVALID_INPUT_MAX', {
                              name: i18('LB_RATE'),
                            }) as string)
                      }
                      keyName="rate"
                      placeholder={i18('PLH_INPUT_CURRENCY')}
                      value={values.rate}
                      onChange={handleCurrencyChange}
                      disabled={codeCurrency === 'VND'}
                    />
                  </FormLayout>
                </Fragment>
              )}
              <FormLayout gap={24}>
                <InputDropdown
                  required
                  keyName="status"
                  label={i18('LB_STATUS')}
                  error={!!errors.status && !!countSubmit && useRequired}
                  errorMessage={errors.status}
                  value={values.status as string}
                  placeholder={i18Contract('PLH_SELECT_CONTRACT_STATUS')}
                  listOptions={
                    !isDetailDraft && isDetailPage
                      ? contractStatus.slice(1)
                      : contractStatus
                  }
                  onChange={handleSingleDropdownChange}
                />
              </FormLayout>
              <InputTextArea
                maxLength={INPUT_TEXTAREA_MAX_LENGTH}
                label={i18('LB_DESCRIPTION') as string}
                placeholder={i18('PLH_DESCRIPTION')}
                defaultValue={values.description}
                onChange={handleTextChange}
              />
              <Box className={classes.dueDateForm}>
                <Box className={classes.dueDateSelectContainer}>
                  <InputDropdown
                    keyName="paymentMethod"
                    label={i18Contract('LB_PAYMENT_METHOD')}
                    value={values.paymentMethod as string}
                    placeholder={
                      i18('MSG_SELECT', {
                        name: i18Contract('LB_METHOD'),
                      }) as string
                    }
                    listOptions={DUE_DATE_METHOD_TYPE}
                    onChange={handleSingleDropdownChange}
                  />
                  <ConditionalRender
                    conditional={values.paymentMethod === DUE_DATE}
                  >
                    <InputCurrency
                      maxLength={5}
                      label={i18Contract('LB_DUE_DATE_PAYMENT')}
                      placeholder={i18Contract('PLH_DUE_DATE_PAYMENT')}
                      keyName="dueDatePayment"
                      value={values.dueDatePayment}
                      onChange={handleCurrencyChange}
                    />
                  </ConditionalRender>
                </Box>
                <ConditionalRender
                  conditional={values.paymentMethod === INSTALLMENT}
                >
                  <InstallmentForm
                    contractStartDate={values.startDate}
                    contractEndDate={values.endDate}
                    dateRequired={useRequired}
                    value={values.installments}
                    onChange={handleInstallmentChange}
                    errorMessage={errors.installments}
                    error={
                      !!errors.installments && !!countSubmit && useRequired
                    }
                    percentageError={percentageError}
                  />
                </ConditionalRender>
              </Box>
            </Box>
          </CardForm>
        </ConditionalRender>
        <ConditionalRender conditional={!showEditInformation && isDetailPage}>
          <CardForm
            titleIcon={<Timeline />}
            title={i18('TXT_GENERAL_INFORMATION') as string}
            useDetailViewMode={permissions.useContractUpdate}
            onOpenEditMode={setUseUpdateContract}
            onTitleIconClick={() => setIsOpenModalActivity(true)}
          >
            <GeneralInformationContractDetail
              contractGeneralInformation={generalTemp}
              codeCurrency={codeCurrency}
            />
          </CardForm>
        </ConditionalRender>
        {!isDetailPage && (
          <ContractStepAction
            configSteps={CONFIG_CONTRACT_STEPS}
            activeStep={activeStep}
            isDetailPage={isDetailPage}
            disabledBtnNext={isButtonSubmitDisabled}
            onNext={handleNextStep}
          />
        )}
      </Box>
      {showLeaveSite && (
        <ModalConfirm
          open
          title={i18('TXT_LEAVE_SITE')}
          description={i18('MSG_DESCRIPTION_CONFIRM_LEAVE')}
          titleSubmit={i18('LB_LEAVE') as string}
          onClose={() => {
            setShowLeaveSite(false)
          }}
          onSubmit={() => {
            setShowLeaveSite(false)
            setShowEditInformation(false)
            form.resetForm({
              values: generalTemp,
            })
          }}
        />
      )}
      {isShowModalConfirm && (
        <ModalConfirm
          title={i18('TXT_UPDATE_INFORMATION')}
          description={i18Contract('MSG_UPDATE_DESCRIPTION', {
            contractId: values.contractNumber,
          })}
          warning={warning}
          open={isShowModalConfirm}
          onClose={() => setIsShowModalConfirm(false)}
          onSubmit={handleUpdateContractGeneral}
        />
      )}
      {isOpenModalActivity && (
        <ModalActivityContractGeneral
          contractId={params.contractId as string}
          onClose={() => setIsOpenModalActivity(false)}
        />
      )}
    </form>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootContractGeneralInformation: {},
  listFields: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    maxWidth: '600px',
  },
  dueDateSelectContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  dueDateForm: {
    display: 'flex',
    flexDirection: 'column',
  },
  installmentField: {
    display: 'flex',
    flexDirection: 'column',
  },
}))

export default forwardRef(ContractGeneralInformation)

import ConditionalRender from '@/components/ConditionalRender'
import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import CardForm from '@/components/Form/CardForm'
import FormLayout from '@/components/Form/FormLayout'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import SelectBranch from '@/components/select/SelectBranch'
import SelectCustomer from '@/components/select/SelectCustomer'
import SelectPartner from '@/components/select/SelectPartner'
import SelectPosition from '@/components/select/SelectPosition'
import { LangConstant } from '@/const'
import {
  MODULE_STAFF_CONST,
  SUB_MODULE_STAFF_OUTSOURCE,
} from '@/const/app.const'
import { genders, status } from '@/modules/staff/const'
import { staffSelector } from '@/modules/staff/reducer/staff'
import { StaffState } from '@/modules/staff/types'
import { AuthState, selectAuth } from '@/reducer/auth'
import { getDivisions } from '@/reducer/common'
import { AppDispatch } from '@/store'
import { EventInput, OptionItem } from '@/types'
import { scrollToFirstErrorMessage, scrollToTop } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { isEmpty } from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import GeneralInformationStaffDetail from '../GeneralInformationStaffDetail'

interface Props {
  showEditInformation: boolean
  isViewDetail: boolean
  isButtonSubmitDisabled: boolean
  formik: any
  onCancel: () => void
  onShow: () => void
}

const OutsourceInformation = ({
  showEditInformation,
  isViewDetail,
  isButtonSubmitDisabled,
  formik,
  onCancel,
  onShow,
}: Props) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Staff } = useTranslation(LangConstant.NS_STAFF)
  const { generalInfoStaff }: StaffState = useSelector(staffSelector)
  const { permissions, staff, role }: AuthState = useSelector(selectAuth)
  const [isDisableBranch, setIsDisableBranch] = useState(false)
  const [divisions, setDivisions] = useState<any[]>([])
  const dispatch = useDispatch<AppDispatch>()

  const getDivisionId = useMemo(() => {
    let division: any
    if (!isEmpty(divisions) && formik.values.branchId) {
      division = divisions.find(
        item => item?.branches?.id === formik.values?.branchId
      )
      const divisionList = division?.divisions?.map(
        (item: any) => item.divisionId
      )
      return divisionList
    }
  }, [divisions, formik.values.branchId])

  const handleTextChange = useCallback((e: EventInput, field: string) => {
    formik.setFieldValue(field, e.target.value)
  }, [])

  const handleInputDropdownChange = useCallback(
    (value: string, option?: OptionItem, keyName?: string) => {
      if (!keyName) return
      formik.setFieldValue(keyName, value)
    },
    [formik]
  )

  const handleDateChange = useCallback(
    (dateSelected: Date, keyName: string) => {
      formik.setFieldValue(keyName, dateSelected || null)
    },
    []
  )
  const handleSaveAs = () => {
    setTimeout(() => {
      scrollToFirstErrorMessage()
    })
    formik.handleSubmit()
  }

  useEffect(() => {
    if (generalInfoStaff.code) {
      scrollToTop()
    }
  }, [generalInfoStaff])

  useEffect(() => {
    const roleAutoCreateBranch = ['Branch Director', 'COO', 'HRM', 'HR']
    role.some((roleItem: any) => {
      if (roleAutoCreateBranch.includes(roleItem?.name)) {
        handleInputDropdownChange(staff?.branch.id || '', undefined, 'branchId')
        setIsDisableBranch(true)
      }
    })
  }, [staff])

  useEffect(() => {
    dispatch(
      getDivisions({
        moduleConstant: MODULE_STAFF_CONST,
        subModuleConstant: SUB_MODULE_STAFF_OUTSOURCE,
      })
    )
      .unwrap()
      .then(res => {
        setDivisions(res?.data)
      })
  }, [])

  useEffect(() => {
    formik.setFieldValue('divisionId', getDivisionId?.[0] || [])
  }, [getDivisionId])

  return (
    <>
      <ConditionalRender conditional={showEditInformation || !isViewDetail}>
        <CardForm
          title={i18('TXT_HR_OUTSOURCING') as string}
          useDetailEditMode={isViewDetail}
          buttonUseDetailEditDisabled={isButtonSubmitDisabled}
          onSaveAs={handleSaveAs}
          onCancelEditMode={onCancel}
        >
          <Box className={classes.formWrapper}>
            <FormLayout top={24} gap={24}>
              <InputTextLabel
                required
                keyName={'staffName'}
                label={i18('LB_STAFF_NAME')}
                placeholder={i18Staff('PLH_STAFF_NAME')}
                name="name"
                value={formik.values.staffName}
                onChange={handleTextChange}
                error={
                  formik.touched.staffName && Boolean(formik.errors.staffName)
                }
                errorMessage={
                  formik.touched.staffName ? formik.errors.staffName : ''
                }
              />
              <InputDropdown
                required
                label={i18Staff('LB_GENDER') || ''}
                listOptions={genders}
                keyName="gender"
                value={formik.values.gender}
                placeholder={i18Staff('PLH_SELECT_GENDER') || ''}
                error={
                  formik.touched.gender && Boolean(formik.errors.gender || '')
                }
                errorMessage={formik.errors.gender || ''}
                onChange={handleInputDropdownChange}
              />
            </FormLayout>
            <FormLayout top={24} gap={24}>
              <InputTextLabel
                keyName={'email'}
                label={i18('LB_EMAIL') || ''}
                placeholder={i18('PLH_INPUT_EMAIL') || ''}
                name="name"
                value={formik.values.email}
                onChange={handleTextChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                errorMessage={formik.touched.email ? formik.errors.email : ''}
              />
            </FormLayout>
            <FormLayout top={24}>
              <InputTextLabel
                error={
                  !!formik.errors.phoneNumber && !!formik.touched.phoneNumber
                }
                errorMessage={formik.errors.phoneNumber}
                keyName="phoneNumber"
                type="number"
                label={i18('LB_PHONE_NUMBER')}
                placeholder={i18('PLH_PHONE_NUMBER')}
                value={formik.values.phoneNumber}
                onChange={handleTextChange}
              />
            </FormLayout>
            <FormLayout top={24} gap={24}>
              <SelectBranch
                required
                disabled={isDisableBranch}
                moduleConstant={MODULE_STAFF_CONST}
                subModuleConstant={SUB_MODULE_STAFF_OUTSOURCE}
                label={i18Staff('LB_BRANCH') || ''}
                error={
                  !!formik.touched.branchId && Boolean(formik.errors.branchId)
                }
                errorMessage={formik.errors.branchId}
                value={formik.values.branchId}
                onChange={handleInputDropdownChange}
              />
            </FormLayout>
            <FormLayout top={24} gap={24}>
              <SelectPosition
                required
                label={i18('LB_POSITION') || ''}
                value={formik.values.position}
                error={
                  formik.touched.position && Boolean(formik.errors.position)
                }
                divisionIds={getDivisionId}
                errorMessage={formik.errors.position}
                onChange={handleInputDropdownChange}
              />
            </FormLayout>

            <FormLayout top={24} gap={24}>
              <InputDatepicker
                label={i18Staff('LB_ONBOARD_DATE') || ''}
                keyName={'onboardDate'}
                disabled={isViewDetail ? true : false}
                inputFormat="DD/MM/YYYY"
                required
                value={formik.values.onboardDate}
                error={
                  formik.touched.onboardDate &&
                  Boolean(formik.errors.onboardDate)
                }
                errorMessage={formik.errors.onboardDate}
                maxDate={formik.values.contractExpiredDate}
                width={'100%'}
                onChange={handleDateChange}
              />

              <InputDatepicker
                label={i18Staff('LB_CONTRACT_EXPIRED_DATE') || ''}
                keyName={'contractExpiredDate'}
                inputFormat="DD/MM/YYYY"
                required
                value={formik.values.contractExpiredDate}
                error={
                  formik.touched.contractExpiredDate &&
                  Boolean(formik.errors.contractExpiredDate)
                }
                errorMessage={formik.errors.contractExpiredDate}
                width={'100%'}
                minDate={formik.values.onboardDate}
                onChange={handleDateChange}
              />
              <InputDropdown
                required
                keyName={'status'}
                label={i18Staff('LB_STATUS') || ''}
                placeholder={i18Staff('PLH_SELECT_STATUS') || ''}
                listOptions={status}
                value={formik.values.status}
                error={formik.touched.status && Boolean(formik.errors.status)}
                errorMessage={formik.errors.status}
                onChange={handleInputDropdownChange}
              />
            </FormLayout>
            <FormLayout top={24} gap={24}>
              <SelectPartner
                width={'100%'}
                required
                keyName="partner"
                label={i18Staff('LB_PARTNER') || ''}
                placeholder={i18Staff('PLH_SELECT_PARTNER') as string}
                error={formik.touched.partner && Boolean(formik.errors.partner)}
                errorMessage={formik.errors.partner}
                multiple={false}
                value={formik.values.partner}
                onChange={(value: any, keyName?: string | undefined) =>
                  handleInputDropdownChange(value, undefined, keyName)
                }
                numberEllipsis={55}
              />
            </FormLayout>
            <FormLayout gap={24} top={24}>
              <SelectCustomer
                width={'100%'}
                required
                keyName="customer"
                label={i18Staff('LB_CUSTOMER') || ''}
                placeholder={i18Staff('PLH_SELECT_CUSTOMER') as string}
                error={
                  formik.touched.customer && Boolean(formik.errors.customer)
                }
                errorMessage={formik.errors.customer}
                value={formik.values.customer}
                onChange={(value: any, keyName?: string | undefined) =>
                  handleInputDropdownChange(value, undefined, keyName)
                }
                numberEllipsis={55}
              />
            </FormLayout>
            {isViewDetail ? (
              <FormLayout top={24} gap={24}>
                <InputTextLabel
                  required
                  keyName={'createdPerson'}
                  disabled={true}
                  label={i18('LB_CREATED_PERSON')}
                  value={formik.values.createdBy?.name}
                />
              </FormLayout>
            ) : null}
          </Box>
        </CardForm>
      </ConditionalRender>
      <ConditionalRender conditional={!showEditInformation && isViewDetail}>
        <CardForm
          title={i18('TXT_GENERAL_INFORMATION') as string}
          useDetailViewMode={permissions.useStaffOutsourcingUpdate}
          onOpenEditMode={onShow}
        >
          <GeneralInformationStaffDetail dataDetail={generalInfoStaff} isHrOs />
        </CardForm>
      </ConditionalRender>
    </>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  formWrapper: {
    maxWidth: theme.spacing(75),
  },
}))
export default OutsourceInformation

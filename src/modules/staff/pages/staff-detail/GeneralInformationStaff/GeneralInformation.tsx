import ConditionalRender from '@/components/ConditionalRender'
import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import CardForm from '@/components/Form/CardForm'
import FormLayout from '@/components/Form/FormLayout'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import SelectBranch from '@/components/select/SelectBranch'
import SelectDivisionSingle from '@/components/select/SelectDivisionSingle'
import SelectPosition from '@/components/select/SelectPosition'
import SelectStaff from '@/components/select/SelectStaff'
import { LangConstant } from '@/const'

import CommonButton from '@/components/buttons/CommonButton'
import {
  MODULE_STAFF_CONST,
  SUB_MODULE_STAFF_INTERNAL,
} from '@/const/app.const'
import ModalChangeStatus from '@/modules/staff/components/ModalChangeStatus'
import {
  JOB_TYPE_FREELANCER,
  JOB_TYPE_OFFICICAL,
  genders,
} from '@/modules/staff/const'
import { staffSelector } from '@/modules/staff/reducer/staff'
import { StaffState } from '@/modules/staff/types'
import { AuthState, selectAuth } from '@/reducer/auth'
import { getDirectManager } from '@/reducer/common'
import { EventInput, OptionItem } from '@/types'
import { scrollToFirstErrorMessage, scrollToTop } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { isEmpty } from 'lodash'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import GeneralInformationStaffDetail from '../GeneralInformationStaffDetail'
import JobType from './JobType'
interface Props {
  showEditInformation: boolean
  isViewDetail: boolean
  isButtonSubmitDisabled: boolean
  formik: any
  onCancel: () => void
  onShow: () => void
  handleSetFirstValue: (value: boolean) => void
  setShowEditInformation: Dispatch<SetStateAction<boolean>>
  disabled: boolean
  setDisabled: Dispatch<SetStateAction<boolean>>
  loading: boolean
}

const GeneralInformation = ({
  showEditInformation,
  isViewDetail,
  isButtonSubmitDisabled,
  formik,
  onCancel,
  handleSetFirstValue,
  setShowEditInformation,
  disabled,
  setDisabled,
  loading,
}: Props) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Staff } = useTranslation(LangConstant.NS_STAFF)
  const { generalInfoStaff, isUpdateStaff }: StaffState =
    useSelector(staffSelector)
  const { staff, role, permissions }: AuthState = useSelector(selectAuth)
  const handleTextChange = useCallback((e: EventInput, field: string) => {
    formik.setFieldValue(field, e.target.value)
  }, [])

  const [isOpenModalChangeStatus, setIsOpenModalChangeStatus] = useState(false)
  const handleInputDropdownChange = useCallback(
    (
      value: string,
      option?: OptionItem,
      keyName?: string,
      jobChangeRequest?: boolean
    ) => {
      if (!keyName) return
      if (keyName === 'branchId') {
        formik.setFieldValue('divisionId', '')
        formik.setFieldValue('position', '')
      }
      if (keyName === 'position') {
        formik.setFieldValue('gradeId', '')
        formik.setFieldValue('leaderGradeId', '')
      }
      if (keyName === 'status.status.id') {
        formik.setFieldValue('status.startDate', null)
        formik.setFieldValue('status.note', null)
        formik.setFieldValue('status.endDate', null)
      }
      if (jobChangeRequest) {
        formik.setFieldValue(`jobChangeRequest.${keyName}`, value)
        if (
          keyName === 'jobType' &&
          value === JOB_TYPE_FREELANCER &&
          (!formik.values?.jobChangeRequest?.freelancerPeriods ||
            isEmpty(formik.values?.jobChangeRequest?.freelancerPeriods))
        ) {
          formik.setFieldValue(`jobChangeRequest.freelancerPeriods`, [
            { startDate: null, endDate: null },
          ])
        }
      } else {
        formik.setFieldValue(keyName, value)
      }
    },
    [formik]
  )

  const handleDateChange = useCallback(
    (dateSelected: Date, keyName: string, jobChangeRequest?: boolean) => {
      if (jobChangeRequest) {
        formik.setFieldValue(
          `jobChangeRequest.${keyName}`,
          dateSelected || null
        )
      } else {
        formik.setFieldValue(keyName, dateSelected || null)
      }
    },
    []
  )

  const handleDivisionChange = (value: OptionItem) => {
    formik.setValues({
      ...formik.values,
      divisionId: value.id as string,
      position: '',
    })
  }

  const handleDirectManagerChange = (value: any) => {
    const updatedValues = {
      ...formik.values,
      directManager: value,
      position: '',
      gradeId: '',
      leaderGradeId: '',
    }
    if (value.id) {
      updatedValues.directManager = value
    } else {
      updatedValues.directManager = {}
    }
    if (!isDisableBranch) {
      updatedValues.divisionId = value?.division?.divisionId || ''
    }
    if (!isDisableBranch) {
      updatedValues.branchId = value?.branch?.id || ''
    }
    formik.setValues(updatedValues)
  }

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

  const [isDisableDivision, setIsDisableDivision] = useState(false)
  const [isDisableBranch, setIsDisableBranch] = useState(false)
  const autoFillBranchAndDivision = useMemo(() => {
    const roleAutoCreateBranch = ['Branch Director', 'COO', 'HRM', 'HR']
    const roleAutoCreateDivision = ['Division Director']
    role.some((roleItem: any) => {
      if (roleAutoCreateBranch.includes(roleItem?.name)) {
        handleInputDropdownChange(staff?.branch.id || '', undefined, 'branchId')
        handleSetFirstValue(true)
        setIsDisableBranch(true)
      }
      if (roleAutoCreateDivision.includes(roleItem?.name)) {
        handleInputDropdownChange(staff?.branch.id || '', undefined, 'branchId')
        handleInputDropdownChange(
          staff?.division.id || '',
          undefined,
          'divisionId'
        )
        handleSetFirstValue(true)
        setIsDisableBranch(true)
        setIsDisableDivision(true)
      }
    })
  }, [staff])

  useEffect(() => {
    autoFillBranchAndDivision
  }, [])

  const handleAddWorkingPeriod = (jobChangeRequest: boolean) => {
    if (jobChangeRequest) {
      const newFreelancerWorkingPeriods = [
        ...formik.values.jobChangeRequest.freelancerPeriods,
      ]
      newFreelancerWorkingPeriods.push({
        id: null,
        startDate: null,
        endDate: null,
      })
      formik.setFieldValue(
        'jobChangeRequest.freelancerPeriods',
        newFreelancerWorkingPeriods
      )
    } else {
      const newFreelancerWorkingPeriods = [...formik.values.freelancerPeriods]
      newFreelancerWorkingPeriods.push({
        id: null,
        startDate: null,
        endDate: null,
      })
      formik.setFieldValue('freelancerPeriods', newFreelancerWorkingPeriods)
    }
  }
  const handleFreelancerWorkingPeriodChange = (
    value: Date | null,
    keyName: string,
    index: number,
    jobChangeRequest?: boolean
  ) => {
    if (jobChangeRequest) {
      formik.setFieldValue(
        `jobChangeRequest.freelancerPeriods.[${index}].${keyName}`,
        value
      )
    } else {
      formik.setFieldValue(`freelancerPeriods.[${index}].${keyName}`, value)
    }
  }

  const handleMinus = (
    field: string,
    jobChangeRequest?: boolean,
    index = 0
  ) => {
    if (field !== JOB_TYPE_FREELANCER) {
      formik.setFieldValue(`jobChangeRequest`, null)
      setDisabled(false)
    } else {
      if (jobChangeRequest) {
        const newFreelancerPeriods = [
          ...formik.values.jobChangeRequest.freelancerPeriods,
        ]
        newFreelancerPeriods.splice(index, 1)
        if (isEmpty(newFreelancerPeriods)) {
          formik.setFieldValue(`jobChangeRequest`, null)
          setDisabled(false)
        }
        formik.setFieldValue(
          'jobChangeRequest.freelancerPeriods',
          newFreelancerPeriods
        )
      } else {
        const newFreelancerPeriods = [...formik.values.freelancerPeriods]
        newFreelancerPeriods.splice(index, 1)
        if (isEmpty(newFreelancerPeriods)) {
          newFreelancerPeriods.push({ startDate: null, endDate: null })
        }
        formik.setFieldValue('freelancerPeriods', newFreelancerPeriods)
      }
    }
  }

  useEffect(() => {
    formik.setFieldValue('jobChangeRequest.isChangeJobType', disabled)
  }, [disabled])

  const handleChangeJobType = useCallback(() => {
    setDisabled(true)
  }, [])

  return (
    <>
      <ConditionalRender conditional={showEditInformation || !isViewDetail}>
        <CardForm
          isLoading={loading}
          title={i18('TXT_GENERAL_INFORMATION') as string}
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
              <InputDatepicker
                label={i18Staff('LB_DATE_OF_BIRTH') || ''}
                keyName={'birthday'}
                inputFormat="DD/MM/YYYY"
                required
                value={formik.values.birthday}
                error={
                  formik.touched.birthday && Boolean(formik.errors.birthday)
                }
                errorMessage={formik.errors.birthday}
                width={'100%'}
                maxDate={new Date()}
                onChange={handleDateChange}
              />
              <InputTextLabel
                keyName={'email'}
                label={i18('LB_EMAIL') || ''}
                required
                placeholder={i18('PLH_INPUT_EMAIL') || ''}
                name="name"
                value={formik.values.email}
                onChange={handleTextChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                errorMessage={formik.touched.email ? formik.errors.email : ''}
              />
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
              <SelectStaff
                required
                callback={getDirectManager}
                label={i18Staff('LB_DIRECT_MANAGER') || ''}
                placeholder={i18Staff('PLH_SELECT_DIRECT_MANAGER') || ''}
                value={formik.values.directManager}
                error={
                  formik.touched.directManager &&
                  Boolean(formik.errors.directManager)
                }
                errorMessage={
                  Boolean(formik.touched.directManager)
                    ? (formik.errors.directManager as string)
                    : ''
                }
                onChange={handleDirectManagerChange}
                numberEllipsis={20}
              />
              <SelectBranch
                required
                moduleConstant={MODULE_STAFF_CONST}
                subModuleConstant={SUB_MODULE_STAFF_INTERNAL}
                disabled={isDisableBranch}
                label={i18Staff('LB_BRANCH') || ''}
                error={
                  formik.touched.branchId && Boolean(formik.errors.branchId)
                }
                errorMessage={formik.touched.branchId && formik.errors.branchId}
                value={formik.values.branchId}
                onChange={handleInputDropdownChange}
              />
              <SelectDivisionSingle
                moduleConstant={MODULE_STAFF_CONST}
                subModuleConstant={SUB_MODULE_STAFF_INTERNAL}
                label={i18Staff('LB_DIVISION') || ''}
                value={formik.values.divisionId}
                required
                isDisable={!formik.values.branchId || isDisableDivision}
                branchId={formik.values.branchId}
                error={
                  formik.touched.divisionId && Boolean(formik.errors.divisionId)
                }
                errorMessage={
                  formik.touched.divisionId
                    ? (formik.errors.divisionId as string)
                    : ''
                }
                placeholder={i18Staff('PLH_SELECT_DIVISION') || ''}
                onChange={handleDivisionChange}
              />
              <SelectPosition
                required
                label={i18('LB_POSITION') || ''}
                value={formik.values.position}
                disabled={!formik.values.divisionId}
                divisionIds={[formik.values.divisionId]}
                error={
                  formik.touched.position && Boolean(formik.errors.position)
                }
                errorMessage={formik.errors.position}
                onChange={handleInputDropdownChange}
              />
            </FormLayout>
            <JobType
              isViewDetail={isViewDetail}
              jobChangeRequest={false}
              values={formik.values}
              touched={formik.touched}
              errors={formik.errors}
              disabled={disabled}
              handleAddWorkingPeriod={handleAddWorkingPeriod}
              handleFreelancerWorkingPeriodChange={
                handleFreelancerWorkingPeriodChange
              }
              handleInputDropdownChange={handleInputDropdownChange}
              handleDateChange={handleDateChange}
              handleChangeJobType={handleChangeJobType}
              handleMinus={handleMinus}
            />
            {disabled && (
              <JobType
                formik={formik}
                jobChangeRequest={true}
                values={formik.values.jobChangeRequest}
                touched={formik.touched.jobChangeRequest}
                errors={formik.errors.jobChangeRequest}
                disabled={false}
                handleAddWorkingPeriod={handleAddWorkingPeriod}
                handleFreelancerWorkingPeriodChange={
                  handleFreelancerWorkingPeriodChange
                }
                handleInputDropdownChange={handleInputDropdownChange}
                handleDateChange={handleDateChange}
                handleMinus={handleMinus}
              />
            )}

            {/* CASE INACTIVE */}

            {/* {!isViewDetail && (
              <FormLayout gap={24} top={24}>
                {formik.values.jobType === JOB_TYPE_OFFICICAL && (
                  <Box style={{ maxWidth: '50%', width: '100%' }}>
                    <InputDropdown
                      required
                      isDisable={
                        generalInfoStaff?.status?.status?.id?.toString() ==
                          status[2].value ||
                        generalInfoStaff?.status?.status?.id?.toString() ==
                          status[3].value
                      }
                      keyName={'status.status.id'}
                      label={i18Staff('LB_STATUS') || ''}
                      placeholder={i18Staff('PLH_SELECT_STATUS') || ''}
                      listOptions={status}
                      value={formik.values?.status?.status?.id}
                      error={
                        formik.touched?.status?.status?.id &&
                        Boolean(formik.errors?.status?.status?.id)
                      }
                      errorMessage={formik.errors?.status?.status?.id}
                      onChange={handleInputDropdownChange}
                    />
                  </Box>
                )}

                {formik.values.status?.status?.id?.toString() ==
                  status[1].value &&
                  formik.values.jobType === JOB_TYPE_OFFICICAL && (
                    <InputDatepicker
                      required
                      minDate={formik.values.onboardDate}
                      label={i18Staff('LB_LAST_WORKING_DATE')}
                      keyName={'lastWorkingDate'}
                      inputFormat="DD/MM/YYYY"
                      value={formik.values.lastWorkingDate}
                      error={
                        formik.touched.lastWorkingDate &&
                        Boolean(formik.errors.lastWorkingDate)
                      }
                      errorMessage={formik.errors.lastWorkingDate}
                      width={'100%'}
                      onChange={handleDateChange}
                    />
                  )}
                {(formik.values.status?.status?.id?.toString() ===
                  STAFF_STATUS_TYPE.STATUS_TEMPORARY_LEAVE.toString() ||
                  formik.values.status?.status?.id.toString() ===
                    STAFF_STATUS_TYPE.ON_SITE.toString()) && (
                  <InputDatepicker
                    label={i18Staff('LB_FROM') || ''}
                    keyName={'status.startDate'}
                    inputFormat="DD/MM/YYYY"
                    required
                    maxDate={formik.values?.status?.endDate}
                    value={formik.values?.status?.startDate}
                    error={
                      formik.touched?.status?.startDate &&
                      Boolean(formik.errors?.status?.startDate)
                    }
                    errorMessage={formik.errors?.status?.startDate}
                    width={'100%'}
                    onChange={handleDateChange}
                  />
                )}
                {formik.values?.status?.status?.id?.toString() ===
                  STAFF_STATUS_TYPE.STATUS_TEMPORARY_LEAVE.toString() && (
                  <>
                    <InputDatepicker
                      label={i18Staff('LB_TO_ESTIMATE') || ''}
                      keyName={'status.endDate'}
                      inputFormat="DD/MM/YYYY"
                      required
                      minDate={formik.values?.status?.startDate}
                      value={formik.values?.status?.endDate}
                      error={
                        formik.touched?.status?.endDate &&
                        Boolean(formik.errors?.status?.endDate)
                      }
                      errorMessage={formik.errors?.status?.endDate}
                      width={'100%'}
                      onChange={handleDateChange}
                    />
                    <InputTextLabel
                      required
                      keyName={'status.note'}
                      label={i18Staff('LB_LEAVE_REASON')}
                      placeholder={i18Staff('PLH_NOTE_PREGNANT')}
                      name="note"
                      value={formik.values?.status?.note}
                      onChange={handleTextChange}
                      error={
                        formik.touched?.status?.note &&
                        Boolean(formik.errors?.status?.note)
                      }
                      errorMessage={
                        formik.touched?.status?.note
                          ? formik.errors?.status?.note
                          : ''
                      }
                    />
                  </>
                )}
              </FormLayout>
            )} */}
          </Box>
        </CardForm>
      </ConditionalRender>
      <ConditionalRender conditional={!showEditInformation && isViewDetail}>
        <CardForm
          isLoading={loading}
          title={i18('TXT_GENERAL_INFORMATION') as string}
          childrenEndHead={
            <>
              {permissions.useStaffUpdate &&
                isUpdateStaff &&
                generalInfoStaff.jobType === JOB_TYPE_OFFICICAL && (
                  <CommonButton
                    onClick={() => setIsOpenModalChangeStatus(true)}
                  >
                    Change Status
                  </CommonButton>
                )}
            </>
          }
        >
          <GeneralInformationStaffDetail dataDetail={generalInfoStaff} />
        </CardForm>
      </ConditionalRender>
      {isOpenModalChangeStatus && (
        <ModalChangeStatus
          initStatus={generalInfoStaff}
          onClose={() => setIsOpenModalChangeStatus(false)}
          onSubmit={() => {
            setShowEditInformation(false)
            setIsOpenModalChangeStatus(false)
          }}
        />
      )}
    </>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  formWrapper: {
    maxWidth: '100%',
  },
  iconChange: {
    width: '14px',
    height: '14px',
  },
  iconAdd: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '14px',
    height: '14px',
    borderRadius: '100%',
    background: 'rgba(23, 70, 159, 1)',
    color: 'white',
  },
  textBlue: {
    width: '100%',
    color: 'rgba(23, 70, 159, 1)',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  disabled: {
    color: 'rgba(23, 70, 159, 0.3)',
  },
}))
export default GeneralInformation

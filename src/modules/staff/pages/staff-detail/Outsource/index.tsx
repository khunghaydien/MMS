import ConditionalRender from '@/components/ConditionalRender'
import ModalConfirm from '@/components/modal/ModalConfirm'
import { LangConstant } from '@/const'
import StaffStepAction from '@/modules/staff/components/StaffStepAction'
import { CONFIG_STAFF_STEP } from '@/modules/staff/const'
import {
  setActiveStep,
  setGeneralInfoStaff,
  staffSelector,
} from '@/modules/staff/reducer/staff'
import {
  getDetailStaffOutsource,
  updateStaffOutsourceInfo,
} from '@/modules/staff/reducer/thunk'
import { IHROutsourcingState, StaffState } from '@/modules/staff/types'
import { formatPayloadHROutsourcingStaff } from '@/modules/staff/utils'
import { AppDispatch } from '@/store'
import { checkValidateFormik, scrollToFirstErrorMessage } from '@/utils'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useFormik } from 'formik'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import StringFormat from 'string-format'
import formikConfig from '../../formik/Formik'
import CVCard from './CVCard'
import OutsourceInformation from './OutsourceInformation'
interface IProps {
  tempStep?: number
  flagUpdate?: boolean
  showEditInformation?: boolean
  useContracts: boolean
  useCertificates: boolean
  onChangeForm: (isChange: boolean) => void
  onUpdateFlag: (isChange: boolean) => void
  onSubmit: () => void
}

const Outsource = ({
  tempStep = 0,
  flagUpdate,
  onChangeForm,
  onUpdateFlag,
  onSubmit,
}: IProps) => {
  const classes = useStyles()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18Staff } = useTranslation(LangConstant.NS_STAFF)
  const { t: i18 } = useTranslation()
  const { activeStep, generalInfoStaff }: StaffState =
    useSelector(staffSelector)
  const { hrOutsourcingValidation } = formikConfig()
  const [isChangeCertificate, setIsChangeCertificate] = useState(false)
  const [isShowModalConfirm, setIsShowModalConfirm] = useState(false)
  const [showEditInformation, setShowEditInformation] = useState(false)
  const [isShowModalConfirmCancelUpdate, setShowModalConfirmCancelUpdate] =
    useState(false)
  const outsourceData: any = {
    phoneNumber: generalInfoStaff.phoneNumber,
    staffCode: generalInfoStaff.code,
    staffName: generalInfoStaff.staffName,
    gender: generalInfoStaff.gender,
    email: generalInfoStaff.email,
    branchId: generalInfoStaff.branch?.id ? generalInfoStaff.branch?.id : '',
    position: generalInfoStaff.position,
    onboardDate: generalInfoStaff.onboardDate,
    contractExpiredDate: generalInfoStaff.contractExpiredDate,
    createdBy: generalInfoStaff.createdBy,
    divisionId: generalInfoStaff.divisionId,
    customer: generalInfoStaff?.customer?.id
      ? {
          abbreviation: generalInfoStaff.customer?.abbreviation,
          contactName: generalInfoStaff.customer?.contactName || '',
          description: generalInfoStaff.customer.description || '',
          id: generalInfoStaff.customer.id,
          label: generalInfoStaff.customer.name,
          name: generalInfoStaff.customer.name,
          value: generalInfoStaff.customer.id,
        }
      : {},
    partner: generalInfoStaff?.partner?.id
      ? {
          abbreviation: generalInfoStaff.partner?.abbreviation,
          contactName: generalInfoStaff.partner?.contactName || '',
          description: generalInfoStaff.partner.description || '',
          id: generalInfoStaff.partner.id,
          label: generalInfoStaff.partner.name,
          name: generalInfoStaff.partner.name,
          value: generalInfoStaff.partner.id,
        }
      : {},
    status: '',
  }

  const formik = useFormik({
    initialValues: structuredClone(outsourceData),
    validationSchema: hrOutsourcingValidation,
    onSubmit: (values: IHROutsourcingState) => {
      if (isViewDetail) {
        setIsShowModalConfirm(true)
      } else {
        dispatch(setGeneralInfoStaff(values))
      }
    },
  })
  const staffId: string | number = useMemo(() => {
    return params.staffId || ''
  }, [params.staffId])

  const isViewDetail = useMemo(() => {
    return !!staffId
  }, [staffId])

  const isChangeData = useMemo(() => {
    const values: any = { ...formik.values }
    const valuesRef: any = { ...outsourceData }
    delete values.statusName
    delete valuesRef.statusName
    delete values.jobTypeName
    delete valuesRef.jobTypeName
    delete values.positionName
    delete valuesRef.positionName
    delete values.division
    delete valuesRef.division
    delete values.branchId
    delete valuesRef.branchId
    values.directManager = values.directManager?.name
    valuesRef.directManager = valuesRef.directManager?.name
    values.gradeId = values.gradeId?.toString() || ''
    valuesRef.gradeId = valuesRef.gradeId?.toString() || ''
    return showEditInformation
      ? JSON.stringify(values) != JSON.stringify(valuesRef)
      : false
  }, [formik.values, outsourceData])

  const isChangeEmail = useMemo(() => {
    return formik.values.email != outsourceData.email
  }, [formik.values, outsourceData.email])

  const isChangeDataCreate = useMemo(() => {
    return (
      !(JSON.stringify(formik.values) === JSON.stringify(outsourceData)) ||
      isChangeCertificate
    )
  }, [formik.values, isChangeCertificate])

  const isButtonSubmitDisabled = useMemo(() => {
    return isViewDetail ? !isChangeData : false
  }, [formik.values, isChangeCertificate, isChangeData, isViewDetail])

  const handleNextStep = () => {
    if (Object.keys(formik.errors).length > 0) {
      setTimeout(() => {
        scrollToFirstErrorMessage()
      })
    } else {
      onSubmit()
    }
  }

  const updateHROutsourcing = (values: IHROutsourcingState) => {
    dispatch(
      updateStaffOutsourceInfo({
        data: formatPayloadHROutsourcingStaff(values),
        code: values.code,
        id: staffId,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(getDetailStaffOutsource(staffId))
        setIsChangeCertificate(false)
        onChangeForm(false)
        dispatch(setGeneralInfoStaff(values))
      })
  }

  const handleUpdateHROutsourcing = () => {
    updateHROutsourcing(formik.values)
  }

  const handleCancelUpdate = () => {
    isButtonSubmitDisabled
      ? setShowEditInformation(false)
      : setShowModalConfirmCancelUpdate(true)
  }

  const handleShowModalUpdate = () => {
    setShowEditInformation(!showEditInformation)
    formik.resetForm({
      values: outsourceData,
    })
  }

  useEffect(() => {
    isViewDetail ? onChangeForm(isChangeData) : onChangeForm(isChangeDataCreate)
  }, [isViewDetail, isChangeData, isChangeDataCreate])

  useEffect(() => {
    const updateGeneralInfo = async () => {
      if (flagUpdate) {
        const isError = await checkValidateFormik(formik)

        if (!isError) {
          dispatch(setGeneralInfoStaff(formik.values))

          if (isViewDetail) {
            updateHROutsourcing(formik.values)
            onChangeForm(false)
            onUpdateFlag(false)
            dispatch(setActiveStep(tempStep))
          }
        } else {
          onUpdateFlag(false)
        }
      }
    }

    updateGeneralInfo()
  }, [flagUpdate])
  return (
    <form onSubmit={formik.handleSubmit} className={classes.formContainer}>
      <OutsourceInformation
        formik={formik}
        isButtonSubmitDisabled={isButtonSubmitDisabled}
        showEditInformation={showEditInformation}
        isViewDetail={isViewDetail}
        onCancel={handleCancelUpdate}
        onShow={handleShowModalUpdate}
      />
      <CVCard staffId={staffId} isViewDetail={isViewDetail} />
      <ConditionalRender conditional={!isViewDetail}>
        <StaffStepAction
          isOutsource
          configSteps={CONFIG_STAFF_STEP}
          activeStep={activeStep}
          isViewDetail={isViewDetail}
          disabledBtnNext={isButtonSubmitDisabled}
          onNext={handleNextStep}
        />
      </ConditionalRender>
      <ModalConfirm
        colorModal={isChangeEmail ? 'warning' : 'primary'}
        title={i18('TXT_UPDATE_INFORMATION')}
        description={
          !isChangeEmail
            ? StringFormat(
                i18Staff('MSG_DESCRIPTION_CONFIRM_UPDATE_INFORMATION'),
                outsourceData?.staffCode || ''
              )
            : i18Staff('MSG_CONFIRM_UPDATE_EMAIL_STAFF')
        }
        titleSubmit="Continue"
        open={isShowModalConfirm}
        onClose={() => setIsShowModalConfirm(false)}
        onSubmit={() => handleUpdateHROutsourcing()}
      />
      <ModalConfirm
        title={i18('TXT_LEAVE_SITE')}
        description={i18('MSG_DESCRIPTION_CONFIRM_LEAVE')}
        open={isShowModalConfirmCancelUpdate}
        titleSubmit={'Leave'}
        onClose={() => {
          setShowModalConfirmCancelUpdate(false)
        }}
        onSubmit={() => {
          setShowModalConfirmCancelUpdate(false)
          setShowEditInformation(false)
          formik.resetForm({
            values: outsourceData,
          })
        }}
      />
    </form>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  formContainer: {
    height: '100%',
    '& .contract-and-certificate': {
      marginTop: '20px',
      display: 'flex',
      alignItems: 'stretch',
      gap: '20px',
      flexWrap: 'wrap',
      '& .c2-file-item': {
        width: '50%',
        minWidth: '400px',
        flex: 1,
      },
    },
  },
  formWrapper: {
    maxWidth: theme.spacing(75),
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}))
export default Outsource

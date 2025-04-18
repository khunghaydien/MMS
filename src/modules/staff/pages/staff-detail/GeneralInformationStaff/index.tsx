import ConditionalRender from '@/components/ConditionalRender'
import CardForm from '@/components/Form/CardForm'
import LoadingSkeleton from '@/components/loading/LoadingSkeleton'
import ModalConfirm from '@/components/modal/ModalConfirm'
import { LangConstant } from '@/const'
import StaffStepAction from '@/modules/staff/components/StaffStepAction'
import {
  CONFIG_STAFF_STEP,
  GENERAL_INFO_STAFF_INIT,
  STAFF_STATUS_TYPE,
} from '@/modules/staff/const'
import {
  setActiveStep,
  setGeneralInfoStaff,
  staffSelector,
} from '@/modules/staff/reducer/staff'
import {
  getDetailStaff,
  updateStaffGeneralInfo,
} from '@/modules/staff/reducer/thunk'
import {
  IGeneralInformationStaffState,
  StaffState,
} from '@/modules/staff/types'
import {
  formatPayloadGeneralInfoStaff,
  formatPayloadGeneralInfoStaffInactive,
} from '@/modules/staff/utils'
import { AuthState, selectAuth } from '@/reducer/auth'
import { AppDispatch } from '@/store'
import { checkValidateFormik, scrollToFirstErrorMessage } from '@/utils'
import { BorderColor } from '@mui/icons-material'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useFormik } from 'formik'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import StringFormat from 'string-format'
import formikConfig from '../../formik/Formik'
import Contract from '../Contract'
import CertificateCard from './CertificateCard'
import GeneralInformation from './GeneralInformation'
import StaffWorkingEvent from './StaffWorkingEvent'
interface IProps {
  tempStep?: number
  flagUpdate?: boolean
  showEditInformation?: boolean
  useContracts: boolean
  useCertificates: boolean
  loading: boolean
  onChangeForm: (isChange: boolean) => void
  onUpdateFlag: (isChange: boolean) => void
}

const GeneralInformationStaff = ({
  tempStep = 0,
  flagUpdate,
  onChangeForm,
  onUpdateFlag,
  useContracts,
  useCertificates,
  loading,
}: IProps) => {
  const classes = useStyles()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { permissions }: AuthState = useSelector(selectAuth)
  const { t: i18Staff } = useTranslation(LangConstant.NS_STAFF)
  const { t: i18 } = useTranslation()
  const {
    activeStep,
    generalInfoStaff,
    isUpdateStaff,
    isLoadingStaffDetail,
  }: StaffState = useSelector(staffSelector)
  const { generalSchemaValidation } = formikConfig()
  const [isChangeCertificate, setIsChangeCertificate] = useState(false)
  const [isShowModalConfirm, setIsShowModalConfirm] = useState(false)
  const [showEditInformation, setShowEditInformation] = useState(false)
  const [isShowModalConfirmCancelUpdate, setShowModalConfirmCancelUpdate] =
    useState(false)
  const [loadingUpdate, setLoadingUpdate] = useState(false)

  const formik = useFormik({
    // enableReinitialize: true,
    initialValues: structuredClone(generalInfoStaff),
    validationSchema: generalSchemaValidation,
    // validateOnMount: true,
    onSubmit: (values: IGeneralInformationStaffState) => {
      if (isViewDetail) {
        setIsShowModalConfirm(true)
      } else {
        dispatch(setGeneralInfoStaff(values))
        dispatch(setActiveStep(activeStep + 1))
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
    const valuesRef: any = { ...generalInfoStaff }
    delete values.statusName
    delete valuesRef.statusName
    delete values.jobTypeName
    delete valuesRef.jobTypeName
    delete values.positionName
    delete valuesRef.positionName
    delete values.division
    delete valuesRef.division
    delete values.branch
    delete valuesRef.branch
    delete values.workingTimeChanged
    values.directManager = values.directManager?.name
    valuesRef.directManager = valuesRef.directManager?.name
    return showEditInformation
      ? JSON.stringify(values) != JSON.stringify(valuesRef)
      : false
  }, [formik.values, generalInfoStaff])

  useEffect(() => {
    const values: any = { ...formik.values }
    const valuesRef: any = { ...generalInfoStaff }
    delete values.jobChangeRequest
    delete valuesRef.jobChangeRequest
    formik.setFieldValue(
      'workingTimeChanged',
      JSON.stringify(values) != JSON.stringify(valuesRef)
    )
  }, [formik.values, generalInfoStaff])

  const isChangeEmail = useMemo(() => {
    return formik.values.email != generalInfoStaff.email
  }, [formik.values, generalInfoStaff.email])

  const [initialVariable, setInitialVariable] = useState(false)
  const [isFirstRender, setIsFirstRender] = useState(true)
  const isChangeDataCreate = useMemo(() => {
    if (isFirstRender && initialVariable) {
      // If it is the first time, do not consider changes.
      setIsFirstRender(false)
      return false
    }
    return (
      !(
        JSON.stringify(formik.values) ===
        JSON.stringify(GENERAL_INFO_STAFF_INIT)
      ) || isChangeCertificate
    )
  }, [formik.values, isChangeCertificate, initialVariable])

  const isButtonSubmitDisabled = useMemo(() => {
    return isViewDetail ? !isChangeData : false
  }, [formik.values, isChangeCertificate, isChangeData, isViewDetail])

  const handleNextStep = () => {
    setTimeout(() => {
      scrollToFirstErrorMessage()
    })
  }
  const updateStaffGeneralInformation = (
    values: IGeneralInformationStaffState
  ) => {
    dispatch(
      updateStaffGeneralInfo({
        data:
          values?.status?.status?.id?.toString() ===
          STAFF_STATUS_TYPE.INACTIVE.toString()
            ? formatPayloadGeneralInfoStaffInactive(values)
            : formatPayloadGeneralInfoStaff(values),
        code: values.code,
        id: staffId,
      })
    )
      .unwrap()
      .then(() => {
        setLoadingUpdate(true)
        dispatch(getDetailStaff(staffId))
          .unwrap()
          .then(res => {
            setShowEditInformation(false)
            setIsChangeCertificate(false)
            onChangeForm(false)
            setDisabled(false)
          })
          .finally(() => {
            setLoadingUpdate(false)
          })
      })
  }
  const handleUpdateGeneralInformation = () => {
    updateStaffGeneralInformation(formik.values)
  }

  const handleCancelUpdate = () => {
    isButtonSubmitDisabled
      ? setShowEditInformation(false)
      : setShowModalConfirmCancelUpdate(true)
  }

  const handleShowModalUpdate = () => {
    setShowEditInformation(!showEditInformation)
    formik.resetForm({
      values: generalInfoStaff,
    })
  }
  const handleInitialVariable = (value: boolean) => {
    setInitialVariable(value)
  }
  useEffect(() => {
    isViewDetail ? onChangeForm(isChangeData) : onChangeForm(isChangeDataCreate)
  }, [isViewDetail, isChangeData, isChangeDataCreate])

  useEffect(() => {
    if (flagUpdate) {
      ;(async () => {
        const isError = await checkValidateFormik(formik)
        if (!isError) {
          dispatch(setGeneralInfoStaff(formik.values))
          if (isViewDetail) {
            updateStaffGeneralInformation(formik.values)
            onChangeForm(false)
            onUpdateFlag(false)
            dispatch(setActiveStep(tempStep))
          }
        } else {
          onUpdateFlag(false)
        }
      })()
    }
  }, [flagUpdate])

  const [disabled, setDisabled] = useState<boolean>(false)

  return (
    <form onSubmit={formik.handleSubmit} className={classes.formContainer}>
      {isViewDetail && (
        <Box className={classes.buttonEdit}>
          {!showEditInformation &&
            permissions.useStaffUpdate &&
            isUpdateStaff && (
              <Box
                className={classes.buttonWrapper}
                onClick={handleShowModalUpdate}
              >
                <BorderColor />
                <Box>{i18('LB_EDIT')}</Box>
              </Box>
            )}
        </Box>
      )}
      <Box className={classes.flexGap}>
        <Box className={classes.wFull}>
          <GeneralInformation
            loading={loadingUpdate || loading}
            disabled={disabled}
            setDisabled={setDisabled}
            formik={formik}
            isButtonSubmitDisabled={isButtonSubmitDisabled}
            showEditInformation={showEditInformation}
            setShowEditInformation={setShowEditInformation}
            isViewDetail={isViewDetail}
            onCancel={handleCancelUpdate}
            onShow={handleShowModalUpdate}
            handleSetFirstValue={handleInitialVariable}
          />
          <ConditionalRender
            conditional={isViewDetail && (useCertificates || useContracts)}
          >
            <Box className="contract-and-certificate">
              {useCertificates && (
                <Box className="c2-file-item">
                  <CertificateCard
                    staffId={staffId}
                    isViewDetail={isViewDetail}
                  />
                </Box>
              )}
              {useContracts && (
                <Box className="c2-file-item">
                  <Contract onSubmit={() => {}} />
                </Box>
              )}
            </Box>
          </ConditionalRender>
          <ConditionalRender conditional={!isViewDetail}>
            <CertificateCard staffId={staffId} isViewDetail={isViewDetail} />
          </ConditionalRender>
          <ConditionalRender conditional={!isViewDetail}>
            <StaffStepAction
              configSteps={CONFIG_STAFF_STEP}
              activeStep={activeStep}
              isViewDetail={isViewDetail}
              disabledBtnNext={isButtonSubmitDisabled}
              onNext={handleNextStep}
            />
          </ConditionalRender>
        </Box>
        {isViewDetail && (
          <Box className={classes.w300}>
            <CardForm title={i18('TXT_STATUS_HISTORY') as string}>
              {isLoadingStaffDetail ? (
                <LoadingSkeleton />
              ) : (
                <StaffWorkingEvent />
              )}
            </CardForm>
          </Box>
        )}
      </Box>
      <ModalConfirm
        colorModal={isChangeEmail ? 'warning' : 'primary'}
        title={i18('TXT_UPDATE_INFORMATION')}
        description={
          !isChangeEmail
            ? StringFormat(
                i18Staff('MSG_DESCRIPTION_CONFIRM_UPDATE_INFORMATION'),
                generalInfoStaff.code || ''
              )
            : i18Staff('MSG_CONFIRM_UPDATE_EMAIL_STAFF')
        }
        titleSubmit="Continue"
        open={isShowModalConfirm}
        onClose={() => setIsShowModalConfirm(false)}
        onSubmit={() => handleUpdateGeneralInformation()}
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
            values: generalInfoStaff,
          })
        }}
      />
    </form>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  buttonEdit: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '24px',
  },
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
  flexGap: {
    display: 'flex',
    gap: '20px',
  },
  wFull: {
    width: '100%',
  },
  w300: {
    width: '400px',
  },
  buttonWrapper: {
    width: 'max-content',
    fontWeight: 700,
    fontSize: 15,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    border: `1px solid ${theme.color.grey.primary}`,
    borderRadius: '50px',
    background: '#FFFFFF',
    cursor: 'pointer',
    color: theme.color.black.secondary,
    transition: 'all .1s',
    '&.disabled': {
      pointerEvents: 'none',
    },
    '& svg': {
      fontSize: 20,
    },
    '&:hover': {
      backgroundColor: theme.color.blue.primary,
      borderColor: theme.color.blue.primary,
      color: '#FFFFFF !important',
      '& *': {
        color: '#FFFFFF !important',
      },
    },
    '&.delete:hover': {
      backgroundColor: theme.color.error.primary,
      borderColor: theme.color.error.primary,
    },
  },
}))
export default GeneralInformationStaff

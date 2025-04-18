import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import ConditionalRender from '@/components/ConditionalRender'
import DialogBox from '@/components/modal/DialogBox'
import ModalConfirm from '@/components/modal/ModalConfirm'
import CommonStep from '@/components/step/Stepper'
import CommonTabs from '@/components/tabs'
import { LangConstant, PathConstant } from '@/const'
import { useCallbackPrompt } from '@/hooks/useCallbackPrompt'
import { alertError, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { FileItem, StepConfig } from '@/types'
import { downloadFileFromByteArr, formatDate } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import ModalExportSkillSets, {
  SkillItem,
  SkillSetListItem,
} from '../../components/ModalExportSkillSets/ModalExportSkillSets'
import {
  genders,
  STAFF_STATUS_TYPE,
  STAFF_STEP,
  STAFF_STEP_DETAIL,
} from '../../const'
import {
  resetFormStaff,
  setActiveStep,
  staffSelector,
} from '../../reducer/staff'
import {
  createNewHrOutsourcing,
  createNewStaff,
  exportStaffSkillSet,
  getDetailStaff,
  getDetailStaffOutsource,
} from '../../reducer/thunk'
import { StaffState } from '../../types'
import {
  formatPayloadGeneralInfoStaff,
  formatPayloadGeneralInfoStaffInactive,
  formatPayloadGeneralInfoStaffOnboard,
  formatPayloadHROutsourcingStaff,
  payloadCreateHROutsourcing,
  payloadCreateStaff,
} from '../../utils'
import Contract from './Contract'
import GeneralInformationStaff from './GeneralInformationStaff'
import GeneralInformationStaffTop from './GeneralInformationStaffTop'
import Outsource from './Outsource'
import SkillSetStaff from './SkillSetStaff'
import StaffDetailProject from './StaffDetailProject/StaffDetailProject'

export interface PersonalInformation {
  staffName?: string
  gender?: string
  email?: string
  dateOfBirth?: string
  positionName?: string
}

interface StaffDetailProps {
  isDetailPage: boolean
  isOutsource: boolean
}

export default function StaffDetail({
  isDetailPage,
  isOutsource,
}: StaffDetailProps) {
  const classes = useStyles()
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Staff } = useTranslation(LangConstant.NS_STAFF)
  const [isOutsourceLocal, setIsOutsourceLocal] = useState<boolean>(isOutsource)
  const {
    activeStep,
    generalInfoStaff,
    certificates,
    contracts,
    skillSetList,
    cvs,
  }: StaffState = useSelector(staffSelector)
  const [isShowModalConfirmNextStep, setIsShowModalConfirmNextStep] =
    useState(false)
  const [flagUpdate, setFlagUpdate] = useState(false)
  const [isFormInformationChange, setIsFormInformationChange] = useState(false)
  const [isShowModalExportSkillSets, setIsShowModalExportSkillSets] =
    useState(false)
  const [personalInformation, setPersonalInformation] =
    useState<PersonalInformation>({})
  const [tempStep, setTempStep] = useState(0)
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [isShowModalConfirmSubmit, setIsShowModalConfirmSubmit] =
    useState(false)
  const [useSkillSet, setUseSkillSet] = useState(false)
  const [useContracts, setUseContracts] = useState(false)
  const [useCertificates, setUseCertificates] = useState(false)
  const [useProject, setUseProject] = useState(false)
  const [loading, setLoading] = useState(false)

  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(showDialog)

  const CONFIG_STAFF_STEP: StepConfig[] = [
    {
      step: STAFF_STEP.GENERAL_INFORMATION,
      label: 'General Information',
    },
    {
      step: STAFF_STEP.SKILL_SET,
      label: 'Skillset',
    },
    {
      step: STAFF_STEP.CONTRACT,
      label: 'Contract',
    },
  ]

  const CONFIG_STAFF_STEP_DETAIL: StepConfig[] = [
    {
      step: STAFF_STEP_DETAIL.GENERAL_INFORMATION,
      label: 'General Information',
      isVisible: true,
    },
    {
      step: STAFF_STEP_DETAIL.PROJECT,
      label: 'Project',
      isVisible: !!useProject,
    },
    {
      step: STAFF_STEP_DETAIL.SKILL_SET,
      label: 'Skillset',
      isVisible: !!useSkillSet,
    },
  ]

  const CONFIG_STAFF_STEP_DETAIL_OUTSOURC: StepConfig[] = [
    {
      step: STAFF_STEP_DETAIL.GENERAL_INFORMATION,
      label: 'General Information',
      isVisible: true,
    },
    {
      step: STAFF_STEP_DETAIL.PROJECT,
      label: 'Project',
      isVisible: true,
    },
  ]

  const listStep = useMemo(() => {
    if (isDetailPage) {
      let _result =
        generalInfoStaff?.branch?.label === 'HR Outsourcing'
          ? CONFIG_STAFF_STEP_DETAIL_OUTSOURC
          : CONFIG_STAFF_STEP_DETAIL
      return _result.filter(i => !!i.isVisible)
    } else {
      return CONFIG_STAFF_STEP
    }
  }, [
    CONFIG_STAFF_STEP,
    CONFIG_STAFF_STEP_DETAIL,
    CONFIG_STAFF_STEP_DETAIL_OUTSOURC,
    isDetailPage,
    useSkillSet,
    useProject,
  ])

  const staffId: string | number = useMemo(() => {
    return params.staffId || ''
  }, [params.staffId])

  const isViewDetail = useMemo(() => {
    return !!staffId
  }, [staffId])

  const backToStaffList = () => {
    navigate(
      isOutsource
        ? PathConstant.STAFF_LIST_HR_OUTSOURCING
        : PathConstant.STAFF_LIST
    )
  }

  const handleChangeStep = (step: number) => {
    setTempStep(step)
    if (isDetailPage && isFormInformationChange) {
      setIsShowModalConfirmNextStep(true)
    } else {
      setFlagUpdate(false)
      dispatch(setActiveStep(step))
    }
  }

  const handleSubmit = () => {
    let payload = {}
    if (isOutsourceLocal) {
      payload = {
        requestBody: formatPayloadHROutsourcingStaff({
          staffName: generalInfoStaff.staffName,
          divisionId: generalInfoStaff.divisionId,
          gender: generalInfoStaff.gender,
          email: generalInfoStaff.email,
          phoneNumber: generalInfoStaff.phoneNumber,
          position: generalInfoStaff.position,
          onboardDate: generalInfoStaff.onboardDate,
          contractExpiredDate: generalInfoStaff.contractExpiredDate,
          customer: generalInfoStaff.customer,
          partner: generalInfoStaff.partner,
          status: generalInfoStaff.status,
        }),
      }
      dispatch(createNewHrOutsourcing(payloadCreateHROutsourcing(payload, cvs)))
        .unwrap()
        .then(() => {
          navigate(
            isOutsource
              ? PathConstant.STAFF_LIST_HR_OUTSOURCING
              : PathConstant.STAFF_LIST
          )
          setIsShowModalConfirmSubmit(false)
        })
      setShowDialog(false)
    } else {
      payload = {
        requestBody: {
          personal:
            generalInfoStaff?.status?.status?.id?.toString() ===
            STAFF_STATUS_TYPE.ACTIVE.toString()
              ? formatPayloadGeneralInfoStaffOnboard(generalInfoStaff)
              : generalInfoStaff?.status?.status?.id?.toString() ===
                STAFF_STATUS_TYPE.INACTIVE.toString()
              ? formatPayloadGeneralInfoStaffInactive(generalInfoStaff)
              : formatPayloadGeneralInfoStaff(generalInfoStaff),
          skillSet: skillSetList.map((item: SkillSetListItem) => ({
            skillGroupId: +item.id,
            skillSetLevels: item.skillSetLevels.map((skillItem: SkillItem) => ({
              level: skillItem.level,
              note: skillItem.note,
              skillId: +skillItem.id,
              yearsOfExperience: skillItem.yearOfExperience,
            })),
          })),
        },
        certificate: certificates.map((file: FileItem) => file.FileObject),
        contract: contracts.map((file: FileItem) => file.FileObject),
      }
      dispatch(createNewStaff(payloadCreateStaff(payload)))
        .unwrap()
        .then(() => {
          navigate(
            isOutsource
              ? PathConstant.STAFF_LIST_HR_OUTSOURCING
              : PathConstant.STAFF_LIST
          )
          setIsShowModalConfirmSubmit(false)
        })
      setShowDialog(false)
    }
  }
  const handleNextCheckpointStep = () => {
    setFlagUpdate(true)
  }
  const handleNotSave = () => {
    setFlagUpdate(false)
    setIsShowModalConfirmNextStep(false)
    dispatch(setActiveStep(tempStep))
    dispatch(
      isOutsource ? getDetailStaffOutsource(staffId) : getDetailStaff(staffId)
    )
      .unwrap()
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }
  const handleChangeFormInformation = (isChange: boolean) => {
    setIsFormInformationChange(isChange)
  }

  const handleShowModalExportSkillSets = () => {
    setIsShowModalExportSkillSets(true)
    const personalInformation = {
      staffName: generalInfoStaff.staffName || '',
      gender:
        genders.find(
          gender => gender.id.toString() === generalInfoStaff.gender.toString()
        )?.label || '',
      email: generalInfoStaff.email || '',
      dateOfBirth: formatDate(generalInfoStaff.birthday || new Date()) || '',
      positionName: generalInfoStaff.positionName || '',
    }
    setPersonalInformation(personalInformation)
  }

  const handleExport = (payload: any) => {
    dispatch(updateLoading(true))
    dispatch(
      exportStaffSkillSet({
        staffId,
        requestBody: payload,
      })
    )
      .unwrap()
      .then((res: any) => {
        downloadFileFromByteArr({
          fileContent: res.data?.fileContent || '',
          fileName: res.data?.fileName || '',
        })
        setIsShowModalExportSkillSets(false)
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  useEffect(() => {
    if (isViewDetail) {
      setLoading(true)
      dispatch(updateLoading(true))
      dispatch(
        isOutsource ? getDetailStaffOutsource(staffId) : getDetailStaff(staffId)
      )
        .unwrap()
        .then(res => {
          setIsOutsourceLocal(isOutsource)
          setUseSkillSet(!!res.data?.isSkillSet)
          setUseContracts(!!res.data?.isContract)
          setUseCertificates(!!res.data?.isCertificate)
          setUseProject(!!res.data?.isViewProject)
        })
        .catch(() => {
          dispatch(
            alertError({
              message: 'Staff not found',
            })
          )
          navigate(
            isOutsource
              ? PathConstant.STAFF_LIST_HR_OUTSOURCING
              : PathConstant.STAFF_LIST
          )
        })
        .finally(() => {
          setLoading(false)
          dispatch(updateLoading(false))
        })
    }
  }, [isViewDetail])

  useEffect(() => {
    return () => {
      dispatch(resetFormStaff({}))
      sessionStorage.removeItem('staffActiveTab')
    }
  }, [])

  useEffect(() => {
    setShowDialog(isFormInformationChange)
  }, [isFormInformationChange])

  useEffect(() => {
    setIsFormInformationChange(false)
    sessionStorage.setItem('staffActiveTab', activeStep.toString())
  }, [activeStep])

  return (
    <CommonScreenLayout
      useBackPage
      backLabel={
        isOutsource
          ? i18Staff('TXT_BACK_TO_LIST_STAFF_OUTSOURCE')
          : i18Staff('TXT_BACK_TO_LIST_STAFF')
      }
      onBack={backToStaffList}
    >
      <Box className={classes.stepWrapper}>
        <ConditionalRender conditional={isDetailPage}>
          <GeneralInformationStaffTop
            useSkillSet={useSkillSet}
            generalInfoStaff={generalInfoStaff}
            onShowModalExportSkillSets={handleShowModalExportSkillSets}
            isDetailPage
          />
        </ConditionalRender>
        <ConditionalRender conditional={isDetailPage}>
          <CommonTabs
            configTabs={listStep}
            activeTab={activeStep}
            nonLinear={isDetailPage}
            onClickTab={handleChangeStep}
          />
        </ConditionalRender>
        <ConditionalRender conditional={!isDetailPage && !isOutsource}>
          <CommonStep
            configSteps={listStep}
            activeStep={activeStep}
            nonLinear={isDetailPage}
            onClickStep={handleChangeStep}
          />
        </ConditionalRender>

        <ModalConfirm
          useNextStep
          title={i18('LB_NEXT_STEP') as string}
          description={i18('MSG_ROUTE_CHANGE_CONFIRMED') as string}
          open={isShowModalConfirmNextStep}
          onClose={() => setIsShowModalConfirmNextStep(false)}
          onDontSave={handleNotSave}
          onSubmit={handleNextCheckpointStep}
        />
      </Box>
      {isShowModalExportSkillSets && (
        <ModalExportSkillSets
          personalInformation={personalInformation}
          title={`${personalInformation.staffName} - ${personalInformation.positionName}`}
          onClose={() => setIsShowModalExportSkillSets(false)}
          onSubmit={handleExport}
        />
      )}
      <Box className={!isDetailPage ? classes.mt24 : ''}>
        <ConditionalRender
          conditional={
            activeStep === STAFF_STEP.GENERAL_INFORMATION && !isOutsourceLocal
          }
        >
          <GeneralInformationStaff
            loading={loading}
            useContracts={useContracts}
            useCertificates={useCertificates}
            tempStep={tempStep}
            flagUpdate={flagUpdate}
            onChangeForm={handleChangeFormInformation}
            onUpdateFlag={setFlagUpdate}
          />
        </ConditionalRender>
        <ConditionalRender
          conditional={
            activeStep === STAFF_STEP.GENERAL_INFORMATION && isOutsourceLocal
          }
        >
          <Outsource
            onSubmit={() => {
              setIsShowModalConfirmSubmit(true)
            }}
            useContracts={useContracts}
            useCertificates={useCertificates}
            tempStep={tempStep}
            flagUpdate={flagUpdate}
            onChangeForm={handleChangeFormInformation}
            onUpdateFlag={setFlagUpdate}
          />
        </ConditionalRender>

        <ConditionalRender
          conditional={
            activeStep === STAFF_STEP_DETAIL.PROJECT &&
            isDetailPage &&
            !!generalInfoStaff.staffName
          }
        >
          <StaffDetailProject />
        </ConditionalRender>
        <ConditionalRender conditional={activeStep === STAFF_STEP.SKILL_SET}>
          <SkillSetStaff
            tempStep={tempStep}
            flagUpdate={flagUpdate}
            onChangeForm={handleChangeFormInformation}
            onUpdateFlag={setFlagUpdate}
          />
        </ConditionalRender>
        <ConditionalRender
          conditional={activeStep === STAFF_STEP.CONTRACT && !isDetailPage}
        >
          <Contract
            onSubmit={() => {
              Number(generalInfoStaff.status) != STAFF_STATUS_TYPE.INACTIVE
                ? setIsShowModalConfirmSubmit(true)
                : handleSubmit()
            }}
          />
        </ConditionalRender>
      </Box>
      <ModalConfirm
        useNextStep
        title={i18Staff('LB_CREATE_STAFF') as string}
        description={i18Staff('MSG_CONFIRM_CREATE_STAFF')}
        isLabelCancel
        open={isShowModalConfirmSubmit}
        onClose={() => setIsShowModalConfirmSubmit(false)}
        titleSubmit="Continue"
        onSubmit={handleSubmit}
        cancelOutlined
      />
      <DialogBox
        // @ts-ignore
        showDialog={showPrompt}
        confirmNavigation={confirmNavigation}
        cancelNavigation={cancelNavigation}
      />
    </CommonScreenLayout>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    fontSize: 22,
    fontWeight: 700,
    lineHeight: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  stepWrapper: {},
  rootBtnExport: {
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '20px',
  },
  mb24: {
    marginBottom: `${theme.spacing(3)} !important`,
  },
  mt24: {
    marginTop: theme.spacing(3),
  },
}))

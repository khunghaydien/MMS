import { HttpStatusCode } from '@/api/types'
import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import DialogBox from '@/components/modal/DialogBox'
import ModalConfirm from '@/components/modal/ModalConfirm'
import CommonStep from '@/components/step/Stepper'
import { LangConstant, PathConstant } from '@/const'
import { useCallbackPrompt } from '@/hooks/useCallbackPrompt'
import { AuthState, selectAuth } from '@/reducer/auth'
import { alertError, alertSuccess, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { ErrorResponse, Installment, OptionItem, StepConfig } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useFormik } from 'formik'
import { isEmpty } from 'lodash'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import StringFormat from 'string-format'
import { CONTRACT_STEP, INTERNAL } from '../../const'
import useContractFormik, {
  initContractGeneralInformation,
} from '../../contractFormik'
import { ContractStaffInformationRequest } from '../../models'
import {
  contractSelector,
  IContractState,
  setActiveStep,
  setDocuments,
  setGeneralInfo,
  setStaffList,
} from '../../reducer/contract'
import {
  createContract,
  getContractGeneralInformation,
  getContractStaffInformation,
} from '../../reducer/thunk'
import { ContractService } from '../../services'
import ContractGeneralInformation from './ContractGeneralInformation'
import ContractStaffInformation from './ContractStaffInformation'
import GeneralInformationContractTop from './GeneralInformationContractTop'
import ProjectContractGeneralInformation from './ProjectContractGeneralInformation'
import RelatedContractTable from './RelatedContract'

interface ContractDetailProps {
  isDetailPage: boolean
}

export const CONFIG_CONTRACT_STEPS: StepConfig[] = [
  {
    step: CONTRACT_STEP.GENERAL_INFORMATION,
    label: 'General Information',
  },
  {
    step: CONTRACT_STEP.STAFF_INFORMATION,
    label: 'Staff Information & Upload Documents',
  },
]

const ContractDetail = ({ isDetailPage }: ContractDetailProps) => {
  const classes = useStyles()
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Contract } = useTranslation(LangConstant.NS_CONTRACT)
  const generalRef = useRef<any>()
  const { contractGeneralInformationValidation } = useContractFormik()

  const { activeStep, documents, staffList, generalInfo }: IContractState =
    useSelector(contractSelector)
  const { role }: AuthState = useSelector(selectAuth)

  const contractGeneralInformation: any = useFormik({
    initialValues: structuredClone(initContractGeneralInformation),
    validationSchema: contractGeneralInformationValidation,
    onSubmit: () => {
      if (generalRef.current.error) return
      if (isDetailPage) {
        setIsShowModalConfirm(true)
      } else {
        dispatch(setActiveStep(activeStep + 1))
      }
    },
  })

  const [isShowModalConfirm, setIsShowModalConfirm] = useState(false)
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [showModalStaff, setShowModalStaff] = useState(false)
  const [generalTemp, setGeneralTemp] = useState({})
  const [flagUpdate, setFlagUpdate] = useState(false)
  const [isShowModalConfirmNextStep, setIsShowModalConfirmNextStep] =
    useState(false)
  const [tempStep, setTempStep] = useState(0)
  const [isConfirmNextStep, setIsConfirmNextStep] = useState(false)
  const [showEditInformation, setShowEditInformation] = useState(false)
  const [staffIsLoading, setStaffIsLoading] = useState(false)

  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(showDialog)

  const branchDisabled = useMemo(() => {
    const rolesDisabledBranch = ['Branch Director', 'COO']
    return role.some((roleItem: any) =>
      rolesDisabledBranch.includes(roleItem?.name)
    )
  }, [role])

  const isButtonUpdateGeneralDisabled = useMemo(() => {
    if (!isDetailPage) return false
    return (
      JSON.stringify(contractGeneralInformation.values) ===
      JSON.stringify(generalTemp)
    )
  }, [contractGeneralInformation.values, generalTemp])

  const isFormCreateHasChanged = useMemo(() => {
    if (isDetailPage) return false
    const newInitContract: any = { ...initContractGeneralInformation }
    const newContractValues: any = { ...contractGeneralInformation.values }
    if (branchDisabled) {
      delete newInitContract.branchId
      delete newContractValues.branchId
    }
    return JSON.stringify(newInitContract) === JSON.stringify(newContractValues)
  }, [contractGeneralInformation.values, branchDisabled])

  const useGeneralInformation = useMemo(() => {
    if (!isDetailPage) return activeStep === CONTRACT_STEP.GENERAL_INFORMATION
    return !!Object.keys(generalTemp).length
  }, [generalTemp, activeStep])

  const useStaffAndDocsInformation = useMemo(() => {
    if (!isDetailPage) return activeStep === CONTRACT_STEP.STAFF_INFORMATION
    return activeStep === CONTRACT_STEP.GENERAL_INFORMATION
  }, [activeStep])

  const handleRedirectToContractList = () => {
    navigate(PathConstant.CONTRACT_LIST)
  }

  const handleStepChange = (step: number) => {
    setTempStep(step)
    if (
      Object.values(CONTRACT_STEP).every(
        (valueStep: number) => valueStep !== step
      )
    )
      return
    if (isConfirmNextStep && activeStep === CONTRACT_STEP.GENERAL_INFORMATION) {
      setIsShowModalConfirmNextStep(true)
    } else {
      dispatch(setActiveStep(step))
    }
  }

  const createContractStaffWithAPI = (
    requestBody: ContractStaffInformationRequest
  ) => {
    const { contractId } = params
    dispatch(updateLoading(true))
    ContractService.createContractStaff({
      contractId: contractId as string,
      requestBody,
    })
      .then(() => {
        setStaffIsLoading(true)
        dispatch(getContractStaffInformation(contractId as string))
          .unwrap()
          .finally(() => {
            setStaffIsLoading(false)
            dispatch(
              alertSuccess({
                message: StringFormat(
                  i18Contract('MSG_CREATE_STAFF'),
                  requestBody.staffName || ''
                ),
              })
            )
          })
        setShowModalStaff(false)
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  const handleCreateNewStaff = (staff: ContractStaffInformationRequest) => {
    if (isDetailPage) {
      const newStaff = { ...staff }
      delete newStaff.id
      createContractStaffWithAPI({
        ...newStaff,
        startDate: staff.startDate?.valueOf() || null,
        endDate: staff.endDate?.valueOf() || null,
        skillIds: staff.skillIds.map((skill: OptionItem) => skill.id),
      })
    } else {
      const newStaffList = [
        {
          ...staff,
          staffId:
            staff.sourceStaff === INTERNAL
              ? staff.staffId
              : new Date().getTime(),
        },
        ...staffList,
      ]
      dispatch(setStaffList(newStaffList))
      setShowModalStaff(false)
    }
  }

  const updateStaffWithAPI = (
    staffId: string,
    staffName: string,
    requestBody: ContractStaffInformationRequest
  ) => {
    const { contractId } = params
    dispatch(updateLoading(true))
    ContractService.updateContractStaff({
      contractId: contractId as string,
      staffId,
      requestBody,
    })
      .then(() => {
        setStaffIsLoading(true)
        dispatch(getContractStaffInformation(contractId as string))
          .unwrap()
          .finally(() => {
            setStaffIsLoading(false)
            dispatch(
              alertSuccess({
                message: StringFormat(
                  i18Contract('MSG_UPDATE_STAFF'),
                  staffName
                ),
              })
            )
          })
        setShowModalStaff(false)
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  const handleUpdateStaff = (
    staff: ContractStaffInformationRequest,
    staffIndex: number
  ) => {
    if (isDetailPage) {
      const newStaff: ContractStaffInformationRequest = {
        ...staff,
        startDate: staff.startDate?.valueOf(),
        endDate: staff.endDate?.valueOf(),
        rate: staff.rate,
        skillIds: staff.skillIds.map((skill: OptionItem) => skill.id),
      }
      delete newStaff.id
      updateStaffWithAPI(
        staff.id as string,
        staff.staffName as string,
        newStaff
      )
    } else {
      const newStaffList = [...staffList]
      newStaffList[staffIndex] = staff
      dispatch(setStaffList(newStaffList))
      setShowModalStaff(false)
    }
  }

  const deleteStaffWithAPI = (staffId: string, staffName: string) => {
    const { contractId } = params
    dispatch(updateLoading(true))
    ContractService.deleteContractStaff(contractId as string, staffId)
      .then(() => {
        setStaffIsLoading(true)
        dispatch(getContractStaffInformation(contractId as string))
          .unwrap()
          .finally(() => {
            setStaffIsLoading(false)
            dispatch(
              alertSuccess({
                message: StringFormat(
                  i18Contract('MSG_DELETE_STAFF'),
                  staffName
                ),
              })
            )
          })
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  const handleDeleteStaff = (
    staffName: string,
    staffId: string,
    staffIndex: number
  ) => {
    if (isDetailPage) {
      deleteStaffWithAPI(staffId, staffName)
    } else {
      const newStaffList = [...staffList]
      newStaffList.splice(staffIndex, 1)
      dispatch(setStaffList(newStaffList))
    }
  }

  const handleCreateNewContract = () => {
    const general = {
      ...contractGeneralInformation.values,
      currencyId: contractGeneralInformation.values.currencyId || 0,
      dueDatePayment: contractGeneralInformation.values.dueDatePayment || 0,
      startDate: contractGeneralInformation.values.startDate || 0,
      endDate: contractGeneralInformation.values.endDate || 0,
      signDate: contractGeneralInformation.values.signDate || 0,
      group: contractGeneralInformation.values.group || 0,
      orderType: contractGeneralInformation.values.orderType || 0,
      paymentMethod: contractGeneralInformation.values.paymentMethod || 0,
      modifiedStatusDate:
        contractGeneralInformation.values.modifiedStatusDate || 0,
      contactPerson: Number(
        contractGeneralInformation.values.contactPerson?.id
      ),
      buyerId: contractGeneralInformation.values.buyerId?.id || '',
      sellerId: contractGeneralInformation.values.sellerId?.id || '',
      selectContractGroup:
        contractGeneralInformation.values.selectContractGroup?.id || '',
      relatedOrders: contractGeneralInformation.values.relatedOrders?.map(
        (item: any) => item.id
      ),
      rate: contractGeneralInformation.values.rate || 0,
      type: contractGeneralInformation.values.type || 0,
      value: contractGeneralInformation.values.value || 0,
      installments: contractGeneralInformation.values.installments.map(
        (item: Installment, index: number) => {
          const _item = structuredClone(item)
          delete _item.id
          _item.installmentNo = index + 1
          return _item
        }
      ),
    }
    const requestBody = {
      general,
      staffs: staffList.map((staff: ContractStaffInformationRequest) => {
        const newStaff = {
          ...staff,
          currencyId: staff.currencyId || 0,
          staffId: staff.sourceStaff === INTERNAL ? staff.staffId : '',
          rate: staff.rate || 0,
          skillIds: staff.skillIds?.map((skill: OptionItem) => skill.id),
          startDate: staff.startDate || 0,
          endDate: staff.endDate || 0,
          price: staff.price || 0,
          unitOfTime: Number(staff.unitOfTime) || 0,
        }
        delete newStaff.id
        return newStaff
      }),
    }
    const formData = new FormData()
    formData.append('requestBody', JSON.stringify(requestBody))
    documents.forEach(file => {
      formData.append('documents', file.FileObject)
    })

    dispatch(updateLoading(true))
    dispatch(createContract(formData))
      .unwrap()
      .then(res => {
        if (res?.status === HttpStatusCode.OK) {
          navigate(PathConstant.CONTRACT_LIST)
        }
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
    setShowDialog(false)
  }
  const getDetailContractGeneralInformation = () => {
    const { contractId } = params
    dispatch(updateLoading(true))
    dispatch(getContractGeneralInformation(contractId as string))
      .unwrap()
      .catch((err: ErrorResponse[]) => {
        if (err[0].field === 'id') {
          dispatch(
            alertError({
              message: i18Contract('MSG_CONTRACT_NOT_FOUND'),
            })
          )
          navigate(PathConstant.CONTRACT_LIST)
          if (typeof confirmNavigation === 'function') {
            confirmNavigation()
          }
        }
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  const handleNextCheckpointStep = () => {
    setFlagUpdate(true)
  }

  const handleDontSave = () => {
    dispatch(setActiveStep(tempStep))
    getDetailContractGeneralInformation()
  }

  useEffect(() => {
    if (isDetailPage) {
      getDetailContractGeneralInformation()
    }
  }, [])

  useEffect(() => {
    if (!isEmpty(generalInfo)) {
      contractGeneralInformation.setValues(generalInfo)
      setGeneralTemp(generalInfo)
    }
  }, [generalInfo])

  useEffect(() => {
    return () => {
      dispatch(setActiveStep(CONTRACT_STEP.GENERAL_INFORMATION))
      dispatch(setDocuments([]))
      dispatch(setStaffList([]))
      dispatch(setGeneralInfo({}))
    }
  }, [])

  useEffect(() => {
    if (isDetailPage) {
      setShowDialog(!isButtonUpdateGeneralDisabled)
    } else {
      setShowDialog(!isFormCreateHasChanged)
    }
  }, [isButtonUpdateGeneralDisabled, isFormCreateHasChanged])

  useEffect(() => {
    if (isDetailPage) {
      setIsConfirmNextStep(!isButtonUpdateGeneralDisabled)
    }
  }, [isButtonUpdateGeneralDisabled])

  return (
    <CommonScreenLayout
      useBackPage
      backLabel={i18Contract('TXT_BACK_TO_CONTRACT_LIST')}
      onBack={handleRedirectToContractList}
    >
      {isShowModalConfirmNextStep && (
        <ModalConfirm
          open
          useNextStep
          title={i18('LB_NEXT_STEP')}
          description={i18('MSG_ROUTE_CHANGE_CONFIRMED')}
          onClose={() => setIsShowModalConfirmNextStep(false)}
          onSubmit={handleNextCheckpointStep}
          onDontSave={handleDontSave}
        />
      )}
      <DialogBox
        // @ts-ignore
        showDialog={showPrompt}
        confirmNavigation={confirmNavigation}
        cancelNavigation={cancelNavigation}
      />
      <Box className={classes.rootContractDetail}>
        {isDetailPage && !!Object.keys(generalTemp).length && (
          <GeneralInformationContractTop
            contractGeneralInformation={generalTemp}
          />
        )}
        {!isDetailPage && (
          <CommonStep
            nonLinear={isDetailPage}
            activeStep={activeStep}
            configSteps={CONFIG_CONTRACT_STEPS}
            onClickStep={handleStepChange}
          />
        )}
        {useGeneralInformation && (
          <ContractGeneralInformation
            branchDisabled={branchDisabled}
            ref={generalRef}
            setShowEditInformation={setShowEditInformation}
            tempStep={tempStep}
            flagUpdate={flagUpdate}
            setFlagUpdate={setFlagUpdate}
            isDetailPage={isDetailPage}
            getDetailContractGeneralInformation={
              getDetailContractGeneralInformation
            }
            isShowModalConfirm={isShowModalConfirm}
            setIsShowModalConfirm={setIsShowModalConfirm}
            form={contractGeneralInformation}
            isButtonSubmitDisabled={isButtonUpdateGeneralDisabled}
            showEditInformation={showEditInformation}
            generalTemp={generalTemp}
          />
        )}
        {useStaffAndDocsInformation && (
          <ContractStaffInformation
            isLoading={staffIsLoading}
            contractStartDate={contractGeneralInformation.values.startDate}
            contractEndDate={contractGeneralInformation.values.endDate}
            branchId={contractGeneralInformation.values.branchId}
            showModalStaff={showModalStaff}
            setShowModalStaff={setShowModalStaff}
            isDetailPage={isDetailPage}
            staffList={staffList}
            onCreateNewContract={handleCreateNewContract}
            onCreateNewStaff={handleCreateNewStaff}
            onUpdateStaff={handleUpdateStaff}
            onDeleteStaff={handleDeleteStaff}
          />
        )}
      </Box>
      {isDetailPage && (
        <ProjectContractGeneralInformation
          orderType={contractGeneralInformation.values.orderType}
        />
      )}

      {isDetailPage && <RelatedContractTable />}
    </CommonScreenLayout>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootContractDetail: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
}))

export default ContractDetail

import CardForm from '@/components/Form/CardForm'
import ButtonAddPlus from '@/components/buttons/ButtonAddPlus'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import CommonTable from '@/components/table/CommonTable'
import { LangConstant, TableConstant } from '@/const'
import { UNIT_OF_TIME } from '@/const/app.const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { OptionItem, TableHeaderColumn } from '@/types'
import { formatCurrencyThreeCommas } from '@/utils'
import { Timeline } from '@mui/icons-material'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import moment from 'moment'
import {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import StringFormat from 'string-format'
import ContractStepAction from '../../components/ContractStepAction'
import ModalContractStaff from '../../components/ModalContractStaff'
import { CONTRACT_HISTORY_TYPE, CONTRACT_STEP } from '../../const'
import { initStaffForm } from '../../contractFormik'
import { ContractStaffInformationRequest } from '../../models'
import { IContractState, contractSelector } from '../../reducer/contract'
import {
  getContractStaffInformation,
  getContractUploadDocuments,
} from '../../reducer/thunk'
import { CONFIG_CONTRACT_STEPS } from './ContractDetail'
import ContractUploadDocuments from './ContractUploadDocuments'
import ModalActivityContractGeneral from './ModalActivityContractGeneral'

interface ContractStaffInformationProps {
  isLoading: boolean
  isDetailPage: boolean
  staffList: ContractStaffInformationRequest[]
  onCreateNewContract: Function
  onCreateNewStaff: (staff: ContractStaffInformationRequest) => void
  setShowModalStaff: Dispatch<SetStateAction<boolean>>
  showModalStaff: boolean
  branchId: string
  contractStartDate: number | null
  contractEndDate: number | null
  onUpdateStaff: (
    staff: ContractStaffInformationRequest,
    staffIndex: number
  ) => void
  onDeleteStaff: (
    staffName: string,
    staffId: string,
    staffIndex: number
  ) => void
}

const ContractStaffInformation = ({
  isDetailPage,
  staffList,
  onCreateNewContract,
  onCreateNewStaff,
  setShowModalStaff,
  showModalStaff,
  onUpdateStaff,
  onDeleteStaff,
  branchId,
  contractStartDate,
  contractEndDate,
  isLoading,
}: ContractStaffInformationProps) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const params = useParams()
  const { t: i18 } = useTranslation()
  const { t: i18Contract } = useTranslation(LangConstant.NS_CONTRACT)

  const { activeStep }: IContractState = useSelector(contractSelector)
  const { permissions }: AuthState = useSelector(selectAuth)

  const [isOpenModalActivity, setIsOpenModalActivity] = useState(false)
  const [isDetailStaff, setIsDetailStaff] = useState(false)
  const [staffDetailLocal, setStaffDetailLocal] =
    useState<ContractStaffInformationRequest>(initStaffForm)
  const [indexStaffSelected, setIndexStaffSelected] = useState(0)
  const [showModalDelete, setShowModalDelete] = useState(false)
  const [staffNameSelected, setStaffNameSelected] = useState('')
  const [staffPageSize, setStaffPageSize] = useState(
    TableConstant.LIMIT_DEFAULT
  )
  const [staffPageNum, setStaffPageNum] = useState(1)
  const [staffIdSelected, setStaffIdSelected] = useState('')

  const headCells: TableHeaderColumn[] = [
    {
      id: 'staffName',
      align: 'left',
      label: i18('LB_STAFF_NAME'),
    },
    {
      id: 'positionName',
      align: 'left',
      label: i18Contract('LB_STAFF_POSITION'),
    },
    {
      id: 'skillIds',
      align: 'left',
      label: i18Contract('LB_SERVICE_SKILLSET'),
    },
    {
      id: 'level',
      align: 'left',
      label: i18Contract('LB_STAFF_LEVEL'),
    },
    {
      id: 'price',
      align: 'left',
      label: i18('LB_PRICE'),
    },
    {
      id: 'unitOfTime',
      align: 'left',
      label: i18('LB_UNIT_OF_TIME'),
    },
    {
      id: 'delete',
      align: 'left',
      label: i18('LB_ACTION'),
    },
  ]

  const checkErrorRow = (row: any) => {
    const isErrorStartDate = moment(row.startDate).isBefore(
      contractStartDate,
      'day'
    )
    const isErrorEndDate = moment(row.endDate).isAfter(contractEndDate, 'day')
    return isErrorEndDate || isErrorStartDate
  }

  const createStaffListRows = (staff: ContractStaffInformationRequest) => {
    return {
      ...staff,
      id: staff.id,
      price: staff.price ? formatCurrencyThreeCommas(staff.price) : '',
      unitOfTime: UNIT_OF_TIME.find(
        unit => unit.id === staff?.unitOfTime?.toString()
      )?.label,
      skillIds: staff.skillIds
        ?.map((skill: OptionItem) => skill.label)
        .join(', '),
      level: staff.levelName,
      currency: staff.codeCurrency,
      useDeleteIcon: !staff.viewOnly,
      isError: checkErrorRow(staff),
    }
  }

  const staffListRows = useMemo(() => {
    if (!staffList.length) return []
    let _staffList = staffList.map((staff: ContractStaffInformationRequest) =>
      createStaffListRows(staff)
    )
    return _staffList.slice(
      (staffPageNum - 1) * staffPageSize,
      (staffPageNum - 1) * staffPageSize + staffPageSize
    )
  }, [staffList, staffPageNum, staffPageSize])

  const staffIds = useMemo(() => {
    if (!staffList.length) return []
    return staffList.map((staff: ContractStaffInformationRequest) =>
      staff?.staffId?.toString()
    )
  }, [staffList])

  const staffHeadCells = useMemo(() => {
    if (permissions.useContractUpdate) return headCells
    return headCells.slice(0, -1)
  }, [permissions.useContractUpdate])

  const staffDateError = useMemo(() => {
    return staffList.some(staff => checkErrorRow(staff))
  }, [staffList])

  const handleCloseModalStaff = () => setShowModalStaff(false)

  const handleShowModalAddNewStaff = () => {
    setIsDetailStaff(false)
    setShowModalStaff(true)
  }

  const handleShowModalDetailStaff = (
    rowParam: ContractStaffInformationRequest
  ) => {
    const index = staffList.findIndex(
      (row: ContractStaffInformationRequest) => row.id == rowParam.id
    )
    if (index !== -1) {
      setStaffDetailLocal(staffList[index])
      setIndexStaffSelected(index)
      setIsDetailStaff(true)
      setShowModalStaff(true)
    }
  }

  const handleShowModalDeleteStaff = (
    rowParam: ContractStaffInformationRequest
  ) => {
    const index = staffList.findIndex(
      (row: ContractStaffInformationRequest) => row.id == rowParam.id
    )
    if (index !== -1) {
      setIndexStaffSelected(index)
      setStaffNameSelected(staffList[index].staffName || '')
      setStaffIdSelected(staffList[index].id || '')
      setShowModalDelete(true)
    }
  }

  const handleCreateNewContract = () => {
    onCreateNewContract()
  }

  const handleDeleteStaff = () => {
    if (staffListRows.length === 1 && staffPageNum !== 1) {
      setStaffPageNum(staffPageNum - 1)
    }
    onDeleteStaff(staffNameSelected, staffIdSelected, indexStaffSelected)
  }

  const handleSubmitModalStaff = (staff: ContractStaffInformationRequest) => {
    if (isDetailStaff) {
      onUpdateStaff(staff, indexStaffSelected)
    } else {
      onCreateNewStaff(staff)
    }
  }

  const getStaffInformationAndDocs = () => {
    const { contractId } = params
    dispatch(updateLoading(true))
    Promise.all([
      dispatch(getContractStaffInformation(contractId as string)),
      dispatch(
        getContractUploadDocuments({
          contractId: contractId as string,
          queries: {
            pageNum: staffPageNum,
            pageSize: TableConstant.LIMIT_DEFAULT,
          },
        })
      ),
    ]).finally(() => {
      dispatch(updateLoading(false))
    })
  }

  const handlePageChange = (newPage: number) => {
    setStaffPageNum(newPage)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setStaffPageSize(newPageSize)
    setStaffPageNum(1)
  }

  useEffect(() => {
    if (isDetailPage) {
      getStaffInformationAndDocs()
    }
  }, [])

  return (
    <Box className={classes.rootContractStaffInformation}>
      {isOpenModalActivity && (
        <ModalActivityContractGeneral
          historyType={CONTRACT_HISTORY_TYPE.STAFF_INFORMATION}
          contractId={params.contractId as string}
          onClose={() => setIsOpenModalActivity(false)}
        />
      )}
      {showModalStaff && (
        <ModalContractStaff
          contractStartDate={contractStartDate}
          contractEndDate={contractEndDate}
          branchId={branchId}
          staffIds={staffIds as string[]}
          isDetail={isDetailStaff}
          staffDetail={staffDetailLocal}
          onClose={handleCloseModalStaff}
          onSubmit={handleSubmitModalStaff}
        />
      )}
      {showModalDelete && (
        <ModalDeleteRecords
          open
          titleMessage={i18Contract('TXT_DELETE_STAFF')}
          subMessage={StringFormat(
            i18Contract('MSG_CONFIRM_STAFF_DELETE'),
            staffNameSelected
          )}
          onClose={() => setShowModalDelete(false)}
          onSubmit={handleDeleteStaff}
        />
      )}
      <CardForm
        isLoading={isLoading}
        title={i18('TXT_STAFF_INFORMATION')}
        titleIcon={isDetailPage ? <Timeline /> : ''}
        onTitleIconClick={() => setIsOpenModalActivity(true)}
      >
        <CommonTable
          columns={staffHeadCells}
          rows={staffListRows}
          onDeleteClick={handleShowModalDeleteStaff}
          onRowClick={handleShowModalDetailStaff}
          pagination={{
            totalElements: staffList.length,
            pageSize: staffPageSize,
            pageNum: staffPageNum,
            onPageChange: handlePageChange,
            onPageSizeChange: handlePageSizeChange,
          }}
          FooterActions={
            permissions.useContractUpdate ? (
              <ButtonAddPlus
                label={i18('LB_ADD_NEW_STAFF')}
                onClick={handleShowModalAddNewStaff}
              />
            ) : (
              <Fragment />
            )
          }
        />
      </CardForm>
      <ContractUploadDocuments isDetailPage={isDetailPage} />
      {!isDetailPage && (
        <ContractStepAction
          useWarning={
            staffDateError && activeStep === CONTRACT_STEP.STAFF_INFORMATION
          }
          disabledBtnNext={
            staffDateError && activeStep === CONTRACT_STEP.STAFF_INFORMATION
          }
          configSteps={CONFIG_CONTRACT_STEPS}
          activeStep={activeStep}
          onNext={handleCreateNewContract}
        />
      )}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootContractStaffInformation: {},
  staffActions: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  dFlexEnd: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  mt16: {
    marginTop: theme.spacing(2),
  },
  rowError: {
    backgroundColor: theme.color.error.tertiary,

    '&:hover': {
      backgroundColor: `${theme.color.error.tertiary} !important`,
    },
  },
}))

export default ContractStaffInformation

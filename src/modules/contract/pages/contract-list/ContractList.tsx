import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import StatusItem from '@/components/common/StatusItem'
import { LangConstant } from '@/const'
import { CONTRACT_STATUS } from '@/const/app.const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { AppDispatch } from '@/store'
import { IStatus, TableHeaderColumn } from '@/types'
import { formatDate, formatNumberToCurrency } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import i18next from 'i18next'
import { cloneDeep } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { IListContractsParams } from '../../models'
import { IContractState, contractSelector } from '../../reducer/contract'
import { getListContracts } from '../../reducer/thunk'
import ContractListActions from './ContractListActions'
import TableContractList from './TableContractList'

const contractListHeadCells: TableHeaderColumn[] = [
  {
    id: 'code',
    align: 'left',
    label: i18next.t('common:LB_CONTRACT_NUMBER'),
    sortBy: 'code',
    orderBy: 'desc',
    checked: false,
  },
  {
    id: 'copy',
    align: 'left',
    label: '',
    checked: false,
  },
  {
    id: 'creator',
    align: 'left',
    label: i18next.t('contract:LB_CREATE_PERSON'),
    checked: false,
  },
  {
    id: 'buyer',
    align: 'left',
    label: i18next.t('contract:LB_BUYER'),
    checked: false,
  },
  {
    id: 'seller',
    align: 'left',
    label: i18next.t('contract:LB_SELLER'),
    checked: false,
  },
  {
    id: 'branch',
    align: 'left',
    label: i18next.t('common:LB_BRANCH'),
    checked: false,
  },
  {
    id: 'contractGroup',
    align: 'left',
    label: i18next.t('common:LB_CONTRACT_GROUP'),
    checked: false,
  },
  {
    id: 'contractType',
    align: 'left',
    label: i18next.t('common:LB_CONTRACT_TYPE'),
    checked: false,
  },
  {
    id: 'contractSignDate',
    align: 'left',
    label: i18next.t('contract:LB_CONTRACT_SIGN_DATE'),
    orderBy: 'desc',
    sortBy: 'signDate',
    checked: false,
  },
  {
    id: 'contractStartDate',
    align: 'left',
    label: i18next.t('contract:LB_CONTRACT_START_DATE'),
    orderBy: 'desc',
    sortBy: 'startDate',
    checked: false,
  },
  {
    id: 'contractEndDate',
    align: 'left',
    label: i18next.t('contract:LB_CONTRACT_END_DATE'),
    orderBy: 'desc',
    sortBy: 'endDate',
    checked: false,
  },
  {
    id: 'status',
    align: 'left',
    label: i18next.t('common:LB_STATUS'),
    checked: false,
  },
  {
    id: 'value',
    align: 'left',
    label: i18next.t('common:LB_EXPECTED_VALUE'),
    orderBy: 'desc',
    sortBy: 'value',
    checked: false,
  },
  {
    id: 'contactPerson',
    align: 'left',
    label: i18next.t('contract:LB_CONTACT_PERSON'),
    checked: false,
  },
  {
    id: 'delete',
    align: 'left',
    label: i18next.t('common:LB_ACTION'),
  },
]

export function convertDataStatus(item: any): IStatus {
  let _resultData: IStatus = { color: 'grey', label: '' }
  if (CONTRACT_STATUS[item?.id]) {
    return CONTRACT_STATUS[item?.id]
  }
  return _resultData
}

export function getContractColor(date: any) {
  if (!date) {
    // Mặc định màu sắc khác (nếu cần)
    return 'white'
  }
  const currentDate = new Date()
  const expirationDate = new Date(date)
  // Số mili giây trong 1 ngày
  const oneDay = 24 * 60 * 60 * 1000
  // Tính toán khoảng cách giữa hai ngày
  const daysDiff = Math.floor(
    (currentDate.getTime() - expirationDate.getTime()) / oneDay
  )
  if (daysDiff >= -30 && daysDiff <= 30) {
    // Trong khoảng từ 30 ngày trước đến 30 ngày sau hết hạn
    return 'yellow'
  } else if (daysDiff > 30) {
    // Sau 30 ngày hết hạn
    return 'red'
  }
}
const createData = (item: any) => {
  return {
    id: item.contractId || '',
    contractId: item.contractId || '',
    code: item.contractNumber || '',
    branch: item.branch?.name || '',
    contractGroup: item.group?.name || '',
    contractType: item.type?.name || '',
    contractStartDate:
      item.startDate && item.startDate > 0 ? formatDate(item.startDate) : '',
    contractEndDate:
      item.endDate && item.endDate > 0 ? formatDate(item.endDate) : '',
    status: <StatusItem typeStatus={{ ...convertDataStatus(item.status) }} />,
    value: item.value ? formatNumberToCurrency(item.value) : '',
    contactPerson: item.contactPerson?.name || '',
    contractSignDate:
      item.signDate && item.signDate > 0 ? formatDate(item.signDate) : '',
    buyer: item.buyer?.name,
    seller: item.seller?.name,
    useDeleteIcon: true,
    copyContent: item.contractNumber,
    creator: item.createdBy?.name || '',
    classColorContract: getContractColor(item.endDate),
  }
}

const ContractList = () => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18Contract } = useTranslation(LangConstant.NS_CONTRACT)

  const { listContracts }: IContractState = useSelector(contractSelector)
  const { permissions }: AuthState = useSelector(selectAuth)
  const { contractQueryParameters }: IContractState =
    useSelector(contractSelector)
  const [headCells, setHeadCells] = useState(() => {
    const newContractListHeadCells = cloneDeep(contractListHeadCells)
    return permissions.usePartnerDelete
      ? contractListHeadCells
      : newContractListHeadCells.splice(0, newContractListHeadCells.length - 1)
  })

  const rows = useMemo(() => {
    return listContracts?.map((item: any) => createData(item)) || []
  }, [listContracts])

  const getListContractsApi = (params: IListContractsParams = {}) => {
    const _params = {
      ...params,
    }
    dispatch(getListContracts({ ..._params }))
  }

  useEffect(() => {
    getListContractsApi(contractQueryParameters)
  }, [contractQueryParameters])

  return (
    <CommonScreenLayout title={i18Contract('TXT_CONTRACT_MANAGEMENT_TITLE')}>
      <Box className={classes.contractContainer}>
        <ContractListActions />
        <TableContractList
          rows={rows}
          headCells={headCells}
          setHeadCells={setHeadCells}
          params={contractQueryParameters}
          getListContractsApi={getListContractsApi}
        />
      </Box>
    </CommonScreenLayout>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootContractList: {},
  title: {
    fontSize: 16,
    fontWeight: 700,
    borderBottom: `1px solid ${theme.color.grey.secondary}`,
    width: 'max-content',
    paddingBottom: '28px',
  },
  contractContainer: {
    marginTop: theme.spacing(3),
  },
}))

export default ContractList

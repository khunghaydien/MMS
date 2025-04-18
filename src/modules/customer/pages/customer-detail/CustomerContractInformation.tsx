import StatusItem from '@/components/common/StatusItem'
import CardForm from '@/components/Form/CardForm'
import CommonTable from '@/components/table/CommonTable'
import { LangConstant, PathConstant, TableConstant } from '@/const'
import { IContract, Optional } from '@/modules/customer/types'
import {
  CommonState,
  commonSelector,
  getContractGroups,
  getContractTypes,
} from '@/reducer/common'
import { AppDispatch } from '@/store'
import { OptionItem, TableHeaderColumn } from '@/types'
import { formatDate, formatNumberToCurrency } from '@/utils'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import StringFormat from 'string-format'

interface ListOptionsFilterContracts {
  contractTypes: OptionItem[]
  contractGroups: OptionItem[]
  listStatus: OptionItem[]
}

export function createData(
  item: any,
  { contractTypes, contractGroups }: ListOptionsFilterContracts
) {
  return {
    id: item.id,
    code: item.code,
    type: contractTypes.find(
      (contract: OptionItem) => contract.value === item.type?.id
    )?.label,
    group: contractGroups.find(
      (group: OptionItem) => group.value === item.group?.id
    )?.label,
    signDate: formatDate(item.signDate),
    startDate: item.startDate ? formatDate(new Date(item.startDate)) : '',
    endDate: item.endDate ? formatDate(new Date(item.endDate)) : '',
    expectedRevenue: !!item.value
      ? `${formatNumberToCurrency(+item.value)} VND`
      : '',
    note: item.note || '',
    status: <StatusItem typeStatus={{ ...item.status }} />,
  }
}

interface IProps {
  contracts: Optional<IContract>[]
}

function ContactTable({ contracts }: IProps) {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Contract } = useTranslation(LangConstant.NS_CONTRACT)

  const [page, setPage] = useState(TableConstant.PAGE_CURRENT_DEFAULT)
  const [pageLimit, setPageLimit] = useState(TableConstant.LIMIT_DEFAULT)

  const { contractTypes, contractGroups, listStatus }: CommonState =
    useSelector(commonSelector)

  const columns: TableHeaderColumn[] = [
    {
      id: 'code',
      align: 'left',
      label: i18('LB_CONTRACT_NUMBER'),
    },
    {
      id: 'group',
      align: 'left',
      label: i18('LB_CONTRACT_GROUP'),
    },
    {
      id: 'type',
      align: 'left',
      label: i18('LB_CONTRACT_TYPE'),
    },
    {
      id: 'signDate',
      align: 'left',
      label: i18Contract('LB_CONTRACT_SIGN_DATE'),
    },
    {
      id: 'startDate',
      align: 'left',
      label: i18Contract('LB_CONTRACT_START_DATE'),
    },
    {
      id: 'endDate',
      align: 'left',
      label: i18Contract('LB_CONTRACT_END_DATE'),
    },
    {
      id: 'expectedRevenue',
      align: 'left',
      label: i18('LB_EXPECTED_VALUE'),
    },
    {
      id: 'status',
      align: 'left',
      label: i18('LB_STATUS'),
    },
  ]

  useEffect(() => {
    if (!contractGroups.length) {
      dispatch(getContractGroups())
    }
    if (!contractTypes.length) {
      dispatch(getContractTypes())
    }
  }, [])

  const contractsPaginate = useMemo(() => {
    if (!contracts || !contracts.length) return []
    const _contracts = JSON.parse(JSON.stringify(contracts))
    const result = _contracts
      .slice((page - 1) * pageLimit, page * pageLimit)
      .map((contract: IContract) =>
        createData(contract, { contractGroups, contractTypes, listStatus })
      )
    return result
  }, [contracts, pageLimit, page])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageLimit(newPageSize)
    setPage(1)
  }

  const handleNavigateToDetailPage = (contract: any) => {
    const url = StringFormat(PathConstant.CONTRACT_DETAIL_FORMAT, contract.id)
    window.open(url)
  }

  return (
    <CardForm title={i18('TXT_CONTRACT_INFORMATION')}>
      <CommonTable
        useOpenNewTab
        rowClassName={classes.row}
        linkFormat={PathConstant.CONTRACT_DETAIL_FORMAT}
        columns={columns}
        rows={contractsPaginate}
        onRowClick={handleNavigateToDetailPage}
        pagination={{
          totalElements: contracts.length,
          pageSize: pageLimit,
          pageNum: page,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange,
        }}
      />
    </CardForm>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  buttonWrapper: {
    paddingTop: theme.spacing(1.5),
  },
  row: {
    '& .first-item': {
      display: 'inline-block',
      width: '200px',
      overflowWrap: 'break-word',
    },
    '& td:nth-child(8) .row-item-text': {
      display: 'inline-block !important',
      width: '200px !important',
    },
  },
}))

export default ContactTable

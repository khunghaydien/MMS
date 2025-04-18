import StatusItem from '@/components/common/StatusItem'
import CardForm from '@/components/Form/CardForm'
import CommonTable from '@/components/table/CommonTable'
import { LangConstant, PathConstant, TableConstant } from '@/const'
import { CONTRACT_STATUS } from '@/const/app.const'
import {
  CommonState,
  commonSelector,
  getContractGroups,
  getContractTypes,
} from '@/reducer/common'
import { AppDispatch } from '@/store'
import { OptionItem, TableHeaderColumn } from '@/types'
import { formatDate, formatNumberToCurrency } from '@/utils'
import { makeStyles } from '@mui/styles'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import StringFormat from 'string-format'
import { PartnerState, selectPartner } from '../../reducer/partner'

interface ListOptionsFilterContracts {
  contractTypes: OptionItem[]
  contractGroups: OptionItem[]
  listStatus: OptionItem[]
}

const createData = (
  item: any,
  { contractTypes, contractGroups }: ListOptionsFilterContracts
) => {
  return {
    id: item.id,
    code: item.code,
    type: contractTypes.find(
      (contract: OptionItem) => contract.value === item.type
    )?.label,
    group: contractGroups.find(
      (group: OptionItem) => group.value === item.group
    )?.label,
    signDate: formatDate(item.signDate),
    startDate: formatDate(item.startDate),
    endDate: formatDate(item.endDate),
    expectedRevenue: !!item.value
      ? `${formatNumberToCurrency(+item.value)} VND`
      : '',
    status: <StatusItem typeStatus={{ ...CONTRACT_STATUS[item.status] }} />,
  }
}

const PartnerContractInformation = () => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Contract } = useTranslation(LangConstant.NS_CONTRACT)

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

  const { contractTypes, contractGroups, listStatus }: CommonState =
    useSelector(commonSelector)
  const { stateContracts }: PartnerState = useSelector(selectPartner)

  const [page, setPage] = useState(TableConstant.PAGE_CURRENT_DEFAULT)
  const [pageLimit, setPageLimit] = useState(TableConstant.LIMIT_DEFAULT)

  const rows = useMemo(() => {
    return [...stateContracts]
      .slice((page - 1) * pageLimit, page * pageLimit)
      .map((contract: any) =>
        createData(contract, { contractTypes, contractGroups, listStatus })
      )
  }, [stateContracts, pageLimit, page])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = (pageSize: number) => {
    setPageLimit(pageSize)
    setPage(1)
  }

  const handleNavigateToDetailPage = (contract: any) => {
    const url = StringFormat(PathConstant.CONTRACT_DETAIL_FORMAT, contract.id)
    window.open(url)
  }

  useEffect(() => {
    if (!contractTypes.length) {
      dispatch(getContractTypes())
    }
    if (!contractGroups.length) {
      dispatch(getContractGroups())
    }
  }, [])

  return (
    <CardForm title={i18('TXT_CONTRACT_INFORMATION')}>
      <CommonTable
        useOpenNewTab
        rowClassName={classes.row}
        linkFormat={PathConstant.CONTRACT_DETAIL_FORMAT}
        columns={columns}
        rows={rows}
        onRowClick={handleNavigateToDetailPage}
        pagination={{
          totalElements: stateContracts.length,
          pageSize: pageLimit,
          pageNum: page,
          onPageChange: handlePageChange,
          onPageSizeChange: handleRowsPerPageChange,
        }}
      />
    </CardForm>
  )
}

const useStyles = makeStyles(() => ({
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

export default PartnerContractInformation

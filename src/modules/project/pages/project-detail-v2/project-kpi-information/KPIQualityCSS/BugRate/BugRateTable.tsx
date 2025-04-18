import StatusItem from '@/components/common/StatusItem'
import InputRadioList from '@/components/inputs/InputRadioList'
import CommonTable from '@/components/table/CommonTable'
import { NS_PROJECT } from '@/const/lang.const'
import { PAGE_CURRENT_DEFAULT } from '@/const/table.const'
import { ACCUMULATED, SEPARATE } from '@/modules/project/const'
import { TableHeaderColumn } from '@/types'
import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { QualityRateItem, getQualityRateStatus } from './BugRate'

interface BugRateTableProps {
  valueType: string
  setValueType: Dispatch<SetStateAction<string>>
  loading: boolean
  dataBug: QualityRateItem[]
}

const BugRateTable = ({
  loading,
  valueType,
  setValueType,
  dataBug,
}: BugRateTableProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const [limit, setLimit] = useState(12)
  const [page, setPage] = useState(PAGE_CURRENT_DEFAULT)

  const columns: TableHeaderColumn[] = [
    {
      id: 'no',
      label: i18('LB_NO'),
    },
    {
      id: 'month',
      label: i18('LB_MONTH'),
    },
    {
      id: 'critialBug',
      label: i18Project('TXT_CRITICAL_BUG'),
      align: 'center',
    },
    {
      id: 'majorBug',
      label: i18Project('TXT_MAJOR_BUG'),
      align: 'center',
    },
    {
      id: 'minorBug',
      label: i18Project('TXT_MNOR_BUG'),
      align: 'center',
    },
    {
      id: 'totalWbug',
      label: i18Project('TXT_TOTAL_WBUG'),
      align: 'center',
    },
    {
      id: 'billableEffort',
      label: i18Project('TXT_BILLABLE_EFFORT'),
      align: 'center',
    },
    {
      id: 'bugRate',
      label: i18Project('TXT_BUG_RATE'),
      align: 'center',
    },
    {
      id: 'status',
      label: i18('LB_STATUS'),
    },
  ]

  const radioListOptions = [
    {
      id: ACCUMULATED,
      value: ACCUMULATED,
      label: i18Project('LB_ACCUMULATED'),
    },
    {
      id: SEPARATE,
      value: SEPARATE,
      label: i18Project('LB_SEPARATE'),
    },
  ]

  const rows = useMemo(() => {
    return dataBug
      .slice((page - 1) * limit, page * limit)
      .map((item, index) => ({
        id: (page - 1) * limit + index + 1,
        no: (page - 1) * limit + index + 1,
        month: item.month,
        critialBug: item.critical === null ? '--' : item.critical,
        majorBug: item.major === null ? '--' : item.major,
        minorBug: item.minor === null ? '--' : item.minor,
        totalWbug: item.totalW === null ? '--' : item.totalW,
        billableEffort: item.billableEffort,
        bugRate: item.bugRate === null ? '--' : item.bugRate,
        status: <StatusItem typeStatus={getQualityRateStatus(item.status)} />,
      }))
  }, [page, limit, dataBug])

  const onPageChange = (newPage: number) => {
    setPage(newPage)
  }

  const onPageSizeChange = (newPageSize: number) => {
    setLimit(newPageSize)
    setPage(1)
  }

  return (
    <Box className={classes.RootBugRateTable}>
      <InputRadioList
        disabed={loading}
        value={valueType}
        listOptions={radioListOptions}
        onChange={type => setValueType(type)}
      />
      <CommonTable
        rowsPerPageOptions={[12, 24, 48, 96]}
        loading={loading}
        columns={columns}
        rows={rows}
        pagination={{
          pageNum: page,
          pageSize: limit,
          totalElements: dataBug.length,
          onPageChange,
          onPageSizeChange,
        }}
      />
    </Box>
  )
}

const useStyles = makeStyles(() => ({
  RootBugRateTable: {
    '& table thead tr th:nth-child(3) > div': {
      width: '46px',
      textAlign: 'center',
    },
    '& table thead tr th:nth-child(4) > div': {
      width: '46px',
      textAlign: 'center',
    },
    '& table thead tr th:nth-child(5) > div': {
      width: '46px',
      textAlign: 'center',
    },
    '& table thead tr th:nth-child(6) > div': {
      width: '46px',
      textAlign: 'center',
    },
    '& table thead tr th:nth-child(7) > div': {
      width: '60px',
      textAlign: 'center',
    },
  },
}))

export default BugRateTable

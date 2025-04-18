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
import { QualityRateItem, getQualityRateStatus } from '../BugRate/BugRate'

interface LeakageRateTableProps {
  valueType: string
  setValueType: Dispatch<SetStateAction<string>>
  loading: boolean
  dataLeakage: QualityRateItem[]
}

const LeakageRateTable = ({
  loading,
  valueType,
  setValueType,
  dataLeakage,
}: LeakageRateTableProps) => {
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
      id: 'critialLeakage',
      label: i18Project('TXT_CRITICAL_LEAKAGE'),
      align: 'center',
    },
    {
      id: 'majorLeakage',
      label: i18Project('TXT_MAJOR_LEAKAGE'),
      align: 'center',
    },
    {
      id: 'minorLeakage',
      label: i18Project('TXT_MNOR_LEAKAGE'),
      align: 'center',
    },
    {
      id: 'totalWLeakage',
      label: i18Project('TXT_TOTAL_WLEAKAGE'),
      align: 'center',
    },
    {
      id: 'billableEffort',
      label: i18Project('TXT_BILLABLE_EFFORT'),
      align: 'center',
    },
    {
      id: 'leakageRate',
      label: i18Project('TXT_LEAKAGE_RATE'),
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
    return dataLeakage
      .slice((page - 1) * limit, page * limit)
      .map((item, index) => ({
        id: (page - 1) * limit + index + 1,
        no: (page - 1) * limit + index + 1,
        month: item.month,
        critialLeakage: item.critical === null ? '--' : item.critical,
        majorLeakage: item.major === null ? '--' : item.major,
        minorLeakage: item.minor === null ? '--' : item.minor,
        totalWLeakage: item.totalW === null ? '--' : item.totalW,
        billableEffort: item.billableEffort,
        leakageRate: item.bugRate === null ? '--' : item.bugRate,
        status: <StatusItem typeStatus={getQualityRateStatus(item.status)} />,
      }))
  }, [page, limit, dataLeakage])

  const onPageChange = (newPage: number) => {
    setPage(newPage)
  }

  const onPageSizeChange = (newPageSize: number) => {
    setLimit(newPageSize)
    setPage(1)
  }

  return (
    <Box className={classes.RootLeakageRateTable}>
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
          totalElements: dataLeakage.length,
          onPageChange,
          onPageSizeChange,
        }}
      />
    </Box>
  )
}

const useStyles = makeStyles(() => ({
  RootLeakageRateTable: {
    '& table thead tr th:nth-child(3) > div': {
      width: '50px',
      textAlign: 'center',
    },
    '& table thead tr th:nth-child(4) > div': {
      width: '50px',
      textAlign: 'center',
    },
    '& table thead tr th:nth-child(5) > div': {
      width: '50px',
      textAlign: 'center',
    },
    '& table thead tr th:nth-child(6) > div': {
      width: '50px',
      textAlign: 'center',
    },
    '& table thead tr th:nth-child(7) > div': {
      width: '60px',
      textAlign: 'center',
    },
  },
}))

export default LeakageRateTable

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
import { KpiCostApi, getCostStatus } from './KPICost'

interface KPICostTableProps {
  valueType: string
  setValueType: Dispatch<SetStateAction<string>>
  loading: boolean
  dataCost: KpiCostApi[]
}

const KPICostTable = ({
  valueType,
  setValueType,
  loading,
  dataCost,
}: KPICostTableProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const [limit, setLimit] = useState(12)
  const [page, setPage] = useState(PAGE_CURRENT_DEFAULT)

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
      id: 'billableEffort',
      label: `${i18Project('TXT_BILLABLE_EFFORT')} (MM)`,
      align: 'center',
    },
    {
      id: 'assignEffort',
      label: `${i18Project('TXT_ASSIGN_EFFORT')} (MM)`,
      align: 'center',
    },
    {
      id: 'actualEffort',
      label: `${i18Project('LB_ACTUAL_EFFORT')} (MM)`,
      align: 'center',
    },
    {
      id: 'eeForecast',
      label: i18Project('TXT_EE_FORECAST'),
      align: 'center',
    },
    {
      id: 'eeActual',
      label: i18Project('TXT_EE_ACTUAL'),
      align: 'center',
    },
    {
      id: 'gap',
      label: i18Project('TXT_GAP'),
    },
    {
      id: 'status',
      label: i18('LB_STATUS'),
    },
  ]

  const rows = useMemo(() => {
    return dataCost
      .slice((page - 1) * limit, page * limit)
      .map((item, index) => ({
        id: (page - 1) * limit + index + 1,
        no: (page - 1) * limit + index + 1,
        month: item.month,
        billableEffort: item.billableEffort,
        assignEffort: item.assignEffort,
        actualEffort: item.actualEffort,
        eeForecast: !item.assignEffort ? '--' : `${item.eeForecast}%`,
        eeActual: !item.actualEffort ? '--' : `${item.eeActual}%`,
        gap: item.gap ? `${item.gap}%` : '--',
        status: <StatusItem typeStatus={getCostStatus(item.status)} />,
      }))
  }, [dataCost, page, limit])

  const onPageChange = (newPage: number) => {
    setPage(newPage)
  }

  const onPageSizeChange = (newPageSize: number) => {
    setLimit(newPageSize)
    setPage(1)
  }

  return (
    <Box className={classes.RootKPICostTable}>
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
          totalElements: dataCost.length,
          onPageChange,
          onPageSizeChange,
        }}
      />
    </Box>
  )
}

const useStyles = makeStyles(() => ({
  RootKPICostTable: {
    '& table thead tr th:nth-child(3) > div': {
      width: '80px',
      textAlign: 'center',
    },
    '& table thead tr th:nth-child(4) > div': {
      width: '80px',
      textAlign: 'center',
    },
    '& table thead tr th:nth-child(5) > div': {
      width: '80px',
      textAlign: 'center',
    },
    '& table thead tr th:nth-child(6) > div': {
      width: '70px',
      textAlign: 'center',
    },
    '& table thead tr th:nth-child(7) > div': {
      width: '60px',
      textAlign: 'center',
    },
  },
}))

export default KPICostTable

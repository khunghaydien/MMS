import RangeMonthPicker from '@/components/Datepicker/RangeMonthPicker'
import CardForm from '@/components/Form/CardForm'
import InputRadioList from '@/components/inputs/InputRadioList'
import CommonTable from '@/components/table/CommonTable'
import { NS_PROJECT } from '@/const/lang.const'
import { LIMIT_DEFAULT, PAGE_CURRENT_DEFAULT } from '@/const/table.const'
import { ACCUMULATED, SEPARATE } from '@/modules/project/const'
import { setCustomerComplaintState } from '@/modules/project/reducer/project'
import { AppDispatch } from '@/store'
import { RangeDate, TableHeaderColumn } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import {
  EvaluationMonthItem,
  OverallEvaluationBonusAndPenaltyItem,
  getColorPoint,
} from './KPIBonusAndPenalty'

interface OverallEvaluationProps {
  valueType: string
  rangeMonth: RangeDate
  setValueType: Dispatch<SetStateAction<string>>
  setRangeMonth: Dispatch<SetStateAction<RangeDate>>
  loading: boolean
  dataRowsApi: OverallEvaluationBonusAndPenaltyItem[]
  setEvaluationMonth: Dispatch<
    SetStateAction<{
      id: number
      month: string
    }>
  >
  setEvaluationMonthData: Dispatch<SetStateAction<EvaluationMonthItem[]>>
}

const OverallEvaluation = ({
  valueType,
  rangeMonth,
  setValueType,
  setRangeMonth,
  loading,
  dataRowsApi,
  setEvaluationMonth,
  setEvaluationMonthData,
}: OverallEvaluationProps) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

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
      id: 'point',
      label: i18Project('TXT_POINTS'),
    },
  ]

  const [indexSelected, setIndexSelected] = useState(-1)

  const rows = useMemo(() => {
    return dataRowsApi.map((item, index) => ({
      index,
      idApi: item.id,
      id: index + 1,
      month: item.month,
      no: index + 1,
      point: (
        <Box sx={{ fontWeight: 700, color: getColorPoint(item.point) }}>
          {typeof item.point === 'number' ? item.point.toFixed(2) : 'N/A'}
        </Box>
      ),
      seeDetails: true,
      useIndex: true,
    }))
  }, [dataRowsApi])

  const onRangeMonthPickerChange = (payload: RangeDate) => {
    setRangeMonth(payload)
    setIndexSelected(-1)
    setEvaluationMonthData([])
    dispatch(
      setCustomerComplaintState({
        data: [],
        totalElements: 0,
        loading: false,
        queryParameters: {
          pageSize: LIMIT_DEFAULT,
          pageNum: PAGE_CURRENT_DEFAULT,
        },
      })
    )
  }

  const onRowClick = (row: any) => {
    setEvaluationMonth({
      id: row.idApi,
      month: row.month,
    })
    setIndexSelected(row.index)
    if (!row.idApi) {
      setEvaluationMonthData([])
      dispatch(
        setCustomerComplaintState({
          data: [],
          totalElements: 0,
          loading: false,
          queryParameters: {
            pageSize: LIMIT_DEFAULT,
            pageNum: PAGE_CURRENT_DEFAULT,
          },
        })
      )
    }
  }

  return (
    <CardForm title={i18Project('TXT_OVERALL_EVALUATION')}>
      <Box className={classes.body}>
        <RangeMonthPicker
          disabled={loading}
          title={{
            from: i18('LB_FROM'),
            to: i18('LB_TO_V2'),
          }}
          startDate={rangeMonth.startDate}
          endDate={rangeMonth.endDate}
          onChange={onRangeMonthPickerChange}
        />
        <InputRadioList
          disabed={loading}
          value={valueType}
          listOptions={radioListOptions}
          onChange={type => {
            setValueType(type)
            setIndexSelected(-1)
            setEvaluationMonthData([])
            dispatch(
              setCustomerComplaintState({
                data: [],
                totalElements: 0,
                loading: false,
                queryParameters: {
                  pageSize: LIMIT_DEFAULT,
                  pageNum: PAGE_CURRENT_DEFAULT,
                },
              })
            )
          }}
        />
        <CommonTable
          activeId={indexSelected}
          loading={loading}
          minWidth={300}
          rootClassName={classes.tableOut}
          columns={columns}
          rows={rows}
          onRowClick={onRowClick}
        />
      </Box>
    </CardForm>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  tableOut: {
    '& .head-cell-no': {
      width: '40px',
    },
    '& .head-cell-month': {
      width: '40px',
    },
  },
}))

export default OverallEvaluation

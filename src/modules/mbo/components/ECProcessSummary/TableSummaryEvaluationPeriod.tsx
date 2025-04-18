import CardForm from '@/components/Form/CardForm'
import CommonTable from '@/components/table/CommonTable'
import { NS_MBO } from '@/const/lang.const'
import { TableHeaderColumn } from '@/types'
import { formatDate } from '@/utils'
import { Box, TableCell, TableRow, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { EvaluationPeriodSummaryResponseRowItem } from '../../models'
import {
  EvaluationProcessState,
  evaluationProcessSelector,
} from '../../reducer/evaluation-process'

interface TableSummaryEvaluationPeriodProps {
  loading: boolean
}

const LastRow = () => {
  const classes = useStyles()
  const { t: i18Mbo } = useTranslation(NS_MBO)

  const { summary }: EvaluationProcessState = useSelector(
    evaluationProcessSelector
  )

  return (
    <TableRow>
      <TableCell colSpan={5}>
        <Box className={classes.averageScore}>{i18Mbo('LB_AVERAGE_SCORE')}</Box>
      </TableCell>
      <TableCell>
        <Box component="b">{summary.averageJobResult}</Box>
      </TableCell>
      <TableCell>
        <Box component="b">{summary.averageAttitude}</Box>
      </TableCell>
      <TableCell>
        <Box component="b">{summary.averageFinalScore}</Box>
      </TableCell>
    </TableRow>
  )
}

const TableSummaryEvaluationPeriod = ({
  loading,
}: TableSummaryEvaluationPeriodProps) => {
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(NS_MBO)

  const { summary }: EvaluationProcessState = useSelector(
    evaluationProcessSelector
  )

  const columns: TableHeaderColumn[] = [
    { id: 'no', label: i18('LB_NO') },
    { id: 'name', label: i18Mbo('LB_EVALUATION_NAME'), ellipsisNumber: 45 },
    { id: 'startDate', label: i18('LB_START_DATE') },
    { id: 'endDate', label: i18('LB_END_DATE') },
    { id: 'evaluateDate', label: i18Mbo('LB_EVALUATE_DATE') },
    { id: 'jobResult', label: i18Mbo('LB_JOB_RESULT') },
    { id: 'attitude', label: i18Mbo('LB_ATTITUDE') },
    {
      id: 'totalScore',
      label: i18Mbo('LB_TOTAL_SCORE'),
      tooltip: i18Mbo('MSG_TOTAL_SCORE') || undefined,
    },
  ]

  const evaluationPeriodsRendered = summary.evaluationPeriods.map(
    (item: EvaluationPeriodSummaryResponseRowItem, index: number) => ({
      id: item.id,
      no: index + 1,
      name: item.name,
      startDate: formatDate(item.startDate),
      endDate: formatDate(item.endDate),
      evaluateDate: formatDate(item.evaluateDate),
      jobResult: +item.jobResult,
      attitude: +item.attitude,
      totalScore: +item.totalScore,
    })
  )

  return (
    <CardForm title={i18Mbo('LB_EVALUATION_PERIOD')}>
      <CommonTable
        loading={loading}
        columns={columns}
        rows={evaluationPeriodsRendered}
        LastRow={<LastRow />}
      />
    </CardForm>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  averageScore: {
    fontWeight: 700,
    textAlign: 'center',
    fontSize: 16,
  },
}))

export default TableSummaryEvaluationPeriod

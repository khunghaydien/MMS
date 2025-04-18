import CardForm from '@/components/Form/CardForm'
import CommonTable from '@/components/table/CommonTable'
import { NS_MBO } from '@/const/lang.const'
import { TableHeaderColumn } from '@/types'
import { formatDate } from '@/utils'
import { Box, TableCell, TableRow, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { AchievementSummaryResponseRowItem } from '../../models'
import {
  EvaluationProcessState,
  evaluationProcessSelector,
} from '../../reducer/evaluation-process'

interface TableSummaryAchievementsProps {
  loading: boolean
}

const LastRow = () => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()

  const { summary }: EvaluationProcessState = useSelector(
    evaluationProcessSelector
  )

  return (
    <TableRow>
      <TableCell colSpan={5}>
        <Box className={classes.total}>{i18('LB_TOTAL')}</Box>
      </TableCell>
      <TableCell>
        <Box component="b">{summary.totalRate}%</Box>
      </TableCell>
      <TableCell>
        <Box component="b">{summary.totalAchievement}</Box>
      </TableCell>
    </TableRow>
  )
}

const TableSummaryAchievements = ({
  loading,
}: TableSummaryAchievementsProps) => {
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(NS_MBO)

  const { summary }: EvaluationProcessState = useSelector(
    evaluationProcessSelector
  )

  const columns: TableHeaderColumn[] = [
    { id: 'no', label: i18('LB_NO') },
    { id: 'name', label: i18Mbo('LB_ACHIEVEMENT_NAME') },
    { id: 'startDate', label: i18Mbo('LB_ACHIEVEMENT_START_DATE') },
    { id: 'endDate', label: i18Mbo('LB_ACHIEVEMENT_END_DATE') },
    { id: 'dayAdded', label: i18Mbo('LB_DAY_ADDED') },
    { id: 'rate', label: i18('LB_RATE') },
    {
      id: 'finalScore',
      label: i18Mbo('LB_FINAL_SCORE'),
      tooltip: i18Mbo('MSG_FINAL_SCORE') || undefined,
    },
  ]

  const evaluationPeriodsRendered = summary.achievements.map(
    (item: AchievementSummaryResponseRowItem, index: number) => ({
      id: item.id,
      no: index + 1,
      name: item.name,
      startDate: formatDate(item.startDate),
      endDate: formatDate(item.endDate),
      dayAdded: formatDate(item.dayAdded),
      rate: `${item.rate}%`,
      finalScore: +item.finalScore,
    })
  )

  return (
    <CardForm title={i18Mbo('LB_ACHIEVEMENT')}>
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
  total: {
    fontWeight: 700,
    textAlign: 'center',
    fontSize: 16,
  },
}))

export default TableSummaryAchievements

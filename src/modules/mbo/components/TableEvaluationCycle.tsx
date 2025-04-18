import StatusItem from '@/components/common/StatusItem'
import CommonTable from '@/components/table/CommonTable'
import { LangConstant } from '@/const'
import {
  MBO_EVALUATION_PROCESS_APPRAISEE_LIST_FORMAT,
  MBO_EVALUATION_PROCESS_DETAIL_FORMAT,
} from '@/const/path.const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { TableHeaderColumn, TablePaginationProps } from '@/types'
import { formatDate } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import i18next from 'i18next'
import QueryString from 'query-string'
import { ReactElement, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import StringFormat from 'string-format'
import { EVALUATION_CYCLE_STATUS, MY_TEAM_MEMBER_EVALUATION } from '../const'
import { EvaluationCycleItem } from '../models'
import { convertEvaluationCycleStatus } from '../pages/cycle-list/TableCycles'
import {
  EvaluationProcessState,
  evaluationProcessSelector,
} from '../reducer/evaluation-process'

const createDataRows = (row: EvaluationCycleItem, index: number) => {
  return {
    evaluationCycleStaffId: row.evaluationCycleStaffId,
    no: index + 1,
    id: row.id,
    name: <Box>{row.name}</Box>,
    duration: `${row.duration} ${i18next.t('common:LB_MONTHS')}`,
    startDate: formatDate(row?.startDate),
    endDate: formatDate(row?.endDate),
    originator: row.appraiser?.name || '',
    status: (
      <StatusItem
        typeStatus={{ ...convertEvaluationCycleStatus(row.status) }}
      />
    ),
  }
}

interface TableEvaluationCycleProps {
  title: string
  status: number
  tabMember: number
  HeaderAction?: ReactElement
  pagination?: TablePaginationProps
}

const TableEvaluationCycle = ({
  title,
  status,
  tabMember,
  HeaderAction,
  pagination,
}: TableEvaluationCycleProps) => {
  const navigate = useNavigate()
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)
  const { permissions }: AuthState = useSelector(selectAuth)

  const {
    evaluationCycleList,
    evaluationCycleListCompleted,
    isEvaluationCycleListFetching,
    isEvaluationCycleListCompletedFetching,
  }: EvaluationProcessState = useSelector(evaluationProcessSelector)

  const evaluationCycleHeadCells: TableHeaderColumn[] = [
    {
      id: 'no',
      align: 'left',
      label: i18('LB_NO'),
      isVisible: true,
    },
    {
      id: 'name',
      align: 'left',
      label: i18Mbo('LB_CYCLE_NAME'),
      isVisible: true,
    },
    {
      id: 'duration',
      align: 'left',
      label: i18('LB_DURATION'),
      isVisible: true,
    },
    {
      id: 'originator',
      align: 'left',
      label: i18Mbo('LB_ORIGINATOR'),
      isVisible: true,
    },
    {
      id: 'startDate',
      align: 'left',
      label: i18('LB_START_DATE'),
      isVisible: true,
    },
    {
      id: 'endDate',
      align: 'left',
      label: i18('LB_END_DATE'),
      isVisible: true,
    },
    {
      id: 'status',
      align: 'left',
      label: i18('LB_STATUS'),
      isVisible: true,
    },
  ]

  const evaluationCycleListRows = useMemo(() => {
    if (status === EVALUATION_CYCLE_STATUS.COMPLETED) {
      return evaluationCycleListCompleted.map(createDataRows)
    }
    const result: EvaluationCycleItem[] = []
    if (status === EVALUATION_CYCLE_STATUS.UP_COMING) {
      evaluationCycleList.forEach(evaluationCycleItem => {
        if (
          evaluationCycleItem.status?.id ===
            EVALUATION_CYCLE_STATUS.UP_COMING ||
          evaluationCycleItem.status?.id === EVALUATION_CYCLE_STATUS.NOT_START
        ) {
          result.push(evaluationCycleItem)
        }
      })
    } else {
      evaluationCycleList.forEach(evaluationCycleItem => {
        if (
          evaluationCycleItem.status?.id ===
            EVALUATION_CYCLE_STATUS.IN_PROGRESS ||
          evaluationCycleItem.status?.id === EVALUATION_CYCLE_STATUS.DELAYED
        ) {
          result.push(evaluationCycleItem)
        }
      })
    }
    return result.map(createDataRows)
  }, [evaluationCycleList, evaluationCycleListCompleted, status])

  const handleRedirectEvaluationCycleProcess = (cycle: any) => {
    if (
      tabMember === MY_TEAM_MEMBER_EVALUATION ||
      !!permissions.useMBOAllCycle
    ) {
      navigate({
        pathname: StringFormat(
          MBO_EVALUATION_PROCESS_APPRAISEE_LIST_FORMAT,
          cycle.id
        ),
        search: QueryString.stringify({
          tab: tabMember,
        }),
      })
    } else {
      navigate({
        pathname: StringFormat(MBO_EVALUATION_PROCESS_DETAIL_FORMAT, cycle.id),
        search: QueryString.stringify({
          tab: tabMember,
          evaluationCycleStaffId: cycle.evaluationCycleStaffId,
        }),
      })
    }
  }

  return (
    <Box className={classes.rootTableEvaluationCycle}>
      <Box
        className={clsx(
          classes.tableLabel,
          status === EVALUATION_CYCLE_STATUS.COMPLETED && classes.cardCompleted,
          status === EVALUATION_CYCLE_STATUS.UP_COMING && classes.cardUpComing,
          status === EVALUATION_CYCLE_STATUS.IN_PROGRESS &&
            classes.cardInProgress
        )}
      >
        {title}
      </Box>
      {HeaderAction}
      <CommonTable
        loading={
          status === EVALUATION_CYCLE_STATUS.COMPLETED
            ? isEvaluationCycleListCompletedFetching
            : isEvaluationCycleListFetching
        }
        columns={evaluationCycleHeadCells.filter(header => header.isVisible)}
        rows={evaluationCycleListRows}
        pagination={pagination}
        onRowClick={handleRedirectEvaluationCycleProcess}
      />
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootTableEvaluationCycle: {},
  tableLabel: {
    fontWeight: 700,
    fontSize: 16,
    margin: theme.spacing(0, 0, 2, 0),
  },
  cardInProgress: {
    color: theme.color.blue.primary,
  },
  cardUpComing: {
    color: theme.color.orange.primary,
  },
  cardCompleted: {
    color: theme.color.green.primary,
  },
}))
export default TableEvaluationCycle

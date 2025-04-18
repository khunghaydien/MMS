import ProgressColumn from '@/components/common/ProgressColumn'
import StatusItem from '@/components/common/StatusItem'
import CommonTable from '@/components/table/CommonTable'
import { LangConstant, PathConstant } from '@/const'
import { IProject } from '@/modules/customer/types'
import { TableHeaderColumn, TablePaginationProps } from '@/types'
import { formatDate } from '@/utils'
import i18next from 'i18next'
import QueryString from 'query-string'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import StringFormat from 'string-format'
import {
  APPROVED,
  EVALUATION_CYCLE_STATUS,
  MY_PROJECT_MEMBER_EVALUATION,
} from '../const'
import { EvaluationCycleProjectMember } from '../models'
import {
  EvaluationProcessState,
  evaluationProcessSelector,
} from '../reducer/evaluation-process'

const createDataRows = (row: EvaluationCycleProjectMember, index: number) => {
  return {
    ...row,
    id: row.evaluationCycleStaffId + index.toString(),
    code: row.staff.code,
    appraiseeName: row.staff.name,
    position: row.staff.position.name,
    project: row.project?.map((prj: IProject) => prj.name)?.join(', ') || '',
    startDate: formatDate(row.evaluationCycle?.startDate),
    endDate: formatDate(row.evaluationCycle?.endDate),
    status: (
      <StatusItem
        typeStatus={{
          ...{
            label:
              row.status.id === APPROVED
                ? i18next.t('mbo:LB_APPROVED')
                : i18next.t('mbo:LB_NOT_APPROVED'),
            color: row.status.id === APPROVED ? 'green' : 'orange',
          },
        }}
      />
    ),
    progress: row.progresses.length ? (
      <ProgressColumn progresses={row.progresses} />
    ) : (
      ''
    ),
  }
}

interface TableEvaluationCycleProjectMemberProps {
  status: number
  pagination?: TablePaginationProps
}

const TableEvaluationCycleProjectMember = ({
  status,
  pagination,
}: TableEvaluationCycleProjectMemberProps) => {
  const navigate = useNavigate()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)

  const {
    evaluationCycleListProjectMember,
    isEvaluationCycleListFetching,
    evaluationCycleListProjectMemberCompleted,
    isEvaluationCycleListCompletedFetching,
  }: EvaluationProcessState = useSelector(evaluationProcessSelector)

  const evaluationCycleHeadCells: TableHeaderColumn[] = [
    {
      id: 'code',
      align: 'left',
      label: i18('LB_CODE'),
    },
    {
      id: 'appraiseeName',
      align: 'left',
      label: i18Mbo('LB_APPRAISEE_NAME'),
    },
    {
      id: 'position',
      align: 'left',
      label: i18('LB_POSITION'),
    },
    {
      id: 'project',
      align: 'left',
      label: i18('LB_PROJECT'),
    },
    {
      id: 'startDate',
      align: 'left',
      label: i18('LB_START_DATE'),
    },
    {
      id: 'endDate',
      align: 'left',
      label: i18('LB_END_DATE'),
    },
    {
      id: 'status',
      align: 'left',
      label: i18('LB_STATUS'),
    },
    {
      id: 'progress',
      label: i18next.t('common:LB_PROGRESS'),
      align: 'center',
    },
  ]

  const evaluationCycleListProjectMemberRows = useMemo(() => {
    if (status === EVALUATION_CYCLE_STATUS.COMPLETED) {
      return evaluationCycleListProjectMemberCompleted.map(createDataRows)
    }
    if (status === EVALUATION_CYCLE_STATUS.IN_PROGRESS) {
      return evaluationCycleListProjectMember.map(createDataRows)
    }
  }, [
    evaluationCycleListProjectMember,
    evaluationCycleListProjectMemberCompleted,
    status,
  ])

  const handleRedirectEvaluationCycleProcess = (
    row: EvaluationCycleProjectMember
  ) => {
    navigate({
      pathname: StringFormat(
        PathConstant.MBO_EVALUATION_PROCESS_DETAIL_FORMAT,
        !!row.evaluationCycle ? row.evaluationCycle.id?.toString() || '' : '*'
      ),
      search: QueryString.stringify({
        evaluationCycleStaffId: row.evaluationCycleStaffId,
        tab: MY_PROJECT_MEMBER_EVALUATION,
      }),
    })
  }

  return (
    <CommonTable
      loading={
        status === EVALUATION_CYCLE_STATUS.IN_PROGRESS
          ? isEvaluationCycleListFetching
          : isEvaluationCycleListCompletedFetching
      }
      columns={evaluationCycleHeadCells}
      rows={evaluationCycleListProjectMemberRows}
      pagination={pagination}
      onRowClick={handleRedirectEvaluationCycleProcess}
    />
  )
}

export default TableEvaluationCycleProjectMember

import CardForm from '@/components/Form/CardForm'
import CardAvatar from '@/components/common/CardAvatar'
import ProgressColumn from '@/components/common/ProgressColumn'
import StatusItem from '@/components/common/StatusItem'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputSearch from '@/components/inputs/InputSearch'
import CommonTable from '@/components/table/CommonTable'
import { LangConstant, TableConstant } from '@/const'
import { INPUT_TIME_DELAY } from '@/const/app.const'
import { MBO_EVALUATION_PROCESS_DETAIL_FORMAT } from '@/const/path.const'
import { useQuery } from '@/hooks/useQuery'
import { AppDispatch } from '@/store'
import { OptionItem, TableHeaderColumn } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import i18next from 'i18next'
import _ from 'lodash'
import QueryString from 'query-string'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import StringFormat from 'string-format'
import { APPRAISEE_LIST, APPROVED, NOT_APPROVED } from '../const'
import { AppraiseeItem } from '../models'
import {
  EvaluationProcessState,
  evaluationProcessSelector,
  setQueryEvaluationAppraisees,
} from '../reducer/evaluation-process'

const headCellAppraisees: TableHeaderColumn[] = [
  {
    id: 'code',
    align: 'left',
    label: i18next.t('common:LB_STAFF_CODE'),
  },
  {
    id: 'name',
    align: 'left',
    label: i18next.t('common:LB_STAFF_NAME'),
  },
  {
    id: 'email',
    align: 'left',
    label: i18next.t('common:LB_EMAIL'),
  },
  {
    id: 'status',
    align: 'left',
    label: i18next.t('common:LB_STATUS'),
  },
  {
    id: 'score',
    align: 'left',
    label: i18next.t('common:LB_SCORE'),
  },
  {
    id: 'progress',
    label: i18next.t('common:LB_PROGRESS'),
    align: 'center',
  },
]

const createAppraiseeList = (item: any) => {
  return {
    id: item.evaluationCycleStaffId,
    code: item.staff.code,
    name: (
      <CardAvatar
        info={{
          name: item.staff.name,
          position: item.staff.position?.name || '',
        }}
      />
    ),
    email: item.staff.email,
    status: (
      <StatusItem
        typeStatus={{
          ...{
            label:
              item.status.id === APPROVED
                ? i18next.t('mbo:LB_APPROVED')
                : i18next.t('mbo:LB_NOT_APPROVED'),
            color: item.status.id === APPROVED ? 'green' : 'orange',
          },
        }}
      />
    ),
    score: item.score ?? '_',
    progress: item.progresses.length ? (
      <ProgressColumn progresses={item.progresses} />
    ) : (
      ''
    ),
  }
}

export interface ECAppraiseeListProps {
  isLoading?: boolean
  appraiseeList: AppraiseeItem[]
  totalElements: number
}

const ECAppraiseeList = ({
  isLoading = false,
  appraiseeList = [],
  totalElements = 0,
}: ECAppraiseeListProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const classes = useStyles()
  const navigate = useNavigate()
  const params = useParams()
  const queryParams = useQuery()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)
  const { queryEvaluationAppraisees }: EvaluationProcessState = useSelector(
    evaluationProcessSelector
  )

  const statusListOptions: OptionItem[] = [
    {
      id: APPROVED,
      value: APPROVED,
      label: i18Mbo('LB_APPROVED') || '',
    },
    {
      id: NOT_APPROVED,
      value: NOT_APPROVED,
      label: i18Mbo('LB_NOT_APPROVED') || '',
    },
  ]

  const [valueSearch, setValueSearch] = useState('')

  const debounceFn = useCallback(
    _.debounce(handleDebounceFn, INPUT_TIME_DELAY),
    [queryEvaluationAppraisees.name, queryEvaluationAppraisees.status]
  )
  function handleDebounceFn(keyword: string) {
    const newQueryParameters = {
      ...queryEvaluationAppraisees,
      name: keyword,
      pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
    }
    dispatch(setQueryEvaluationAppraisees(newQueryParameters))
  }
  const handleSearchChange = (newValueSearch: string) => {
    setValueSearch(newValueSearch)
    debounceFn(newValueSearch.trim())
  }

  const handleStatusChange = (newValue: string) => {
    dispatch(
      setQueryEvaluationAppraisees({
        ...queryEvaluationAppraisees,
        status: newValue,
      })
    )
  }

  const handlePageChange = (newPage: number) => {
    dispatch(
      setQueryEvaluationAppraisees({
        ...queryEvaluationAppraisees,
        pageNum: newPage,
      })
    )
  }

  const handlePageSizeChange = (newPageSize: number) => {
    dispatch(
      setQueryEvaluationAppraisees({
        ...queryEvaluationAppraisees,
        pageNum: 1,
        pageSize: newPageSize,
      })
    )
  }

  const handleRedirectToEvaluationProcessDetail = (staff: any) => {
    navigate({
      pathname: StringFormat(
        MBO_EVALUATION_PROCESS_DETAIL_FORMAT,
        params.evaluationCycleId || ''
      ),
      search: QueryString.stringify({
        evaluationCycleStaffId: staff.id,
        tab: queryParams.get('tab'),
        history: APPRAISEE_LIST,
      }),
    })
  }

  return (
    <CardForm title={i18Mbo('TXT_APPRAISEE_LIST')}>
      <Box className={classes.headerActions}>
        <InputSearch
          value={valueSearch}
          placeholder={i18('LB_STAFF_NAME')}
          onChange={handleSearchChange}
        />
        <InputDropdown
          width={180}
          label={i18('LB_STATUS')}
          placeholder={i18('PLH_SELECT_STATUS')}
          value={queryEvaluationAppraisees.status}
          listOptions={statusListOptions}
          onChange={handleStatusChange}
        />
      </Box>
      <CommonTable
        loading={isLoading}
        columns={headCellAppraisees}
        rows={appraiseeList.map(createAppraiseeList)}
        onRowClick={handleRedirectToEvaluationProcessDetail}
        pagination={{
          totalElements,
          pageSize: queryEvaluationAppraisees.pageSize,
          pageNum: queryEvaluationAppraisees.pageNum,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange,
        }}
      />
    </CardForm>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  headerActions: {
    display: 'flex',
    gap: theme.spacing(3),
    alignItems: 'flex-end',
    marginBottom: theme.spacing(3),
  },
  wrapLoading: {
    height: '300px',
  },
}))

export default ECAppraiseeList

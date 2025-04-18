import InputSearch from '@/components/inputs/InputSearch'
import { LangConstant, TableConstant } from '@/const'
import { INPUT_TIME_DELAY } from '@/const/app.const'
import { AppDispatch } from '@/store'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import _ from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import TableEvaluationCycleProjectMember from '../../components/TableEvaluationCycleProjectMember'
import { EVALUATION_CYCLE_STATUS } from '../../const'
import {
  EvaluationProcessState,
  evaluationProcessSelector,
  setECListQueryParametersForProjectMemberCompleted,
  setECListQueryParametersForProjectMemberInProgress,
} from '../../reducer/evaluation-process'

interface IEvaluationCycleProjectMember {
  status: number
}

const EvaluationCycleProjectMember = ({
  status,
}: IEvaluationCycleProjectMember) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)
  const {
    ecListQueryParametersForProjectMemberCompleted,
    ecListQueryParametersForProjectMemberInProgress,
    ecListTotalElementsForProjectMemberCompleted,
    ecListTotalElementsForProjectMemberInProgress,
  }: EvaluationProcessState = useSelector(evaluationProcessSelector)
  const dispatch = useDispatch<AppDispatch>()

  const [valueSearch, setValueSearch] = useState('')

  const handleDebounceFn = (searchName: string) => {
    const queryParameters = {
      name: searchName,
      pageSize: TableConstant.LIMIT_DEFAULT,
      pageNum: 1,
    }
    status === EVALUATION_CYCLE_STATUS.IN_PROGRESS
      ? dispatch(
          setECListQueryParametersForProjectMemberInProgress({
            ...ecListQueryParametersForProjectMemberInProgress,
            ...queryParameters,
          })
        )
      : dispatch(
          setECListQueryParametersForProjectMemberCompleted({
            ...ecListQueryParametersForProjectMemberCompleted,
            ...queryParameters,
          })
        )
  }

  const debounceFn = useCallback(
    _.debounce(handleDebounceFn, INPUT_TIME_DELAY),
    [ecListQueryParametersForProjectMemberInProgress]
  )

  const handleSearchChange = (newValueSearch: string) => {
    setValueSearch(newValueSearch)
    debounceFn(newValueSearch.trim())
  }

  const handlePageChange = (newPage: number) => {
    const queryParameters = {
      pageNum: newPage,
    }
    status === EVALUATION_CYCLE_STATUS.IN_PROGRESS
      ? dispatch(
          setECListQueryParametersForProjectMemberInProgress({
            ...ecListQueryParametersForProjectMemberInProgress,
            ...queryParameters,
          })
        )
      : dispatch(
          setECListQueryParametersForProjectMemberCompleted({
            ...ecListQueryParametersForProjectMemberCompleted,
            ...queryParameters,
          })
        )
  }

  const handlePageSizeChange = (newPageSize: number) => {
    const queryParameters = {
      pageSize: newPageSize,
      pageNum: 1,
    }
    status === EVALUATION_CYCLE_STATUS.IN_PROGRESS
      ? dispatch(
          setECListQueryParametersForProjectMemberInProgress({
            ...ecListQueryParametersForProjectMemberInProgress,
            ...queryParameters,
          })
        )
      : dispatch(
          setECListQueryParametersForProjectMemberCompleted({
            ...ecListQueryParametersForProjectMemberCompleted,
            ...queryParameters,
          })
        )
  }

  const pagination = useMemo(() => {
    if (status === EVALUATION_CYCLE_STATUS.IN_PROGRESS) {
      return {
        pageSize: ecListQueryParametersForProjectMemberInProgress.pageSize,
        pageNum: ecListQueryParametersForProjectMemberInProgress.pageNum,
        totalElements: ecListTotalElementsForProjectMemberInProgress,
      }
    } else {
      return {
        pageSize: ecListQueryParametersForProjectMemberCompleted.pageSize,
        pageNum: ecListQueryParametersForProjectMemberCompleted.pageNum,
        totalElements: ecListTotalElementsForProjectMemberCompleted,
      }
    }
  }, [
    ecListQueryParametersForProjectMemberInProgress,
    ecListTotalElementsForProjectMemberInProgress,
    ecListQueryParametersForProjectMemberCompleted,
    ecListTotalElementsForProjectMemberInProgress,
  ])

  useEffect(() => {
    status === EVALUATION_CYCLE_STATUS.IN_PROGRESS
      ? setValueSearch(
          ecListQueryParametersForProjectMemberInProgress.name || ''
        )
      : setValueSearch(
          ecListQueryParametersForProjectMemberCompleted.name || ''
        )
  }, [])

  return (
    <Box>
      <Box className={classes.tabContainer}>
        <Box
          className={clsx(
            classes.tableLabel,
            status === EVALUATION_CYCLE_STATUS.IN_PROGRESS
              ? classes.cardInProgress
              : classes.cardCompleted
          )}
        >
          {status === EVALUATION_CYCLE_STATUS.IN_PROGRESS
            ? i18Mbo('LB_INPROGRESS')
            : i18Mbo('LB_COMPLETED')}
        </Box>
        <Box className={classes.headerActions}>
          <InputSearch
            placeholder={i18Mbo('LB_APPRAISEE_NAME')}
            label={i18('LB_SEARCH')}
            value={valueSearch}
            onChange={handleSearchChange}
          />
        </Box>
        <TableEvaluationCycleProjectMember
          status={status}
          pagination={{
            totalElements: pagination.totalElements,
            pageSize: pagination.pageSize as number,
            pageNum: pagination.pageNum as number,
            onPageChange: handlePageChange,
            onPageSizeChange: handlePageSizeChange,
          }}
        />
      </Box>
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  tabContainer: {},
  completedTab: {},
  cardCompleted: {
    color: theme.color.green.primary,
  },
  cardInProgress: {
    color: theme.color.blue.primary,
  },
  tableLabel: {
    fontWeight: 700,
    fontSize: 16,
    margin: theme.spacing(0, 0, 2, 0),
  },
  headerActions: {
    marginBottom: theme.spacing(3),
    display: 'flex',
    gap: theme.spacing(3),
    alignItems: 'flex-end',
  },
}))
export default EvaluationCycleProjectMember

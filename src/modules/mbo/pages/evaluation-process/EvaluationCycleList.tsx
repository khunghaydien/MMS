import CardForm from '@/components/Form/CardForm'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputSearch from '@/components/inputs/InputSearch'
import { LangConstant, TableConstant } from '@/const'
import { INPUT_TIME_DELAY } from '@/const/app.const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { AppDispatch } from '@/store'
import { OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import _ from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import TableEvaluationCycle from '../../components/TableEvaluationCycle'
import {
  EVALUATION_CYCLE_STATUS,
  MY_EVALUATION,
  MY_PROJECT_MEMBER_EVALUATION,
  MY_TEAM_MEMBER_EVALUATION,
} from '../../const'
import { ECListQueryParameters } from '../../models'
import {
  EvaluationProcessState,
  evaluationProcessSelector,
  getCompletedEvaluationCycle,
  getCompletedEvaluationCycleForTeamMemberView,
  getCompletedProjectMember,
  getDurations,
  getInProgressProjectMember,
  getPresentAndFutureEvaluationCycle,
  getPresentAndFutureEvaluationCycleForTeamMemberView,
  setECListQueryParameters,
  setECListQueryParametersForTeamMember,
} from '../../reducer/evaluation-process'
import EvaluationCycleProjectMember from './EvaluationCycleProjectMember'

interface EvaluationCycleListProps {
  tabMember: number
}

const EvaluationCycleList = ({ tabMember }: EvaluationCycleListProps) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)

  const { permissions }: AuthState = useSelector(selectAuth)
  const {
    ecListQueryParameters,
    ecListTotalElements,
    ecListQueryParametersForTeamMember,
    ecListQueryParametersForProjectMemberInProgress,
    ecListTotalElementsForTeamMember,
    ecListTotalElementsForProjectMemberInProgress,
    ecListTotalElementsForProjectMemberCompleted,
    ecListQueryParametersForProjectMemberCompleted,
  }: EvaluationProcessState = useSelector(evaluationProcessSelector)

  const [valueSearch, setValueSearch] = useState(
    ecListQueryParameters.name || ''
  )
  const [valueSearchTeamMember, setValueSearchTeamMember] = useState(
    ecListQueryParametersForTeamMember.name || ''
  )

  const [
    valueSearchProjectMemberCompleted,
    setValueSearchProjectMemberCompleted,
  ] = useState(ecListQueryParametersForProjectMemberCompleted.name || '')
  const [listDurations, setListDurations] = useState<OptionItem[]>([])

  const valueSearchView = useMemo(() => {
    if (tabMember === MY_EVALUATION) {
      return valueSearch
    } else if (tabMember === MY_TEAM_MEMBER_EVALUATION) {
      return valueSearchTeamMember
    } else {
      return valueSearchProjectMemberCompleted
    }
  }, [
    tabMember,
    valueSearch,
    valueSearchTeamMember,
    valueSearchProjectMemberCompleted,
  ])

  const pagination = useMemo(() => {
    if (tabMember === MY_EVALUATION) {
      return {
        pageSize: ecListQueryParameters.pageSize,
        pageNum: ecListQueryParameters.pageNum,
        totalElements: ecListTotalElements,
      }
    } else if (tabMember === MY_TEAM_MEMBER_EVALUATION) {
      return {
        pageSize: ecListQueryParametersForTeamMember.pageSize,
        pageNum: ecListQueryParametersForTeamMember.pageNum,
        totalElements: ecListTotalElementsForTeamMember,
      }
    } else {
      return {
        pageSize: ecListQueryParametersForProjectMemberCompleted.pageSize,
        pageNum: ecListQueryParametersForProjectMemberCompleted.pageNum,
        totalElements: ecListTotalElementsForProjectMemberCompleted,
      }
    }
  }, [
    tabMember,
    ecListQueryParameters,
    ecListQueryParametersForTeamMember,
    ecListQueryParametersForProjectMemberInProgress,
    ecListQueryParametersForProjectMemberCompleted,
    ecListTotalElements,
    ecListTotalElementsForTeamMember,
    ecListTotalElementsForProjectMemberInProgress,
    ecListTotalElementsForProjectMemberCompleted,
  ])

  const handlePageChange = (newPage: number) => {
    setQueryParameters({
      pageNum: newPage,
    })
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setQueryParameters({
      pageSize: newPageSize,
      pageNum: 1,
    })
  }

  const debounceFn = useCallback(
    _.debounce(handleDebounceFn, INPUT_TIME_DELAY),
    [
      tabMember,
      ecListQueryParameters,
      ecListQueryParametersForTeamMember,
      ecListQueryParametersForProjectMemberInProgress,
      ecListQueryParametersForProjectMemberCompleted,
    ]
  )

  function handleDebounceFn(name: string) {
    setQueryParameters({
      name,
      pageSize: TableConstant.LIMIT_DEFAULT,
      pageNum: 1,
    })
  }

  const handleSearchChange = (newValueSearch: string) => {
    if (tabMember === MY_EVALUATION) {
      setValueSearch(newValueSearch)
    } else if (tabMember === MY_TEAM_MEMBER_EVALUATION) {
      setValueSearchTeamMember(newValueSearch)
    } else {
      setValueSearchProjectMemberCompleted(newValueSearch)
    }
    debounceFn(newValueSearch.trim())
  }

  const handleDurationChange = (value: string) => {
    setQueryParameters({
      pageSize: TableConstant.LIMIT_DEFAULT,
      pageNum: 1,
      duration: +value || null,
    })
  }

  const callPresentAndFutureWithTab = () => {
    if (tabMember === MY_EVALUATION) {
      dispatch(getPresentAndFutureEvaluationCycle())
    } else if (tabMember === MY_TEAM_MEMBER_EVALUATION) {
      dispatch(getPresentAndFutureEvaluationCycleForTeamMemberView())
    } else {
      dispatch(
        getInProgressProjectMember(
          ecListQueryParametersForProjectMemberInProgress
        )
      )
    }
  }

  const callCompletedWithTab = () => {
    if (tabMember === MY_EVALUATION) {
      dispatch(getCompletedEvaluationCycle(ecListQueryParameters))
    } else if (tabMember === MY_TEAM_MEMBER_EVALUATION) {
      dispatch(
        getCompletedEvaluationCycleForTeamMemberView(
          ecListQueryParametersForTeamMember
        )
      )
    } else {
      dispatch(
        getCompletedProjectMember(
          ecListQueryParametersForProjectMemberCompleted
        )
      )
    }
  }

  const setQueryParameters = (queryParameters: ECListQueryParameters) => {
    if (tabMember === MY_EVALUATION) {
      dispatch(
        setECListQueryParameters({
          ...ecListQueryParameters,
          ...queryParameters,
        })
      )
    } else if (tabMember === MY_TEAM_MEMBER_EVALUATION) {
      dispatch(
        setECListQueryParametersForTeamMember({
          ...ecListQueryParametersForTeamMember,
          ...queryParameters,
        })
      )
    }
  }

  const setDurations = (data: number[]) => {
    setListDurations(
      data.map((item: number) => ({
        id: item.toString(),
        label: `${item} ${i18('LB_MONTHS')}`,
        value: item.toString(),
      }))
    )
  }

  useEffect(() => {
    callPresentAndFutureWithTab()
  }, [tabMember, ecListQueryParametersForProjectMemberInProgress])

  useEffect(() => {
    callCompletedWithTab()
  }, [
    tabMember,
    ecListQueryParameters,
    ecListQueryParametersForTeamMember,
    ecListQueryParametersForProjectMemberCompleted,
  ])

  useEffect(() => {
    if (tabMember !== MY_PROJECT_MEMBER_EVALUATION) {
      dispatch(getDurations(tabMember))
        .unwrap()
        .then(res => {
          setDurations(res.data)
        })
    }
  }, [tabMember])

  return (
    <Box className={classes.rootEvaluationCycleList}>
      <CardForm
        title={
          tabMember === MY_PROJECT_MEMBER_EVALUATION
            ? i18Mbo('TXT_APPRAISEE_LIST')
            : i18Mbo('TXT_EVALUATION_CYCLE_LIST')
        }
      >
        {tabMember === MY_PROJECT_MEMBER_EVALUATION ? (
          <Box className={classes.tabWarper}>
            <EvaluationCycleProjectMember
              status={EVALUATION_CYCLE_STATUS.IN_PROGRESS}
            />
            <EvaluationCycleProjectMember
              status={EVALUATION_CYCLE_STATUS.COMPLETED}
            />
          </Box>
        ) : (
          <Box className={classes.tabWarper}>
            <Box className={classes.tableContainer}>
              <TableEvaluationCycle
                title={i18Mbo('LB_INPROGRESS')}
                status={EVALUATION_CYCLE_STATUS.IN_PROGRESS}
                tabMember={tabMember}
              />
              <TableEvaluationCycle
                title={i18Mbo('LB_UP_COMING')}
                status={EVALUATION_CYCLE_STATUS.UP_COMING}
                tabMember={tabMember}
              />
              <TableEvaluationCycle
                HeaderAction={
                  <Box className={classes.headerActions}>
                    <InputSearch
                      placeholder={i18Mbo('LB_CYCLE_NAME')}
                      label={i18('LB_SEARCH')}
                      value={valueSearchView}
                      onChange={handleSearchChange}
                    />
                    <InputDropdown
                      width={180}
                      label={i18('LB_DURATION')}
                      placeholder={i18('PLH_SELECT_DURATION')}
                      value={ecListQueryParameters.duration?.toString() || ''}
                      listOptions={listDurations}
                      onChange={handleDurationChange}
                    />
                  </Box>
                }
                title={i18Mbo('LB_COMPLETED')}
                status={EVALUATION_CYCLE_STATUS.COMPLETED}
                tabMember={tabMember}
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
        )}
      </CardForm>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootEvaluationCycleList: {},
  tabWarper: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  tableContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  headerActions: {
    marginBottom: theme.spacing(3),
    display: 'flex',
    gap: theme.spacing(3),
    alignItems: 'flex-end',
  },
}))

export default EvaluationCycleList

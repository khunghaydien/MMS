import CardForm from '@/components/Form/CardForm'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputSearch from '@/components/inputs/InputSearch'
import { LangConstant, TableConstant } from '@/const'
import { INPUT_TIME_DELAY } from '@/const/app.const'
import { AppDispatch } from '@/store'
import { OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import _ from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import TableEvaluationCycle from '../../components/TableEvaluationCycle'
import { EVALUATION_CYCLE_STATUS } from '../../const'
import {
  EvaluationProcessState,
  evaluationProcessSelector,
  getCompletedEvaluationCycleForReviewer,
  getDurationForReviewer,
  getPresentAndFutureEvaluationCycleForReviewer,
  setECListQueryParameters,
} from '../../reducer/evaluation-process'
const EvaluationCycleReviewerList = ({ tabMember }: { tabMember: number }) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)

  const {
    ecListQueryParameters,
    ecListTotalElements,
    ecListQueryParametersForTeamMember,
    ecListTotalElementsForTeamMember,
  }: EvaluationProcessState = useSelector(evaluationProcessSelector)

  const [listDurations, setListDurations] = useState<OptionItem[]>([])
  const [valueSearch, setValueSearch] = useState<string>(
    ecListQueryParameters.name || ''
  )

  const pagination = useMemo(() => {
    return {
      pageSize: ecListQueryParameters.pageSize,
      pageNum: ecListQueryParameters.pageNum,
      totalElements: ecListTotalElements,
    }
  }, [
    tabMember,
    ecListQueryParameters,
    ecListTotalElements,
    ecListQueryParametersForTeamMember,
    ecListTotalElementsForTeamMember,
  ])

  function handleDebounceFn(name: string) {
    dispatch(
      setECListQueryParameters({
        name,
        pageSize: TableConstant.LIMIT_DEFAULT,
        pageNum: 1,
      })
    )
  }

  const debounceFn = useCallback(
    _.debounce(handleDebounceFn, INPUT_TIME_DELAY),
    [tabMember, ecListQueryParameters]
  )

  const handleSearchChange = (newValueSearch: string) => {
    if (!/[!@#$%^&*{}?<>:]/.test(newValueSearch)) {
      setValueSearch(newValueSearch)
      debounceFn(newValueSearch.trim())
    }
  }

  const handlePageChange = (newPage: number) => {
    dispatch(
      setECListQueryParameters({
        ...ecListQueryParameters,
        pageNum: newPage,
      })
    )
  }

  const handlePageSizeChange = (newPageSize: number) => {
    dispatch(
      setECListQueryParameters({
        ...ecListQueryParameters,
        pageSize: newPageSize,
      })
    )
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

  const handleDurationChange = (value: string) => {
    dispatch(
      setECListQueryParameters({
        pageSize: TableConstant.LIMIT_DEFAULT,
        pageNum: 1,
        duration: +value || null,
      })
    )
  }

  const callCompletedWithTab = () => {
    dispatch(
      getCompletedEvaluationCycleForReviewer({
        ...ecListQueryParameters,
        tab: tabMember,
      })
    )
  }

  const callPresentAndFuture = () => {
    dispatch(getPresentAndFutureEvaluationCycleForReviewer(tabMember))
  }

  const callDuration = () => {
    dispatch(getDurationForReviewer(tabMember))
      .unwrap()
      .then(res => {
        setDurations(res.data)
      })
  }

  useEffect(() => {
    callPresentAndFuture()
  }, [tabMember])

  useEffect(() => {
    callCompletedWithTab()
  }, [tabMember, ecListQueryParameters])

  useEffect(() => {
    callDuration()
  }, [tabMember])

  return (
    <Box className={classes.rootEvaluationCycleReviewerList}>
      <CardForm title={i18Mbo('TXT_EVALUATION_CYCLE_LIST')}>
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
                  value={valueSearch}
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
      </CardForm>
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootEvaluationCycleReviewerList: {},
  tabWarper: {
    display: 'flex',
    flexDirection: 'column',
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
export default EvaluationCycleReviewerList

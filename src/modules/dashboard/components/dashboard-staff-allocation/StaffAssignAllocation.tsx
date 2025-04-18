import CommonButton from '@/components/buttons/CommonButton'
import CardFormToggleBody from '@/components/Form/CardFormToggleBody'
import InputSearch from '@/components/inputs/InputSearch'
import { FAKE_LOADING_TIME_DELAY, INPUT_TIME_DELAY } from '@/const/app.const'
import { NS_DASHBOARD, NS_STAFF } from '@/const/lang.const'
import { LIMIT_DEFAULT, PAGE_CURRENT_DEFAULT } from '@/const/table.const'
import {
  dashboardSelector,
  getStaffAssignAllocation,
  setStaffAllocationQueries,
} from '@/modules/dashboard/reducer/dashboard'
import { updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { Cached } from '@mui/icons-material'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import _ from 'lodash'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import StaffAssignAllocationTable from './StaffAssignAllocationTable'

const StaffAssignAllocation = () => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Dashboard } = useTranslation(NS_DASHBOARD)
  const { t: i18Staff } = useTranslation(NS_STAFF)

  const { staffAllocationQueries } = useSelector(dashboardSelector)

  const [valueSearch, setValueSearch] = useState('')
  const [useViewSummary, setUseViewSummary] = useState(true)

  const debounceFn = useCallback(
    _.debounce(handleDebounceFn, INPUT_TIME_DELAY),
    [staffAllocationQueries]
  )

  function handleDebounceFn(keyword: string) {
    const queries = {
      ...staffAllocationQueries,
      keyword,
      pageSize: LIMIT_DEFAULT,
      pageNum: PAGE_CURRENT_DEFAULT,
    }
    dispatch(setStaffAllocationQueries(queries))
    dispatch(getStaffAssignAllocation(queries))
  }

  const onSearchChange = (newValueSearch: string) => {
    setValueSearch(newValueSearch)
    debounceFn(newValueSearch.trim())
  }

  const toggleModeView = () => {
    dispatch(updateLoading(true))
    setTimeout(() => {
      setUseViewSummary(!useViewSummary)
      dispatch(updateLoading(false))
    }, FAKE_LOADING_TIME_DELAY)
  }

  return (
    <CardFormToggleBody title={i18Dashboard('TXT_STAFF_ASSIGN_ALLOCATION')}>
      <Box className={classes.body}>
        <Box className={classes.header}>
          <Box className={classes.headerActions}>
            <InputSearch
              placeholder={i18Staff('PLH_SEARCH_STAFF')}
              label={i18('LB_SEARCH')}
              value={valueSearch}
              onChange={onSearchChange}
            />
            <CommonButton
              lowercase
              variant="outlined"
              startIcon={<Cached />}
              onClick={toggleModeView}
            >
              {useViewSummary
                ? i18Dashboard('TXT_VIEW_ALL_ALLOCATE')
                : i18Dashboard('TXT_VIEW_SUMMARY')}
            </CommonButton>
          </Box>
          <Box className={classes.unit}>{i18('LB_UNIT')}: MM</Box>
        </Box>
        <StaffAssignAllocationTable useViewSummary={useViewSummary} />
      </Box>
    </CardFormToggleBody>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
    alignItems: 'end',
  },
  unit: {
    fontSize: 14,
    fontWeight: 500,
  },
  headerActions: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
  },
}))

export default StaffAssignAllocation

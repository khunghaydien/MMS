import CommonButton from '@/components/buttons/CommonButton'
import CardFormToggleBody from '@/components/Form/CardFormToggleBody'
import InputSearch from '@/components/inputs/InputSearch'
import { FAKE_LOADING_TIME_DELAY, INPUT_TIME_DELAY } from '@/const/app.const'
import { NS_DASHBOARD, NS_PROJECT } from '@/const/lang.const'
import { LIMIT_DEFAULT, PAGE_CURRENT_DEFAULT } from '@/const/table.const'
import {
  dashboardSelector,
  getProjectAllocationStaff,
  setProjectAllocationQueries,
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
import ProjectAllocationStaffTable from './ProjectAllocationStaffTable'

const ProjectAllocationStaff = () => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Dashboard } = useTranslation(NS_DASHBOARD)
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const { projectAllocationQueries } = useSelector(dashboardSelector)

  const [valueSearch, setValueSearch] = useState('')
  const [useViewSummary, setUseViewSummary] = useState(true)

  const debounceFn = useCallback(
    _.debounce(handleDebounceFn, INPUT_TIME_DELAY),
    [projectAllocationQueries]
  )

  function handleDebounceFn(keyword: string) {
    const queries = {
      ...projectAllocationQueries,
      keyword,
      pageSize: LIMIT_DEFAULT,
      pageNum: PAGE_CURRENT_DEFAULT,
    }
    dispatch(setProjectAllocationQueries(queries))
    dispatch(getProjectAllocationStaff(queries))
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
    <CardFormToggleBody title={i18Dashboard('TXT_PROJECT_ALLOCATION')}>
      <Box className={classes.body}>
        <Box className={classes.header}>
          <Box className={classes.headerActions}>
            <InputSearch
              placeholder={i18Project('PLH_SEARCH_PROJECT')}
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
                ? i18Dashboard('TXT_VIEW_ALL_METRICS')
                : i18Dashboard('TXT_VIEW_SUMMARY')}
            </CommonButton>
          </Box>
          <Box className={classes.unit}>{i18('LB_UNIT')}: MM</Box>
        </Box>
        <ProjectAllocationStaffTable useViewSummary={useViewSummary} />
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

export default ProjectAllocationStaff

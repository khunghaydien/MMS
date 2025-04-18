import CommonButton from '@/components/buttons/CommonButton'
import RangeMonthPicker from '@/components/Datepicker/RangeMonthPicker'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputSearch from '@/components/inputs/InputSearch'
import { LangConstant, TableConstant } from '@/const'
import { INPUT_TIME_DELAY } from '@/const/app.const'
import { AppDispatch } from '@/store'
import { RangeDate } from '@/types'
import { Delete } from '@mui/icons-material'
import AccessAlarmTwoToneIcon from '@mui/icons-material/AccessAlarmTwoTone'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import _, { isEmpty } from 'lodash'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  projectSelector,
  setReportOTTimesheetQueryParameters,
} from '../../reducer/project'
import { ProjectState } from '../../types'
import { statusTimesheet } from '../project-list/instance'
type ITimesheetOTManagementListAction = {
  onAddReportOT: () => void
  onDeleteSelection: () => void
}
const TimesheetOTManagementListAction = ({
  onAddReportOT,
  onDeleteSelection,
}: ITimesheetOTManagementListAction) => {
  const classes = useStyles()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)
  const dispatch = useDispatch<AppDispatch>()
  const {
    reportOTTimesheetQueryParameters,
    isCheckAllReportOT,
    listCheckedReportOT,
  }: ProjectState = useSelector(projectSelector)
  const [valueSearch, setValueSearch] = useState(
    reportOTTimesheetQueryParameters.keyword || ''
  )
  const debounceFn = useCallback(
    _.debounce(handleDebounceFn, INPUT_TIME_DELAY),
    [reportOTTimesheetQueryParameters]
  )
  function handleDebounceFn(keyword: string) {
    const newQueryParameters = {
      ...reportOTTimesheetQueryParameters,
      keyword,
      pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
      pageSize: TableConstant.LIMIT_DEFAULT,
    }
    dispatch(setReportOTTimesheetQueryParameters(newQueryParameters))
  }
  const handleSearchChange = (newValueSearch: string) => {
    setValueSearch(newValueSearch)
    debounceFn(newValueSearch.trim())
  }
  const handleFilterChange = (value: any, key: string) => {
    const newQueryParameters = {
      ...reportOTTimesheetQueryParameters,
      [key]: value,
    }
    dispatch(setReportOTTimesheetQueryParameters(newQueryParameters))
  }

  const onRangeMonthPickerChange = (payload: RangeDate) => {
    const newQueryParameters = {
      ...reportOTTimesheetQueryParameters,
      otDateFrom:
        typeof payload.startDate === 'object' &&
        payload.startDate instanceof Date
          ? payload.startDate.getTime()
          : payload.startDate,
      otDateTo:
        typeof payload.endDate === 'object' && payload.endDate instanceof Date
          ? payload.endDate.getTime()
          : payload.endDate,
    }
    dispatch(setReportOTTimesheetQueryParameters(newQueryParameters))
  }
  const title = useMemo(() => {
    return {
      from: 'OT Date from',
      to: 'to',
    }
  }, [])
  return (
    <Box className={classes.rootProjectListActions}>
      <Box className={classes.flexBetween}>
        <Box className={classes.flexGap24}>
          <InputSearch
            placeholder={i18Project('PLH_SEARCH_FOR_PROJECT')}
            label={i18Project('LB_SEARCH')}
            value={valueSearch}
            onChange={handleSearchChange}
          />
          <InputDropdown
            placeholder={i18Project('PLH_STATUS')}
            listOptions={statusTimesheet}
            onChange={(status: any) => {
              handleFilterChange(status, 'status')
            }}
            value={reportOTTimesheetQueryParameters.status}
            width={260}
          />
        </Box>
        <CommonButton
          startIcon={<AccessAlarmTwoToneIcon />}
          onClick={onAddReportOT}
          height={40}
        >
          {i18Project('LB_CREATE_OT_REPORT')}
        </CommonButton>
      </Box>
      <Box className={classes.flexBetween}>
        <RangeMonthPicker
          title={title}
          startDate={reportOTTimesheetQueryParameters.otDateFrom}
          endDate={reportOTTimesheetQueryParameters.otDateTo}
          onChange={onRangeMonthPickerChange}
        />
        <CommonButton
          disabled={isEmpty(listCheckedReportOT)}
          startIcon={<Delete />}
          onClick={onDeleteSelection}
          height={40}
          variant={'outlined'}
          color={'error'}
        >
          {i18Project('LB_DELETE_SELECTION')}
        </CommonButton>
      </Box>
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootProjectListActions: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: '20px',
  },
  flexGap24: {
    display: 'flex',
    gap: theme.spacing(3),
    flexWrap: 'wrap',
  },
  flexBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '20px',
  },
}))
export default TimesheetOTManagementListAction

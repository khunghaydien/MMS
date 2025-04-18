import CommonButton from '@/components/buttons/CommonButton'
import ConditionalRender from '@/components/ConditionalRender'
import RangeMonthPicker from '@/components/Datepicker/RangeMonthPicker'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputSearch from '@/components/inputs/InputSearch'
import { LangConstant, TableConstant } from '@/const'
import { INPUT_TIME_DELAY } from '@/const/app.const'
import { AppDispatch } from '@/store'
import { OptionItem, RangeDate } from '@/types'
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
  setApprovalOTTimesheetQueryParameters,
} from '../../reducer/project'
import { ProjectState } from '../../types'
import { statusTimesheet } from '../project-list/instance'
type ITimesheetOTManagementListApprovalAction = {
  onConfirmReportOT: () => void
  onRejectSelection: () => void
  onApproveReportOT: () => void
  isDivisionDirector: boolean
  listOptions: OptionItem[]
  isAllReportOT?: boolean
}
const TimesheetOTManagementListApprovalAction = ({
  onConfirmReportOT,
  onRejectSelection,
  onApproveReportOT,
  isDivisionDirector,
  listOptions,
  isAllReportOT,
}: ITimesheetOTManagementListApprovalAction) => {
  const classes = useStyles()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)
  const dispatch = useDispatch<AppDispatch>()
  const {
    approvalOTTimesheetQueryParameters,
    isCheckAllApprovalOT,
    listCheckedApprovalOT,
  }: ProjectState = useSelector(projectSelector)
  const [valueSearch, setValueSearch] = useState(
    approvalOTTimesheetQueryParameters.keyword || ''
  )
  const debounceFn = useCallback(
    _.debounce(handleDebounceFn, INPUT_TIME_DELAY),
    [approvalOTTimesheetQueryParameters]
  )
  function handleDebounceFn(keyword: string) {
    const newQueryParameters = {
      ...approvalOTTimesheetQueryParameters,
      keyword,
      pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
      pageSize: TableConstant.LIMIT_DEFAULT,
    }
    dispatch(setApprovalOTTimesheetQueryParameters(newQueryParameters))
  }
  const handleSearchChange = (newValueSearch: string) => {
    setValueSearch(newValueSearch)
    debounceFn(newValueSearch.trim())
  }
  const handleFilterChange = (value: any, key: string) => {
    const newQueryParameters = {
      ...approvalOTTimesheetQueryParameters,
      [key]: value,
    }
    dispatch(setApprovalOTTimesheetQueryParameters(newQueryParameters))
  }

  const onRangeMonthPickerChange = (payload: RangeDate) => {
    const newQueryParameters = {
      ...approvalOTTimesheetQueryParameters,
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
    dispatch(setApprovalOTTimesheetQueryParameters(newQueryParameters))
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
            placeholder={i18Project('PLH_SEARCH_STAFF')}
            label={i18Project('LB_SEARCH')}
            value={valueSearch}
            onChange={handleSearchChange}
          />
          <InputDropdown
            placeholder={i18Project('PLH_PROJECT_NAME_S')}
            listOptions={listOptions}
            onChange={(project: any) => {
              handleFilterChange(project, 'project')
            }}
            value={approvalOTTimesheetQueryParameters.project}
            width={260}
          />
          <InputDropdown
            placeholder={i18Project('PLH_STATUS')}
            listOptions={statusTimesheet}
            onChange={(status: any) => {
              handleFilterChange(status, 'status')
            }}
            value={approvalOTTimesheetQueryParameters.status}
            width={260}
          />
        </Box>
        {!isAllReportOT && (
          <ConditionalRender
            conditional={!isDivisionDirector}
            fallback={
              <CommonButton
                disabled={isEmpty(listCheckedApprovalOT)}
                startIcon={<AccessAlarmTwoToneIcon />}
                onClick={onApproveReportOT}
                height={40}
              >
                {i18Project('LB_APPROVE_SELECTION')}
              </CommonButton>
            }
          >
            <CommonButton
              disabled={isEmpty(listCheckedApprovalOT)}
              startIcon={<AccessAlarmTwoToneIcon />}
              onClick={onConfirmReportOT}
              height={40}
            >
              {i18Project('LB_CONFIRM_SELECTION')}
            </CommonButton>
          </ConditionalRender>
        )}
      </Box>
      <Box className={classes.flexBetween}>
        <RangeMonthPicker
          title={title}
          startDate={approvalOTTimesheetQueryParameters.otDateFrom}
          endDate={approvalOTTimesheetQueryParameters.otDateTo}
          onChange={onRangeMonthPickerChange}
        />
        {!isAllReportOT && (
          <CommonButton
            disabled={isEmpty(listCheckedApprovalOT)}
            startIcon={<Delete />}
            onClick={onRejectSelection}
            height={40}
            variant={'outlined'}
            color={'error'}
          >
            {i18Project('LB_REJECT_SELECTION')}
          </CommonButton>
        )}
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
export default TimesheetOTManagementListApprovalAction

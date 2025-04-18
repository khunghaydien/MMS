import FormItem from '@/components/Form/FormItem/FormItem'
import ButtonAddWithIcon from '@/components/buttons/ButtonAddWithIcon'
import FilterList from '@/components/common/FilterList'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputRangeDatePicker from '@/components/inputs/InputRangeDatePicker'
import InputSearch from '@/components/inputs/InputSearch'
import SelectAutoCompleteProject from '@/components/select/SelectAutoCompleteProject'
import SelectBranch from '@/components/select/SelectBranch'
import SelectDivisionSingle from '@/components/select/SelectDivisionSingle'
import { LangConstant, TableConstant } from '@/const'
import {
  INPUT_TIME_DELAY,
  MODULE_PROJECT_REQUEST_OT_CONST,
} from '@/const/app.const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { AppDispatch } from '@/store'
import { DateRange, OptionItem, TableHeaderColumn } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import _ from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import ModalRequestOT from '../../components/ModalRequestOT'
import {
  projectSelector,
  setRequestOTQueryParameters,
} from '../../reducer/project'
import { ProjectState } from '../../types'
import { effectStatus, requestStatus } from '../project-list/instance'

interface ProjectListActionsProps {
  listChecked: string[]
  headCells: TableHeaderColumn[]
}

const initialFilters = {
  effectStatus: '',
  requestStatus: '',
  projectId: '',
  branchId: '',
  divisionId: '',
  requestStartDateFrom: null,
  requestStartDateTo: null,
  requestEndDateFrom: null,
  requestEndDateTo: null,
}

const RequestOTListAction = ({ listChecked }: ProjectListActionsProps) => {
  const classes = useStyles()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)
  const dispatch = useDispatch<AppDispatch>()
  const { requestOTQueryParameters }: ProjectState =
    useSelector(projectSelector)
  const { permissions }: AuthState = useSelector(selectAuth)
  const [valueSearch, setValueSearch] = useState(
    requestOTQueryParameters.keyword || ''
  )

  const [filters, setFilters] = useState({
    effectStatus: requestOTQueryParameters.effectStatus,
    requestStatus: requestOTQueryParameters.requestStatus,
    projectId: requestOTQueryParameters.projectId,
    branchId: requestOTQueryParameters.branchId || '',
    divisionId: requestOTQueryParameters.divisionId || '',
    requestStartDateFrom: requestOTQueryParameters.requestStartDateFrom || null,
    requestStartDateTo: requestOTQueryParameters.requestStartDateTo || null,
    requestEndDateFrom: requestOTQueryParameters.requestEndDateFrom || null,
    requestEndDateTo: requestOTQueryParameters.requestEndDateTo || null,
  })
  const [dateRangeError, setDateRangeError] = useState(false)
  const [flagFilter, setFlagFilter] = useState(false)
  const [flagReset, setFlagReset] = useState(false)
  const [isModalRequestOT, setIsModalRequestOT] = useState(false)
  const [isOpenFilter, setIsOpenFilter] = useState(false)

  const isButtonClearDisabled = useMemo(() => {
    return (
      !filters.effectStatus &&
      !filters.requestStatus &&
      !filters.projectId &&
      !filters.branchId &&
      !filters.requestStartDateFrom &&
      !filters.requestStartDateTo &&
      !filters.requestEndDateFrom &&
      !filters.requestEndDateTo
    )
  }, [filters])

  const debounceFn = useCallback(
    _.debounce(handleDebounceFn, INPUT_TIME_DELAY),
    [requestOTQueryParameters]
  )
  function handleDebounceFn(keyword: string) {
    const newQueryParameters = {
      ...requestOTQueryParameters,
      keyword,
      pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
      pageSize: TableConstant.LIMIT_DEFAULT,
    }
    dispatch(setRequestOTQueryParameters(newQueryParameters))
  }
  const handleSearchChange = (newValueSearch: string) => {
    setValueSearch(newValueSearch)
    debounceFn(newValueSearch.trim())
  }

  const handleFilter = () => {
    const newQueryParameters = {
      ...requestOTQueryParameters,
      ...filters,
      pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
      pageSize: TableConstant.LIMIT_DEFAULT,
    }
    dispatch(setRequestOTQueryParameters(newQueryParameters))
  }
  const handleFilterChange = (value: any, key: string) => {
    setFlagFilter(true)
    setFlagReset(false)
    setFilters((prev: any) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleProjectStartDateChange = (dateRange: DateRange) => {
    setFlagReset(false)
    const { startDate, endDate } = dateRange
    const _dateRange = {
      requestStartDateFrom:
        typeof startDate === 'number' ? startDate : startDate?.getTime(),
      requestStartDateTo:
        typeof endDate === 'number' ? endDate : endDate?.getTime(),
    }
    setFilters((prev: any) => ({
      ...prev,
      ..._dateRange,
    }))
  }

  const handleProjectEndDateChange = (dateRange: DateRange) => {
    setFlagReset(false)
    const { startDate, endDate } = dateRange
    const _dateRange = {
      requestEndDateFrom:
        typeof startDate === 'number' ? startDate : startDate?.getTime(),
      requestEndDateTo:
        typeof endDate === 'number' ? endDate : endDate?.getTime(),
    }
    setFilters((prev: any) => ({
      ...prev,
      ..._dateRange,
    }))
  }

  const handleClearFilter = () => {
    setFilters(initialFilters)
    setFlagReset(true)
    if (flagFilter) {
      const newQueryParameters = {
        ...requestOTQueryParameters,
        ...initialFilters,
        customerId: null,
        pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
        pageSize: TableConstant.LIMIT_DEFAULT,
      }
      dispatch(setRequestOTQueryParameters(newQueryParameters))
    }
  }

  const handleToggleFilter = (isOpen: boolean) => {
    setIsOpenFilter(isOpen)
  }

  useEffect(() => {
    if (!isButtonClearDisabled) {
      setFlagFilter(true)
    }
  }, [])

  return (
    <Box className={classes.rootProjectListActions}>
      <Box className={classes.flexGap24}>
        <InputSearch
          placeholder={i18Project('PLH_SEARCH_PROJECT')}
          label={i18Project('LB_SEARCH')}
          value={valueSearch}
          onChange={handleSearchChange}
        />
        <FilterList
          title={i18Project('TXT_FILTER_PROJECT_LIST').toString()}
          submitDisabled={dateRangeError}
          clearDisabled={isButtonClearDisabled}
          onSubmit={handleFilter}
          onClear={handleClearFilter}
          onToggleFilter={handleToggleFilter}
        >
          {isOpenFilter ? (
            <Box className={classes.fieldFilters}>
              <SelectBranch
                moduleConstant={MODULE_PROJECT_REQUEST_OT_CONST}
                label={i18Project('LB_RESPONSIBLE_BRANCH')}
                value={filters.branchId}
                width={260}
                onChange={(branchId: string) => {
                  handleFilterChange(branchId, 'branchId')
                  handleFilterChange({}, 'divisionId')
                }}
              />
              <FormItem label={i18Project('LB_PARTICIPATE_DIVISION')}>
                <SelectDivisionSingle
                  moduleConstant={MODULE_PROJECT_REQUEST_OT_CONST}
                  width={260}
                  value={filters.divisionId}
                  isDisable={!filters.branchId}
                  branchId={filters.branchId}
                  placeholder={i18Project('PLH_SELECT_DIVISION') || ''}
                  onChange={(divisionIds: OptionItem) =>
                    handleFilterChange(divisionIds.id, 'divisionId')
                  }
                />
              </FormItem>
              <SelectAutoCompleteProject
                width={260}
                multiple={false}
                value={filters.projectId}
                label={i18Project('LB_PROJECT')}
                onChange={(projectId: any) => {
                  handleFilterChange(projectId, 'projectId')
                }}
              />
              <InputRangeDatePicker
                flagReset={flagReset}
                title={'Request Start Date'}
                errorMessageDateRange="Request Start Date 'To' cannot have the date before Request Start Date 'From'"
                values={{
                  startDate: filters.requestStartDateFrom,
                  endDate: filters.requestStartDateTo,
                }}
                onChange={handleProjectStartDateChange}
                onError={(error: boolean) => setDateRangeError(error)}
              />
              <InputRangeDatePicker
                flagReset={flagReset}
                title={'Request Start Date'}
                errorMessageDateRange="Request End Date 'To' cannot have the date before Request End Date 'From'"
                values={{
                  startDate: filters.requestEndDateFrom,
                  endDate: filters.requestEndDateTo,
                }}
                onChange={handleProjectEndDateChange}
                onError={(error: boolean) => setDateRangeError(error)}
              />
              <FormItem label={'Request Status'}>
                <InputDropdown
                  placeholder={i18Project('PLH_SELECT_REQUEST_OT_STATUS')}
                  listOptions={requestStatus}
                  onChange={(requestStatus: any) => {
                    handleFilterChange(requestStatus, 'requestStatus')
                  }}
                  value={filters.requestStatus}
                  width={260}
                />
              </FormItem>
              <FormItem label={'Effect Status'}>
                <InputDropdown
                  placeholder={i18Project('PLH_SELECT_EFFECT_STATUS')}
                  listOptions={effectStatus}
                  onChange={(effectStatus: any) => {
                    handleFilterChange(effectStatus, 'effectStatus')
                  }}
                  value={filters.effectStatus}
                  width={260}
                />
              </FormItem>
            </Box>
          ) : (
            <Box />
          )}
        </FilterList>
      </Box>

      <Box className={classes.rightActions}>
        {!!permissions.otRequestCreate && (
          <ButtonAddWithIcon onClick={() => setIsModalRequestOT(true)}>
            {i18Project('LB_REQUEST_OT')}
          </ButtonAddWithIcon>
        )}
        {isModalRequestOT && (
          <ModalRequestOT
            open
            onCloseModal={() => setIsModalRequestOT(false)}
            onSubmitModal={() => handleFilter()}
            disabled={false}
          />
        )}
      </Box>
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootProjectListActions: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '20px',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  flexGap24: {
    display: 'flex',
    gap: theme.spacing(3),
    flexWrap: 'wrap',
  },
  fieldFilters: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  rightActions: {
    display: 'flex',
    gap: theme.spacing(3),
  },
}))
export default RequestOTListAction

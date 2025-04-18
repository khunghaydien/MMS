import FormItem from '@/components/Form/FormItem/FormItem'
import FormLayout from '@/components/Form/FormLayout'
import ButtonActions from '@/components/buttons/ButtonActions'
import ButtonAddWithIcon from '@/components/buttons/ButtonAddWithIcon'
import FilterList from '@/components/common/FilterList'
import InputRangeDatePicker from '@/components/inputs/InputRangeDatePicker'
import InputSearch from '@/components/inputs/InputSearch'
import ModalExportToExcelTable from '@/components/modal/ModalExportToExcelTable'
import SelectBranch from '@/components/select/SelectBranch'
import SelectDivisionSingle from '@/components/select/SelectDivisionSingle'
import SelectMarket from '@/components/select/SelectMarket'
import SelectPriority from '@/components/select/SelectPriority'
import SelectService from '@/components/select/SelectService'
import { LangConstant, PathConstant, TableConstant } from '@/const'
import {
  INPUT_TIME_DELAY,
  MODULE_CUSTOMER_CONST,
  SUB_MODULE_STAFF_FILTER,
} from '@/const/app.const'
import { LIST_ACTIONS_KEY } from '@/const/table.const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import {
  DateRange,
  IExportListToExcelBody,
  OptionItem,
  TableHeaderColumn,
} from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import _ from 'lodash'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import SelectLanguage from '../../components/SelectLanguage'
import {
  PartnerState,
  exportPartnerList,
  selectPartner,
  setPartnerQueryParameters,
} from '../../reducer/partner'

interface PartnerListActionsProps {
  listChecked: string[]
  headCells: TableHeaderColumn[]
}

const initialFilters = {
  priority: '',
  branchId: '',
  skillSetIds: [],
  startDate: null,
  endDate: null,
  locationId: '',
  languageIds: [],
  divisionIds: [],
}

const PartnerListActions = ({
  headCells,
  listChecked,
}: PartnerListActionsProps) => {
  const classes = useStyles()
  const navigate = useNavigate()
  const { t: i18 } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18Customer } = useTranslation(LangConstant.NS_CUSTOMER)
  const { permissions }: AuthState = useSelector(selectAuth)
  const { partnerQueryParameters }: PartnerState = useSelector(selectPartner)

  const [valueSearch, setValueSearch] = useState(
    partnerQueryParameters.keyword || ''
  )
  const [filters, setFilters] = useState({
    priority: partnerQueryParameters.priority || '',
    branchId: partnerQueryParameters.branchId || '',
    skillSetIds: partnerQueryParameters.skillSetIds || [],
    startDate: partnerQueryParameters.startDate || null,
    endDate: partnerQueryParameters.endDate || null,
    locationId: partnerQueryParameters.locationId || '',
    languageIds: partnerQueryParameters.languageIds || [],
    divisionIds: partnerQueryParameters.divisionIds || [],
  })
  const [dateRangeError, setDateRangeError] = useState(false)
  const [flagFilter, setFlagFilter] = useState(false)
  const [flagReset, setFlagReset] = useState(false)
  const [isShowModalApplyColumn, setIsShowModalApplyColumn] = useState(false)
  const [isOpenFilter, setIsOpenFilter] = useState(false)

  const isButtonClearDisabled = useMemo(() => {
    return (
      !filters.priority &&
      !filters.branchId &&
      !filters.startDate &&
      !filters.endDate &&
      !filters.locationId &&
      !filters.skillSetIds.length &&
      !filters.languageIds.length &&
      !filters.divisionIds.length
    )
  }, [filters])

  const listActions = useMemo(() => {
    return [
      {
        id: 1,
        label: i18('TXT_EXPORT_TO_EXCEL'),
        value: LIST_ACTIONS_KEY.EXPORT_TO_EXCEL,
        disabled: !listChecked.length,
      },
    ]
  }, [listChecked])

  const debounceFn = useCallback(
    _.debounce(handleDebounceFn, INPUT_TIME_DELAY),
    [partnerQueryParameters]
  )
  function handleDebounceFn(keyword: string) {
    const newQueryParameters = {
      ...partnerQueryParameters,
      keyword,
      pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
      pageSize: TableConstant.LIMIT_DEFAULT,
    }
    dispatch(setPartnerQueryParameters(newQueryParameters))
  }
  const handleSearchChange = (newValueSearch: string) => {
    setValueSearch(newValueSearch)
    debounceFn(newValueSearch.trim())
  }

  const handleNavigateToAddPage = () => {
    navigate(PathConstant.CUSTOMER_PARTNER_CREATE)
  }

  const handleFilterChange = (value: any, key: string) => {
    setFilters((prev: any) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleDateRangeChange = (dateRange: DateRange) => {
    setFlagReset(false)
    const { startDate, endDate } = dateRange
    const _dateRange = {
      startDate:
        typeof startDate === 'number' ? startDate : startDate?.getTime(),
      endDate: typeof endDate === 'number' ? endDate : endDate?.getTime(),
    }
    setFilters((prev: any) => ({
      ...prev,
      ..._dateRange,
    }))
  }

  const handleFilter = () => {
    setFlagFilter(true)
    setFlagReset(false)
    const newQueryParameters = {
      ...partnerQueryParameters,
      ...filters,
      pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
      pageSize: TableConstant.LIMIT_DEFAULT,
    }
    dispatch(setPartnerQueryParameters(newQueryParameters))
  }

  const handleClearFilter = () => {
    setFilters(initialFilters)
    setFlagReset(true)
    if (flagFilter) {
      const newQueryParameters = {
        ...partnerQueryParameters,
        ...initialFilters,
        pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
        pageSize: TableConstant.LIMIT_DEFAULT,
      }
      dispatch(setPartnerQueryParameters(newQueryParameters))
    }
  }

  const handleChooseAction = (option: OptionItem) => {
    if (option.value === LIST_ACTIONS_KEY.EXPORT_TO_EXCEL) {
      setIsShowModalApplyColumn(true)
    }
  }

  const handleExportToExcel = (payload: IExportListToExcelBody) => {
    dispatch(updateLoading(true))
    dispatch(
      exportPartnerList({
        ...payload,
        orderBy: partnerQueryParameters.orderBy,
        sortBy: partnerQueryParameters.sortBy,
      })
    )
      .unwrap()
      .finally(() => dispatch(updateLoading(false)))
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
    <Fragment>
      <Box className={classes.rootPartnerListActions}>
        <Box className={classes.flexGap24}>
          <InputSearch
            placeholder={i18Customer('PLH_SEARCH_PARTNER')}
            label={i18Customer('LB_SEARCH')}
            value={valueSearch}
            onChange={handleSearchChange}
          />
          <FilterList
            title="Filter Partner List"
            submitDisabled={dateRangeError}
            clearDisabled={isButtonClearDisabled}
            onSubmit={handleFilter}
            onClear={handleClearFilter}
            onToggleFilter={handleToggleFilter}
          >
            {isOpenFilter ? (
              <Box className={classes.fieldFilters}>
                <SelectMarket
                  width={260}
                  label={i18('LB_LOCATION')}
                  placeholder={i18('PLH_SELECT_LOCATION') as string}
                  value={filters.locationId || ''}
                  onChange={(locationId: string) =>
                    handleFilterChange(locationId, 'locationId')
                  }
                />
                <FormLayout width={260}>
                  <SelectLanguage
                    value={filters.languageIds || []}
                    onChange={(langs: OptionItem[]) =>
                      handleFilterChange(langs, 'languageIds')
                    }
                  />
                </FormLayout>
                <SelectBranch
                  moduleConstant={MODULE_CUSTOMER_CONST}
                  subModuleConstant={SUB_MODULE_STAFF_FILTER}
                  label={i18Customer('LB_BRANCH')}
                  width={260}
                  value={String(filters.branchId)}
                  onChange={(branchId: string) => {
                    handleFilterChange(branchId, 'branchId')
                    handleFilterChange([], 'divisionIds')
                  }}
                />
                <SelectDivisionSingle
                  width={260}
                  moduleConstant={MODULE_CUSTOMER_CONST}
                  subModuleConstant={SUB_MODULE_STAFF_FILTER}
                  label={i18('LB_DIVISION') || ''}
                  branchId={String(filters.branchId)}
                  isDisable={!filters.branchId}
                  placeholder={i18('PLH_SELECT_DIVISION') || ''}
                  value={filters.divisionIds[0]?.id}
                  onChange={(divisions: OptionItem) =>
                    handleFilterChange([divisions], 'divisionIds')
                  }
                />
                <SelectPriority
                  width={260}
                  value={String(filters.priority)}
                  onChange={(priority: string) =>
                    handleFilterChange(priority, 'priority')
                  }
                />
                <FormItem label={i18Customer('LB_STRENGTH')}>
                  <SelectService
                    maxLength={10}
                    width={260}
                    placeholder={i18Customer('PLH_SELECT_STRENGTH')}
                    value={filters.skillSetIds}
                    onChange={(skillSetIds: OptionItem[]) =>
                      handleFilterChange(skillSetIds, 'skillSetIds')
                    }
                  />
                </FormItem>
                <InputRangeDatePicker
                  flagReset={flagReset}
                  errorMessageDateRange="Collaboration End Date cannot have the date before Collaboration Start Date"
                  errorMessage="Collaboration Start Date has invalid date"
                  values={{
                    startDate: filters.startDate,
                    endDate: filters.endDate,
                  }}
                  title={i18Customer('LB_COLLABORATION_START_DATE')}
                  onChange={handleDateRangeChange}
                  onError={(error: boolean) => setDateRangeError(error)}
                />
              </Box>
            ) : (
              <Box />
            )}
          </FilterList>
        </Box>

        <Box className={classes.rightActions}>
          {!!permissions.usePartnerCreate && (
            <ButtonAddWithIcon onClick={handleNavigateToAddPage}>
              {i18Customer('LB_ADD_NEW_PARTNER')}
            </ButtonAddWithIcon>
          )}
          <ButtonActions
            listOptions={listActions}
            onChooseOption={handleChooseAction}
          />
          {isShowModalApplyColumn && (
            <ModalExportToExcelTable
              listIdsChecked={listChecked}
              listColumn={headCells}
              onClose={() => setIsShowModalApplyColumn(false)}
              onSubmit={handleExportToExcel}
            />
          )}
        </Box>
      </Box>
    </Fragment>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootPartnerListActions: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '20px',
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

export default PartnerListActions

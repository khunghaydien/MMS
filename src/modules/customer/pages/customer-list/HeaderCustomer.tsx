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
import { LangConstant, TableConstant } from '@/const'
import {
  INPUT_TIME_DELAY,
  MODULE_CUSTOMER_CONST,
  SUB_MODULE_STAFF_FILTER,
} from '@/const/app.const'
import { LIST_ACTIONS_KEY } from '@/const/table.const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { DateRange, IExportListToExcelBody, OptionItem } from '@/types'
import { theme } from '@/ui/mui/v5'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import _ from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import SelectLanguage from '../../components/SelectLanguage'
import {
  CustomerState,
  exportCustomerList,
  selectCustomer,
  setQueryParameters,
} from '../../reducer/customer'
import { IListCustomersParams } from '../../types'
import { columns } from './index'

interface HeaderCustomerProps {
  listChecked: Array<any>
}

const initialFilters = {
  priority: '',
  branchId: '',
  skillSetIds: [],
  startDate: null,
  endDate: null,
  marketId: '',
  languageIds: [],
  divisionIds: [],
}

const HeaderCustomer = ({ listChecked }: HeaderCustomerProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Customer } = useTranslation(LangConstant.NS_CUSTOMER)
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { permissions }: AuthState = useSelector(selectAuth)
  const { queryParameters }: CustomerState = useSelector(selectCustomer)

  const [valueSearch, setValueSearch] = useState(queryParameters.keyword || '')
  const [filters, setFilters] = useState<IListCustomersParams>({
    priority: queryParameters.priority || '',
    branchId: queryParameters.branchId || '',
    skillSetIds: queryParameters.skillSetIds || [],
    startDate: queryParameters.startDate || null,
    endDate: queryParameters.endDate || null,
    marketId: queryParameters.marketId || '',
    languageIds: queryParameters.languageIds || [],
    divisionIds: queryParameters.divisionIds,
  })
  const [dateRangeError, setDateRangeError] = useState(false)
  const [flagFilter, setFlagFilter] = useState(false)
  const [flagReset, setFlagReset] = useState(false)
  const [isShowModalApplyColumn, setIsShowModalApplyColumn] = useState(false)
  const [isOpenFilter, setIsOpenFilter] = useState(false)

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

  const isButtonClearDisabled = useMemo(() => {
    return (
      !filters.priority &&
      !filters.branchId &&
      !filters.skillSetIds.length &&
      !filters.languageIds.length &&
      !filters.divisionIds.length &&
      !filters.startDate &&
      !filters.endDate &&
      !filters.marketId
    )
  }, [filters])

  const debounceFn = useCallback(
    _.debounce(handleDebounceFn, INPUT_TIME_DELAY),
    [queryParameters]
  )
  function handleDebounceFn(keyword: string) {
    const newQueryParameters = {
      ...queryParameters,
      keyword,
      pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
      pageSize: TableConstant.LIMIT_DEFAULT,
    }
    dispatch(setQueryParameters(newQueryParameters))
  }

  const handleSearchChange = (newValueSearch: string) => {
    setValueSearch(newValueSearch)
    debounceFn(newValueSearch.trim())
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
      ...queryParameters,
      ...filters,
      pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
      pageSize: TableConstant.LIMIT_DEFAULT,
    }
    dispatch(setQueryParameters(newQueryParameters))
  }

  const handleClearFilter = () => {
    setFilters(initialFilters)
    setFlagReset(true)
    if (flagFilter) {
      const newQueryParameters = {
        ...queryParameters,
        ...initialFilters,
        pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
        pageSize: TableConstant.LIMIT_DEFAULT,
      }
      dispatch(setQueryParameters(newQueryParameters))
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
      exportCustomerList({
        ...payload,
        orderBy: queryParameters.orderBy,
        sortBy: queryParameters.sortBy,
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
    <Box className={classes.rootHeaderCustomers}>
      <Box data-title="header">
        <Box data-title="actions-and-filter">
          <Box data-title="wrap-filter">
            <InputSearch
              value={valueSearch}
              placeholder={i18Customer('PLH_SEARCH_CUSTOMER')}
              label={i18Customer('LB_SEARCH')}
              onChange={handleSearchChange}
            />
            <FilterList
              title="Filter Customer List"
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
                    label="Market"
                    value={filters.marketId || ''}
                    onChange={(marketId: string) =>
                      handleFilterChange(marketId, 'marketId')
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
                  <FormItem label={i18Customer('LB_SERVICE')}>
                    <SelectService
                      maxLength={10}
                      width={260}
                      placeholder={i18Customer('PLH_SELECT_SERVICE')}
                      value={filters.skillSetIds}
                      onChange={(skillSetIds: OptionItem[]) =>
                        handleFilterChange(skillSetIds, 'skillSetIds')
                      }
                    />
                  </FormItem>
                  <InputRangeDatePicker
                    flagReset={flagReset}
                    errorMessage="Collaboration Start Date has invalid date"
                    errorMessageDateRange="Collaboration End Date cannot have the date before Collaboration Start Date"
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
            {!!permissions.useCustomerCreate && (
              <ButtonAddWithIcon onClick={() => navigate('create')}>
                {i18Customer('LB_ADD_CUSTOMER')}
              </ButtonAddWithIcon>
            )}
            <ButtonActions
              listOptions={listActions}
              onChooseOption={handleChooseAction}
            />
            {isShowModalApplyColumn && (
              <ModalExportToExcelTable
                listIdsChecked={listChecked}
                listColumn={columns}
                onClose={() => setIsShowModalApplyColumn(false)}
                onSubmit={handleExportToExcel}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((themeMui: Theme) => ({
  rootHeaderCustomers: {
    width: '100%',
    marginBottom: '10px',
    '& [data-title="header"]': {
      width: '100%',
      '& [data-title="title"]': {
        fontWeight: '700',
        fontSize: themeMui.spacing(2),
        color: theme.color.black.primary,
        borderBottom: `1px solid ${theme.color.grey.secondary}`,
        paddingBottom: themeMui.spacing(3),
        width: 'max-content',
        paddingRight: themeMui.spacing(4),
        marginBottom: themeMui.spacing(3),
      },
      '& [data-title="actions-and-filter"]': {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: themeMui.spacing(4),
        flexWrap: 'wrap',
        gap: '20px',
        '& [data-title="wrap-filter"]': {
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
        },
        '& [data-title="wrap-actions"]': {
          display: 'flex',
          gap: '20px',
          '& [data-title="btn"]': {
            display: 'flex',
            gap: '10px',
            fontWeight: '700',
            fontSize: '14px',
            alignItems: 'center',
            color: theme.color.white,
            svg: { fontSize: '20px' },
            '& [data-title="icon-add"]': {
              fontSize: '20px',
              fontWeight: '700',
            },
          },
        },
      },
    },
  },
  labelAdd: {
    marginLeft: themeMui.spacing(0.5),
  },
  labelAction: {
    marginRight: themeMui.spacing(0.5),
  },
  buttonAdd: {
    height: theme.spacing(5),
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
export default HeaderCustomer

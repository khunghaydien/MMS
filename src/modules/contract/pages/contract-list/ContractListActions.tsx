import FormItem from '@/components/Form/FormItem/FormItem'
import ButtonAddWithIcon from '@/components/buttons/ButtonAddWithIcon'
import FilterList from '@/components/common/FilterList'
import InputAutocomplete from '@/components/inputs/InputAutocomplete'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputRangeDatePicker from '@/components/inputs/InputRangeDatePicker'
import InputSearch from '@/components/inputs/InputSearch'
import SelectBranch from '@/components/select/SelectBranch'
import SelectCustomer from '@/components/select/SelectCustomer'
import SelectPartner from '@/components/select/SelectPartner'
import SelectStaffContactPerson from '@/components/select/SelectStaffContactPerson'
import { LangConstant, PathConstant, TableConstant } from '@/const'
import {
  CONTRACT_STATUS,
  INPUT_TIME_DELAY,
  MODULE_CONTRACT_CONST,
} from '@/const/app.const'
import { convertStatusInSelectOption } from '@/modules/customer/utils'
import { AuthState, selectAuth } from '@/reducer/auth'
import { AppDispatch } from '@/store'
import { DateRange, OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import _ from 'lodash'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CONTRACT_GROUP, CONTRACT_TYPE } from '../../const'
import {
  IContractState,
  contractSelector,
  getCreatePerson,
  setContractQueryParameters,
} from '../../reducer/contract'

interface ContractListActionsProps {}

const contractStatus = convertStatusInSelectOption(
  Object.values(CONTRACT_STATUS)
)

const initialFilters = {
  branchId: '',
  contractType: '',
  contractGroup: '',
  startDateFrom: null,
  startDateTo: null,
  endDateFrom: null,
  endDateTo: null,
  signDateFrom: null,
  signDateTo: null,
  status: '',
  contactPerson: null,
  startDate: null,
  endDate: null,
  buyerId: null,
  sellerId: null,
  createPerson: [],
}

const ContractListActions = ({}: ContractListActionsProps) => {
  const classes = useStyles()
  const navigate = useNavigate()
  const { t: i18Customer } = useTranslation(LangConstant.NS_CUSTOMER)
  const { t: i18 } = useTranslation(LangConstant.NS_COMMON)
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18Contract } = useTranslation(LangConstant.NS_CONTRACT)
  const { permissions }: AuthState = useSelector(selectAuth)
  const { createPerson }: IContractState = useSelector(contractSelector)
  const { contractQueryParameters }: IContractState =
    useSelector(contractSelector)
  const [valueSearch, setValueSearch] = useState(
    contractQueryParameters.keyword || ''
  )
  const [filters, setFilters]: any = useState({
    source: contractQueryParameters.source || '',
    branchId: contractQueryParameters.branchId || '',
    contractType: contractQueryParameters.contractType || '',
    contractGroup: contractQueryParameters.contractGroup || '',
    startDate: contractQueryParameters.startDate || null,
    endDate: contractQueryParameters.endDate || null,
    contactPerson: contractQueryParameters.contactPerson || '',
    startDateFrom: contractQueryParameters.startDateFrom || null,
    startDateTo: contractQueryParameters.startDateTo || null,
    endDateFrom: contractQueryParameters.endDateFrom || null,
    endDateTo: contractQueryParameters.endDateTo || null,
    signDateFrom: contractQueryParameters.signDateFrom || null,
    signDateTo: contractQueryParameters.signDateTo || null,
    status: contractQueryParameters.status || '',
    buyerId: contractQueryParameters.buyerId || '',
    sellerId: contractQueryParameters.sellerId || '',
    createPerson: contractQueryParameters.createPerson || null,
  })
  const [dateRangeError, setDateRangeError] = useState(false)
  const [flagFilter, setFlagFilter] = useState(false)
  const [flagReset, setFlagReset] = useState(false)
  const [isOpenFilter, setIsOpenFilter] = useState(false)
  const isButtonClearDisabled = useMemo(() => {
    return (
      !filters.startDate &&
      !filters.endDate &&
      !filters.branchId &&
      !filters.contractType &&
      !filters.contractGroup &&
      !filters.contactPerson &&
      !filters.startDateFrom &&
      !filters.startDateTo &&
      !filters.endDateFrom &&
      !filters.endDateTo &&
      !filters.signDateFrom &&
      !filters.signDateTo &&
      !filters.status &&
      !filters.buyerId &&
      !filters.sellerId &&
      !filters.createPerson?.length
    )
  }, [filters])

  const debounceFn = useCallback(
    _.debounce(handleDebounceFn, INPUT_TIME_DELAY),
    [contractQueryParameters]
  )

  function handleDebounceFn(keyword: string) {
    const newQueryParameters = {
      ...contractQueryParameters,
      keyword,
      pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
      pageSize: TableConstant.LIMIT_DEFAULT,
    }
    dispatch(setContractQueryParameters(newQueryParameters))
  }
  const handleSearchChange = (newValueSearch: string) => {
    setValueSearch(newValueSearch)
    debounceFn(newValueSearch.trim())
  }

  const handleNavigateToAddPage = () => {
    navigate(PathConstant.CONTRACT_CREATE)
  }
  const handleStartDateRangeChange = (dateRange: DateRange) => {
    setFlagReset(false)
    const { startDate, endDate } = dateRange
    const _dateRange = {
      startDate:
        typeof startDate === 'number' ? startDate : startDate?.getTime(),
      endDate: typeof endDate === 'number' ? endDate : endDate?.getTime(),
    }
    setFilters((prev: any) => ({
      ...prev,
      startDateFrom: _dateRange.startDate,
      startDateTo: _dateRange.endDate,
    }))
  }

  const handleEndDateRangeChange = (dateRange: DateRange) => {
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
      endDateFrom: _dateRange.startDate,
      endDateTo: _dateRange.endDate,
    }))
  }

  const handleSignDateRangeChange = (dateRange: DateRange) => {
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
      signDateFrom: _dateRange.startDate,
      signDateTo: _dateRange.endDate,
    }))
  }
  const handleFilter = () => {
    setFlagFilter(true)
    setFlagReset(false)
    delete filters.startDate
    delete filters.endDate
    const newQueryParameters = {
      ...contractQueryParameters,
      ...filters,
      createPerson:
        filters.createPerson
          ?.map((item: OptionItem) => item.value)
          ?.join(',') || null,
      contactPerson: filters.contactPerson?.id,
      buyerId: filters.buyerId?.id,
      sellerId: filters.sellerId?.id,
      pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
      pageSize: TableConstant.LIMIT_DEFAULT,
    }
    dispatch(setContractQueryParameters(newQueryParameters))
  }

  const handleClearFilter = () => {
    setFilters(initialFilters)
    setFlagReset(true)
    if (flagFilter) {
      const newQueryParameters = {
        ...contractQueryParameters,
        ...initialFilters,
        pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
        pageSize: TableConstant.LIMIT_DEFAULT,
      }
      dispatch(setContractQueryParameters(newQueryParameters))
    }
  }
  const handleFilterChange = (key: any, value: any) => {
    setFilters((prev: any) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleToggleFilter = (isOpen: boolean) => {
    setIsOpenFilter(isOpen)
  }

  const handleOptionChange = useCallback(
    (value: OptionItem | OptionItem[] | null, keyName?: string) => {
      setFilters((prev: any) => ({
        ...prev,
        [keyName || '']: value,
      }))
    },
    []
  )

  useEffect(() => {
    if (!isButtonClearDisabled) {
      setFlagFilter(true)
    }
  }, [])

  useEffect(() => {
    if (!createPerson.length) {
      dispatch(getCreatePerson())
    }
  }, [createPerson])

  return (
    <Box className={classes.rootContractListActions}>
      <Box className={classes.flexGap24}>
        <InputSearch
          placeholder={i18Contract('PLH_SEARCH_CONTRACT')}
          label={i18Customer('LB_SEARCH')}
          value={valueSearch}
          onChange={handleSearchChange}
        />
        <FilterList
          useScroll
          title={i18Contract('TXT_FILTER_CONTRACT_LIST')}
          submitDisabled={dateRangeError}
          clearDisabled={isButtonClearDisabled}
          onSubmit={handleFilter}
          onClear={handleClearFilter}
          onToggleFilter={handleToggleFilter}
        >
          {isOpenFilter ? (
            <Fragment>
              <SelectCustomer
                width={260}
                keyName="buyerId"
                label={i18Contract('LB_BUYER')}
                placeholder={i18Contract('PLH_SELECT_BUYER') as string}
                value={filters.buyerId}
                onChange={handleOptionChange}
              />
              <SelectPartner
                width={260}
                keyName="sellerId"
                label={i18Contract('LB_SELLER')}
                placeholder={i18Contract('PLH_SELECT_SELLER') as string}
                multiple={false}
                value={filters.sellerId}
                onChange={handleOptionChange}
              />
              <SelectBranch
                moduleConstant={MODULE_CONTRACT_CONST}
                width={260}
                label={i18Customer('LB_BRANCH')}
                placeholder={i18Contract('PLH_CONTRACT_SELECT_BRANCH')}
                value={filters.branchId}
                onChange={(branchId: string) => {
                  handleFilterChange('branchId', branchId)
                }}
              />
              <InputDropdown
                width={260}
                keyName="contractGroup"
                label={i18('LB_CONTRACT_GROUP')}
                placeholder={i18Contract('PLH_CONTRACT_SELECT_GROUP')}
                listOptions={CONTRACT_GROUP}
                value={filters.contractGroup}
                onChange={(contractGroup: string) => {
                  handleFilterChange('contractGroup', contractGroup)
                }}
              />
              <InputDropdown
                width={260}
                keyName="contractType"
                label={i18('LB_CONTRACT_TYPE')}
                placeholder={i18Contract('PLH_CONTRACT_SELECT_TYPE')}
                listOptions={CONTRACT_TYPE}
                value={filters.contractType}
                onChange={(contractType: string) => {
                  handleFilterChange('contractType', contractType)
                }}
              />
              <InputDropdown
                width={260}
                value={filters.status as string}
                label={i18Contract('LB_CONTRACT_STATUS')}
                placeholder={i18Contract('PLH_CONTRACT_SELECT_STATUS')}
                listOptions={contractStatus}
                onChange={(status: string) => {
                  handleFilterChange('status', status)
                }}
              />
              <SelectStaffContactPerson
                width={260}
                moduleConstant={MODULE_CONTRACT_CONST}
                disabled={!filters.branchId}
                branchId={filters.branchId}
                keyName="contactPerson"
                value={filters.contactPerson}
                onChange={(contactPerson: any) => {
                  handleFilterChange('contactPerson', contactPerson)
                }}
              />
              <FormItem label={i18Contract('LB_CREATE_PERSON')}>
                <InputAutocomplete
                  width={260}
                  maxLength={5}
                  placeholder={i18('PLH_SELECT', {
                    labelName: i18Contract('LB_CREATE_PERSON'),
                  })}
                  listOptions={createPerson}
                  defaultTags={filters.createPerson}
                  onChange={(personListOptions: OptionItem[]) => {
                    handleFilterChange('createPerson', personListOptions)
                  }}
                />
              </FormItem>
              <InputRangeDatePicker
                flagReset={flagReset}
                title={i18Contract('LB_CONTRACT_SIGN_DATE')}
                values={{
                  startDate: filters.signDateFrom,
                  endDate: filters.signDateTo,
                }}
                onChange={handleSignDateRangeChange}
                onError={(error: boolean) => setDateRangeError(error)}
              />
              <InputRangeDatePicker
                flagReset={flagReset}
                title={i18Contract('LB_CONTRACT_START_DATE')}
                values={{
                  startDate: filters.startDateFrom,
                  endDate: filters.startDateTo,
                }}
                onChange={handleStartDateRangeChange}
                onError={(error: boolean) => setDateRangeError(error)}
              />
              <InputRangeDatePicker
                flagReset={flagReset}
                title={i18Contract('LB_CONTRACT_END_DATE')}
                values={{
                  startDate: filters.endDateFrom,
                  endDate: filters.endDateTo,
                }}
                onChange={handleEndDateRangeChange}
                onError={(error: boolean) => setDateRangeError(error)}
              />
            </Fragment>
          ) : (
            <Box />
          )}
        </FilterList>
      </Box>

      <Box className={classes.rightActions}>
        {!!permissions.useContractCreate && (
          <ButtonAddWithIcon onClick={handleNavigateToAddPage}>
            {i18Contract('LB_ADD_NEW_CONTRACT')}
          </ButtonAddWithIcon>
        )}
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootContractListActions: {
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
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing(3),
  },
  rightActions: {
    display: 'flex',
    gap: theme.spacing(3),
  },
}))

export default ContractListActions

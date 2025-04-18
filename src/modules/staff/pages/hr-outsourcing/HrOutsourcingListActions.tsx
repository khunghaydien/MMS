import ButtonActions from '@/components/buttons/ButtonActions'
import CommonButton from '@/components/buttons/CommonButton'
import FilterList from '@/components/common/FilterList'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputRangeDatePicker from '@/components/inputs/InputRangeDatePicker'
import InputSearch from '@/components/inputs/InputSearch'
import ModalExportToExcelTable from '@/components/modal/ModalExportToExcelTable'
import SelectBranch from '@/components/select/SelectBranch'
import SelectCustomer from '@/components/select/SelectCustomer'
import SelectDivisionSingle from '@/components/select/SelectDivisionSingle'
import SelectMultiplePosition from '@/components/select/SelectMultiplePosition'
import SelectPartner from '@/components/select/SelectPartner'
import SelectService from '@/components/select/SelectService'
import { LangConstant, PathConstant, TableConstant } from '@/const'
import {
  INPUT_TIME_DELAY,
  MODULE_STAFF_CONST,
  SUB_MODULE_STAFF_FILTER,
  SUB_MODULE_STAFF_OUTSOURCE,
} from '@/const/app.const'
import { LIST_ACTIONS_KEY } from '@/const/table.const'
import { jobType, statusOutsourcing } from '@/modules/staff/const'
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
import _, { isEmpty } from 'lodash'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setHrOsQueryParameters, staffSelector } from '../../reducer/staff'
import { exportListHROutsourceToExcel } from '../../reducer/thunk'
import { StaffState } from '../../types'

interface StaffListActionsProps {
  listChecked: string[]
  headCells: TableHeaderColumn[]
}
type IInitialFilters = {
  branchId: string
  jobType: string
  positionIds: any[]
  skillsId: any[]
  startDate: any
  endDate: any
  divisionIds: any[]
  status: string
  partnerId: any[]
  customerId: any[]
}
const initialFilters: IInitialFilters = {
  branchId: '',
  jobType: '',
  positionIds: [],
  skillsId: [],
  startDate: null,
  endDate: null,
  divisionIds: [],
  status: '',
  partnerId: [],
  customerId: [],
}

const HrOutsourcingListActions = ({
  listChecked,
  headCells,
}: StaffListActionsProps) => {
  const classes = useStyles()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Staff } = useTranslation(LangConstant.NS_STAFF)

  const { permissions, role, staff }: AuthState = useSelector(selectAuth)
  const { hrOsQueryParameters }: StaffState = useSelector(staffSelector)
  const [divisionOptions, setDivisionOptions] = useState<OptionItem[]>([])
  const [isDisableBranch, setIsDisableBranch] = useState(false)
  const [tmpInitialFilters, setTmpInitialFilters] = useState(initialFilters)
  const [valueSearch, setValueSearch] = useState(
    hrOsQueryParameters.keyword || ''
  )
  useEffect(() => {
    setValueSearch('')
  }, [])
  const [filters, setFilters] = useState({
    branchId: hrOsQueryParameters.branchId || '',
    jobType: hrOsQueryParameters.jobType || '',
    positionIds: hrOsQueryParameters.positionIds || [],
    skillsId: hrOsQueryParameters.skillsId || [],
    startDate: hrOsQueryParameters.startDate || null,
    endDate: hrOsQueryParameters.endDate || null,
    divisionIds: hrOsQueryParameters.divisionIds || [],
    status: hrOsQueryParameters.status || '',
    customerId: hrOsQueryParameters.customerId || [],
    partnerId: hrOsQueryParameters.partnerId || [],
  })
  const [dateRangeError, setDateRangeError] = useState(false)
  const [flagFilter, setFlagFilter] = useState(false)
  const [flagReset, setFlagReset] = useState(false)
  const [isShowModalApplyColumn, setIsShowModalApplyColumn] = useState(false)
  const [isOpenFilter, setIsOpenFilter] = useState(false)

  const isButtonClearDisabled = useMemo(() => {
    return (
      !filters.jobType &&
      !filters.startDate &&
      !filters.endDate &&
      (!filters.branchId || isDisableBranch) &&
      !filters.status &&
      !filters.positionIds.length &&
      !filters.skillsId.length &&
      !filters.partnerId.length &&
      !filters.customerId.length
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
    [hrOsQueryParameters]
  )
  function handleDebounceFn(keyword: string) {
    const newQueryParameters = {
      ...hrOsQueryParameters,
      keyword,
      pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
      pageSize: TableConstant.LIMIT_DEFAULT,
    }
    dispatch(setHrOsQueryParameters(newQueryParameters))
  }
  const handleSearchChange = (newValueSearch: string) => {
    setValueSearch(newValueSearch)
    debounceFn(newValueSearch)
  }

  const handleNavigateToAddPage = (isHROutSourcing: boolean) => {
    if (isHROutSourcing) navigate(PathConstant.STAFF_CREATE_HR_OUTSOURCING)
    else navigate(PathConstant.STAFF_CREATE)
  }

  const handleFilterChange = useCallback(
    (value: any, key: string) => {
      setFilters((prev: any) => ({
        ...prev,
        divisionIds: key !== 'branchId' ? prev.divisionIds : [],
        positionIds:
          key !== 'branchId' && key !== 'divisionIds' ? prev.positionIds : [],
        [key]: value,
      }))
    },
    [setFilters]
  )

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
      ...hrOsQueryParameters,
      ...filters,
      pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
      pageSize: TableConstant.LIMIT_DEFAULT,
    }
    dispatch(setHrOsQueryParameters(newQueryParameters))
  }

  const handleClearFilter = () => {
    setFilters(tmpInitialFilters)
    if (flagFilter) {
      const newQueryParameters = {
        ...hrOsQueryParameters,
        ...tmpInitialFilters,
        pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
        pageSize: TableConstant.LIMIT_DEFAULT,
      }
      dispatch(setHrOsQueryParameters(newQueryParameters))
    }
  }

  const handleChooseAction = (option: OptionItem) => {
    if (option.value === LIST_ACTIONS_KEY.EXPORT_TO_EXCEL) {
      setIsShowModalApplyColumn(true)
    }
  }

  const handleExportToExcel = (payload: IExportListToExcelBody) => {
    dispatch(updateLoading(true))
    const newPayload = structuredClone(payload)
    if (newPayload.fieldNames) {
      newPayload.fieldNames.unshift('id')
    }
    dispatch(
      exportListHROutsourceToExcel({
        ...newPayload,
        fieldNames: newPayload.fieldNames?.filter(key => key !== 'code'),
        orderBy: hrOsQueryParameters.orderBy,
        sortBy: hrOsQueryParameters.sortBy,
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

  const divisionIdsAutoFill = useMemo(() => {
    return divisionOptions
  }, [divisionOptions[0]?.id])

  useEffect(() => {
    if (!filters.branchId) {
      handleFilterChange([], 'divisionIds')
      const newInitialFilters = {
        ...tmpInitialFilters,
        divisionIds: [],
      }
      setTmpInitialFilters(newInitialFilters)
    } else if (!isEmpty(divisionIdsAutoFill[0])) {
      handleFilterChange([divisionIdsAutoFill[0]], 'divisionIds')
      const newInitialFilters = {
        ...tmpInitialFilters,
        divisionIds: [divisionIdsAutoFill[0]],
      }
      setTmpInitialFilters(newInitialFilters)
      if (!isEmpty(hrOsQueryParameters.positionIds)) {
        handleFilterChange(hrOsQueryParameters.positionIds, 'positionIds')
      }
    }
  }, [divisionIdsAutoFill, filters.branchId, hrOsQueryParameters])

  useEffect(() => {
    const roleAutoCreateBranch = ['COO', 'HRM', 'HR', 'Branch Director']
    role.some((roleItem: any) => {
      if (roleAutoCreateBranch.includes(roleItem?.name)) {
        handleFilterChange(staff?.branch.id, 'branchId')
        const newInitialFilters = {
          ...tmpInitialFilters,
          branchId: staff?.branch.id || '',
        }
        setTmpInitialFilters(newInitialFilters)
        setIsDisableBranch(true)
      }
    })
  }, [])

  return (
    <Fragment>
      <Box className={classes.rootStaffListActions}>
        <Box className={classes.flexGap24}>
          <InputSearch
            placeholder="Staff Code, Staff Name"
            label="Search"
            value={valueSearch}
            onChange={handleSearchChange}
          />
          <FilterList
            title="Filter Staff List"
            submitDisabled={dateRangeError}
            clearDisabled={isButtonClearDisabled}
            onSubmit={handleFilter}
            onClear={handleClearFilter}
            onToggleFilter={handleToggleFilter}
          >
            {isOpenFilter ? (
              <Box className={classes.fieldFilters}>
                <SelectBranch
                  moduleConstant={MODULE_STAFF_CONST}
                  subModuleConstant={SUB_MODULE_STAFF_FILTER}
                  label="Branch"
                  disabled={isDisableBranch}
                  placeholder="Select Branch"
                  value={filters.branchId}
                  width={260}
                  onChange={(value: string) =>
                    handleFilterChange(value, 'branchId')
                  }
                />
                <SelectDivisionSingle
                  setDivisionOptions={setDivisionOptions}
                  width={260}
                  moduleConstant={MODULE_STAFF_CONST}
                  subModuleConstant={SUB_MODULE_STAFF_OUTSOURCE}
                  label="Division"
                  placeholder="Select Divisions"
                  isDisable={true}
                  branchId={filters.branchId}
                  value={filters.divisionIds[0]?.id}
                  onChange={(divisionIds: OptionItem) =>
                    handleFilterChange([divisionIds], 'divisionIds')
                  }
                />
                <SelectMultiplePosition
                  maxLength={5}
                  label={i18('LB_POSITION') || ''}
                  value={filters.positionIds}
                  width={260}
                  disabled={!filters.divisionIds.length}
                  divisionIds={
                    filters.divisionIds.map((division: OptionItem) =>
                      division.id?.toString()
                    ) as string[]
                  }
                  onChange={(value: OptionItem[]) =>
                    handleFilterChange(value, 'positionIds')
                  }
                />
                <InputDropdown
                  width={260}
                  keyName={'jobType'}
                  label={i18Staff('LB_JOB_TYPE') || ''}
                  placeholder={i18Staff('PLH_SELECT_JOB_TYPE') || ''}
                  listOptions={jobType}
                  value={filters.jobType}
                  onChange={(value: string) =>
                    handleFilterChange(value, 'jobType')
                  }
                />
                <SelectService
                  maxLength={10}
                  width={260}
                  label="Skills"
                  placeholder="Select Skills"
                  value={filters.skillsId}
                  onChange={(skillSets: OptionItem[]) =>
                    handleFilterChange(skillSets, 'skillsId')
                  }
                />
                <SelectPartner
                  isProject
                  width={260}
                  label={i18Staff('LB_PARTNER')}
                  placeholder={i18Staff('PLH_SELECT_PARTNER') as string}
                  value={filters.partnerId}
                  onChange={(partner: any) =>
                    handleFilterChange(partner, 'partnerId')
                  }
                  numberEllipsis={15}
                />
                <SelectCustomer
                  isProject
                  width={260}
                  label={i18Staff('LB_CUSTOMER')}
                  placeholder={i18Staff('PLH_SELECT_CUSTOMER') as string}
                  value={filters.customerId}
                  onChange={(partner: any) =>
                    handleFilterChange(partner, 'customerId')
                  }
                  numberEllipsis={15}
                />
                <InputDropdown
                  width={260}
                  label={i18Staff('LB_STATUS') || ''}
                  placeholder={i18Staff('PLH_SELECT_STATUS') || ''}
                  listOptions={statusOutsourcing}
                  value={filters.status.toString()}
                  onChange={(value: string) =>
                    handleFilterChange(value, 'status')
                  }
                />
                <InputRangeDatePicker
                  flagReset={flagReset}
                  errorMessageDateRange="Onboard End Date cannot have the date before Onboard Start Date"
                  values={{
                    startDate: filters.startDate,
                    endDate: filters.endDate,
                  }}
                  title="Onboard Date"
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
          {!!permissions.useStaffOutsourcingCreate && (
            <CommonButton
              height={40}
              onClick={() => handleNavigateToAddPage(true)}
            >
              New Staff
            </CommonButton>
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
  dropdownCreateStaff: {
    position: 'relative',
  },
  btnCreateStaffContainer: {
    zIndex: 100,
    position: 'absolute',
    width: 'max-content',
    background: '#fff',
    right: 0,
    paddingTop: '5px',
  },
  rootStaffListActions: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    alignItems: 'self-start',
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
    gap: theme.spacing(0.5),
  },
  rightActions: {
    display: 'flex',
    gap: theme.spacing(2),
  },
}))

export default HrOutsourcingListActions

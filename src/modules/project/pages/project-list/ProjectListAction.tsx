import ButtonActions from '@/components/buttons/ButtonActions'
import ButtonAddWithIcon from '@/components/buttons/ButtonAddWithIcon'
import InputFilterRangeDatepicker from '@/components/inputs/InputFilterRangeDatepicker'
import InputFilterSearchCheckbox from '@/components/inputs/InputFilterSearchCheckbox'
import InputFilterToggleMultiple from '@/components/inputs/InputFilterToggleMultiple'
import InputSearch from '@/components/inputs/InputSearch'
import { LangConstant, PathConstant, TableConstant } from '@/const'
import { INPUT_TIME_DELAY, MODULE_PROJECT_CONST } from '@/const/app.const'
import { LIST_ACTIONS_KEY } from '@/const/table.const'
import useDivisions from '@/hooks/useDivisions'
import { AuthState, selectAuth } from '@/reducer/auth'
import { commonSelector, CommonState } from '@/reducer/common'
import { updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { DateRange, OptionItem, TableHeaderColumn } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import _ from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ModalRequestOT from '../../components/ModalRequestOT'
import { initProjectQueryParameters, PRODUCT_TYPES_OPTIONS } from '../../const'
import {
  projectSelector,
  setProjectQueryParameters,
} from '../../reducer/project'
import { exportProjectList } from '../../reducer/thunk'
import { IListProjectsParams, ProjectState } from '../../types'
import FilterProjectList from './FilterProjectList'
import { projectStatus } from './instance'
import ModalExportKPI from './ModalExportKPI'
import CommonButton from '@/components/buttons/CommonButton'

interface ProjectListActionsProps {
  listChecked: string[]
  headCells: TableHeaderColumn[]
}

const ProjectListAction = ({
  listChecked,
  headCells,
}: ProjectListActionsProps) => {
  const classes = useStyles()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)
  const { t: i18Customer } = useTranslation(LangConstant.NS_CUSTOMER)
  const { permissions, staff, role }: AuthState = useSelector(selectAuth)
  const { projectQueryParameters }: ProjectState = useSelector(projectSelector)
  const { listCommonCustomers }: CommonState = useSelector(commonSelector)

  const [filters, setFilters] = useState<IListProjectsParams>(
    projectQueryParameters
  )
  const [countFilter, setCountFilter] = useState(0)

  const [valueSearch, setValueSearch] = useState(
    projectQueryParameters.keyword || ''
  )
  const [isModalRequestOT, setIsModalRequestOT] = useState(false)
  const [openModalExportKPI, setOpenModalExportKPI] = useState(false)

  const [listDivisions] = useDivisions({
    branchId: '',
    isProject: true,
    moduleConstant: MODULE_PROJECT_CONST,
    isFilterProject: true,
  })

  const isPermissionRequestOT = useMemo(() => {
    const rolesPermissionRequestOT = ['Project Manager', 'Division Director']
    return role.some((roleItem: any) =>
      rolesPermissionRequestOT.includes(roleItem?.name)
    )
  }, [staff])

  const listActions = useMemo(() => {
    return [
      {
        id: 1,
        label: i18('TXT_EXPORT_TO_EXCEL'),
        value: LIST_ACTIONS_KEY.EXPORT_TO_EXCEL,
        disabled: !listChecked.length,
        isVisible: true,
      },
      {
        id: 2,
        label: i18Project('LB_REQUEST_OT'),
        value: LIST_ACTIONS_KEY.REQUEST_OT,
        isVisible: !!isPermissionRequestOT,
      },
      {
        id: 3,
        label: i18Project('TXT_EXPORT_KPI'),
        value: LIST_ACTIONS_KEY.EXPORT_KPI,
        isVisible: permissions.useProjectExPortKpi,
      },
    ].filter(item => item.isVisible)
  }, [listChecked, isPermissionRequestOT])

  const debounceFn = useCallback(
    _.debounce(handleDebounceFn, INPUT_TIME_DELAY),
    [projectQueryParameters]
  )

  function handleDebounceFn(keyword: string) {
    const newQueryParameters = {
      ...projectQueryParameters,
      keyword,
      pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
      pageSize: TableConstant.LIMIT_DEFAULT,
    }
    dispatch(setProjectQueryParameters(newQueryParameters))
  }

  const handleSearchChange = (newValueSearch: string) => {
    setValueSearch(newValueSearch)
    debounceFn(newValueSearch)
  }

  const handleNavigateToAddPage = () => {
    navigate(PathConstant.PROJECT_CREATE)
  }

  const handleChooseAction = (option: OptionItem) => {
    if (option.value === LIST_ACTIONS_KEY.EXPORT_TO_EXCEL) {
      exportToExcel()
    }
    if (option.value === LIST_ACTIONS_KEY.REQUEST_OT) {
      setIsModalRequestOT(true)
    }
    if (option.value === LIST_ACTIONS_KEY.EXPORT_KPI) {
      setOpenModalExportKPI(true)
    }
  }

  const exportToExcel = () => {
    dispatch(updateLoading(true))
    dispatch(
      exportProjectList({
        ids: listChecked,
        orderBy: projectQueryParameters.orderBy,
        sortBy: projectQueryParameters.sortBy,
      })
    )
      .unwrap()
      .finally(() => dispatch(updateLoading(false)))
  }

  const onDivisionIdsActivatedChange = (payload: {
    listIdActivated: string[] | number[]
    option: OptionItem
  }) => {
    const newFilters = {
      ...filters,
      divisionIds: payload.listIdActivated,
    }
    setFilters(newFilters)
  }

  const onProjectStatusIdsActivatedChange = (payload: {
    listIdActivated: string[] | number[]
    option: OptionItem
  }) => {
    const newFilters = {
      ...filters,
      status: payload.listIdActivated,
    }
    setFilters(newFilters)
  }

  const onProjectStartDateChange = (dateRange: DateRange) => {
    const { startDate, endDate } = dateRange
    const _dateRange: any = {
      startDateFrom:
        typeof startDate === 'number' ? startDate : startDate?.getTime(),
      startDateTo: typeof endDate === 'number' ? endDate : endDate?.getTime(),
    }
    const newFilters: IListProjectsParams = {
      ...filters,
      ..._dateRange,
    }
    setFilters(newFilters)
  }

  const onProjectEndDateChange = (dateRange: DateRange) => {
    const { startDate, endDate } = dateRange
    const _dateRange: any = {
      endDateFrom:
        typeof startDate === 'number' ? startDate : startDate?.getTime(),
      endDateTo: typeof endDate === 'number' ? endDate : endDate?.getTime(),
    }
    const newFilters: IListProjectsParams = {
      ...filters,
      ..._dateRange,
    }
    setFilters(newFilters)
  }

  const onCustomerChange = (customerIds: OptionItem[]) => {
    const newFilters = {
      ...filters,
      customerIds: customerIds,
    }
    setFilters(newFilters)
  }

  const onProductTypeChange = (productType: OptionItem[]) => {
    const newFilters = {
      ...filters,
      productType,
    }
    setFilters(newFilters)
  }

  const filter = () => {
    dispatch(setProjectQueryParameters({ ...filters, keyword: valueSearch }))
    setCountFilter(countFilter + 1)
  }

  const closeFilter = () => {
    setFilters(projectQueryParameters)
  }

  useEffect(() => {
    setFilters(projectQueryParameters)
    setValueSearch(projectQueryParameters.keyword || '')
  }, [projectQueryParameters])

  const clearDisabled = useMemo(() => {
    return (
      !filters.divisionIds?.length &&
      !filters.customerIds?.length &&
      !filters.status?.length &&
      !filters.productType?.length &&
      !filters.startDateFrom &&
      !filters.startDateTo &&
      !filters.endDateFrom &&
      !filters.endDateTo
    )
  }, [filters])

  const handleClear = () => {
    dispatch(setProjectQueryParameters(initProjectQueryParameters))
    setFilters(initProjectQueryParameters)
  }
  return (
    <Box className={classes.rootProjectListActions}>
      <Box className={clsx(classes.flexGap24, classes.rootInputSearch)}>
        <InputSearch
          placeholder={i18Project('PLH_SEARCH_PROJECT')}
          label={i18Project('LB_SEARCH')}
          value={valueSearch}
          onChange={handleSearchChange}
        />
        <FilterProjectList
          listDivisions={listDivisions}
          countFilter={countFilter}
        />
      </Box>
      <Box className={classes.filtersOutside}>
        <InputFilterSearchCheckbox
          hideSearch
          label={i18Project('LB_PRODUCT_TYPE')}
          listOptions={PRODUCT_TYPES_OPTIONS}
          listOptionsChecked={filters.productType}
          currentListOptionsChecked={projectQueryParameters.productType}
          onFilter={filter}
          onClose={closeFilter}
          onChange={onProductTypeChange}
        />
        <InputFilterToggleMultiple
          widthInput={400}
          label={i18('LB_DIVISION')}
          listOptions={listDivisions}
          currentListIdActivated={projectQueryParameters.divisionIds}
          listIdActivated={filters.divisionIds}
          onChange={onDivisionIdsActivatedChange}
          onFilter={filter}
          onClose={closeFilter}
        />
        <InputFilterSearchCheckbox
          loading={!listCommonCustomers.length} // fake loading
          label={i18('LB_CUSTOMER')}
          searchPlaceholder={i18Customer('LB_CUSTOMER_NAME')}
          listOptions={listCommonCustomers}
          listOptionsChecked={filters.customerIds}
          currentListOptionsChecked={projectQueryParameters.customerIds}
          onFilter={filter}
          onClose={closeFilter}
          onChange={onCustomerChange}
        />
        <InputFilterRangeDatepicker
          label={i18('LB_START_DATE')}
          currentValues={{
            startDate: projectQueryParameters.startDateFrom || null,
            endDate: projectQueryParameters.startDateTo || null,
          }}
          values={{
            startDate: filters.startDateFrom || null,
            endDate: filters.startDateTo || null,
          }}
          onFilter={filter}
          onClose={closeFilter}
          onChange={onProjectStartDateChange}
        />
        <InputFilterRangeDatepicker
          label={i18('LB_END_DATE')}
          currentValues={{
            startDate: projectQueryParameters.endDateFrom || null,
            endDate: projectQueryParameters.endDateTo || null,
          }}
          values={{
            startDate: filters.endDateFrom || null,
            endDate: filters.endDateTo || null,
          }}
          onFilter={filter}
          onClose={closeFilter}
          onChange={onProjectEndDateChange}
        />
        <InputFilterToggleMultiple
          widthInput={400}
          label={i18('LB_STATUS')}
          listOptions={projectStatus}
          currentListIdActivated={projectQueryParameters.status}
          listIdActivated={filters.status}
          onChange={onProjectStatusIdsActivatedChange}
          onFilter={filter}
          onClose={closeFilter}
        />
        <CommonButton
          color="error"
          onClick={handleClear}
          disabled={clearDisabled}
        >
          {i18('LB_CLEAR')}
        </CommonButton>
      </Box>
      <Box className={classes.rightActions}>
        {!!permissions.useProjectCreate && (
          <ButtonAddWithIcon onClick={handleNavigateToAddPage}>
            {i18Project('LB_ADD_NEW_PROJECT')}
          </ButtonAddWithIcon>
        )}
        <ButtonActions
          listOptions={listActions}
          onChooseOption={handleChooseAction}
        />
        {isModalRequestOT && (
          <ModalRequestOT
            open
            onCloseModal={() => setIsModalRequestOT(false)}
            disabled={false}
          />
        )}
        {openModalExportKPI && (
          <ModalExportKPI onClose={() => setOpenModalExportKPI(false)} />
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
    flex: 1,
    justifyContent: 'flex-end',
  },
  rootInputSearch: {
    position: 'relative',
  },
  filtersOutside: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
    flexWrap: 'wrap',
  },
}))
export default ProjectListAction

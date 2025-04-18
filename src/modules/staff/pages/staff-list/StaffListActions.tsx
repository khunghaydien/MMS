import ButtonActions from '@/components/buttons/ButtonActions'
import CommonButton from '@/components/buttons/CommonButton'
import InputFilterSearchCheckbox from '@/components/inputs/InputFilterSearchCheckbox'
import InputSearch from '@/components/inputs/InputSearch'
import ModalExportToExcelTable from '@/components/modal/ModalExportToExcelTable'
import { LangConstant, PathConstant, TableConstant } from '@/const'
import {
  INPUT_TIME_DELAY,
  MODULE_STAFF_CONST,
  SUB_MODULE_STAFF_FILTER,
} from '@/const/app.const'
import { LIST_ACTIONS_KEY } from '@/const/table.const'
import useDivisions from '@/hooks/useDivisions'
import { jobType, status } from '@/modules/staff/const'
import { AuthState, selectAuth } from '@/reducer/auth'
import {
  commonSelector,
  CommonState,
  getBranchList,
  getPositions,
  getSkillSets,
} from '@/reducer/common'
import { updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import {
  DateRange,
  IExportListToExcelBody,
  ISkillSet,
  OptionItem,
  SkillSet,
  TableHeaderColumn,
} from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import _, { isEmpty } from 'lodash'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setStaffQueryParameters, staffSelector } from '../../reducer/staff'
import { exportStaffList } from '../../reducer/thunk'
import { StaffState } from '../../types'
import { ListStaffParams } from '../../types/staff-list'
import FilterStaffList, { getPositionsByDivision } from './FilterStaffList'
import InputFilterToggleMultiple from '@/components/inputs/InputFilterToggleMultiple'
import { staffQueryParameters as initStaffQueryParameters } from './../../const/index'
interface StaffListActionsProps {
  listChecked: string[]
  headCells: TableHeaderColumn[]
}

const StaffListActions = ({
  listChecked,
  headCells,
}: StaffListActionsProps) => {
  const classes = useStyles()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Staff } = useTranslation(LangConstant.NS_STAFF)

  const { permissions }: AuthState = useSelector(selectAuth)
  const { staffQueryParameters }: StaffState = useSelector(staffSelector)
  const { listPosition, skillSets, listBranches }: CommonState =
    useSelector(commonSelector)

  const [valueSearch, setValueSearch] = useState(
    staffQueryParameters.keyword || ''
  )

  const [filters, setFilters] = useState<ListStaffParams>(staffQueryParameters)
  const [isShowModalApplyColumn, setIsShowModalApplyColumn] = useState(false)
  const [countFilter, setCountFilter] = useState(0)

  const [listDivisions] = useDivisions({
    branchId: '',
    moduleConstant: MODULE_STAFF_CONST,
  })

  const listPositionOptions = useMemo(() => {
    return getPositionsByDivision(
      listPosition,
      staffQueryParameters.divisionIds[0] as string
    )
  }, [listPosition, staffQueryParameters.divisionIds])

  const listSkillOptions: OptionItem[] = useMemo(() => {
    const result: any[] = []
    skillSets.forEach((item: SkillSet) => {
      result.push(...item.skillSets)
    })
    return result.map((item: ISkillSet) => ({
      label: item.name,
      value: item.skillSetId,
      id: item.skillSetId,
    }))
  }, [skillSets])

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
    [staffQueryParameters]
  )
  function handleDebounceFn(keyword: string) {
    const newQueryParameters = {
      ...staffQueryParameters,
      keyword,
      pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
      pageSize: TableConstant.LIMIT_DEFAULT,
    }
    dispatch(setStaffQueryParameters(newQueryParameters))
  }

  const handleSearchChange = (newValueSearch: string) => {
    setValueSearch(newValueSearch)
    debounceFn(newValueSearch)
  }

  const handleNavigateToAddPage = (isHROutSourcing: boolean) => {
    if (isHROutSourcing) navigate(PathConstant.STAFF_CREATE_HR_OUTSOURCING)
    else navigate(PathConstant.STAFF_CREATE)
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
      exportStaffList({
        ...newPayload,
        fieldNames: newPayload.fieldNames?.filter(key => key !== 'code'),
        orderBy: staffQueryParameters.orderBy,
        sortBy: staffQueryParameters.sortBy,
      })
    )
      .unwrap()
      .finally(() => dispatch(updateLoading(false)))
  }
  const onMultipleChange = (
    payload: {
      listIdActivated: string[] | number[]
      option: OptionItem
    },
    field: string
  ) => {
    const newFilters = {
      ...filters,
      [field]: payload.listIdActivated,
    }
    if (field === 'branchId') {
      newFilters.divisionIds = []
    }
    setFilters(newFilters)
  }

  const onPositionChange = (options: OptionItem[]) => {
    const newFilters: ListStaffParams = {
      ...filters,
      positionIds: options,
    }
    setFilters(newFilters)
  }

  const onSkillChange = (options: OptionItem[]) => {
    const newFilters: ListStaffParams = {
      ...filters,
      skillsId: options,
    }
    setFilters(newFilters)
  }

  const onDivisionChange = ({
    listIdActivated,
    option,
  }: {
    listIdActivated: string[] | number[]
    option: OptionItem
  }) => {
    const newFilters: ListStaffParams = {
      ...filters,
      divisionIds: listIdActivated,
      positionIds: [],
    }
    setFilters(newFilters)
  }

  const closeFilter = () => {
    setFilters(staffQueryParameters)
  }

  const filter = () => {
    dispatch(setStaffQueryParameters({ ...filters, keyword: valueSearch }))
    setCountFilter(countFilter + 1)
  }

  useEffect(() => {
    if (!listPosition.length) {
      dispatch(getPositions())
    }
    if (!skillSets.length) {
      dispatch(getSkillSets())
    }
    dispatch(
      getBranchList({
        useAllBranches: false,
        moduleConstant: MODULE_STAFF_CONST,
        subModuleConstant: SUB_MODULE_STAFF_FILTER,
      })
    )
  }, [])

  useEffect(() => {
    setFilters(staffQueryParameters)
    setValueSearch(staffQueryParameters.keyword || '')
  }, [staffQueryParameters])

  const handleClear = () => {
    dispatch(setStaffQueryParameters(initStaffQueryParameters))
    setFilters(initStaffQueryParameters)
  }
  const clearDisabled = useMemo(() => {
    return (
      !filters.partnerId?.length &&
      !filters.customerId?.length &&
      !filters.divisionIds?.length &&
      !filters.skillsId?.length &&
      !filters.positionIds?.length &&
      !filters.branchId?.length &&
      !filters.startDate &&
      !filters.endDate &&
      !filters.jobType?.length &&
      !filters.status?.length
    )
  }, [filters])
  return (
    <Fragment>
      <Box className={classes.rootStaffListActions}>
        <Box className={clsx(classes.flexGap24, classes.rootInputSearch)}>
          <InputSearch
            placeholder={i18Staff('PLH_SEARCH_STAFF')}
            label={i18('LB_SEARCH')}
            value={valueSearch}
            onChange={handleSearchChange}
          />
          <FilterStaffList
            countFilter={countFilter}
            listDivisions={listDivisions}
            listSkills={listSkillOptions}
          />
        </Box>
        <Box className={classes.filtersOutside}>
          <InputFilterToggleMultiple
            listOptions={listBranches}
            label={i18('LB_BRANCH')}
            currentListIdActivated={staffQueryParameters.branchId}
            listIdActivated={filters.branchId}
            onChange={(payload: {
              listIdActivated: string[] | number[]
              option: OptionItem
            }) => onMultipleChange(payload, 'branchId')}
            onFilter={filter}
            onClose={closeFilter}
          />

          <InputFilterToggleMultiple
            currentListIdActivated={staffQueryParameters.divisionIds}
            // disabled={isEmpty(staffQueryParameters.branchId)}
            listOptions={listDivisions}
            label={i18('LB_DIVISION')}
            listIdActivated={filters.divisionIds}
            onChange={onDivisionChange}
            onFilter={filter}
            onClose={closeFilter}
          />

          <InputFilterToggleMultiple
            listOptions={jobType}
            currentListIdActivated={staffQueryParameters.jobType}
            label={i18Staff('LB_JOB_TYPE')}
            listIdActivated={filters.jobType}
            onChange={(payload: {
              listIdActivated: string[] | number[]
              option: OptionItem
            }) => onMultipleChange(payload, 'jobType')}
            onFilter={filter}
            onClose={closeFilter}
          />
          <InputFilterToggleMultiple
            currentListIdActivated={staffQueryParameters.status}
            listOptions={status}
            label={i18('LB_STATUS')}
            listIdActivated={filters.status}
            onChange={(payload: {
              listIdActivated: string[] | number[]
              option: OptionItem
            }) => onMultipleChange(payload, 'status')}
            onFilter={filter}
            onClose={closeFilter}
          />
          <InputFilterSearchCheckbox
            label={i18('LB_POSITION')}
            searchPlaceholder={i18('TXT_POSITION_NAME')}
            listOptions={listPositionOptions}
            listOptionsChecked={filters.positionIds}
            currentListOptionsChecked={staffQueryParameters.positionIds}
            onFilter={filter}
            onClose={closeFilter}
            onChange={onPositionChange}
          />
          <InputFilterSearchCheckbox
            label={i18('TXT_SKILLS')}
            searchPlaceholder={i18Staff('LB_SKILL_NAME')}
            listOptions={listSkillOptions}
            listOptionsChecked={filters.skillsId}
            currentListOptionsChecked={staffQueryParameters.skillsId}
            onFilter={filter}
            onClose={closeFilter}
            onChange={onSkillChange}
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
          {!!permissions.useStaffCreate && (
            <CommonButton
              height={40}
              width={'auto'}
              style={{ justifyContent: 'flex-start' }}
              onClick={() => handleNavigateToAddPage(false)}
            >
              {i18Staff('LB_NEW_STAFF')}
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
    justifyContent: 'flex-end',
    flex: 1,
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

export default StaffListActions

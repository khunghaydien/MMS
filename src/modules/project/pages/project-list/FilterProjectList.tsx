import CommonButton from '@/components/buttons/CommonButton'
import CloseIcon from '@/components/icons/CloseIcon'
import InputRangeDatePicker from '@/components/inputs/InputRangeDatePicker'
import SelectCustomer from '@/components/select/SelectCustomer'
import SelectMultipleDropdown from '@/components/select/SelectMultipleDropdown'
import SelectMultipleToggle from '@/components/select/SelectMultipleToggle'
import { NS_PROJECT } from '@/const/lang.const'
import { useClickOutside2 } from '@/hooks'
import {
  initProjectQueryParameters,
  PRODUCT_TYPES_OPTIONS,
} from '@/modules/project/const/index'
import { AppDispatch } from '@/store'
import { DateRange, OptionItem } from '@/types'
import { onOpenDatepicker } from '@/utils'
import { Tune } from '@mui/icons-material'
import { Box, Paper, Theme, Tooltip } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  projectSelector,
  setProjectQueryParameters,
} from '../../reducer/project'
import { IListProjectsParams, ProjectState } from '../../types'
import { projectStatus } from './instance'

interface FilterProjectListProps {
  countFilter: number
  listDivisions: OptionItem[]
}

const FilterProjectList = ({
  countFilter,
  listDivisions,
}: FilterProjectListProps) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const { projectQueryParameters }: ProjectState = useSelector(projectSelector)

  const filtersBoxRef = useRef<any>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<IListProjectsParams>(
    projectQueryParameters
  )

  useClickOutside2(filtersBoxRef, () => {
    setIsOpen(false)
  })

  const submitDisabled = useMemo(() => {
    return JSON.stringify(projectQueryParameters) === JSON.stringify(filters)
  }, [projectQueryParameters, filters])

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

  const hasFilter = useMemo(() => {
    return (
      !!projectQueryParameters.divisionIds?.length ||
      !!projectQueryParameters.customerIds?.length ||
      !!projectQueryParameters.status?.length ||
      !!projectQueryParameters.productType?.length ||
      !!projectQueryParameters.startDateFrom ||
      !!projectQueryParameters.startDateTo ||
      !!projectQueryParameters.endDateFrom ||
      !!projectQueryParameters.endDateTo
    )
  }, [projectQueryParameters])

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

  const onCustomerChange = (customerIds: any) => {
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

  const cancel = () => {
    setIsOpen(false)
    setFilters(projectQueryParameters)
  }

  const submitFilter = () => {
    dispatch(
      setProjectQueryParameters({
        ...filters,
        keyword: projectQueryParameters.keyword,
      })
    )
    setIsOpen(false)
  }

  const clear = () => {
    dispatch(setProjectQueryParameters(initProjectQueryParameters))
    setFilters(initProjectQueryParameters)
  }

  useEffect(() => {
    const onEscape = (event: { key: string }) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', onEscape)
    } else {
      document.removeEventListener('keydown', onEscape)
    }
    return () => {
      document.removeEventListener('keydown', onEscape)
    }
  }, [isOpen])

  useEffect(() => {
    if (countFilter) {
      setFilters(projectQueryParameters)
    }
  }, [countFilter])

  return (
    <Box className={classes.RootFilterProjectList}>
      <Box className={classes.filtersContainer} ref={filtersBoxRef}>
        <Tooltip title={i18('TXT_ADVANCED_FILTER')}>
          <Tune
            className={clsx(classes.tune, hasFilter && 'hasFilter')}
            onClick={() => setIsOpen(!isOpen)}
          />
        </Tooltip>
        <Paper className={clsx(classes.filtersBox, isOpen && 'open')}>
          <Box className={classes.header}>
            <CloseIcon onClick={cancel} />
          </Box>
          <Box className={classes.bodyGroup}>
            <Box className={classes.listFields}>
              <SelectMultipleToggle
                label={i18('LB_DIVISION')}
                listOptions={listDivisions}
                listIdActivated={filters.divisionIds}
                onChange={onDivisionIdsActivatedChange}
              />
              <SelectMultipleToggle
                label={i18Project('LB_PROJECT_STATUS')}
                listOptions={projectStatus}
                listIdActivated={filters.status}
                onChange={onProjectStatusIdsActivatedChange}
              />
            </Box>
            <Box className={clsx(classes.listFields, classes.mt16)}>
              <Box className={classes.dropdownBox} sx={{ flex: 1 }}>
                <SelectCustomer
                  isProject
                  multiple
                  value={filters.customerIds}
                  onChange={onCustomerChange}
                />
              </Box>
              <SelectMultipleDropdown
                width={300}
                value={filters.productType}
                label={i18Project('LB_PRODUCT_TYPE')}
                listOptions={PRODUCT_TYPES_OPTIONS}
                placeholder={i18Project('PLH_PRODUCT_TYPE')}
                onChange={onProductTypeChange}
              />
            </Box>
            <Box
              className={clsx(
                classes.dropdownBox,
                classes.mt16,
                classes.rangeDateBox
              )}
            >
              <Box className={classes.formRangeDate}>
                <Box className={classes.label}>{i18('LB_START_DATE_FROM')}</Box>
                <InputRangeDatePicker
                  spaceFix={i18('LB_TO_V2')}
                  errorMessageDateRange="Project Start Date 'To' cannot have the date before Project Start Date 'From'"
                  values={{
                    startDate: filters.startDateFrom,
                    endDate: filters.startDateTo,
                  }}
                  onChange={onProjectStartDateChange}
                  onOpen={onOpenDatepicker}
                />
              </Box>
              <Box className={classes.formRangeDate}>
                <Box className={classes.label}>{i18('LB_END_DATE_FROM')}</Box>
                <InputRangeDatePicker
                  spaceFix={i18('LB_TO_V2')}
                  errorMessageDateRange="Project End Date 'To' cannot have the date before Project End Date 'From'"
                  values={{
                    startDate: filters.endDateFrom,
                    endDate: filters.endDateTo,
                  }}
                  onChange={onProjectEndDateChange}
                  onOpen={onOpenDatepicker}
                />
              </Box>
            </Box>
          </Box>
          <Box className={classes.footer}>
            <CommonButton variant="outlined" color="inherit" onClick={cancel}>
              {i18('LB_CANCEL')}
            </CommonButton>
            <Box className={classes.footerActionsRight}>
              <CommonButton
                color="error"
                onClick={clear}
                disabled={clearDisabled}
              >
                {i18('LB_CLEAR')}
              </CommonButton>
              <CommonButton onClick={submitFilter} disabled={submitDisabled}>
                {i18('LB_FILTER')}
              </CommonButton>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootFilterProjectList: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    right: '12px',
    top: '10px',
  },
  tune: {
    color: theme.color.black.secondary,
    cursor: 'pointer',
    fontSize: '20px !important',
    '&.hasFilter': {
      color: theme.color.blue.primary,
    },
  },
  filtersContainer: {
    position: 'relative',
  },
  filtersBox: {
    zIndex: 3,
    position: 'absolute',
    top: '30px',
    left: '30px',
    padding: theme.spacing(3),
    borderRadius: theme.spacing(0, 1.5, 1.5, 1.5),
    display: 'none',
    '&.open': {
      display: 'block',
    },
    border: `1px solid ${theme.color.grey.secondary}`,
    minWidth: '800px',
    backgroundColor: theme.color.white,
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(1),
  },
  listFields: {
    display: 'flex',
    gap: theme.spacing(2),
  },
  dropdownBox: {
    padding: theme.spacing(2),
    background: theme.color.blue.six,
    borderRadius: theme.spacing(1),
    '& .label': {
      color: theme.color.blue.primary,
    },
  },
  flex16: {
    display: 'flex',
    gap: theme.spacing(2),
  },
  mt16: {
    marginTop: theme.spacing(2),
  },
  rangeDateBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    '& .formItemComp': {
      width: 'unset',
    },
  },
  formRangeDate: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(3),
  },
  label: {
    color: theme.color.blue.primary,
    fontWeight: 700,
    fontSize: 14,
    width: '120px',
  },
  bodyGroup: {
    marginBottom: theme.spacing(3),
  },
  footer: {
    display: 'flex',
    gap: theme.spacing(2),
    justifyContent: 'space-between',
  },
  footerActionsRight: {
    display: 'flex',
    gap: theme.spacing(2),
  },
}))

export default FilterProjectList

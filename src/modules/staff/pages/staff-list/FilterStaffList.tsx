import CommonButton from '@/components/buttons/CommonButton'
import CloseIcon from '@/components/icons/CloseIcon'
import SelectMultiplePosition from '@/components/select/SelectMultiplePosition'
import SelectService from '@/components/select/SelectService'
import { NS_STAFF } from '@/const/lang.const'
import { useClickOutside2 } from '@/hooks'
import { commonSelector, CommonState } from '@/reducer/common'
import { AppDispatch } from '@/store'
import { DateRange, OptionItem, PositionType } from '@/types'
import { Tune } from '@mui/icons-material'
import { Box, Paper, Theme, Tooltip } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  staffQueryParameters as initStaffQueryParameters,
  jobType,
  status,
} from '../../const'
import { setStaffQueryParameters, staffSelector } from '../../reducer/staff'
import { StaffState } from '../../types'
import { ListStaffParams } from '../../types/staff-list'
import SelectMultipleToggle from '@/components/select/SelectMultipleToggle'
import { isEmpty } from 'lodash'

export const getPositionsByDivision = (
  listPosition: any,
  divisionId: string
) => {
  const positions: OptionItem[] =
    listPosition.find(
      (position: PositionType) => position.division.divisionId === divisionId
    )?.positions || []
  return positions.map(item => ({
    id: item.id,
    value: item.id,
    label: item.name,
  }))
}

interface FilterStaffListProps {
  countFilter: number
  listDivisions: OptionItem[]
  listSkills: OptionItem[]
}

const FilterStaffList = ({
  countFilter,
  listDivisions,
  listSkills,
}: FilterStaffListProps) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Staff } = useTranslation(NS_STAFF)

  const { listBranches, listPosition }: CommonState =
    useSelector(commonSelector)
  const { staffQueryParameters }: StaffState = useSelector(staffSelector)

  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<ListStaffParams>(staffQueryParameters)

  const filtersBoxRef = useRef<any>(null)

  const hasFilter = useMemo(() => {
    return (
      !!staffQueryParameters.partnerId?.length ||
      !!staffQueryParameters.customerId?.length ||
      !!staffQueryParameters.divisionIds?.length ||
      !!staffQueryParameters.skillsId?.length ||
      !!staffQueryParameters.positionIds?.length ||
      !!staffQueryParameters.branchId?.length ||
      !!staffQueryParameters.startDate ||
      !!staffQueryParameters.endDate ||
      !!staffQueryParameters.jobType?.length ||
      !!staffQueryParameters.status?.length
    )
  }, [staffQueryParameters])

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

  const submitDisabled = useMemo(() => {
    return JSON.stringify(staffQueryParameters) === JSON.stringify(filters)
  }, [staffQueryParameters, filters])

  const listPositionOptions = useMemo(() => {
    return getPositionsByDivision(
      listPosition,
      filters.divisionIds[0] as string
    )
  }, [listPosition, filters.divisionIds])

  useClickOutside2(filtersBoxRef, () => {
    setIsOpen(false)
  })

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

  const cancel = () => {
    setIsOpen(false)
    setFilters(staffQueryParameters)
  }

  const clear = () => {
    dispatch(setStaffQueryParameters(initStaffQueryParameters))
    setFilters(initStaffQueryParameters)
  }

  const submitFilter = () => {
    dispatch(
      setStaffQueryParameters({
        ...filters,
        keyword: staffQueryParameters.keyword,
      })
    )
    setIsOpen(false)
  }

  useEffect(() => {
    if (countFilter) {
      setFilters(staffQueryParameters)
    }
  }, [countFilter])

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

  return (
    <Box className={classes.RootFilterStaffList}>
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
                listOptions={listBranches}
                label={i18('LB_BRANCH')}
                listIdActivated={filters.branchId}
                onChange={(payload: {
                  listIdActivated: string[] | number[]
                  option: OptionItem
                }) => onMultipleChange(payload, 'branchId')}
              />
              <SelectMultipleToggle
                // disabled={isEmpty(filters.branchId)}
                listOptions={listDivisions}
                label={i18('LB_DIVISION')}
                listIdActivated={filters.divisionIds}
                onChange={onDivisionChange}
              />
            </Box>
            <Box className={clsx(classes.listFields, classes.mt16)}>
              <SelectMultipleToggle
                listOptions={jobType}
                label={i18Staff('LB_JOB_TYPE')}
                listIdActivated={filters.jobType}
                onChange={(payload: {
                  listIdActivated: string[] | number[]
                  option: OptionItem
                }) => onMultipleChange(payload, 'jobType')}
              />
              <SelectMultipleToggle
                listOptions={status}
                label={i18('LB_STATUS')}
                listIdActivated={filters.status}
                onChange={(payload: {
                  listIdActivated: string[] | number[]
                  option: OptionItem
                }) => onMultipleChange(payload, 'status')}
              />
            </Box>
            <Box className={clsx(classes.listFields, classes.mt16)}>
              <Box className={classes.dropdownBox} sx={{ flex: 1 }}>
                <SelectMultiplePosition
                  width="100%"
                  listOptionsProp={listPositionOptions}
                  label={i18('LB_POSITION') || ''}
                  value={filters.positionIds}
                  disabled={!filters.divisionIds.length}
                  divisionIds={
                    filters.divisionIds.map((division: OptionItem) =>
                      division.id?.toString()
                    ) as string[]
                  }
                  onChange={onPositionChange}
                />
              </Box>
              <Box className={classes.dropdownBox} sx={{ flex: 1 }}>
                <SelectService
                  width="100%"
                  listOptionsProp={listSkills}
                  label={i18('TXT_SKILLS')}
                  placeholder={i18('PLH_SELECT_SKILLS')}
                  value={filters.skillsId}
                  onChange={onSkillChange}
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
  RootFilterStaffList: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    right: '12px',
    top: '10px',
  },
  filtersContainer: {
    position: 'relative',
  },
  tune: {
    color: theme.color.black.secondary,
    cursor: 'pointer',
    fontSize: '20px !important',
    '&.hasFilter': {
      color: theme.color.blue.primary,
    },
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
    minWidth: '850px',
    backgroundColor: theme.color.white,
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(1),
  },
  bodyGroup: {
    marginBottom: theme.spacing(3),
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
    width: '130px',
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
  selectDivisions: {
    flex: 1,
  },
  selectStatus: {
    flex: 1,
  },
}))

export default FilterStaffList

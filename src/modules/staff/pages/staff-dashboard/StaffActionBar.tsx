import InputRangeDatePicker from '@/components/inputs/InputRangeDatePicker'
import SelectBranch from '@/components/select/SelectBranch'
import SelectDivisionSingle from '@/components/select/SelectDivisionSingle'
import { LangConstant } from '@/const'
import {
  BRANCH_ID_ALL,
  MODULE_STAFF_CONST,
  SUB_MODULE_STAFF_FILTER,
} from '@/const/app.const'
import { DateRange, OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Dispatch, SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StaffFilterDashboard } from '../../types'

const StaffActionBar = ({
  filter,
  setFilter,
}: {
  filter: StaffFilterDashboard
  setFilter: Dispatch<SetStateAction<any>>
}) => {
  const classes = useStyles()
  const { t: i18nStaff } = useTranslation(LangConstant.NS_STAFF)
  const { t: i18nCustomer } = useTranslation(LangConstant.NS_CUSTOMER)

  const [flagReset, setFlagReset] = useState(false)

  const handleFilterChange = (value: any, key: string) => {
    let dataFilter = {
      ...filter,
      [key]: value,
    }
    if (key === 'branchId') {
      dataFilter.divisionId = ''
    }
    setFilter(dataFilter)
  }
  const handleDateRangeChange = (dateRange: DateRange) => {
    setFlagReset(false)
    const { startDate, endDate } = dateRange
    const _dateRange = {
      startDate:
        typeof startDate === 'number' ? startDate : startDate?.getTime(),
      endDate: typeof endDate === 'number' ? endDate : endDate?.getTime(),
    }
    const dataFilter: any = {
      ...filter,
      ..._dateRange,
    }
    setFilter(dataFilter)
  }

  return (
    <Box className={classes.rootStaffActionBar}>
      <Box className="filter-item">
        <SelectBranch
          isDashboard
          moduleConstant={MODULE_STAFF_CONST}
          subModuleConstant={SUB_MODULE_STAFF_FILTER}
          label={i18nStaff('LB_BRANCH') || ''}
          placeholder={i18nCustomer('PLH_SELECT_BRANCH') || ''}
          value={filter.branchId}
          width={250}
          onChange={(value: string) => handleFilterChange(value, 'branchId')}
        />
      </Box>
      <Box className="filter-item">
        <SelectDivisionSingle
          isDashboard
          isShowClearIcon
          moduleConstant={MODULE_STAFF_CONST}
          subModuleConstant={SUB_MODULE_STAFF_FILTER}
          width={250}
          label={i18nStaff('LB_DIVISION') || ''}
          value={filter.divisionId}
          isDisable={!filter.branchId || filter.branchId === BRANCH_ID_ALL}
          branchId={filter.branchId}
          placeholder={i18nStaff('PLH_SELECT_DIVISION') || ''}
          onChange={(division: OptionItem) => {
            handleFilterChange(division?.id, 'divisionId')
          }}
        />
      </Box>
      <Box className="filter-item">
        <InputRangeDatePicker
          isCustomLabel
          flagReset={flagReset}
          values={{
            startDate: filter.startDate,
            endDate: filter.endDate,
          }}
          onChange={handleDateRangeChange}
        />
      </Box>
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootStaffActionBar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(3),
    '& .filter-item': {},
  },
}))
export default StaffActionBar

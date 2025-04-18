import { SUB_MODULE_STAFF_FILTER } from '@/const/app.const'
import {
  commonSelector,
  CommonState,
  getBranchDashboardList,
  getBranchFilterListProject,
  getBranchList,
} from '@/reducer/common'
import { AppDispatch } from '@/store'
import { OptionItem } from '@/types'
import { memo, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import InputDropdown from '../inputs/InputDropdown'

interface SelectBranchProps {
  value: string
  width?: number
  useLabel?: boolean
  onChange: (value: string, option?: OptionItem, keyName?: string) => void
  error?: boolean
  errorMessage?: any
  label?: any
  required?: boolean
  placeholder?: any
  disabled?: boolean
  isShowClearIcon?: boolean
  isDashboard?: boolean
  isListProject?: boolean
  keyName?: string
  useAllBranches?: boolean
  moduleConstant: number
  subModuleConstant?: number
}

const SelectBranch = ({
  width,
  value,
  useLabel,
  onChange,
  error,
  errorMessage,
  label,
  required = false,
  placeholder,
  disabled = false,
  isShowClearIcon,
  isDashboard = false,
  keyName = 'branchId',
  useAllBranches = false,
  moduleConstant,
  subModuleConstant = SUB_MODULE_STAFF_FILTER,
  isListProject,
}: SelectBranchProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()

  const { listBranches, listDashboardBranches }: CommonState =
    useSelector(commonSelector)

  const listOptions = useMemo(() => {
    if (isDashboard) {
      return listDashboardBranches
    }
    return listBranches
  }, [listBranches, listDashboardBranches])

  useEffect(() => {
    if (isListProject) {
      dispatch(getBranchFilterListProject())
      return
    }
    if (isDashboard) {
      dispatch(getBranchDashboardList({ moduleConstant, subModuleConstant }))
    } else {
      dispatch(
        getBranchList({ useAllBranches, moduleConstant, subModuleConstant })
      )
    }
  }, [])

  return (
    <InputDropdown
      keyName={keyName}
      required={required}
      useLabel={useLabel}
      label={label || i18('LB_BRANCH')}
      placeholder={!useLabel ? placeholder || i18('PLH_SELECT_BRANCH') : ''}
      width={width || '100%'}
      value={value}
      listOptions={listOptions}
      isDisable={disabled}
      onChange={onChange}
      error={error}
      errorMessage={errorMessage}
      isShowClearIcon={isShowClearIcon}
    />
  )
}

export default memo(SelectBranch)

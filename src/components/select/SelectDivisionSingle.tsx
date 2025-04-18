import InputDropdown from '@/components/inputs/InputDropdown'
import { SUB_MODULE_STAFF_FILTER } from '@/const/app.const'
import useDivisions from '@/hooks/useDivisions'
import { OptionItem } from '@/types'
import { Dispatch, SetStateAction, useEffect } from 'react'

interface IProps {
  value?: string | number | undefined
  width?: number | string
  useLabel?: boolean
  onChange: (value: OptionItem) => void
  error?: boolean
  errorMessage?: string | null
  placeholder?: string
  label?: string
  branchId?: string
  required?: boolean
  listDivision?: OptionItem[]
  isFullData?: boolean
  isDisable?: boolean
  ignoreOptionById?: string | number | undefined
  isProject?: boolean
  isFilterProject?: boolean
  isDashboard?: boolean
  isMergeProjectGeneral?: boolean
  moduleConstant: number
  subModuleConstant?: number
  isShowClearIcon?: boolean
  setIsShowClearIcon?: Dispatch<SetStateAction<boolean>>
  setDivisionOptions?: Dispatch<SetStateAction<OptionItem[]>>
  paddingRight?: number
}

const SelectDivisionSingle = ({
  width,
  value = '',
  useLabel,
  placeholder = '',
  branchId = '',
  onChange,
  error,
  errorMessage,
  label,
  required = false,
  listDivision = [],
  isFullData = true,
  isDisable = false,
  ignoreOptionById,
  isProject = false,
  isDashboard = false,
  isMergeProjectGeneral = false,
  moduleConstant,
  subModuleConstant = SUB_MODULE_STAFF_FILTER,
  isShowClearIcon,
  setIsShowClearIcon,
  setDivisionOptions,
  isFilterProject,
  paddingRight,
}: IProps) => {
  const [listOptions] = useDivisions({
    branchId,
    isFullData,
    isProject,
    listDivision,
    isDashboard,
    isMergeProjectGeneral,
    moduleConstant,
    subModuleConstant,
    isFilterProject,
  })

  const handleChange = (value: string) => {
    const optionFound = listOptions.find(
      (item: OptionItem) => item.id === value
    )
    if (optionFound) onChange(optionFound)
    else onChange({})
  }

  useEffect(() => {
    if (setIsShowClearIcon)
      if (listOptions?.length > 1) {
        setIsShowClearIcon(true)
      } else {
        setIsShowClearIcon(false)
      }
    if (setDivisionOptions) setDivisionOptions(listOptions)
  }, [listOptions])
  return (
    <InputDropdown
      paddingRight={paddingRight}
      isShowClearIcon={!!isShowClearIcon}
      required={required}
      ignoreOptionById={ignoreOptionById}
      useLabel={useLabel}
      label={label || ''}
      isDisable={isDisable}
      placeholder={placeholder || ''}
      width={width || '100%'}
      value={value.toString()}
      listOptions={listOptions}
      onChange={(value: string) => handleChange(value)}
      error={error}
      errorMessage={errorMessage}
    />
  )
}

export default SelectDivisionSingle

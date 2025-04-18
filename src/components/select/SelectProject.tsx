import { LangConstant } from '@/const'
import { OptionItem } from '@/types'
import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import InputDropdown from '../inputs/InputDropdown'

interface SelectProjectProps {
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
  keyName?: string
  projectManaged: OptionItem[]
}

const SelectProject = ({
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
  keyName = 'branchId',
  projectManaged = [],
}: SelectProjectProps) => {
  const { t } = useTranslation(LangConstant.NS_CUSTOMER)
  const listOptions = useMemo(() => {
    return projectManaged
  }, [projectManaged])
  return (
    <InputDropdown
      keyName={keyName}
      required={required}
      useLabel={useLabel}
      label={label || t('LB_SELECT_BRANCH')}
      placeholder={!useLabel ? placeholder || t('PLH_SELECT_BRANCH') : ''}
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

export default memo(SelectProject)

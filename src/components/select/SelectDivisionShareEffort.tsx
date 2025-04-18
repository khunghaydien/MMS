import { commonSelector, getDivisionsShareEffort } from '@/reducer/common'
import { AppDispatch } from '@/store'
import { OptionItem } from '@/types'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import InputDropdown from '../inputs/InputDropdown'

interface SelectDivisionShareEffortProps {
  label?: string
  placeholder?: string
  value: string
  keyName?: string
  required?: boolean
  onChange?: (value: string, option?: OptionItem, keyName?: string) => void
  error?: boolean
  errorMessage?: string
}

const SelectDivisionShareEffort = ({
  value = '',
  onChange,
  keyName,
  required,
  error,
  errorMessage,
}: SelectDivisionShareEffortProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()

  const { divisionsShareEffort } = useSelector(commonSelector)

  useEffect(() => {
    if (!divisionsShareEffort.length) {
      dispatch(getDivisionsShareEffort())
    }
  }, [divisionsShareEffort])

  return (
    <InputDropdown
      keyName={keyName}
      error={error}
      errorMessage={errorMessage}
      required={required}
      label={i18('LB_DIVISION')}
      placeholder={i18('PLH_SELECT_DIVISION')}
      value={value}
      onChange={onChange}
      listOptions={divisionsShareEffort}
    />
  )
}

export default SelectDivisionShareEffort

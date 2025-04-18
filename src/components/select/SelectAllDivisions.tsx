import { commonSelector, getAllDivisions } from '@/reducer/common'
import { AppDispatch } from '@/store'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import InputDropdown from '../inputs/InputDropdown'

interface SelectAllDivisionsProps {
  label?: string
  placeholder?: string
  value?: string
  keyName?: string
  onChange?: (value: string, keyName?: string) => void
}

const SelectAllDivisions = ({
  label,
  placeholder,
  value = '',
  onChange,
  keyName,
}: SelectAllDivisionsProps) => {
  const dispatch = useDispatch<AppDispatch>()

  const { allDivisions } = useSelector(commonSelector)

  useEffect(() => {
    if (!allDivisions.length) {
      dispatch(getAllDivisions())
    }
  }, [allDivisions])

  return (
    <InputDropdown
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={(value: string) => !!onChange && onChange(value, keyName)}
      listOptions={allDivisions}
    />
  )
}

export default SelectAllDivisions

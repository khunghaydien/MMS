import { LangConstant } from '@/const'
import { commonSelector, CommonState, getPositions } from '@/reducer/common'
import { AppDispatch } from '@/store'
import { IPosition, OptionItem, PositionType } from '@/types'
import { memo, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import InputDropdown from '../inputs/InputDropdown'

interface IProps {
  value: string
  label?: string
  width?: number
  useLabel?: boolean
  onChange: (value: string) => void
  error?: boolean
  errorMessage?: any
  required?: boolean
  placeholder?: any
  disabled?: boolean
  divisionIds?: string[]
}

const SelectPosition = ({
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
  divisionIds = [],
}: IProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18nProject } = useTranslation(LangConstant.NS_PROJECT)
  const { listPosition }: CommonState = useSelector(commonSelector)

  const listOptions: OptionItem[] = useMemo(() => {
    const result: any[] = []
    listPosition.forEach((item: PositionType) => {
      if (divisionIds && divisionIds.length > 0) {
        if (divisionIds.includes(item.division.divisionId)) {
          result.push(...item.positions)
        }
      } else {
        result.push(...item.positions)
      }
    })
    return result.map((item: IPosition) => ({
      ...item,
      label: item.name,
      value: item.id,
      id: item.id,
      note: item?.note || '',
    }))
  }, [listPosition, divisionIds])

  useEffect(() => {
    if (!listPosition.length) {
      dispatch(getPositions())
    }
  }, [])

  return (
    <InputDropdown
      keyName="position"
      required={required}
      label={label}
      isDisable={disabled}
      useLabel={useLabel}
      placeholder={!useLabel ? i18nProject('LB_SELECT_POSITION') : placeholder}
      width={width || '100%'}
      value={value}
      listOptions={listOptions}
      onChange={onChange}
      error={error}
      errorMessage={errorMessage}
    />
  )
}

export default memo(SelectPosition)

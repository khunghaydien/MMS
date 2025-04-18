import {
  commonSelector,
  CommonState,
  getStaffContactPerson,
} from '@/reducer/common'
import { AppDispatch } from '@/store'
import { OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { memo, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import AutoCompleteSearchCustom from '../common/AutoCompleteSearchCustom'
import InputTitle from '../common/InputTitle'

interface SelectStaffContactPersonProps {
  keyName?: string
  value: OptionItem
  onChange: (value: OptionItem, keyName?: string) => void
  error?: boolean
  errorMessage?: any
  label?: any
  required?: boolean
  placeholder?: any
  width?: number | string
  disabled?: boolean
  branchId: string
  moduleConstant: number
}

const SelectStaffContactPerson = ({
  value,
  onChange,
  error,
  errorMessage,
  label,
  required = false,
  placeholder,
  keyName = 'contactPersonId',
  width,
  disabled = false,
  branchId,
  moduleConstant,
}: SelectStaffContactPersonProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const classes = useStyles()

  const { staffContactPersons }: CommonState = useSelector(commonSelector)

  const [valueSearch, setValueSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const listOptions: OptionItem[] = useMemo(() => {
    if (!staffContactPersons || !staffContactPersons.length) return []
    const listOptions = staffContactPersons.map((item: any) => ({
      ...item,
      label: item.name,
      value: item.id,
      id: item.id,
      description: item.email,
    }))
    if (!valueSearch) return listOptions
    return listOptions.filter((option: OptionItem) =>
      option.label?.toLowerCase()?.includes(valueSearch.toLowerCase())
    )
  }, [staffContactPersons, valueSearch])

  const handleInputChange = (value: string) => {
    setValueSearch(value)
  }

  const handleChange = (value: OptionItem) => {
    onChange(value, keyName)
  }

  useEffect(() => {
    if (!!branchId) {
      setIsLoading(true)
      dispatch(
        getStaffContactPerson({
          branchId,
          moduleConstant,
        })
      )
        .unwrap()
        .finally(() => setIsLoading(false))
    }
  }, [branchId])

  return (
    <Box className={clsx(classes.rootFormItem)}>
      <InputTitle
        title={label || i18('LB_CONTACT_PERSON')}
        required={required}
      />
      <Box className={classes.formContent}>
        <AutoCompleteSearchCustom
          loading={isLoading}
          disabled={disabled}
          error={error}
          errorMessage={errorMessage}
          multiple={false}
          placeholder={placeholder || i18('PLH_SELECT_CONTACT_PERSON')}
          listOptions={listOptions}
          onChange={handleChange}
          onInputChange={handleInputChange}
          value={value}
          width={width}
          isCustomFilter
        />
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootFormItem: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    fontSize: 14,
  },
  formContent: {
    width: '100%',
  },
}))

export default memo(SelectStaffContactPerson)

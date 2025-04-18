import AutoCompleteSearchCustom from '@/components/common/AutoCompleteSearchCustom'
import InputTitle from '@/components/common/InputTitle'
import {
  commonSelector,
  CommonState,
  getContractByGroup,
} from '@/reducer/common'
import { AppDispatch } from '@/store'
import { OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { memo, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ORDER } from '../const'

interface SelectContractByContractGroupProps {
  value: OptionItem | OptionItem[]
  width?: number
  onChange: (value: OptionItem | OptionItem[], keyName?: string) => void
  error?: boolean
  errorMessage?: any
  label?: any
  required?: boolean
  placeholder?: any
  group: string | number
  disabled?: boolean
  keyName?: string
  multiple?: boolean
  branchId: string | number
  numberEllipsis?: number
}

const SelectContractByContractGroup = ({
  width,
  value,
  onChange,
  error,
  errorMessage,
  required = false,
  group,
  disabled,
  label,
  placeholder,
  keyName = 'selectContractGroup',
  multiple = false,
  branchId,
  numberEllipsis,
}: SelectContractByContractGroupProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const classes = useStyles()

  const { listContractByGroup, listContractOrder }: CommonState =
    useSelector(commonSelector)
  const [valueSearch, setValueSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const listOptions: OptionItem[] = useMemo(() => {
    const listOptions = structuredClone(
      group.toString() === ORDER.toString()
        ? listContractOrder
        : listContractByGroup
    )
    if (!valueSearch) return listOptions
    return listOptions.filter((option: OptionItem) =>
      option.label?.toLowerCase()?.includes(valueSearch.toLowerCase())
    )
  }, [group, valueSearch, listContractByGroup, listContractOrder])

  const handleInputChange = (value: string) => {
    setValueSearch(value)
  }

  const handleChange = (value: OptionItem | OptionItem[]) => {
    onChange(value, keyName)
  }

  useEffect(() => {
    if (group) {
      setIsLoading(true)
      dispatch(
        getContractByGroup({
          group,
          branchId,
        })
      )
        .unwrap()
        .finally(() => setIsLoading(false))
    }
  }, [group, branchId])

  return (
    <Box className={clsx(classes.rootFormItem)}>
      <InputTitle title={label} required={required} />
      <Box className={classes.formContent}>
        <AutoCompleteSearchCustom
          loading={isLoading}
          disabled={disabled}
          keyName={keyName}
          error={error}
          errorMessage={errorMessage}
          multiple={multiple}
          placeholder={placeholder}
          listOptions={listOptions}
          onChange={handleChange}
          onInputChange={handleInputChange}
          value={value}
          width={width}
          isCustomFilter
          numberEllipsis={numberEllipsis}
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

export default memo(SelectContractByContractGroup)

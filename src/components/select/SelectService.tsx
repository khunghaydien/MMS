import { INPUT_TEXT_MAX_LENGTH } from '@/const/app.const'
import { commonSelector, CommonState, getSkillSets } from '@/reducer/common'
import { AppDispatch } from '@/store'
import { ISkillSet, OptionItem, SkillSet } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { memo, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import InputTitle from '../common/InputTitle'
import InputAutocomplete from '../inputs/InputAutocomplete'

interface IProps {
  value?: OptionItem[]
  width?: number | string
  useLabel?: boolean
  onChange: (value: OptionItem[]) => void
  error?: boolean
  errorMessage?: string
  placeholder?: any
  label?: any
  required?: boolean
  maxLength?: number
  disabled?: boolean
  listOptionsProp?: OptionItem[]
}

const SelectService = ({
  width,
  value,
  useLabel,
  placeholder,
  onChange,
  error,
  errorMessage,
  label,
  required = false,
  maxLength = INPUT_TEXT_MAX_LENGTH,
  disabled = false,
  listOptionsProp,
}: IProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { skillSets }: CommonState = useSelector(commonSelector)

  const classes = useStyles()

  const listOptions: OptionItem[] = useMemo(() => {
    if (listOptionsProp) return listOptionsProp
    const result: any[] = []
    skillSets.forEach((item: SkillSet) => {
      result.push(...item.skillSets)
    })
    return result.map((item: ISkillSet) => ({
      label: item.name,
      value: item.skillSetId,
      id: item.skillSetId,
    }))
  }, [skillSets])

  useEffect(() => {
    if (!skillSets.length && !listOptionsProp) {
      dispatch(getSkillSets())
    }
  }, [])

  return (
    <Box className={clsx(classes.rootFormItem)}>
      {!useLabel && !!label && <InputTitle title={label} required={required} />}
      <Box className={classes.formContent}>
        <InputAutocomplete
          disabled={disabled}
          maxLength={maxLength}
          placeholder={placeholder}
          listOptions={listOptions}
          onChange={onChange}
          defaultTags={value}
          error={error}
          errorMessage={errorMessage}
          width={width}
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

export default memo(SelectService)

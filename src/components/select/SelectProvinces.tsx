import { commonSelector, CommonState, getProvinces } from '@/reducer/common'
import { AppDispatch } from '@/store'
import { OptionItem, Province } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { memo, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import InputTitle from '../common/InputTitle'
import InputAutocomplete from '../inputs/InputAutocomplete'

interface IProps {
  value: OptionItem[]
  width?: number | string
  useLabel?: boolean
  onChange: (value: OptionItem[]) => void
  error?: boolean
  errorMessage?: any
  label?: any
  required?: boolean
}

const SelectProvinces = ({
  value,
  useLabel,
  onChange,
  error,
  errorMessage,
  label,
  required = false,
  width,
}: IProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { listProvinces }: CommonState = useSelector(commonSelector)
  const classes = useStyles()

  const [loading, setLoading] = useState(false)

  const listSelectOptions: OptionItem[] = useMemo(() => {
    if (!listProvinces[0]?.provinces) return []
    return listProvinces[0]?.provinces.map((province: Province) => ({
      id: province?.id || '',
      label: province?.name || '',
      value: province?.id || '',
    }))
  }, [listProvinces])

  useEffect(() => {
    if (!listProvinces.length) {
      setLoading(true)
      dispatch(getProvinces())
        .unwrap()
        .finally(() => setLoading(false))
    }
  }, [])

  return (
    <Box className={clsx(classes.rootFormItem)}>
      {!useLabel && !!label && <InputTitle title={label} required={required} />}
      <Box className={classes.formContent}>
        <InputAutocomplete
          maxLength={10}
          width={width}
          placeholder="Select Province"
          defaultTags={value}
          listOptions={listSelectOptions}
          onChange={onChange}
          error={error}
          errorMessage={errorMessage}
          loading={loading}
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

export default memo(SelectProvinces)

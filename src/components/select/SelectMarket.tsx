import { LangConstant } from '@/const'
import { commonSelector, CommonState, getMarkets } from '@/reducer/common'
import { AppDispatch } from '@/store'
import { MarketType, OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { memo, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import InputTitle from '../common/InputTitle'
import InputDropdown from '../inputs/InputDropdown'

interface IProps {
  value: string
  width?: number
  useLabel?: boolean
  onChange: (value: string) => void
  error?: boolean
  errorMessage?: any
  label?: any
  required?: boolean
  placeholder?: string
}

const SelectMarket = ({
  width,
  value,
  useLabel,
  onChange,
  error,
  errorMessage,
  label,
  required = false,
  placeholder = '',
}: IProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18nProject } = useTranslation(LangConstant.NS_PROJECT)
  const { listMarket }: CommonState = useSelector(commonSelector)
  const classes = useStyles()

  const listSelectOptions: OptionItem[] = useMemo(() => {
    return listMarket.map((market: MarketType) => ({
      id: market.id?.toString(),
      label: market.name,
      value: market.id?.toString(),
    }))
  }, [listMarket])

  useEffect(() => {
    if (!listMarket.length) {
      dispatch(getMarkets())
    }
  }, [])

  return (
    <Box className={clsx(classes.rootFormItem)}>
      {!!label && <InputTitle title={label} required={required} />}
      <Box className={classes.formContent}>
        <InputDropdown
          placeholder={placeholder || i18nProject('PLH_SELECT_MARKET')}
          width={width || '100%'}
          value={value}
          listOptions={listSelectOptions}
          onChange={onChange}
          error={error}
          errorMessage={errorMessage}
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

export default memo(SelectMarket)

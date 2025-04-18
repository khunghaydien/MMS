import { LangConstant } from '@/const'
import { commonSelector, CommonState, getCurrencies } from '@/reducer/common'
import { AppDispatch } from '@/store'
import { CurrencyType, OptionItem } from '@/types'
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
  onChange: (value: string, option?: OptionItem, keyName?: string) => void
  error?: boolean
  errorMessage?: any
  label?: any
  required?: boolean
  isShowClearIcon?: boolean
  disabled?: boolean
  keyName?: string
  placeholder?: string
}

const SelectCurrency = ({
  width,
  value,
  useLabel,
  onChange,
  error,
  errorMessage,
  label,
  required = false,
  isShowClearIcon = true,
  disabled = false,
  keyName = 'currencyId',
  placeholder = '',
}: IProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18nCommon } = useTranslation(LangConstant.NS_COMMON)
  const { listCurrency }: CommonState = useSelector(commonSelector)
  const classes = useStyles()

  const listSelectOptions: OptionItem[] = useMemo(() => {
    return listCurrency.map((currency: CurrencyType) => ({
      id: currency?.id.toString(),
      label: currency.code,
      value: currency?.id.toString(),
      code: currency.code,
    }))
  }, [listCurrency])

  useEffect(() => {
    if (!listCurrency.length) {
      dispatch(getCurrencies())
    }
  }, [])

  const handleChange = (id: string) => {
    const itemSelected = listSelectOptions.find(
      (option: OptionItem) => option.id === id
    )
    if (itemSelected) onChange(id, itemSelected, keyName)
    else onChange(id, {}, keyName)
  }
  return (
    <Box className={clsx(classes.rootFormItem)}>
      {!useLabel && !!label && <InputTitle title={label} required={required} />}
      <Box className={classes.formContent}>
        <InputDropdown
          keyName={keyName}
          isDisable={disabled}
          isShowClearIcon={isShowClearIcon}
          useLabel={useLabel}
          label={useLabel ? label : ''}
          placeholder={
            !useLabel ? i18nCommon('PLH_SELECT_CURRENCY') : placeholder
          }
          width={width || '100%'}
          value={value?.toString()}
          listOptions={listSelectOptions}
          onChange={(value: string) => handleChange(value)}
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

export default memo(SelectCurrency)

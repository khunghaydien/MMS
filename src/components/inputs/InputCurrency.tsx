import { INPUT_CURRENCY_MAX_LENGTH } from '@/const/app.const'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/system'
import clsx from 'clsx'
import { memo } from 'react'
import CurrencyInput from 'react-currency-input-field'
import InputErrorMessage from '../common/InputErrorMessage'
import InputTitle from '../common/InputTitle'

interface InputCurrencyProps {
  value: string | number | undefined
  placeholder?: any
  keyName?: string
  error?: boolean
  suffix?: string
  disabled?: boolean
  valueTemp?: string | number
  onChange?: (
    value?: string,
    keyName?: string,
    valueTemp?: string | number | undefined
  ) => void
  useDot?: boolean
  maxLength?: number
  onFocus?: () => void
  onBlur?: () => void
  ignoreChars?: string[]
  label?: any
  errorMessage?: any
  required?: boolean
  className?: string
  description?: string
  allowDecimals?: boolean
}

const InputCurrency = ({
  value,
  placeholder,
  error,
  suffix = '',
  disabled = false,
  onChange,
  valueTemp,
  useDot = true,
  maxLength = INPUT_CURRENCY_MAX_LENGTH,
  keyName = '',
  onFocus,
  onBlur,
  ignoreChars = [],
  label,
  errorMessage,
  required,
  className = '',
  description,
  allowDecimals = true,
}: InputCurrencyProps) => {
  const classes = useStyles()

  const handleChange = (newValue: any) => {
    !!onChange && onChange(newValue || '', keyName, valueTemp)
  }

  const onKeyDown = (e: any) => {
    if (
      ignoreChars.includes(e.key) ||
      e.key === '-' ||
      (e.key === '.' && !useDot)
    ) {
      e.preventDefault()
    }
  }

  const handleFocus = () => {
    !!onFocus && onFocus()
  }

  const handleBlur = () => {
    !!onBlur && onBlur()
  }

  return (
    <Box className={clsx(classes.rootInputCurrency, className)}>
      {!!label && (
        <InputTitle
          className={classes.title}
          title={label}
          required={required}
        />
      )}
      {!!description && (
        <Box className={classes.description}>{description}</Box>
      )}
      <CurrencyInput
        decimalSeparator="."
        groupSeparator=","
        disableAbbreviations
        maxLength={maxLength}
        disabled={disabled}
        className={`currency-input ${error && 'error'}`}
        allowDecimals={allowDecimals}
        placeholder={placeholder}
        suffix={suffix}
        value={value}
        onValueChange={handleChange}
        onKeyDown={onKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {!!error && (
        <InputErrorMessage
          className={classes.errorMessage}
          content={errorMessage || ''}
        />
      )}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    marginBottom: 'unset !important',
  },
  rootInputCurrency: {
    width: '100%',
    maxWidth: '288px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    '& input': {
      color: theme.color.black.primary,
      fontSize: 14,

      '&.error': {
        borderColor: `${theme.color.error.primary} !important`,
      },

      '&::placeholder': {
        color: `${theme.color.grey.fourth} !important`,
      },
    },
    '& input[type="text"]:disabled': {
      background: theme.color.grey.tertiary,
      color: theme.color.black.tertiary,
    },
  },
  errorMessage: {
    // marginTop: theme.spacing(1),
  },
  description: {
    fontSize: 12,
  },
}))

export default memo(InputCurrency)

import { LangConstant } from '@/const'
import { EventInput } from '@/types'
import { Box, Theme } from '@mui/material'
import TextField from '@mui/material/TextField'
import { makeStyles } from '@mui/styles'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import clsx from 'clsx'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import InputErrorMessage from '../common/InputErrorMessage'
import InputTitle from '../common/InputTitle'
import ConditionalRender from '../ConditionalRender'
import CloseIcon from '../icons/CloseIcon'

interface PropTypes {
  keyName?: string
  placeholder?: string
  onChange?: Function
  className?: string
  disabled?: boolean
  inputRef?: any
  maxDate?: Date | null | number
  minDate?: Date | null | number
  value?: Date | number | null
  inputFormat?: string
  error?: boolean
  errorMessage?: string
  label?: string | null
  required?: boolean
  useLabel?: boolean
  width?: string | number
  flagReset?: boolean
  onError?: (error: string | null) => void
  views?: Array<'day' | 'month' | 'year'>
  openTo?: 'day' | 'month' | 'year'
  isShowClearIcon?: boolean
  allowedYears?: string[]
  defaultCalendarMonth?: Date | null
  readOnly?: boolean
  shouldDisableDate?: (date: number | Date | null) => boolean | false
  onFocus?: () => void
  onBlur?: () => void
}

function InputDateFns(props: PropTypes) {
  const {
    readOnly = false,
    placeholder,
    onChange,
    value,
    label = '',
    error,
    required = false,
    errorMessage,
    useLabel,
    className,
    minDate,
    maxDate,
    width,
    disabled,
    onError,
    flagReset,
    keyName = '',
    views = ['year', 'day'],
    openTo = 'day',
    isShowClearIcon = true,
    allowedYears = [],
    defaultCalendarMonth,
    inputFormat = 'dd/MM/yyyy',
    shouldDisableDate,
    onFocus,
    onBlur,
  } = props
  const classes = useStyles()
  const { t: i18Common } = useTranslation(LangConstant.NS_COMMON)
  const styleRootFormItem = { width }

  const inputRef = useRef<HTMLInputElement | null>(null)
  const rootPopoverRef = useRef<HTMLInputElement | Element | null>(null)

  const [valueLocal, setValueLocal] = useState<Date | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [isShowCloseIcon, setIsShowCloseIcon] = useState(false)
  const [open, setOpen] = useState(false)
  const [errorOnMui, setErrorOnMui] = useState(false)

  const errorLocal = useMemo(() => {
    return !!error
  }, [error])

  const onDatePickerChange = (newValue: any) => {
    setValueLocal(newValue)
    !!onChange && onChange(newValue, keyName || '')
  }

  const handleInputChange = ({ target }: EventInput) => {
    setInputValue(target.value)
  }

  const handleMouseOver = () => {
    if (!isShowClearIcon) return
    setIsShowCloseIcon(true)
  }
  const handleMouseOut = () => {
    if (!isShowClearIcon) return
    setIsShowCloseIcon(false)
  }
  const handleClearValue = () => {
    setInputValue('')
    setValueLocal(null)
    !!onChange && onChange(null, keyName || '')
  }

  const setYearOptionDisabled = () => {
    const rootContainer = document.querySelector('.MuiPickersPopper-root')
    rootPopoverRef.current = rootContainer
    const yearsEl = Array.from(
      document.querySelectorAll<HTMLElement>('.PrivatePickersYear-root button')
    )
    if (yearsEl) {
      yearsEl.forEach(year => {
        if (!allowedYears.includes(year.innerText)) {
          year.style.color = '#C4C4C4'
          year.style.pointerEvents = 'none'
        }
      })
    }
  }

  const handleError = (error: string | null) => {
    setErrorOnMui(!!error)
    !!onError && onError(error)
  }

  const handleTextFieldBlur = () => {
    if (errorOnMui) {
      setValueLocal(null)
      !!onChange && onChange(null, keyName)
    }
    !!onBlur && onBlur()
  }

  const handleFocus = () => {
    !!onFocus && onFocus()
  }

  useEffect(() => {
    if (value) {
      setValueLocal(typeof value !== 'number' ? value : new Date(+value))
    } else {
      if (!inputValue) {
        setValueLocal(null)
      }
    }
  }, [value])

  useEffect(() => {
    if (flagReset) {
      setValueLocal(null)
    }
  }, [flagReset])

  useEffect(() => {
    if (open && allowedYears.length) {
      setTimeout(() => {
        setYearOptionDisabled()
      })
    }
  }, [open, allowedYears])

  return (
    <Box
      className={clsx(classes.rootFormItem, className, disabled && 'disabled')}
      sx={{ width }}
    >
      {!useLabel && !!label && <InputTitle title={label} required={required} />}
      <Box className={classes.formContent} style={styleRootFormItem}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            defaultCalendarMonth={defaultCalendarMonth}
            label={!!useLabel ? label : ''}
            value={valueLocal}
            onChange={onDatePickerChange}
            shouldDisableDate={shouldDisableDate}
            renderInput={params => (
              <Box
                className="input-box"
                style={{ position: 'relative', display: 'inline-block' }}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              >
                <TextField
                  {...params}
                  inputProps={{
                    ...params.inputProps,
                    readOnly,
                    placeholder:
                      placeholder || (i18Common('PLH_SELECT_DATE') as string),
                  }}
                  onChange={handleInputChange}
                  onBlur={handleTextFieldBlur}
                  onFocus={handleFocus}
                />
                {!disabled && (
                  <Box
                    className={clsx(
                      isShowCloseIcon && props.value && isShowClearIcon
                        ? ''
                        : 'hidden',
                      'custom-close-icon'
                    )}
                    onClick={handleClearValue}
                  >
                    <CloseIcon />
                  </Box>
                )}
              </Box>
            )}
            inputFormat={inputFormat}
            className={clsx(classes.rootDatePicker, error && classes.error)}
            inputRef={inputRef}
            minDate={minDate}
            maxDate={maxDate}
            disabled={disabled}
            onError={handleError}
            views={views}
            openTo={openTo}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
          />
        </LocalizationProvider>
      </Box>

      <ConditionalRender conditional={errorLocal}>
        <InputErrorMessage
          className={classes.errorMessage}
          content={errorMessage || ''}
        />
      </ConditionalRender>
    </Box>
  )
}

export default memo(InputDateFns)

const useStyles = makeStyles((theme: Theme) => ({
  rootFormItem: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    fontSize: 14,
    '&.disabled *': {
      cursor: 'unset',
    },
    '&.disabled .input-box div:first-child': {
      background: theme.color.grey.tertiary,
    },
  },
  formContent: {
    width: theme.spacing(20),
    minWidth: theme.spacing(20),
  },
  rootDatePicker: {
    width: '100%',
    height: theme.spacing(5),
    '& > div': {
      width: '100%',
      height: '100%',
      backgroundColor: '#FFFFFF',
    },
    '& input': {
      padding: '8px 14px',
      fontSize: 14,
      lineHeight: 1,
      color: theme.color.black.primary,
    },
  },
  error: {
    '& fieldset': {
      borderColor: theme.color.error.primary,
    },
  },
  errorMessage: {
    marginTop: theme.spacing(1),
  },
}))

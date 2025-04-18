import { LangConstant } from '@/const'
import { EventInput } from '@/types'
import { Box, Theme } from '@mui/material'
import TextField from '@mui/material/TextField'
import { makeStyles } from '@mui/styles'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
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
  className?: string
  disabled?: boolean
  inputRef?: any
  maxDate?: Date | null | number
  minDate?: Date | null | number
  value?: Date | number | null
  inputFormat?: string
  error?: boolean
  errorMessage?: any
  label?: string | null
  required?: boolean
  useLabel?: boolean
  width?: string | number
  flagReset?: boolean
  views?: Array<'day' | 'month' | 'year'>
  openTo?: 'day' | 'month' | 'year'
  isShowClearIcon?: boolean
  allowedYears?: string[]
  defaultOpen?: boolean
  readOnly?: boolean
  useResetOnErrorMui?: boolean
  onChange?: Function
  onError?: (error: string | null) => void
  onClose?: () => void
  onOpen?: () => void
}

function InputDatePicker(props: PropTypes) {
  const {
    readOnly = false,
    placeholder,
    onChange = (dateSelected?: any, keyName?: string) => {},
    value,
    inputFormat = 'DD/MM/YYYY',
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
    defaultOpen = false,
    onClose,
    useResetOnErrorMui = false,
    onOpen,
  } = props
  const classes = useStyles()
  const { t: i18Common } = useTranslation(LangConstant.NS_COMMON)
  const styleRootFormItem = { width }

  const inputRef = useRef<HTMLInputElement | null>(null)
  const rootPopoverRef = useRef<HTMLInputElement | Element | null>(null)

  const [valueLocal, setValueLocal] = useState<Date | null>(null)
  const [inputValue, setInputValue] = useState<string>('')
  const [isShowCloseIcon, setIsShowCloseIcon] = useState(false)
  const [open, setOpen] = useState(defaultOpen)
  const [errorOnMui, setErrorOnMui] = useState(false)
  const [focus, setFocus] = useState(false)

  const errorLocal = useMemo(() => {
    return !!error
  }, [error])

  const onDatePickerChange = (newValue: any) => {
    let dateSelected = null
    if (newValue && newValue.isValid()) {
      dateSelected = newValue.toDate()
    }
    setValueLocal(newValue)
    onChange(dateSelected, keyName)
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
    onChange(null, keyName)
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
    setFocus(false)
    if (errorOnMui) {
      setValueLocal(null)
      !!onChange && onChange(null, keyName)
    }
  }

  const mouseOver = () => {
    setTimeout(() => {
      const dialog = document.querySelector('[role="dialog"]') as HTMLDivElement
      if (dialog) {
        const dialogChildren = dialog.querySelectorAll('*')
        dialogChildren.forEach(child => {
          child.setAttribute('outside-root', '*')
        })
      }
    })
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

  useEffect(() => {
    setOpen(defaultOpen)
  }, [defaultOpen])

  useEffect(() => {
    if (errorOnMui && useResetOnErrorMui && !focus) {
      setValueLocal(null)
      setInputValue('')
      onChange(null, keyName || '')
    }
  }, [errorOnMui, inputValue, focus])

  return (
    <Box
      className={clsx(classes.rootFormItem, className, disabled && 'disabled')}
      style={styleRootFormItem}
      onMouseOver={mouseOver}
    >
      {!useLabel && !!label && <InputTitle title={label} required={required} />}
      <Box className={classes.formContent} style={styleRootFormItem}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker
            label={!!useLabel ? label : ''}
            value={valueLocal}
            onChange={onDatePickerChange}
            renderInput={params => (
              <Box
                className={clsx(
                  classes.datepickerView,
                  errorOnMui && classes.errorOnMui,
                  readOnly && classes.datepickerReadOnly,
                  'input-box'
                )}
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
                  onClick={() => setFocus(true)}
                />
                {
                  <Box
                    className={clsx(
                      isShowCloseIcon &&
                        props.value &&
                        isShowClearIcon &&
                        !readOnly &&
                        !disabled
                        ? ''
                        : 'hidden',
                      'custom-close-icon'
                    )}
                    onClick={handleClearValue}
                  >
                    <CloseIcon />
                  </Box>
                }
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
            onOpen={() => {
              setOpen(true)
              !!onOpen && onOpen()
            }}
            onClose={() => {
              setOpen(false)
              !!onClose && onClose()
            }}
          />
        </LocalizationProvider>
      </Box>

      <ConditionalRender conditional={errorLocal && !!errorMessage}>
        <InputErrorMessage
          className={classes.errorMessage}
          content={errorMessage || ''}
        />
      </ConditionalRender>
    </Box>
  )
}

export default memo(InputDatePicker)

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
  datepickerView: {
    width: '100%',
    position: 'relative',
    display: 'inline-block',
  },
  errorOnMui: {
    '& fieldset': {
      borderColor: `${theme.color.blue.primary} !important`,
    },
  },
  datepickerReadOnly: {
    '& input': {
      cursor: 'auto',
    },
  },
}))

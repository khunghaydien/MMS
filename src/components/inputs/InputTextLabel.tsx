import { LangConstant } from '@/const'
import { CHANGE_TIME_DELAY, INPUT_TEXT_MAX_LENGTH } from '@/const/app.const'
import { EventInput } from '@/types'
import { ErrorOutline } from '@mui/icons-material'
import { Box, TextField, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { ReactElement, memo, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import InputErrorMessage from '../common/InputErrorMessage'

interface PropTypes {
  keyName?: string
  type?: string
  name?: string
  label?: any
  required?: boolean
  placeholder?: any
  value?: string | null
  onChange?: Function
  maxLength?: number
  errorMessage?: any
  readonly?: boolean
  disabled?: boolean
  iconLeft?: ReactElement
  error?: boolean
  onFocus?: () => void
  endAdornment?: ReactElement | null
  onBlur?: Function
  onMouseOver?: () => void
  onMouseOut?: () => void
  ignoreChars?: string[]
  useMatches?: boolean
  matchingTitles?: string[]
  useCounter?: boolean
  className?: string
  isHorizontal?: boolean
}

function InputTextLabel(props: PropTypes) {
  const {
    keyName = '',
    type = 'text',
    name,
    label,
    required,
    placeholder,
    value,
    onChange = () => {},
    errorMessage = '',
    readonly,
    iconLeft,
    error,
    maxLength = INPUT_TEXT_MAX_LENGTH,
    onFocus,
    disabled,
    endAdornment,
    onBlur,
    onMouseOver,
    onMouseOut,
    ignoreChars = [],
    useMatches,
    matchingTitles = [],
    useCounter = true,
    className,
    isHorizontal = false,
  } = props

  const { t: i18nCommon } = useTranslation(LangConstant.NS_COMMON)

  const ref = useRef<any>(null)
  const [widthEnd, setWidthEnd] = useState(0)
  const currentWidthEnd = useMemo(() => {
    return widthEnd
  }, [widthEnd])
  const classes = useStyles({ widthEnd, currentWidthEnd })

  const changeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [internalValue, setInternalValue] = useState('')

  const allowedCharacters = useMemo(() => {
    let specialCharacters = ''
    matchingTitles.forEach(char => {
      specialCharacters += '"' + char + '";&nbsp;'
    })
    return specialCharacters.slice(0, specialCharacters.length - 1)
  }, [])

  const handleChange = (e: EventInput) => {
    if (changeTimeoutRef.current) {
      clearTimeout(changeTimeoutRef.current)
    }
    const value = e.target.value
    setInternalValue(value)
    changeTimeoutRef.current = setTimeout(() => {
      onChange(e, keyName || '')
    }, CHANGE_TIME_DELAY)
  }

  const onKeydown = (e: any) => {
    if (
      (e.code === 'Space' && !internalValue.trim().length) ||
      ignoreChars.includes(e.key)
    ) {
      e.preventDefault()
    }
  }

  const handleFocus = () => {
    !!onFocus && onFocus()
  }

  const handleBlur = () => {
    !!onBlur && onBlur(keyName)
  }

  const handleMouseOver = () => {
    !!onMouseOver && onMouseOver()
  }

  const handleMouseOut = () => {
    !!onMouseOut && onMouseOut()
  }
  useEffect(() => {
    setWidthEnd(ref.current?.offsetWidth)
  }, [])

  useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(value || '')
    }
  }, [value])

  return (
    <>
      <Box
        className={clsx(
          isHorizontal ? classes.horizontal : '',
          classes.rootInputTextLabel,
          className
        )}
      >
        {label && (
          <label
            htmlFor={name && `form-input-${name || keyName}`}
            className={clsx(classes.label)}
          >
            {!!useMatches && (
              <Box className={classes.warningMessage}>
                <ErrorOutline sx={{ fontSize: 18, marginRight: '4px' }} />
                <Box className={classes.allowedCharacters}>
                  <Box>{i18nCommon('MSG_ALLOWED_CHARACTERS')}</Box>
                  {allowedCharacters}
                </Box>
              </Box>
            )}
            {label}
            {required ? <span className={clsx(classes.mark)}>*</span> : null}
          </label>
        )}
        <Box
          className={clsx(classes.inputWrapper, !!error && classes.errorInput)}
        >
          {iconLeft && iconLeft}
          <TextField
            label=""
            variant="outlined"
            type={type}
            name={name}
            id={'form-input-' + (name || keyName)}
            placeholder={placeholder}
            className={clsx(classes.input, disabled && classes.disabled)}
            value={internalValue}
            disabled={disabled}
            error={!!error}
            onChange={handleChange}
            inputProps={{
              maxLength,
              readOnly: readonly,
            }}
            onKeyDown={onKeydown}
            onFocus={handleFocus}
            onWheel={(event: any) => event.target.blur()}
            onBlur={handleBlur}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          />
          {(!!endAdornment || !!useCounter) && (
            <Box
              className={clsx(classes.endAdornment, 'endAdornment')}
              ref={ref}
            >
              {endAdornment && <Box>{endAdornment}</Box>}
              {useCounter && (
                <Box className={clsx(classes.counter, 'counter')}>
                  {internalValue.length} / {maxLength}
                </Box>
              )}
            </Box>
          )}
        </Box>
        {!!error && !isHorizontal && (
          <InputErrorMessage
            className={classes.errorMessage}
            content={
              errorMessage ? errorMessage : i18nCommon('MSG_REQUIRE_FIELD')
            }
          />
        )}
      </Box>
      {!!error && isHorizontal && (
        <InputErrorMessage
          className={classes.errorMessage}
          content={
            errorMessage ? errorMessage : i18nCommon('MSG_REQUIRE_FIELD')
          }
        />
      )}
    </>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootInputTextLabel: {
    color: theme.color.black.primary,
    fontSize: theme.typography.fontSize,
    width: '100%',
    position: 'relative',
  },
  horizontal: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    '& label': {
      minWidth: '150px',
    },
  },
  inputWrapper: {
    height: theme.spacing(5),
    position: 'relative',
    width: '100%',
    '& input': {
      color: theme.color.black.primary,
      fontSize: theme.typography.fontSize,
      lineHeight: '14px',
      borderRadius: theme.spacing(0.5),
      height: 40,
      padding: (props: any) => {
        return `0 ${props.currentWidthEnd + 30}px 0 12px`
      },
    },
  },
  label: {
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  mark: {
    color: theme.color.error.secondary,
    marginLeft: theme.spacing(0.5),
  },
  input: {
    width: '100%',
    height: '100%',
    outline: 'none',
    border: 'none',
    borderRadius: theme.spacing(0.5),
    backgroundColor: '#FFFFFF',
  },
  errorInput: {
    borderColor: theme.color.error.primary,
  },
  disabled: {
    cursorPointer: 'none',
    background: theme.color.grey.tertiary,
  },
  errorMessage: {
    marginTop: theme.spacing(1),
  },
  endAdornment: {
    gap: '6px',
    display: 'flex',
    position: 'absolute',
    right: theme.spacing(2),
    top: '50%',
    width: 'max-content',
    transform: 'translateY(-50%)',
  },
  counter: {
    fontSize: 12,
    fontWeight: 500,
    color: theme.color.grey.primary,
  },
  warningMessage: {
    position: 'relative',
    '&:hover div': {
      display: 'block',
    },
  },
  allowedCharacters: {
    position: 'absolute',
    zIndex: 1,
    border: `1px solid ${theme.color.black.tertiary}`,
    backgroundColor: '#FFFFFF',
    bottom: theme.spacing(3),
    left: theme.spacing(1),
    width: '285px',
    padding: theme.spacing(0.5),
    lineHeight: '20px',
    display: 'none',
    color: theme.color.error.primary,
  },
}))

export default memo(InputTextLabel)

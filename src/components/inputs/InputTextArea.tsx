import { LangConstant } from '@/const'
import { CHANGE_TIME_DELAY, INPUT_TEXTAREA_MAX_LENGTH } from '@/const/app.const'
import { useClickOutside2 } from '@/hooks'
import { cleanObject } from '@/utils'
import { Box, TextareaAutosize, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import {
  CSSProperties,
  ReactNode,
  memo,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import ConditionalRender from '../ConditionalRender'
import InputErrorMessage from '../common/InputErrorMessage'
import InputTitle from '../common/InputTitle'
interface PropType {
  keyName?: string
  placeholder?: any
  defaultValue?: string | number | readonly string[]
  onChange?: Function
  style?: CSSProperties
  minRows?: number
  maxRows?: number
  className?: string
  height?: number | null
  resize?: 'both' | 'vertical' | 'horizontal' | 'initial' | 'unset' | 'none'
  name?: string
  error?: boolean
  errorMessage?: any
  label?: string
  required?: boolean
  maxLength?: number
  disabled?: boolean
  footerContainer?: ReactNode
}

function InputTextArea(props: PropType) {
  const {
    placeholder,
    minRows,
    maxRows,
    defaultValue,
    style,
    onChange = () => {},
    height = 150,
    className,
    resize = 'vertical',
    name,
    label,
    required = false,
    error,
    errorMessage,
    keyName = 'description',
    maxLength = INPUT_TEXTAREA_MAX_LENGTH,
    disabled = false,
    footerContainer,
  } = props
  const { t: i18nCommon } = useTranslation(LangConstant.NS_COMMON)
  const classes = useStyles()

  const textAreaRef = useRef(null)
  const changeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [internalValue, setInternalValue] = useState('')
  const [isFocus, setIsFocus] = useState(false)

  const customStyle = cleanObject({ ...style, height, resize })

  useClickOutside2(textAreaRef, () => {
    setIsFocus(false)
  })

  const handleChange = (e: any) => {
    if (changeTimeoutRef.current) {
      clearTimeout(changeTimeoutRef.current)
    }
    setInternalValue(e.target.value)
    changeTimeoutRef.current = setTimeout(() => {
      onChange(e, keyName)
    }, CHANGE_TIME_DELAY)
  }

  const handleFocus = () => {
    setIsFocus(true)
  }

  useEffect(() => {
    if (defaultValue !== internalValue && typeof defaultValue === 'string') {
      setInternalValue(defaultValue)
    }
  }, [defaultValue])

  return (
    <Box className={clsx(classes.rootFormItem, className)}>
      {!!label && <InputTitle title={label} required={required} />}
      <Box
        className={clsx(
          classes.formContainer,
          error && 'error',
          isFocus && 'focus'
        )}
      >
        <Box className={clsx(classes.formContent, error && 'error')}>
          <TextareaAutosize
            onFocus={handleFocus}
            ref={textAreaRef}
            disabled={disabled}
            placeholder={placeholder}
            minRows={minRows}
            maxRows={maxRows}
            value={internalValue}
            onChange={handleChange}
            className={clsx(classes.rootInputTextArea, 'scrollbar', className)}
            style={customStyle}
            name={name}
            maxLength={maxLength}
          />
        </Box>
        <ConditionalRender conditional={!!error && !!errorMessage}>
          <InputErrorMessage
            className={classes.errorMessage}
            content={errorMessage || i18nCommon('MSG_REQUIRE_FIELD')}
          />
        </ConditionalRender>
        {!footerContainer && (
          <Box className={clsx(classes.counter, 'counter')}>
            {internalValue.length} / {maxLength}
          </Box>
        )}
        <ConditionalRender conditional={!!footerContainer}>
          <Box className={classes.footer}>{footerContainer}</Box>
        </ConditionalRender>
      </Box>
    </Box>
  )
}

export default memo(InputTextArea)

const useStyles = makeStyles((theme: Theme) => ({
  rootInputTextArea: {
    minHeight: 50,
    width: '100%',
    padding: theme.spacing(1),
    fontSize: 14,
    lineHeight: 2,
    color: theme.color.black.primary,
    border: 'none',
    borderRadius: theme.spacing(0.5),
    overflow: 'auto !important',
    '& *': {
      fontFamily: 'Roboto',
    },
    '&::-webkit-input-placeholder': {
      color: `${theme.color.grey.fourth} !important`,
    },
    '&:focus-visible': {
      outline: 'none',
    },
  },
  rootFormItem: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    position: 'relative',
  },
  formContainer: {
    fontSize: 14,
    borderRadius: theme.spacing(0.5),
    paddingRight: theme.spacing(0.25),
    border: `1px solid ${theme.color.grey.primary}`,
    '&:hover': {
      border: `1px solid ${theme.color.black.primary}`,
    },
    '&.focus': {
      border: `2px solid ${theme.color.blue.primary}`,
    },
    '&.error': {
      border: `2px solid ${theme.color.error.primary}`,
    },
    '&:focus-visible': {
      border: `2px solid ${theme.color.blue.primary}`,
      outline: 'none',
    },
  },
  errorMessage: {
    margin: theme.spacing(1),
  },
  formContent: {
    width: '100%',
    '&.error textarea': {
      borderColor: theme.color.error.primary,
    },
  },
  submitIcon: {
    color: theme.color.blue.primary,
    marginTop: theme.spacing(1),
    '&:hover': {
      cursor: 'pointer',
    },
  },
  footer: {
    fontSize: 12,
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(1, 1, 0.5, 1),
    borderRadius: theme.spacing(0, 0, 0.5, 0.5),
    fontWeight: 500,
    background: theme.color.white,
    color: theme.color.grey.primary,
  },
  counter: {
    fontSize: 12,
    position: 'absolute',
    bottom: theme.spacing(1),
    right: theme.spacing(1.5),
    padding: theme.spacing(1),
    fontWeight: 500,
    background: '#FFFFFF',
    color: theme.color.grey.primary,
  },
}))

import { EventInput } from '@/types'
import SendIcon from '@mui/icons-material/Send'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import InputTextArea from './InputTextArea'
interface FormTextMessageProps {
  keyName?: string
  placeholder?: any
  defaultValue?: string | number | readonly string[]
  name?: string
  error?: boolean
  useSubmit?: boolean
  errorMessage?: any
  label?: string
  required?: boolean
  maxLength?: number
  disabled?: boolean
  onChange?: Function
  onSubmit?: Function
}

const InputFormText = ({
  defaultValue = '',
  placeholder = '',
  errorMessage = '',
  useSubmit = true,
  error = false,
  required = false,
  onChange,
  onSubmit,
  disabled,
}: FormTextMessageProps) => {
  const classes = useStyles()

  const [internalValue, setInternalValue] = useState<
    string | number | readonly string[]
  >('')

  const handleChangeValue = (event: EventInput) => {
    setInternalValue(event.target.value)
    !!onChange && onChange(event.target.value)
  }

  const handleSubmit = () => {
    if (internalValue !== defaultValue) {
      !!onSubmit && onSubmit()
    }
  }

  useEffect(() => {
    if (defaultValue !== internalValue) {
      setInternalValue(defaultValue)
    }
  }, [defaultValue])

  return (
    <InputTextArea
      placeholder={placeholder}
      defaultValue={internalValue}
      resize="none"
      height={null}
      error={error}
      errorMessage={errorMessage}
      onChange={handleChangeValue}
      required={required}
      disabled={disabled}
      footerContainer={
        useSubmit && (
          <Box
            className={clsx(
              classes.sendIcon,
              internalValue === defaultValue && 'disabled'
            )}
          >
            <SendIcon onClick={handleSubmit} />
          </Box>
        )
      }
    />
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  sendIcon: {
    color: theme.color.blue.primary,
    '&:hover': {
      cursor: 'pointer',
    },
    '&.disabled': {
      color: theme.color.grey.primary,
      '&:hover': {
        cursor: 'unset',
      },
    },
  },
}))

export default InputFormText

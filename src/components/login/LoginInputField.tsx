import InputErrorMessage from '@/components/common/InputErrorMessage'
import { EventInput } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useMemo } from 'react'
import LockIcon from '../icons/LockIcon'
import MailIcon from '../icons/MailIcon'

interface LoginInputFieldProps {
  value: string
  type: string
  placeholder?: any
  error: boolean
  errorMessage: string
  onChange: (value: string) => void
}

const LoginInputField = ({
  value,
  type,
  placeholder,
  error,
  errorMessage,
  onChange,
}: LoginInputFieldProps) => {
  const classes = useStyles()

  const IconAdornment: any = useMemo(() => {
    return type === 'text' ? <MailIcon /> : <LockIcon />
  }, [])

  const handleInputChange = (event: EventInput) => {
    const { value } = event.target
    onChange(value)
  }

  return (
    <Box className={classes.rootLoginInputField}>
      <Box
        className={clsx(
          classes.inputContainer,
          error && classes.inputContainerError
        )}
      >
        {IconAdornment}
        <input
          className={classes.inputEl}
          value={value}
          type={type}
          placeholder={placeholder}
          onChange={handleInputChange}
        />
      </Box>
      {error && (
        <InputErrorMessage
          className={classes.errorMessage}
          content={errorMessage}
        />
      )}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => {
  const _8px = theme.spacing(1)
  return {
    rootLoginInputField: {},
    inputContainer: {
      border: `1px solid ${theme.color.grey.primary}`,
      paddingLeft: theme.spacing(1.5),
      background: theme.color.white,
      borderRadius: _8px,
      width: '384px',
      height: '48px',
      display: 'flex',
      alignItems: 'center',
    },
    inputContainerError: {
      marginBottom: theme.spacing(0.5),
      borderColor: theme.color.error.primary,
    },
    inputEl: {
      marginLeft: _8px,
      border: 'none',
      outline: 'none',
      width: '320px',
    },
    errorMessage: {
      maxWidth: '384px',
    },
  }
})

LoginInputField.defaultProps = {
  type: 'text',
  placeholder: 'Placeholder',
}

export default LoginInputField

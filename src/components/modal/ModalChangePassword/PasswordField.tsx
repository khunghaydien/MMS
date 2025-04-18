import InputTextLabel from '@/components/inputs/InputTextLabel'
import { EventInput } from '@/types'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { IconButton, InputAdornment } from '@mui/material'
import { useState } from 'react'

interface PasswordFieldProps {
  value: string
  required?: boolean
  error?: boolean
  errorMessage?: string
  keyName?: string
  label?: string
  placeholder?: string
  onChange: (e: EventInput, keyName: string) => void
}

const PasswordField = ({
  value,
  required,
  error,
  errorMessage,
  label,
  keyName,
  placeholder,
  onChange,
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false)

  const handleToggleShowPassword = () => {
    setShowPassword(prev => !prev)
  }

  return (
    <InputTextLabel
      useCounter={false}
      required={required}
      error={error}
      errorMessage={errorMessage}
      keyName={keyName}
      name={keyName}
      label={label}
      type={showPassword ? 'text' : 'password'}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            edge="end"
            onClick={handleToggleShowPassword}
            onMouseDown={handleToggleShowPassword}
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      }
    />
  )
}

export default PasswordField

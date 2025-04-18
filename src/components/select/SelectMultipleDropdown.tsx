import { OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import InputAutocomplete from '../inputs/InputAutocomplete'

interface SelectMultipleDropdownProps {
  className?: string
  label?: string | null
  placeholder?: string | null
  disabled?: boolean
  onChange: (value: OptionItem[]) => void
  value: any
  listOptions: OptionItem[]
  width?: string | number
}

const SelectMultipleDropdown = ({
  label,
  className,
  placeholder,
  disabled,
  onChange,
  value,
  listOptions,
  width,
}: SelectMultipleDropdownProps) => {
  const classes = useStyles()

  return (
    <Box className={clsx(classes.RootSelectMultipleDropdown, className)}>
      <Box className={classes.label}>{label}</Box>
      <InputAutocomplete
        width={width}
        placeholder={placeholder}
        listOptions={listOptions}
        onChange={onChange}
        defaultTags={value}
        disabled={disabled}
      />
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootSelectMultipleDropdown: {
    padding: theme.spacing(2),
    background: theme.color.blue.six,
    borderRadius: theme.spacing(1),
  },
  label: {
    color: theme.color.blue.primary,
    fontWeight: 700,
    marginBottom: theme.spacing(1),
    fontSize: 14,
  },
}))

export default SelectMultipleDropdown

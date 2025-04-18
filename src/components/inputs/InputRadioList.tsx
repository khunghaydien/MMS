import { OptionItem } from '@/types'
import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import { ChangeEvent, useEffect, useState } from 'react'

interface InputRadioListProps {
  listOptions?: OptionItem[]
  value?: string
  onChange?: (value: string) => void
  disabed?: boolean
}

const InputRadioList = ({
  listOptions = [],
  value,
  onChange,
  disabed,
}: InputRadioListProps) => {
  const classes = useStyles()

  const [internalValue, setInternalValue] = useState(
    listOptions[0]?.value || ''
  )

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value)
    !!onChange && onChange(e.target.value)
  }

  useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(value || '')
    }
  }, [value])

  return (
    <FormControl>
      <RadioGroup value={internalValue} onChange={handleChange}>
        <Box className={classes.radioGroup}>
          {listOptions.map(option => (
            <FormControlLabel
              key={option.value}
              disabled={disabed || option.disabled}
              value={option.value}
              control={<Radio />}
              label={option.label}
            />
          ))}
        </Box>
      </RadioGroup>
    </FormControl>
  )
}

const useStyles = makeStyles(() => ({
  radioGroup: {
    display: 'flex',
  },
}))

export default InputRadioList

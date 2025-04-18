import { Box, Switch } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { ChangeEvent } from 'react'

interface SwitchToggleProps {
  label?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
}

const SwitchToggle = ({ label, checked, onChange }: SwitchToggleProps) => {
  const classes = useStyles()

  return (
    <Box className={classes.RootSwitchToggle}>
      <Switch
        checked={!!checked}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          !!onChange && onChange(event.target.checked)
        }
      />
      <Box className={classes.label}>{label}</Box>
    </Box>
  )
}

const useStyles = makeStyles(() => ({
  RootSwitchToggle: {
    display: 'flex',
    alignItems: 'center',
  },
  label: {},
}))

export default SwitchToggle

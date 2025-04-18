import { Box, Checkbox, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'

interface InputCheckboxProps {
  label: any
  checked: boolean
  indeterminate?: boolean
  className?: string
  onClick?: () => void
  disabled?: boolean
  isEmphasize?: boolean
}

const InputCheckbox = ({
  label,
  checked,
  indeterminate,
  className,
  onClick,
  disabled = false,
  isEmphasize = false,
}: InputCheckboxProps) => {
  const classes = useStyles({ label })

  const handleClick = () => {
    !!onClick && !disabled && onClick()
  }

  return (
    <Box
      className={clsx(classes.rootInputCheckbox, className)}
      onClick={handleClick}
    >
      <Checkbox
        disabled={disabled}
        className={classes.checkbox}
        checked={checked}
        indeterminate={indeterminate}
      />
      {!!label && (
        <Box className={isEmphasize ? classes.labelEmphasize : classes.label}>
          {label}
        </Box>
      )}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootInputCheckbox: {
    width: '100%',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    margin: '0 !important',
    '& .Mui-checked': {
      color: `${theme.color.blue.primary} !important`,
    },
  },
  checkbox: {
    padding: '0 !important',
    marginRight: (props: any) => (props.label ? '4px !important' : '0'),
  },
  label: {},
  labelEmphasize: {
    fontWeight: '700',
  },
}))

InputCheckbox.defaultProps = {
  label: 'Label',
  checked: false,
  indeterminate: false,
}

export default InputCheckbox

import { Button, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { ReactElement } from 'react'
import DropdownHoverIcon from '../icons/DropdownHoverIcon'
import DropdownIcon from '../icons/DropdownIcon'

interface ButtonWithDropDownProps {
  Icon?: ReactElement
  children: any
  onClick?: () => void
  onMouseOver?: () => void
  onMouseOut?: () => void
  height?: number
  className?: string
  disabled?: boolean
  isShowDropdownAddStaff: boolean
}

const ButtonWithDropDown = ({
  Icon,
  height,
  children,
  className,
  onClick,
  onMouseOver,
  onMouseOut,
  disabled = false,
  isShowDropdownAddStaff = false,
}: ButtonWithDropDownProps) => {
  const classes = useStyles({ height })

  return (
    <Button
      className={clsx(classes.rootButtonWithDropdownIcon, className)}
      variant="contained"
      data-title="btn"
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      disabled={disabled}
    >
      <span className={classes.labelDropdown}>{children}</span>
      {Icon ? (
        Icon
      ) : isShowDropdownAddStaff ? (
        <DropdownHoverIcon data-title="icon-dropdown" width={16} height={16} />
      ) : (
        <DropdownIcon data-title="icon-dropdown" width={16} height={16} />
      )}
    </Button>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootButtonWithDropdownIcon: {
    padding: '7.75px 16px 7.75px 16px !important',
    '&:hover': {
      background: `${theme.color.orange.primary} !important`,
    },
  },
  labelDropdown: {
    marginRight: theme.spacing(1),
  },
  labelAction: {
    marginRight: theme.spacing(0.5),
  },
}))

ButtonWithDropDown.defaultProps = {
  height: 40,
}

export default ButtonWithDropDown

import { Add } from '@mui/icons-material'
import { Button, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'

interface ButtonAddWithIconProps {
  Icon?: any
  children: any
  onClick?: () => void
  height?: number
  className?: string
  disabled?: boolean
  variant?: any
}

const ButtonAddWithIcon = ({
  Icon,
  height,
  children,
  className,
  onClick,
  disabled = false,
  variant = 'contained',
}: ButtonAddWithIconProps) => {
  const classes = useStyles({ height })

  return (
    <Button
      className={clsx(
        classes.rootButtonAddWithIcon,
        variant ? variant : '',
        className
      )}
      variant={variant}
      data-title="btn"
      onClick={onClick}
      disabled={disabled}
    >
      {Icon ? Icon : <Add data-title="icon-add" />}
      <span className={classes.labelAdd}>{children}</span>
    </Button>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootButtonAddWithIcon: {
    height: '42px',
    minWidth: 'max-content !important',
    padding: '7.75px 16px 7.75px 16px !important',
    '&:hover': {
      background: `${theme.color.orange.primary} !important`,
    },
    '&.outlined:hover': {
      background: `${theme.color.blue.primary} !important`,
      color: '#fff',
    },
  },
  labelAdd: {
    marginLeft: theme.spacing(0.5),
  },
  labelAction: {
    marginRight: theme.spacing(0.5),
  },
}))

ButtonAddWithIcon.defaultProps = {
  height: 40,
}

export default ButtonAddWithIcon

import { Button, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { CSSProperties, MouseEvent, ReactNode } from 'react'

interface CommonButtonProps {
  disabled?: boolean
  children: string | ReactNode
  height?: number
  width?: number | string
  color?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning'
    | undefined
  variant?: 'text' | 'contained' | 'outlined' | undefined
  className?: string
  style?: CSSProperties
  onClick?: () => void
  outlined?: boolean
  lowercase?: boolean
  endIcon?: ReactNode
  startIcon?: ReactNode
}

const CommonButton = ({
  disabled,
  height,
  width,
  children,
  color,
  variant,
  className,
  style,
  onClick,
  outlined,
  lowercase,
  ...otherProps
}: CommonButtonProps) => {
  const classes = useStyles({
    height,
    width,
  })

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    !!onClick && onClick()
  }

  return (
    <Button
      type="button"
      className={clsx(
        classes.rootCommonButton,
        className,
        variant,
        lowercase && 'lowercase'
      )}
      variant={variant}
      disabled={disabled}
      color={color}
      onClick={handleClick}
      style={style}
      {...otherProps}
    >
      {children}
    </Button>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootCommonButton: {
    height: (props: any) => `${props.height}px`,
    lineHeight: '1 !important',
    width: (props: any) =>
      props.width
        ? typeof props.width === 'number'
          ? `${props.width}px`
          : props.width
        : 'max-content',
    color: theme.color.white,
    borderRadius: theme.spacing(0.5),
    fontWeight: '700 !important',
    textAlign: 'start',
    cursor: 'pointer',
    transition: 'all .2s !important',
    '&:hover': {
      background: `${theme.color.orange.primary} !important`,
    },
    '&.outlined:hover': {
      color: '#FFFFFF',
      borderColor: theme.color.blue.primary,
      background: `${theme.color.blue.primary} !important`,
    },
    '&.lowercase': {
      textTransform: 'unset',
    },
  },
}))

CommonButton.defaultProps = {
  height: 32,
  variant: 'contained',
  type: 'button',
}

export default CommonButton

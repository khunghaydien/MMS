import { TypographyStyles } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'

interface TypographyProps {
  title?: string
  children: string
  className?: string
  active?: boolean
  styleProps?: TypographyStyles
  onClick?: () => void
}

const Typography = ({
  children,
  className,
  active,
  styleProps,
  onClick,
  title = children,
}: TypographyProps) => {
  const classes = useStyles()
  return (
    <Box
      title={title}
      className={clsx(
        classes.rootTypography,
        active && classes.rootActive,
        className
      )}
      style={{
        ...styleProps,
      }}
      onClick={onClick}
    >
      {children}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootTypography: {
    color: theme.color.black.primary,
    fontSize: 14,
  },
  rootActive: {
    color: theme.color.blue.primary,
    fontWeight: 700,
  },
}))

export default Typography

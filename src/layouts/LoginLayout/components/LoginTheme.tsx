import loginBackGroundImageURL from '@/ui/images/login-background.jpeg'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { ReactNode } from 'react'

interface LoginThemeProps {
  children: ReactNode
  className?: string
}

const LoginTheme = ({ children, className }: LoginThemeProps) => {
  const classes = useStyles()
  return (
    <Box className={clsx(classes.rootLoginTheme, className)}>{children}</Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootLoginTheme: {
    width: '100%',
    height: '100vh',
    padding: theme.spacing(4, 15, 4, 15),
    backgroundImage: `url(${loginBackGroundImageURL})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    overflow: 'hidden',
  },
}))

export default LoginTheme

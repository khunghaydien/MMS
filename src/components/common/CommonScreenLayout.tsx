import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { ReactNode } from 'react'
import BackIcon from '../icons/BackIcon'

interface CommonScreenLayoutProps {
  children: ReactNode
  title?: any
  useBackPage?: boolean
  backLabel?: any
  onBack?: () => void
}

const CommonScreenLayout = ({
  title,
  useBackPage,
  children,
  backLabel,
  onBack,
}: CommonScreenLayoutProps) => {
  const classes = useStyles({ title, useBackPage })

  return (
    <Box className={classes.rootCommonScreenLayout}>
      {!!useBackPage && <BackIcon onClick={onBack} label={backLabel} />}
      {!!title && (
        <Box className={clsx(classes.title, useBackPage && classes.mt8)}>
          {title}
        </Box>
      )}
      <Box className={classes.children}>{children}</Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootCommonScreenLayout: {
    padding: theme.spacing(3),
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    width: '100%',
    wordBreak: 'break-word',
  },
  children: {
    marginTop: (props: any) =>
      props.title || props.useBackPage ? theme.spacing(3) : '',
  },
  mt8: {
    marginTop: theme.spacing(1),
  },
}))

export default CommonScreenLayout

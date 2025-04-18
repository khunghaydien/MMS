import morLogoSingle from '@/ui/images/mor-logo-single.png'
import { Backdrop, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'

interface ProcessingProps {
  open: boolean
  className?: string
}

const Processing = ({ open, className, ...otherProps }: ProcessingProps) => {
  const classes = useStyles()
  return (
    <Backdrop
      open={open}
      className={clsx(classes.backdrop, className)}
      {...otherProps}
    >
      <img
        className={clsx(classes.logo, 'animation-loading')}
        src={morLogoSingle}
      />
    </Backdrop>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  backdrop: {
    zIndex: 9999,
    color: theme.color.white,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  logo: {
    width: theme.spacing(10),
  },
}))

Processing.defaultProps = {
  open: false,
}

export default Processing

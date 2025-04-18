import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'

interface InputTitleProps {
  title: string
  required?: boolean
  className?: string
  removeMargin?: boolean
}

const InputTitle = ({
  title,
  required,
  className = '',
  removeMargin,
}: InputTitleProps) => {
  const classes = useStyles()
  return (
    <Box
      className={clsx(
        classes.rootInputTitle,
        className,
        'label',
        !!removeMargin && 'removeMargin'
      )}
    >
      {title}
      {!!required && (
        <Box className={classes.mark} component="span">
          *
        </Box>
      )}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootInputTitle: {
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    fontSize: 14,
    '&.removeMargin': {
      marginBottom: 'unset',
    },
  },
  mark: {
    color: theme.color.error.secondary,
    marginLeft: theme.spacing(0.5),
  },
}))

export default InputTitle

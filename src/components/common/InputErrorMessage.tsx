import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'

interface InputErrorMessageProps {
  content: string
  className?: string
  color?: 'green' | 'error'
}

const InputErrorMessage = ({
  content,
  className,
  color = 'error',
}: InputErrorMessageProps) => {
  const classes = useStyles({ color })
  return (
    <Box className={clsx(classes.rootInputErrorMessage, className)}>
      {content}
      <Box className="error-message-scroll" component="span"></Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootInputErrorMessage: {
    fontSize: 12,
    fontWeight: 'normal',
    // @ts-ignore
    color: props => theme.color[props.color].primary,
    position: 'relative',
    '& .error-message-scroll': {
      position: 'absolute',
      top: '-72px',
    },
  },
}))

export default InputErrorMessage

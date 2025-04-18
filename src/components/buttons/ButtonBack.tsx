import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import BackIcon from '../icons/BackIcon'

interface IProps {
  iconWidth?: number
  iconColor?: string
  onClick?: Function
  className?: string
}

const defaultProps = {
  onClick: () => {},
}

export default function ButtonBack(props: IProps & typeof defaultProps) {
  const { iconWidth, iconColor, onClick, className } = props

  const classes = useStyles()

  return (
    <Box onClick={onClick} className={clsx(classes.rootButtonBack, className)}>
      <BackIcon width={iconWidth} color={iconColor} />
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootButtonBack: {
    display: 'inline-flex',
    marginBottom: 24,
    cursor: 'pointer',
  },
}))

ButtonBack.defaultProps = defaultProps

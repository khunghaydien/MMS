import { Add } from '@mui/icons-material'
import { Button, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'

interface IProps {
  onClick: () => void
  label: string
  textTransform?: string
  className?: string
  disabled?: boolean
}

function ButtonAddPlus({
  onClick,
  label,
  textTransform = 'capitalize',
  className = ' ',
  disabled,
}: IProps) {
  const classes = useStyles({ textTransform })
  return (
    <Button
      className={clsx(classes.rootButtonAddPlus, className)}
      data-title="btn"
      onClick={onClick}
      disabled={disabled}
    >
      <Add
        data-title="icon-add"
        className={clsx(classes.iconAdd, disabled && classes.disabled)}
      />
      <span className={classes.textButton}>{label}</span>
    </Button>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootButtonAddPlus: {
    gap: theme.spacing(1),
    padding: '0 !important',
  },
  iconAdd: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    borderRadius: '50%',
    backgroundColor: theme.color.blue.primary,
    color: theme.color.white,
  },
  textButton: {
    color: theme.color.black.primary,
    textTransform: (props: any) => props.textTransform,
    fontWeight: 400,
  },
  disabled: {
    backgroundColor: '#87898f',
  },
}))

export default ButtonAddPlus

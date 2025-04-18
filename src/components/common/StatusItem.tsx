import { IColor } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useMemo } from 'react'

export interface IStatusType {
  color: IColor
  label: string
}

interface IProps {
  className?: string
  typeStatus: IStatusType
}

export default function StatusItem(props: IProps) {
  const { typeStatus, className } = props
  const classes = useStyles()
  const resultData = (color: string, label: string) => {
    let _resultData = { color: '', label: '' }
    if (color) {
      _resultData = {
        color: color,
        label: label,
      }
    }
    return _resultData
  }
  const statusItem = useMemo(
    () => resultData(typeStatus?.color, typeStatus?.label),
    [typeStatus?.color, typeStatus?.label]
  )
  return (
    <Box className={clsx(classes.rootStatusItem, statusItem?.color, className)}>
      {statusItem?.label}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootStatusItem: {
    width: 'max-content',
    borderRadius: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(0.5, 1),
    '&.green': {
      background: theme.color.green.primary,
      color: theme.color.white,
    },
    '&.red': {
      background: theme.color.error.primary,
      color: theme.color.white,
    },
    '&.grey': {
      background: theme.color.grey.primary,
      color: theme.color.white,
    },
    '&.yellow': {
      background: theme.color.yellow.aesthetic,
      color: theme.color.white,
    },
    '&.blue': {
      background: theme.color.blue.primary,
      color: theme.color.white,
    },
    '&.orange': {
      background: theme.color.orange.third,
      color: theme.color.white,
    },
    '&.violet': {
      background: theme.color.violet.primary,
      color: theme.color.white,
    },
    '&.earthy': {
      background: theme.color.earthy.primary,
      color: theme.color.white,
    },
  },
}))
